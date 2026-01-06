import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Pagination from '../components/Pagination'
import RequestCard from '../components/RequestCard'
import {
  approveRequest,
  fetchRequests,
  rejectRequest,
  selectRequests,
  selectRequestsCurrentPage,
  selectRequestsError,
  selectRequestsFilter,
  selectRequestsLimit,
  selectRequestsLoading,
  selectRequestsTotalPages,
  selectRequestsTotalCount,
  setRequestsFilter,
  setRequestsLimit,
  setRequestsPage,
} from '../redux/requestsSlice'

export default function RequestsAdminPage() {
  const dispatch = useDispatch()

  const items = useSelector(selectRequests)
  const loading = useSelector(selectRequestsLoading)
  const error = useSelector(selectRequestsError)
  const currentPage = useSelector(selectRequestsCurrentPage)
  const totalPages = useSelector(selectRequestsTotalPages)
  const limit = useSelector(selectRequestsLimit)
  const filter = useSelector(selectRequestsFilter)
  const totalCount = useSelector(selectRequestsTotalCount)

  useEffect(() => {
    dispatch(fetchRequests({ page: currentPage, limit, status: filter }))
  }, [dispatch, currentPage, limit, filter])

  const sorted = useMemo(() => {
    return items
  }, [items])

  const emptyMessage = useMemo(() => {
    if (filter === 'PENDING') return 'No pending requests.'
    if (filter === 'APPROVED') return 'No approved requests.'
    if (filter === 'REJECTED') return 'No rejected requests.'
    return 'No requests.'
  }, [filter])

  const refetch = () => dispatch(fetchRequests({ page: currentPage, limit, status: filter }))

  const handleApprove = async (id) => {
    try {
      await dispatch(approveRequest(id))
    } finally {
      if (sorted.length <= 1 && currentPage > 1) {
        dispatch(setRequestsPage(currentPage - 1))
        return
      }
      refetch()
    }
  }

  const handleReject = async (id) => {
    try {
      await dispatch(rejectRequest(id))
    } finally {
      if (sorted.length <= 1 && currentPage > 1) {
        dispatch(setRequestsPage(currentPage - 1))
        return
      }
      refetch()
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
          <h1 className="h4 mb-0">Requests Management</h1>
          <span className="badge text-bg-light border">{Number.isFinite(Number(totalCount)) ? totalCount : sorted.length} items</span>
        </div>

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <div className="btn-group" role="group" aria-label="Request status filter">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((s) => (
              <button
                key={s}
                type="button"
                className={`btn btn-sm btn-outline-secondary ${filter === s ? 'active' : ''}`}
                onClick={() => dispatch(setRequestsFilter(s))}
                disabled={loading === 'pending'}
              >
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className="d-flex align-items-center gap-2">
            <select
              aria-label="Page size"
              className="form-select form-select-sm"
              value={limit}
              onChange={(e) => dispatch(setRequestsLimit(Number(e.target.value)))}
              style={{ width: 120 }}
              disabled={loading === 'pending'}
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
            </select>

            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={refetch} disabled={loading === 'pending'}>
              <i className="bi bi-arrow-clockwise me-1" />
              Refresh
            </button>
          </div>
        </div>

        {error && loading !== 'pending' && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {loading === 'pending' ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border" role="status" aria-label="Loading">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="d-flex flex-column gap-2">
              <AnimatePresence initial={false}>
                {sorted.map((r) => (
                  <RequestCard
                    key={r.id}
                    request={r}
                    rightSlot={
                      r.status === 'PENDING' ? (
                        <div className="d-flex gap-2">
                          <button type="button" className="btn btn-sm btn-success" onClick={() => handleApprove(r.id)}>
                            Approve
                          </button>
                          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleReject(r.id)}>
                            Reject
                          </button>
                        </div>
                      ) : null
                    }
                  />
                ))}
              </AnimatePresence>

              {sorted.length === 0 && <div className="text-secondary">{emptyMessage}</div>}
            </div>

            <div className="d-flex flex-column align-items-center gap-2 pt-3">
              <div className="text-secondary" style={{ fontSize: 13 }}>
                Page {currentPage} of {totalPages}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => dispatch(setRequestsPage(p))} />
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
