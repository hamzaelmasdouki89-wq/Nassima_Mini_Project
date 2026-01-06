import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectUser } from '../redux/authSlice'

export default function RequireAge({ minAge, children }) {
  const user = useSelector(selectUser)

  if (user?.admin) return children

  const age = Number(user?.age)
  if (!Number.isFinite(age) || age < minAge) {
    return <Navigate to="/" replace />
  }

  return children
}
