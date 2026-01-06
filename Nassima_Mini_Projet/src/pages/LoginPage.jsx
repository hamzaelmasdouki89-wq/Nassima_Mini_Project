import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'

import { fetchStagiaires } from '../services/api'
import { loginSuccess, selectIsAuthenticated } from '../redux/authSlice'
import { setLanguage } from '../redux/settingsSlice'
import { passwordMatches } from '../utils/passwordUtils'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [pseudo, setPseudo] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const isLocked = attempts >= 3

  const canSubmit = useMemo(() => {
    return !isSubmitting && !isLocked
  }, [isSubmitting, isLocked])

  if (isAuthenticated) {
    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="px-card">
              <h1 className="h4 mb-2">You are already logged in</h1>
              <Link className="link-primary" to="/">
                Go to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nextErrors = []
    const trimmedPseudo = pseudo.trim()

    if (!trimmedPseudo) nextErrors.push('Username is required.')
    if (!password) nextErrors.push('Password is required.')

    if (nextErrors.length) {
      setErrors(nextErrors)
      setAttempts((a) => a + 1)
      return
    }

    setIsSubmitting(true)
    setErrors([])

    try {
      const res = await fetchStagiaires()
      const list = Array.isArray(res?.data) ? res.data : []

      const found = list.find((u) => String(u?.pseudo || '').toLowerCase() === trimmedPseudo.toLowerCase())
      if (!found) {
        setErrors(['Invalid username or password.'])
        setAttempts((a) => a + 1)
        return
      }

      const ok = await passwordMatches(found?.MotDePasse, password)
      if (!ok) {
        setErrors(['Invalid username or password.'])
        setAttempts((a) => a + 1)
        return
      }

      dispatch(loginSuccess(found))
      if (found?.language) {
        dispatch(setLanguage(found.language))
      }
      navigate('/', { replace: true })
    } catch (err) {
      setErrors(['Login failed due to a network error. Please try again.'])
      setAttempts((a) => a + 1)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="px-card"
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h1 className="h4 mb-0">Login</h1>
              <span className="badge text-bg-light border">
                Attempts: {attempts}/3
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="pseudo">
                  Username
                </label>
                <input
                  id="pseudo"
                  className="form-control"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={!canSubmit}>
                {isLocked ? 'Locked' : isSubmitting ? 'Signing in…' : 'Sign in'}
              </button>

              {errors.length > 0 && (
                <ul className="mt-3 mb-0 text-danger">
                  {errors.map((msg) => (
                    <li key={msg}>{msg}</li>
                  ))}
                </ul>
              )}

              {isLocked && (
                <div className="alert alert-danger mt-3 mb-0" role="alert">
                  Maximum attempts reached. Please refresh the page to try again.
                </div>
              )}
            </form>

            <div className="px-divider my-3" />

            <Link className="link-primary" to="/register">
              Create an account
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
