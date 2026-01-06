import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit'

const STORAGE_KEY = 'px_requests_v1'

const normalizeStatus = (value) => {
  const s = String(value || '').toUpperCase()
  if (s === 'PENDING' || s === 'APPROVED' || s === 'REJECTED') return s

  if (s === 'PENDING') return 'PENDING'
  if (s === 'APPROVED') return 'APPROVED'
  if (s === 'REJECTED') return 'REJECTED'

  if (String(value || '').toLowerCase() === 'pending') return 'PENDING'
  if (String(value || '').toLowerCase() === 'approved') return 'APPROVED'
  if (String(value || '').toLowerCase() === 'rejected') return 'REJECTED'

  return 'PENDING'
}

const normalizeRequest = (r) => {
  const createdAt = r?.createdAt || r?.updatedAt || new Date().toISOString()
  const status = normalizeStatus(r?.status)
  return {
    id: String(r?.id || nanoid()),
    userId: String(r?.userId || ''),
    nom: String(r?.nom || ''),
    prenom: String(r?.prenom || ''),
    pseudo: String(r?.pseudo || ''),
    avatar: String(r?.avatar || r?.photo || ''),
    title: String(r?.title || ''),
    description: String(r?.description || ''),
    status,
    createdAt,
    approvedAt: status === 'APPROVED' ? r?.approvedAt || r?.updatedAt || createdAt : r?.approvedAt || null,
  }
}

const loadRequests = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(normalizeRequest) : []
  } catch (e) {
    return []
  }
}

export const saveRequests = (requests) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
  } catch (e) {
    // ignore
  }
}

const initialState = {
  items: loadRequests(),
}

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    addRequest: {
      reducer: (state, action) => {
        state.items.unshift(action.payload)
      },
      prepare: ({ title, description, userId, nom, prenom, pseudo, avatar }) => {
        const now = new Date().toISOString()
        return {
          payload: {
            id: nanoid(),
            userId,
            nom,
            prenom,
            pseudo,
            avatar,
            title,
            description,
            status: 'PENDING',
            createdAt: now,
            approvedAt: null,
          },
        }
      },
    },
    cancelPendingRequest: (state, action) => {
      const id = action.payload
      state.items = state.items.filter((r) => !(r.id === id && r.status === 'PENDING'))
    },
    approveRequest: (state, action) => {
      const id = action.payload
      const found = state.items.find((r) => r.id === id)
      if (!found) return

      found.status = 'APPROVED'
      found.approvedAt = new Date().toISOString()
    },
    rejectRequest: (state, action) => {
      const id = action.payload
      const found = state.items.find((r) => r.id === id)
      if (!found) return

      found.status = 'REJECTED'
      found.approvedAt = null
    },
    updateRequestContent: (state, action) => {
      const { id, title, description } = action.payload
      const found = state.items.find((r) => r.id === id)
      if (!found) return

      found.title = title
      found.description = description
    },
    clearAllRequests: (state) => {
      state.items = []
    },
  },
})

export const {
  addRequest,
  cancelPendingRequest,
  approveRequest,
  rejectRequest,
  updateRequestContent,
  clearAllRequests,
} = requestsSlice.actions

export const selectRequests = (state) => state.requests.items
export const selectRequestsByUserId = (userId) =>
  createSelector([selectRequests], (items) => items.filter((r) => String(r.userId) === String(userId)))

export const selectPendingRequests = createSelector([selectRequests], (items) =>
  items
    .filter((r) => r.status === 'PENDING')
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))),
)

export const selectApprovedPosts = createSelector([selectRequests], (items) =>
  items
    .filter((r) => r.status === 'APPROVED')
    .sort((a, b) => String(b.approvedAt).localeCompare(String(a.approvedAt))),
)

export const approvedPostsSelector = selectApprovedPosts

export default requestsSlice.reducer
