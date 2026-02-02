import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ContextLoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error, isAuthenticated, clearError } = useAuth()

  const [pseudo, setPseudo] = useState('')
  const [password, setPassword] = useState('')

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()

    const success = await login(pseudo, password)
    if (success) {
      navigate('/', { replace: true })
    }
  }

  if (isAuthenticated) {
    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="px-card">
              <h1 className="h4 mb-2">You are already logged in</h1>
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                Go to home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="px-card">
            <h1 className="h4 mb-3">Login</h1>
            
            <div className="alert alert-info mb-3">
              <strong>Test Credentials:</strong><br/>
              Username: User715 | Password: Anas@2103<br/>
              <small>Real user data with full name: Anas Hrdouch</small>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="pseudo">
                  Username (pseudo)
                </label>
                <input
                  id="pseudo"
                  className="form-control"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="password">
                  Password (MotDePasse)
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>

              {error && (
                <div className="alert alert-danger mt-3 mb-0" role="alert">
                  {error}
                </div>
              )}
            </form>

            <div className="px-divider my-3" />

            <div className="text-center">
              <small className="text-muted">
                This login uses React Context API for state management
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
