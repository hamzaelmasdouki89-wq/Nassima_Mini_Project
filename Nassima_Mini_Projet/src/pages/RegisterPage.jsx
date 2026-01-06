import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { createStagiaire } from '../services/api'
import { hashPassword } from '../utils/passwordUtils'

const hasUpper = (value) => /[A-Z]/.test(value)
const hasLower = (value) => /[a-z]/.test(value)
const hasNumber = (value) => /\d/.test(value)
const hasSpecial = (value) => /[^A-Za-z0-9]/.test(value)

export default function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    age: '',
    admin: 'false',
    MotDePasse: '',
    confirmPassword: '',
    pseudo: '',
    couleur: '#ffffff',
    Devise: '',
    Pays: '',
    avatar: '',
    email: '',
    photo: '',
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
  }

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
      'avatar',
      'email',
      'photo',
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
        admin: form.admin === 'true',
        MotDePasse: hashed,
        pseudo: form.pseudo.trim(),
        couleur: form.couleur,
        Devise: form.Devise.trim(),
        Pays: form.Pays.trim(),
        avatar: form.avatar.trim(),
        email: form.email.trim(),
        photo: form.photo.trim(),
      }

      await createStagiaire(payload)
      navigate('/login', { replace: true })
    } catch (err) {
      setErrors(['Account creation failed due to a network error. Please try again.'])
    } finally {
      setIsSubmitting(false)
    }
  }

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
                  <input
                    id="devise"
                    className="form-control"
                    value={form.Devise}
                    onChange={(e) => setField('Devise', e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="pays">
                    Pays
                  </label>
                  <input
                    id="pays"
                    className="form-control"
                    value={form.Pays}
                    onChange={(e) => setField('Pays', e.target.value)}
                  />
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

                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="photo">
                    Photo (URL)
                  </label>
                  <input
                    id="photo"
                    className="form-control"
                    value={form.photo}
                    onChange={(e) => setField('photo', e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-primary w-100" disabled={!canSubmit}>
                    {isSubmitting ? 'Creating…' : 'Create account'}
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
