import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectUser } from '../redux/authSlice'

export default function RequireAdmin({ children }) {
  const user = useSelector(selectUser)

  if (!user?.admin) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
