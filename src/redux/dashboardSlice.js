import { createSelector, createSlice } from '@reduxjs/toolkit'

import { selectRequests } from './requestsSlice'
import { selectUsers } from './usersSlice'

const initialState = {
  dateRange: '7d',
  status: 'ALL',
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.dateRange = action.payload
    },
    setStatusFilter: (state, action) => {
      state.status = action.payload
    },
  },
})

export const { setDateRange, setStatusFilter } = dashboardSlice.actions

export const selectDashboardFilters = (state) => state.dashboard

const toTs = (value) => {
  const ts = Date.parse(String(value || ''))
  return Number.isFinite(ts) ? ts : 0
}

const withinRange = (createdAt, range) => {
  const now = Date.now()
  const ts = toTs(createdAt)

  if (range === 'today') {
    const d = new Date(now)
    d.setHours(0, 0, 0, 0)
    return ts >= d.getTime()
  }

  const days = range === '30d' ? 30 : 7
  return ts >= now - days * 24 * 60 * 60 * 1000
}

export const selectFilteredRequests = createSelector(
  [selectRequests, selectDashboardFilters],
  (requests, filters) => {
    const items = Array.isArray(requests) ? requests : []
    const status = String(filters?.status || 'ALL').toUpperCase()
    const range = filters?.dateRange || '7d'

    return items.filter((r) => {
      if (!withinRange(r?.createdAt, range)) return false
      if (status === 'ALL') return true
      return String(r?.status || '').toUpperCase() === status
    })
  },
)

export const selectDashboardStats = createSelector([selectUsers, selectFilteredRequests], (users, requests) => {
  const list = Array.isArray(requests) ? requests : []

  const totalRequests = list.length
  const approvedRequests = list.filter((r) => r.status === 'APPROVED').length
  const pendingRequests = list.filter((r) => r.status === 'PENDING').length
  const rejectedRequests = list.filter((r) => r.status === 'REJECTED').length

  return {
    totalUsers: Array.isArray(users) ? users.length : 0,
    totalRequests,
    approvedRequests,
    pendingRequests,
    rejectedRequests,
    totalPosts: approvedRequests,
  }
})

export const selectRequestsByStatus = createSelector([selectFilteredRequests], (requests) => {
  const list = Array.isArray(requests) ? requests : []
  return {
    PENDING: list.filter((r) => r.status === 'PENDING').length,
    APPROVED: list.filter((r) => r.status === 'APPROVED').length,
    REJECTED: list.filter((r) => r.status === 'REJECTED').length,
  }
})

export const selectUsersByRole = createSelector([selectUsers], (users) => {
  const list = Array.isArray(users) ? users : []
  return {
    admin: list.filter((u) => Boolean(u?.admin)).length,
    normal: list.filter((u) => !Boolean(u?.admin)).length,
  }
})

export const selectUsersByCountry = createSelector([selectUsers], (users) => {
  const list = Array.isArray(users) ? users : []
  const map = {}
  list.forEach((u) => {
    const key = String(u?.Pays || 'Unknown')
    map[key] = (map[key] || 0) + 1
  })
  return Object.entries(map)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
})

export const selectTopActiveUsers = createSelector([selectUsers, selectRequests], (users, requests) => {
  const userList = Array.isArray(users) ? users : []
  const reqList = Array.isArray(requests) ? requests : []

  const counts = {}
  reqList.forEach((r) => {
    const id = String(r?.userId || '')
    if (!id) return
    counts[id] = (counts[id] || 0) + 1
  })

  return userList
    .map((u) => ({
      userId: String(u?.id || ''),
      prenom: u?.prenom || '',
      nom: u?.nom || '',
      pseudo: u?.pseudo || '',
      count: counts[String(u?.id || '')] || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

export const selectRecentActivities = createSelector([selectUsers, selectRequests], (users, requests) => {
  const items = []

  ;(Array.isArray(users) ? users : []).forEach((u) => {
    items.push({
      id: `user-${u.id}`,
      type: 'USER_REGISTERED',
      date: u?.createdAt || '',
      label: `${u?.prenom || ''} ${u?.nom || ''} registered`,
    })
  })

  ;(Array.isArray(requests) ? requests : []).forEach((r) => {
    items.push({
      id: `req-created-${r.id}`,
      type: 'REQUEST_CREATED',
      date: r?.createdAt || '',
      label: `Request created: ${r?.title || ''}`,
    })

    if (r.status === 'APPROVED' && r.approvedAt) {
      items.push({
        id: `req-approved-${r.id}`,
        type: 'REQUEST_APPROVED',
        date: r?.approvedAt || '',
        label: `Request approved: ${r?.title || ''}`,
      })
    }

    if (r.status === 'REJECTED') {
      items.push({
        id: `req-rejected-${r.id}`,
        type: 'REQUEST_REJECTED',
        date: r?.createdAt || '',
        label: `Request rejected: ${r?.title || ''}`,
      })
    }
  })

  return items.sort((a, b) => toTs(b.date) - toTs(a.date))
})

export default dashboardSlice.reducer
