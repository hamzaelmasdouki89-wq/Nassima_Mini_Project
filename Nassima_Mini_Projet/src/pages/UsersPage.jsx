import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import { deleteStagiaire, fetchStagiaires } from '../services/api'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetchStagiaires()
      setUsers(Array.isArray(res?.data) ? res.data : [])
    } catch (e) {
      setError('Failed to load users.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id) => {
    const ok = window.confirm('Delete this user?')
    if (!ok) return

    try {
      await deleteStagiaire(id)
      await load()
    } catch (e) {
      setError('Delete failed.')
    }
  }

  return (
    <div className="container py-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="px-card"
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h4 mb-0">Users</h1>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={load}>
            <i className="bi bi-arrow-clockwise me-1" />
            Refresh
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-secondary">Loading…</div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Pseudo</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={u.avatar || u.photo || 'https://via.placeholder.com/32'}
                          alt="avatar"
                          className="rounded-circle border"
                          width="32"
                          height="32"
                        />
                        <div>
                          <div className="fw-semibold" style={{ lineHeight: 1.1 }}>
                            {u.prenom} {u.nom}
                          </div>
                          <div className="text-secondary" style={{ fontSize: 12 }}>
                            id: {u.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>@{u.pseudo}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="badge text-bg-light border">{u.admin ? 'Admin' : 'Visitor'}</span>
                    </td>
                    <td className="text-end">
                      <Link className="btn btn-sm btn-outline-primary me-2" to={`/users/${u.id}`}>
                        Details
                      </Link>
                      <Link className="btn btn-sm btn-outline-secondary me-2" to={`/users/${u.id}/edit`}>
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
