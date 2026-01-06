import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { selectUser } from '../redux/authSlice'
import { addRequest, cancelPendingRequest, fetchRequests, selectRequestsByUserId } from '../redux/requestsSlice'

export default function MyRequestsPage() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const myRequestsSelector = useMemo(() => selectRequestsByUserId(user?.id), [user?.id])
  const myRequests = useSelector(myRequestsSelector)

  useEffect(() => {
    dispatch(fetchRequests())
  }, [dispatch])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState([])

  const sorted = useMemo(() => {
    return [...myRequests].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
  }, [myRequests])

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = []

    if (!title.trim()) nextErrors.push('Title is required.')
    if (!description.trim()) nextErrors.push('Description is required.')

    if (nextErrors.length) {
      setErrors(nextErrors)
      return
    }

    dispatch(
      addRequest({
        title: title.trim(),
        description: description.trim(),
        userId: user.id,
        nom: user.nom,
        prenom: user.prenom,
        pseudo: user.pseudo,
        avatar: user.avatar || user.photo,
      }),
    )
    setTitle('')
    setDescription('')
    setErrors([])
  }

  const handleCancel = (id) => {
    dispatch(cancelPendingRequest(id))
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
          <h1 className="h4 mb-0">My Requests</h1>
          <span className="badge text-bg-light border">{sorted.length} total</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-5">
              <label className="form-label" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Request title"
              />
            </div>

            <div className="col-12 col-md-7">
              <label className="form-label" htmlFor="description">
                Description
              </label>
              <input
                id="description"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What do you need?"
              />
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-send me-1" />
                Create request
              </button>

              {errors.length > 0 && (
                <ul className="mt-2 mb-0 text-danger">
                  {errors.map((msg) => (
                    <li key={msg}>{msg}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </form>

        <div className="px-divider my-3" />

        <div className="d-flex flex-column gap-2">
          <AnimatePresence initial={false}>
            {sorted.map((r) => (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="px-card"
              >
                <div className="d-flex align-items-start justify-content-between gap-3">
                  <div>
                    <div className="fw-semibold">{r.title}</div>
                    <div className="text-secondary" style={{ fontSize: 14 }}>
                      {r.description}
                    </div>
                    <div className="text-secondary mt-2" style={{ fontSize: 12 }}>
                      Created: {new Date(r.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="text-end">
                    <span className="badge text-bg-light border">{r.status}</span>
                    {r.status === 'PENDING' && (
                      <div className="mt-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleCancel(r.id)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {sorted.length === 0 && <div className="text-secondary">No requests yet.</div>}
        </div>
      </motion.div>
    </div>
  )
}
