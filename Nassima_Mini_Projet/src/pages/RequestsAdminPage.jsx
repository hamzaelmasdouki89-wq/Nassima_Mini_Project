import { AnimatePresence, motion } from 'framer-motion'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import RequestCard from '../components/RequestCard'
import { approveRequest, rejectRequest, selectPendingRequests } from '../redux/requestsSlice'

export default function RequestsAdminPage() {
  const dispatch = useDispatch()
  const pending = useSelector(selectPendingRequests)

  const sorted = useMemo(() => {
    return pending
  }, [pending])

  const handleApprove = (id) => dispatch(approveRequest(id))
  const handleReject = (id) => dispatch(rejectRequest(id))

  return (
    <div className="container py-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="px-card"
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h4 mb-0">Requests Management</h1>
          <span className="badge text-bg-light border">{sorted.length} pending</span>
        </div>

        <div className="d-flex flex-column gap-2">
          <AnimatePresence initial={false}>
            {sorted.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                rightSlot={
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-sm btn-success" onClick={() => handleApprove(r.id)}>
                      Approve
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleReject(r.id)}>
                      Reject
                    </button>
                  </div>
                }
              />
            ))}
          </AnimatePresence>

          {sorted.length === 0 && <div className="text-secondary">No pending requests.</div>}
        </div>
      </motion.div>
    </div>
  )
}
