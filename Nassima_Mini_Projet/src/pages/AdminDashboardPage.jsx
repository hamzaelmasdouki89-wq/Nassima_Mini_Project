import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useT } from '../i18n/i18n'
import {
  selectDashboardFilters,
  selectDashboardStats,
  selectRecentActivities,
  selectRequestsByStatus,
  selectTopActiveUsers,
  selectUsersByCountry,
  selectUsersByRole,
  setDateRange,
  setStatusFilter,
} from '../redux/dashboardSlice'
import { fetchRequests, selectRequests, selectRequestsFetched } from '../redux/requestsSlice'
import { fetchUsers } from '../redux/usersSlice'
import { selectUsers } from '../redux/usersSlice'

function StatCard({ title, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="px-card h-100"
    >
      <div className="text-secondary" style={{ fontSize: 13 }}>
        {title}
      </div>
      <div className="fw-semibold" style={{ fontSize: 28, lineHeight: 1.1 }}>
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
          {value}
        </motion.span>
      </div>
    </motion.div>
  )
}

function BarChart({ data }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0) || 1
  const rows = [
    { key: 'PENDING', label: 'Pending', value: data.PENDING || 0, className: 'bg-warning' },
    { key: 'APPROVED', label: 'Approved', value: data.APPROVED || 0, className: 'bg-success' },
    { key: 'REJECTED', label: 'Rejected', value: data.REJECTED || 0, className: 'bg-danger' },
  ]

  return (
    <div className="d-flex flex-column gap-2">
      {rows.map((r) => (
        <div key={r.key}>
          <div className="d-flex justify-content-between">
            <div className="fw-medium">{r.label}</div>
            <div className="text-secondary">{r.value}</div>
          </div>
          <div className="progress" style={{ height: 10 }}>
            <div className={`progress-bar ${r.className}`} style={{ width: `${(r.value / total) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboardPage() {
  const t = useT()
  const dispatch = useDispatch()

  const filters = useSelector(selectDashboardFilters)
  const stats = useSelector(selectDashboardStats)
  const byStatus = useSelector(selectRequestsByStatus)
  const byRole = useSelector(selectUsersByRole)
  const byCountry = useSelector(selectUsersByCountry)
  const topActive = useSelector(selectTopActiveUsers)
  const recent = useSelector(selectRecentActivities)
  const users = useSelector(selectUsers)
  const requests = useSelector(selectRequests)
  const requestsFetched = useSelector(selectRequestsFetched)

  useEffect(() => {
    if (!Array.isArray(users) || users.length === 0) {
      dispatch(fetchUsers())
    }
    if (!requestsFetched) {
      dispatch(fetchRequests())
    }
  }, [dispatch, users, requestsFetched])

  const recentTop = useMemo(() => recent.slice(0, 10), [recent])

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">{t('admin_dashboard')}</h1>

        <div className="d-flex gap-2 flex-wrap">
          <select
            aria-label="Date range"
            className="form-select form-select-sm"
            value={filters.dateRange}
            onChange={(e) => dispatch(setDateRange(e.target.value))}
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>

          <select
            aria-label="Status filter"
            className="form-select form-select-sm"
            value={filters.status}
            onChange={(e) => dispatch(setStatusFilter(e.target.value))}
          >
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-4">
          <StatCard title="Total Users" value={stats.totalUsers} />
        </div>
        <div className="col-12 col-md-4">
          <StatCard title="Total Requests" value={stats.totalRequests} />
        </div>
        <div className="col-12 col-md-4">
          <StatCard title="Total Posts" value={stats.totalPosts} />
        </div>
        <div className="col-12 col-md-4">
          <StatCard title="Approved Requests" value={stats.approvedRequests} />
        </div>
        <div className="col-12 col-md-4">
          <StatCard title="Pending Requests" value={stats.pendingRequests} />
        </div>
        <div className="col-12 col-md-4">
          <StatCard title="Rejected Requests" value={stats.rejectedRequests} />
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-12 col-lg-6">
          <div className="px-card">
            <div className="fw-semibold mb-2">Requests by status</div>
            <BarChart data={byStatus} />
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="px-card">
            <div className="fw-semibold mb-2">Users analytics</div>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="text-secondary" style={{ fontSize: 13 }}>
                  Users by role
                </div>
                <div className="mt-2">
                  <div className="d-flex justify-content-between">
                    <span>Admin</span>
                    <span className="text-secondary">{byRole.admin}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Normal</span>
                    <span className="text-secondary">{byRole.normal}</span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="text-secondary" style={{ fontSize: 13 }}>
                  Top 5 most active
                </div>
                <div className="mt-2 d-flex flex-column gap-1">
                  {topActive.map((u) => (
                    <div key={u.userId} className="d-flex justify-content-between">
                      <span className="text-truncate" style={{ maxWidth: 180 }}>
                        {u.prenom} {u.nom} (@{u.pseudo})
                      </span>
                      <span className="text-secondary">{u.count}</span>
                    </div>
                  ))}
                  {topActive.length === 0 && <div className="text-secondary">No data</div>}
                </div>
              </div>

              <div className="col-12">
                <div className="text-secondary" style={{ fontSize: 13 }}>
                  Users by country
                </div>
                <div className="mt-2 d-flex flex-column gap-1">
                  {byCountry.slice(0, 8).map((c) => (
                    <div key={c.label} className="d-flex justify-content-between">
                      <span>{c.label}</span>
                      <span className="text-secondary">{c.value}</span>
                    </div>
                  ))}
                  {byCountry.length === 0 && <div className="text-secondary">No data</div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="px-card">
            <div className="fw-semibold mb-2">Recent activity</div>

            <AnimatePresence initial={false}>
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
                }}
                className="d-flex flex-column gap-2"
              >
                {recentTop.map((a) => (
                  <motion.div
                    key={a.id}
                    variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                    className="d-flex align-items-center justify-content-between"
                  >
                    <div className="text-truncate" style={{ maxWidth: '75%' }}>
                      {a.label}
                    </div>
                    <div className="text-secondary" style={{ fontSize: 12 }}>
                      {a.date ? new Date(a.date).toLocaleString() : ''}
                    </div>
                  </motion.div>
                ))}
                {recentTop.length === 0 && <div className="text-secondary">No activity yet.</div>}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
