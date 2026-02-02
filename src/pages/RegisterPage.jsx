import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { useDispatch, useSelector } from 'react-redux'

import { createStagiaireAccount } from '../services/api'
import { loginSuccess } from '../redux/authSlice'
import { selectLanguage, setLanguage } from '../redux/settingsSlice'
import { hashPassword } from '../utils/passwordUtils'

const hasUpper = (value) => /[A-Z]/.test(value)
const hasLower = (value) => /[a-z]/.test(value)
const hasNumber = (value) => /\d/.test(value)
const hasSpecial = (value) => /[^A-Za-z0-9]/.test(value)

export default function RegisterPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const language = useSelector(selectLanguage)

  const [countries, setCountries] = useState([])
  const [currencies, setCurrencies] = useState([])
  const [countriesLoading, setCountriesLoading] = useState(false)
  const [countriesError, setCountriesError] = useState('')

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    age: '',
    MotDePasse: '',
    confirmPassword: '',
    pseudo: '',
    couleur: '#ffffff',
    Devise: '',
    Pays: '',
    avatar: '',
    email: '',
  })

  const [errors, setErrors] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = useMemo(() => {
    return !isSubmitting
  }, [isSubmitting])

  const setField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))

    if (errors.length) setErrors([])
  }

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setCountriesLoading(true)
      setCountriesError('')

      try {
        if (typeof fetch === 'undefined') return

        const fetchJson = async (url) => {
          const res = await fetch(url)
          if (!res.ok) {
            const err = new Error(`HTTP ${res.status}`)
            err.status = res.status
            err.url = url
            throw err
          }
          return res.json()
        }

        const sources = [
          'https://restcountries.com/v3.1/all?fields=name,cca2,flag,flags,currencies',
          'https://restcountries.com/v3.1/all',
          'https://cdn.jsdelivr.net/npm/world-countries@4/countries.json',
        ]

        let data = null
        let lastErr = null
        for (const url of sources) {
          try {
            data = await fetchJson(url)
            lastErr = null
            break
          } catch (e) {
            lastErr = e
          }
        }

        if (!data) throw lastErr || new Error('Failed to load countries')

        const list = Array.isArray(data) ? data : []

        const options = list
          .map((c) => {
            const name = c?.name?.common || c?.name?.official || c?.name
            const code = c?.cca2 || c?.alpha2Code || c?.cca2
            if (!name || !code) return null

            const rawCurrencies = c?.currencies
            let currencies = rawCurrencies || {}
            if (Array.isArray(rawCurrencies)) {
              const obj = {}
              rawCurrencies.forEach((curCode) => {
                const key = String(curCode || '').trim().toUpperCase()
                if (key) obj[key] = {}
              })
              currencies = obj
            }

            return {
              name: String(name),
              code: String(code),
              flag: String(c?.flag || ''),
              flagUrl: String(c?.flags?.png || c?.flags?.svg || ''),
              currencies,
            }
          })
          .filter(Boolean)
          .sort((a, b) => a.name.localeCompare(b.name))

        const currencyMap = new Map()
        options.forEach((c) => {
          const cur = c?.currencies && typeof c.currencies === 'object' ? c.currencies : {}
          Object.entries(cur).forEach(([code, meta]) => {
            const codeStr = String(code || '').trim().toUpperCase()
            if (!codeStr) return
            const name = String(meta?.name || '')
            const symbol = String(meta?.symbol || '')
            if (!currencyMap.has(codeStr)) {
              currencyMap.set(codeStr, { code: codeStr, name, symbol })
            }
          })
        })

        const currencyOptions = Array.from(currencyMap.values()).sort((a, b) => a.code.localeCompare(b.code))

        if (cancelled) return
        setCountries(options)
        setCurrencies(currencyOptions)
      } catch (err) {
        if (!cancelled) {
          console.error(err)
          const detail = err?.status ? ` (HTTP ${err.status})` : ''
          setCountriesError(`Failed to load countries list.${detail}`)
        }
      } finally {
        if (!cancelled) setCountriesLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  const validate = () => {
    const nextErrors = []

    const requiredFields = [
      'nom',
      'prenom',
      'age',
      'pseudo',
      'MotDePasse',
      'confirmPassword',
      'couleur',
      'Devise',
      'Pays',
      'email',
    ]

    requiredFields.forEach((key) => {
      if (!String(form[key] ?? '').trim()) {
        nextErrors.push(`${key} is required.`)
      }
    })

    const ageNumber = Number(form.age)
    if (!Number.isFinite(ageNumber) || ageNumber <= 0) {
      nextErrors.push('age must be a valid positive number.')
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.push('email must be a valid email address.')
    }

    const pwd = String(form.MotDePasse || '')
    if (pwd.length < 8) nextErrors.push('Password must be at least 8 characters.')
    if (!hasUpper(pwd)) nextErrors.push('Password must contain at least one uppercase letter.')
    if (!hasLower(pwd)) nextErrors.push('Password must contain at least one lowercase letter.')
    if (!hasNumber(pwd)) nextErrors.push('Password must contain at least one number.')
    if (!hasSpecial(pwd)) nextErrors.push('Password must contain at least one special character.')
    if (form.confirmPassword !== form.MotDePasse) nextErrors.push('Passwords do not match.')

    return nextErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nextErrors = validate()
    if (nextErrors.length) {
      setErrors(nextErrors)
      return
    }

    setIsSubmitting(true)
    setErrors([])

    try {
      const hashed = await hashPassword(form.MotDePasse)
      const payload = {
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        age: Number(form.age),
        admin: false,
        MotDePasse: hashed,
        pseudo: form.pseudo.trim(),
        couleur: form.couleur,
        Devise: String(form.Devise || '').trim(),
        Pays: String(form.Pays || '').trim(),
        avatar: String(form.avatar || '').trim(),
        email: form.email.trim(),
        language: String(language || 'en'),
      }

      const res = await createStagiaireAccount(payload)
      const createdUser = res?.data || payload

      dispatch(loginSuccess(createdUser))
      dispatch(setLanguage(createdUser?.language || payload.language))
      navigate('/', { replace: true })
    } catch (err) {
      const status = err?.response?.status
      const data = err?.response?.data
      const msg =
        (typeof data === 'string' && data) ||
        data?.message ||
        data?.error ||
        err?.message ||
        'Unknown error'

      console.error({ status, data, message: err?.message, err })

      setErrors([
        status ? `Account creation failed (HTTP ${status}).` : 'Account creation failed due to a network error.',
        String(msg),
      ])
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCountry = useMemo(() => {
    const name = String(form.Pays || '').trim()
    if (!name) return null
    return countries.find((c) => c.name === name) || null
  }, [countries, form.Pays])

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="px-card"
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h1 className="h4 mb-0">Create Account</h1>
              <Link className="link-primary" to="/login">
                Back to login
              </Link>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="nom">
                    Nom
                  </label>
                  <input
                    id="nom"
                    className="form-control"
                    value={form.nom}
                    onChange={(e) => setField('nom', e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="prenom">
                    Prenom
                  </label>
                  <input
                    id="prenom"
                    className="form-control"
                    value={form.prenom}
                    onChange={(e) => setField('prenom', e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label" htmlFor="age">
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    className="form-control"
                    value={form.age}
                    onChange={(e) => setField('age', e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label" htmlFor="couleur">
                    Preferred Color
                  </label>
                  <input
                    id="couleur"
                    type="color"
                    className="form-control form-control-color w-100"
                    value={form.couleur}
                    onChange={(e) => setField('couleur', e.target.value)}
                    title="Choose your color"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="pseudo">
                    Pseudo (username)
                  </label>
                  <input
                    id="pseudo"
                    className="form-control"
                    value={form.pseudo}
                    onChange={(e) => setField('pseudo', e.target.value)}
                    autoComplete="username"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    value={form.MotDePasse}
                    onChange={(e) => setField('MotDePasse', e.target.value)}
                    autoComplete="new-password"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="form-control"
                    value={form.confirmPassword}
                    onChange={(e) => setField('confirmPassword', e.target.value)}
                    autoComplete="new-password"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="devise">
                    Devise
                  </label>
                  <select
                    id="devise"
                    className="form-select"
                    value={form.Devise}
                    onChange={(e) => setField('Devise', e.target.value)}
                    disabled={countriesLoading}
                  >
                    <option value="">Select currency…</option>
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} {c.symbol ? `– ${c.symbol}` : ''} {c.name ? `– ${c.name}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="pays">
                    Pays
                  </label>
                  <div className="input-group">
                    <span className="input-group-text" aria-label="Selected country flag">
                      {selectedCountry?.flag || '🌍'}
                    </span>
                    <select
                      id="pays"
                      className="form-select"
                      value={form.Pays}
                      onChange={(e) => setField('Pays', e.target.value)}
                      disabled={countriesLoading}
                    >
                      <option value="">Select country…</option>
                      {countries.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.flag ? `${c.flag} ` : ''}
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {countriesError && <div className="text-danger mt-1">{countriesError}</div>}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="avatar">
                    Avatar (URL)
                  </label>
                  <input
                    id="avatar"
                    className="form-control"
                    value={form.avatar}
                    onChange={(e) => setField('avatar', e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-primary w-100" disabled={!canSubmit}>
                    {isSubmitting ? (
                      <span className="d-inline-flex align-items-center justify-content-center gap-2">
                        <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                        Creating…
                      </span>
                    ) : (
                      'Create account'
                    )}
                  </button>

                  {errors.length > 0 && (
                    <ul className="mt-3 mb-0 text-danger">
                      {errors.map((msg) => (
                        <li key={msg}>{msg}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
