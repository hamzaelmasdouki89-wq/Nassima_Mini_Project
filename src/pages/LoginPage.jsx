import { Link } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'

import { login, selectAuthError, selectAuthStatus, selectIsAuthenticated } from '../redux/authSlice'
import { setLanguage } from '../redux/settingsSlice'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const authStatus = useSelector(selectAuthStatus)
  const authError = useSelector(selectAuthError)

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
      const action = await dispatch(login({ pseudo: trimmedPseudo, password }))
      if (login.fulfilled.match(action)) {
        if (action.payload?.language) {
          dispatch(setLanguage(action.payload.language))
        }
        const to = location?.state?.from || '/'
        navigate(to, { replace: true })
        return
      }

      setErrors([action.payload || action.error?.message || 'Invalid username or password.'])
      setAttempts((a) => a + 1)
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
      setErrors([status ? `Login failed (HTTP ${status}).` : 'Login failed due to a network error. Please try again.', String(msg)])
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
                {isLocked ? 'Locked' : isSubmitting || authStatus === 'pending' ? 'Signing in…' : 'Sign in'}
              </button>

              {errors.length > 0 && (
                <ul className="mt-3 mb-0 text-danger">
                  {errors.map((msg) => (
                    <li key={msg}>{msg}</li>
                  ))}
                </ul>
              )}

              {errors.length === 0 && authError && authStatus === 'failed' && (
                <div className="alert alert-danger mt-3 mb-0" role="alert">
                  {authError}
                </div>
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
