import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import Avatar from '../components/Avatar'
import Pagination from '../components/Pagination'
import {
  fetchUsers,
  selectUsers,
  selectUsersCurrentPage,
  selectUsersError,
  selectUsersLimit,
  selectUsersLoading,
  selectUsersTotalPages,
  setUsersLimit,
  setUsersPage,
} from '../redux/usersSlice'
import { deleteStagiaire } from '../services/api'

export default function UsersPage() {
  const dispatch = useDispatch()

  const users = useSelector(selectUsers)
  const isLoading = useSelector(selectUsersLoading)
  const error = useSelector(selectUsersError)
  const currentPage = useSelector(selectUsersCurrentPage)
  const totalPages = useSelector(selectUsersTotalPages)
  const limit = useSelector(selectUsersLimit)

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, limit }))
  }, [dispatch, currentPage, limit])

  const handleDelete = async (id) => {
    const ok = window.confirm('Delete this user?')
    if (!ok) return

    try {
      await deleteStagiaire(id)
      if (users.length <= 1 && currentPage > 1) {
        dispatch(setUsersPage(currentPage - 1))
        return
      }
      dispatch(fetchUsers({ page: currentPage, limit }))
    } catch (e) {
      dispatch(fetchUsers({ page: currentPage, limit }))
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
          <div className="d-flex align-items-center gap-2">
            <select
              aria-label="Page size"
              className="form-select form-select-sm"
              value={limit}
              onChange={(e) => dispatch(setUsersLimit(Number(e.target.value)))}
              style={{ width: 120 }}
              disabled={isLoading}
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
            </select>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => dispatch(fetchUsers({ page: currentPage, limit }))}
              disabled={isLoading}
            >
              <i className="bi bi-arrow-clockwise me-1" />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border" role="status" aria-label="Loading">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
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
                        <Avatar name={`${u?.prenom || ''} ${u?.nom || ''}`} avatarUrl={u?.avatar || u?.photo} size="sm" />
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

            <div className="d-flex flex-column align-items-center gap-2 py-2">
              <div className="text-secondary" style={{ fontSize: 13 }}>
                Page {currentPage} of {totalPages}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => dispatch(setUsersPage(p))} />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
