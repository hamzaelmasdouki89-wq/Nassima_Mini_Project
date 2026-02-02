import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginSuccess, selectIsAuthenticated } from '../redux/authSlice'

// Simple mock users for testing
const mockUsers = [
  { id: '1', pseudo: 'admin', MotDePasse: 'admin123', nom: 'Admin', prenom: 'User' },
  { id: '2', pseudo: 'user', MotDePasse: 'password123', nom: 'Regular', prenom: 'User' },
  { id: '3', pseudo: 'test', MotDePasse: 'test123', nom: 'Test', prenom: 'User' }
]

export default function SimpleLoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [pseudo, setPseudo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Simple direct lookup in mock users
      const found = mockUsers.find(
        (u) => u.pseudo.toLowerCase() === pseudo.toLowerCase()
      )

      if (!found) {
        setError('Invalid username or password')
        setIsLoading(false)
        return
      }

      // Simple password comparison
      if (found.MotDePasse !== password) {
        setError('Invalid username or password')
        setIsLoading(false)
        return
      }

      // Success! Dispatch login action
      dispatch(loginSuccess(found))
      navigate('/', { replace: true })
    } catch (err) {
      setError('Login failed. Please try again.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="px-card">
            <h1 className="h4 mb-3">Login</h1>
            
            <div className="alert alert-info mb-3">
              <strong>Test Credentials:</strong><br/>
              Username: admin | Password: admin123<br/>
              Username: user | Password: password123<br/>
              Username: test | Password: test123
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
                  required
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
          </div>
        </div>
      </div>
    </div>
  )
}
