import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectIsAuthenticated } from '../redux/authSlice'

export default function RequireAuth({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
