import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import PostCard from '../components/PostCard'
import {
  approvedRequestsSelector,
  fetchRequests,
  selectRequestsError,
  selectRequestsFetched,
  selectRequestsLoading,
} from '../redux/requestsSlice'

export default function HomePage() {
  const dispatch = useDispatch()

  const loading = useSelector(selectRequestsLoading)
  const error = useSelector(selectRequestsError)
  const fetched = useSelector(selectRequestsFetched)
  const posts = useSelector(approvedRequestsSelector)

  useEffect(() => {
    if (!fetched) dispatch(fetchRequests())
  }, [dispatch, fetched])

  return (
    <div className="container py-4" style={{ maxWidth: 600 }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Accueil</h1>
        <span className="badge text-bg-light border">{posts.length} posts</span>
      </div>

      {loading === 'pending' && (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border" role="status" aria-label="Loading">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {loading !== 'pending' && error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading !== 'pending' && !error && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.06 } },
          }}
          className="d-flex flex-column gap-3"
        >
          {posts.map((p) => (
            <motion.div key={p.id} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
              <PostCard post={p} />
            </motion.div>
          ))}
          {posts.length === 0 && <div className="text-secondary">No approved posts yet.</div>}
        </motion.div>
      )}
    </div>
  )
}
