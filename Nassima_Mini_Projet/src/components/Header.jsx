import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Avatar from './Avatar'
import { logout, selectIsAuthenticated, selectUser } from '../redux/authSlice'

export default function Header() {
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const fullName = `${user?.prenom || ''} ${user?.nom || ''}`.trim()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <header className="px-header border-bottom">
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between py-2">
          <div className="d-flex align-items-center gap-2">
            <div className="px-logo">PX</div>
            <div className="d-none d-sm-block text-secondary fw-medium">Dashboard</div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <Avatar name={fullName} avatarUrl={user?.avatar || user?.photo} size="sm" />
              <div className="d-none d-md-block">
                <div className="fw-semibold" style={{ lineHeight: 1.1 }}>
                  {fullName || 'Guest'}
                </div>
                <div className="text-secondary" style={{ fontSize: 12 }}>
                  @{user?.pseudo || 'visitor'}
                </div>
              </div>
            </div>

            {isAuthenticated ? (
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-1" />
                Logout
              </button>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/login')}>
                  Login
                </button>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>
                  Create account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
