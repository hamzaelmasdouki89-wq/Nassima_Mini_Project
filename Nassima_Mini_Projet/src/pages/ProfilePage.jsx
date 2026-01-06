import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'

import { selectUser } from '../redux/authSlice'

export default function ProfilePage() {
  const user = useSelector(selectUser)

  return (
    <div className="container py-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="px-card"
      >
        <div className="d-flex align-items-start justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <img
              src={user?.avatar || user?.photo || 'https://via.placeholder.com/72'}
              alt="avatar"
              className="rounded-circle border"
              width="72"
              height="72"
            />
            <div>
              <h1 className="h4 mb-1">
                {user?.prenom} {user?.nom}
              </h1>
              <div className="text-secondary">@{user?.pseudo}</div>
            </div>
          </div>
          <span className="badge text-bg-light border">{user?.admin ? 'Admin' : 'Visitor'}</span>
        </div>

        <div className="px-divider my-3" />

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="text-secondary" style={{ fontSize: 12 }}>
              Email
            </div>
            <div className="fw-medium">{user?.email}</div>
          </div>
          <div className="col-12 col-md-3">
            <div className="text-secondary" style={{ fontSize: 12 }}>
              Age
            </div>
            <div className="fw-medium">{user?.age}</div>
          </div>
          <div className="col-12 col-md-3">
            <div className="text-secondary" style={{ fontSize: 12 }}>
              Pays
            </div>
            <div className="fw-medium">{user?.Pays}</div>
          </div>
          <div className="col-12 col-md-6">
            <div className="text-secondary" style={{ fontSize: 12 }}>
              Devise
            </div>
            <div className="fw-medium">{user?.Devise}</div>
          </div>
          <div className="col-12 col-md-6">
            <div className="text-secondary" style={{ fontSize: 12 }}>
              Preferred Color
            </div>
            <div className="d-flex align-items-center gap-2">
              <span
                className="d-inline-block border rounded"
                style={{ width: 18, height: 18, background: user?.couleur || '#ffffff' }}
              />
              <span className="fw-medium">{user?.couleur}</span>
            </div>
          </div>
        </div>

        {!user?.admin && (
          <div className="alert alert-light border mt-3 mb-0" role="alert">
            Profile is read-only for visitors.
          </div>
        )}
      </motion.div>
    </div>
  )
}
