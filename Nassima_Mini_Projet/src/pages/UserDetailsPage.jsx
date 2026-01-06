import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

import Avatar from '../components/Avatar'
import { fetchStagiaireById } from '../services/api'

export default function UserDetailsPage() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      setIsLoading(true)
      setError('')
      try {
        const res = await fetchStagiaireById(id)
        setUser(res?.data || null)
      } catch (e) {
        setError('Failed to load user details.')
      } finally {
        setIsLoading(false)
      }
    }

    run()
  }, [id])

  return (
    <div className="container py-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="px-card"
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h4 mb-0">User Details</h1>
          <Link className="btn btn-sm btn-outline-secondary" to="/users">
            Back
          </Link>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-secondary">Loading…</div>
        ) : user ? (
          <div className="row g-3">
            <div className="col-12 col-md-auto">
              <Avatar name={`${user?.prenom || ''} ${user?.nom || ''}`} avatarUrl={user?.avatar || user?.photo} size="lg" />
            </div>
            <div className="col">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <div className="h5 mb-0">
                  {user.prenom} {user.nom}
                </div>
                <span className="badge text-bg-light border">{user.admin ? 'Admin' : 'Visitor'}</span>
              </div>
              <div className="text-secondary">@{user.pseudo}</div>

              <div className="px-divider my-3" />

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Email
                  </div>
                  <div className="fw-medium">{user.email}</div>
                </div>
                <div className="col-12 col-md-3">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Age
                  </div>
                  <div className="fw-medium">{user.age}</div>
                </div>
                <div className="col-12 col-md-3">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Pays
                  </div>
                  <div className="fw-medium">{user.Pays}</div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Devise
                  </div>
                  <div className="fw-medium">{user.Devise}</div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Preferred Color
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="d-inline-block border rounded"
                      style={{ width: 18, height: 18, background: user.couleur || '#ffffff' }}
                    />
                    <span className="fw-medium">{user.couleur}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <Link className="btn btn-outline-primary" to={`/users/${user.id}/edit`}>
                  Edit user
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-secondary">Not found.</div>
        )}
      </motion.div>
    </div>
  )
}
