import { createAsyncThunk, createSelector, createSlice, nanoid } from '@reduxjs/toolkit'
import { createDemande, deleteDemande, fetchDemandes, updateDemande } from '../services/api'

const normalizeStatus = (value) => {
  const raw = String(value || '').trim()
  const s = raw.toUpperCase()
  if (s === 'PENDING' || s === 'APPROVED' || s === 'REJECTED') return s

  const lower = raw.toLowerCase()
  if (lower === 'pending' || lower === 'en attente') return 'PENDING'
  if (lower === 'approved' || lower === 'approuvée' || lower === 'approuvee') return 'APPROVED'
  if (lower === 'rejected' || lower === 'rejetée' || lower === 'rejetee') return 'REJECTED'

  return 'PENDING'
}

const normalizeRequest = (r) => {
  const createdAt = r?.createdAt || r?.updatedAt || new Date().toISOString()
  const rawStatus = r?.status ?? r?.statut ?? r?.statu
  const status = normalizeStatus(rawStatus)
  return {
    id: String(r?.id || nanoid()),
    userId: String(r?.userId || ''),
    nom: String(r?.nom || ''),
    prenom: String(r?.prenom || ''),
    pseudo: String(r?.pseudo || r?.username || ''),
    avatar: String(r?.avatar || r?.photo || ''),
    title: String(r?.title || r?.titre || ''),
    description: String(r?.description || ''),
    status,
    createdAt,
    approvedAt: status === 'APPROVED' ? r?.approvedAt || r?.updatedAt || createdAt : r?.approvedAt || null,
  }
}

const getErrorMessage = (err) => {
  const apiMsg = err?.response?.data?.message
  if (apiMsg) return String(apiMsg)
  const msg = err?.message
  return msg ? String(msg) : 'Something went wrong. Please try again.'
}

export const fetchRequests = createAsyncThunk('requests/fetchRequests', async (_, { rejectWithValue }) => {
  const args = _ || {}

  const page = Number(args?.page || 0)
  const limit = Number(args?.limit || 0)
  const statusRaw = String(args?.status || '').toUpperCase()

  const isPaginated = page > 0 && limit > 0
  const status = statusRaw === 'PENDING' || statusRaw === 'APPROVED' || statusRaw === 'REJECTED' || statusRaw === 'ALL' ? statusRaw : ''

  try {
    const params = {}
    if (page > 0) params.page = page
    if (limit > 0) params.limit = limit
    if (status && status !== 'ALL') params.status = status

    const res = await fetchDemandes(params)
    const list = Array.isArray(res?.data) ? res.data : []
    const items = list.map(normalizeRequest)

    const totalCountRaw = res?.headers?.['x-total-count']
    const totalCount = Number(totalCountRaw)

    if (!isPaginated) {
      return {
        items,
        totalCount: Number.isFinite(totalCount) ? totalCount : items.length,
        isPaginated: false,
      }
    }

    const totalPages = Number.isFinite(totalCount)
      ? Math.max(1, Math.ceil(totalCount / limit))
      : Math.max(1, page + (items.length === limit ? 1 : 0))

    return {
      items,
      currentPage: page,
      totalPages,
      limit,
      filter: status || 'ALL',
      totalCount: Number.isFinite(totalCount) ? totalCount : null,
      isPaginated: true,
    }
  } catch (err) {
    const code = err?.response?.status
    if (code === 404 && status && status !== 'ALL') {
      if (!isPaginated) {
        return { items: [], totalCount: 0, isPaginated: false }
      }
      return {
        items: [],
        currentPage: page || 1,
        totalPages: 1,
        limit: limit || 10,
        filter: status,
        totalCount: 0,
        isPaginated: true,
      }
    }

    return rejectWithValue(getErrorMessage(err))
  }
})

const applyUpdateToList = (list, predicate, updater) => {
  const idx = Array.isArray(list) ? list.findIndex(predicate) : -1
  if (idx < 0) return
  list[idx] = updater(list[idx])
}

export const addRequest = createAsyncThunk('requests/addRequest', async (payload, { rejectWithValue }) => {
  try {
    const now = new Date().toISOString()
    const body = {
      userId: String(payload?.userId || ''),
      nom: String(payload?.nom || ''),
      prenom: String(payload?.prenom || ''),
      pseudo: String(payload?.pseudo || ''),
      avatar: String(payload?.avatar || ''),
      title: String(payload?.title || ''),
      description: String(payload?.description || ''),
      status: 'PENDING',
      createdAt: now,
      approvedAt: null,
    }
    const res = await createDemande(body)
    return normalizeRequest(res?.data)
  } catch (err) {
    return rejectWithValue(getErrorMessage(err))
  }
})

export const cancelPendingRequest = createAsyncThunk(
  'requests/cancelPendingRequest',
  async (id, { getState, rejectWithValue }) => {
    try {
      const items = getState()?.requests?.items || []
      const found = items.find((r) => String(r?.id) === String(id))
      if (String(found?.id || '').startsWith('tmp-')) return { id: String(id), localOnly: true }

      await deleteDemande(id)
      return { id: String(id) }
    } catch (err) {
      return rejectWithValue(getErrorMessage(err))
    }
  },
)

export const approveRequest = createAsyncThunk('requests/approveRequest', async (id, { rejectWithValue }) => {
  try {
    const now = new Date().toISOString()
    const res = await updateDemande(id, { status: 'APPROVED', approvedAt: now })
    return normalizeRequest(res?.data)
  } catch (err) {
    return rejectWithValue(getErrorMessage(err))
  }
})

export const rejectRequest = createAsyncThunk('requests/rejectRequest', async (id, { rejectWithValue }) => {
  try {
    const res = await updateDemande(id, { status: 'REJECTED', approvedAt: null })
    return normalizeRequest(res?.data)
  } catch (err) {
    return rejectWithValue(getErrorMessage(err))
  }
})

const initialState = {
  items: [],
  pagedItems: [],
  currentPage: 1,
  totalPages: 1,
  limit: 10,
  filter: 'PENDING',
  totalCount: null,
  loading: 'idle',
  error: null,
  pageLoading: 'idle',
  pageError: null,
  fetched: false,
}

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    updateRequestContent: (state, action) => {
      const { id, title, description } = action.payload
      const found = state.items.find((r) => r.id === id)
      if (!found) return

      found.title = title
      found.description = description
    },
    clearAllRequests: (state) => {
      state.items = []
      state.pagedItems = []
      state.loading = 'idle'
      state.error = null
      state.pageLoading = 'idle'
      state.pageError = null
      state.fetched = false
    },
    setRequestsPage: (state, action) => {
      const n = Number(action.payload)
      state.currentPage = Number.isFinite(n) && n > 0 ? n : 1
    },
    setRequestsLimit: (state, action) => {
      const n = Number(action.payload)
      state.limit = n === 5 ? 5 : 10
      state.currentPage = 1
    },
    setRequestsFilter: (state, action) => {
      const next = String(action.payload || '').toUpperCase()
      state.filter = next === 'PENDING' || next === 'APPROVED' || next === 'REJECTED' || next === 'ALL' ? next : 'ALL'
      state.currentPage = 1
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state, action) => {
        const args = action?.meta?.arg || {}
        const page = Number(args?.page || 0)
        const limit = Number(args?.limit || 0)
        const isPaginated = page > 0 && limit > 0
        if (isPaginated) {
          state.pageLoading = 'pending'
          state.pageError = null
          return
        }
        state.loading = 'pending'
        state.error = null
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        const isPaginated = Boolean(action.payload?.isPaginated)
        if (isPaginated) {
          state.pageLoading = 'succeeded'
          state.pagedItems = Array.isArray(action.payload?.items) ? action.payload.items : []

          if (action.payload?.currentPage) state.currentPage = Number(action.payload.currentPage)
          if (action.payload?.totalPages) state.totalPages = Number(action.payload.totalPages)
          if (action.payload?.limit) state.limit = Number(action.payload.limit)
          if (action.payload?.filter) state.filter = String(action.payload.filter)
          if (action.payload?.totalCount !== undefined) state.totalCount = action.payload.totalCount
          return
        }

        state.loading = 'succeeded'
        state.items = Array.isArray(action.payload?.items) ? action.payload.items : []
        state.fetched = true
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        const args = action?.meta?.arg || {}
        const page = Number(args?.page || 0)
        const limit = Number(args?.limit || 0)
        const isPaginated = page > 0 && limit > 0
        if (isPaginated) {
          state.pageLoading = 'failed'
          state.pageError = String(action.payload || action.error?.message || 'Failed to load requests.')
          return
        }
        state.loading = 'failed'
        state.error = String(action.payload || action.error?.message || 'Failed to load requests.')
      })

      .addCase(addRequest.pending, (state, action) => {
        state.error = null
        const now = new Date().toISOString()
        const tempId = `tmp-${action.meta.requestId}`
        state.items.unshift(
          normalizeRequest({
            ...action.meta.arg,
            id: tempId,
            status: 'PENDING',
            createdAt: now,
            approvedAt: null,
          }),
        )
      })
      .addCase(addRequest.fulfilled, (state, action) => {
        const created = normalizeRequest(action.payload)
        const tempId = `tmp-${action.meta.requestId}`
        const idx = state.items.findIndex((r) => String(r.id) === tempId)
        if (idx >= 0) state.items[idx] = created
        else state.items.unshift(created)
      })
      .addCase(addRequest.rejected, (state, action) => {
        const tempId = `tmp-${action.meta.requestId}`
        state.items = state.items.filter((r) => String(r.id) !== tempId)
        state.error = String(action.payload || action.error?.message || 'Failed to create request.')
      })

      .addCase(cancelPendingRequest.pending, (state, action) => {
        const id = String(action.meta.arg)
        state.items = state.items.filter((r) => !(String(r.id) === id && r.status === 'PENDING'))
        state.pagedItems = state.pagedItems.filter((r) => !(String(r.id) === id && r.status === 'PENDING'))
      })
      .addCase(cancelPendingRequest.rejected, (state, action) => {
        state.error = String(action.payload || action.error?.message || 'Failed to cancel request.')
      })

      .addCase(approveRequest.pending, (state, action) => {
        const id = String(action.meta.arg)
        const apply = (r) => ({ ...r, status: 'APPROVED', approvedAt: new Date().toISOString() })
        applyUpdateToList(state.items, (r) => String(r.id) === id, apply)
        applyUpdateToList(state.pagedItems, (r) => String(r.id) === id, apply)
      })
      .addCase(approveRequest.fulfilled, (state, action) => {
        const updated = normalizeRequest(action.payload)
        const apply = (r) => ({ ...r, ...updated })
        applyUpdateToList(state.items, (r) => String(r.id) === String(updated.id), apply)
        applyUpdateToList(state.pagedItems, (r) => String(r.id) === String(updated.id), apply)
      })
      .addCase(approveRequest.rejected, (state, action) => {
        state.error = String(action.payload || action.error?.message || 'Failed to approve request.')
      })

      .addCase(rejectRequest.pending, (state, action) => {
        const id = String(action.meta.arg)
        const apply = (r) => ({ ...r, status: 'REJECTED', approvedAt: null })
        applyUpdateToList(state.items, (r) => String(r.id) === id, apply)
        applyUpdateToList(state.pagedItems, (r) => String(r.id) === id, apply)
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        const updated = normalizeRequest(action.payload)
        const apply = (r) => ({ ...r, ...updated })
        applyUpdateToList(state.items, (r) => String(r.id) === String(updated.id), apply)
        applyUpdateToList(state.pagedItems, (r) => String(r.id) === String(updated.id), apply)
      })
      .addCase(rejectRequest.rejected, (state, action) => {
        state.error = String(action.payload || action.error?.message || 'Failed to reject request.')
      })
  },
})

export const { updateRequestContent, clearAllRequests } = requestsSlice.actions

export const { setRequestsFilter, setRequestsLimit, setRequestsPage } = requestsSlice.actions

export const selectRequests = (state) => state.requests.items
export const selectRequestsLoading = (state) => state.requests.loading
export const selectRequestsError = (state) => state.requests.error
export const selectRequestsFetched = (state) => Boolean(state?.requests?.fetched)

export const selectPagedRequests = (state) => state?.requests?.pagedItems || []
export const selectRequestsPageLoading = (state) => state?.requests?.pageLoading || 'idle'
export const selectRequestsPageError = (state) => state?.requests?.pageError || null
export const selectRequestsCurrentPage = (state) => {
  const n = Number(state?.requests?.currentPage)
  return Number.isFinite(n) && n > 0 ? n : 1
}
export const selectRequestsTotalPages = (state) => {
  const n = Number(state?.requests?.totalPages)
  return Number.isFinite(n) && n > 0 ? n : 1
}
export const selectRequestsLimit = (state) => {
  const n = Number(state?.requests?.limit)
  return n === 5 ? 5 : 10
}
export const selectRequestsFilter = (state) => {
  const s = String(state?.requests?.filter || 'PENDING').toUpperCase()
  return s === 'PENDING' || s === 'APPROVED' || s === 'REJECTED' || s === 'ALL' ? s : 'PENDING'
}
export const selectRequestsTotalCount = (state) => state?.requests?.totalCount ?? null
export const selectRequestsByUserId = (userId) =>
  createSelector([selectRequests], (items) => items.filter((r) => String(r.userId) === String(userId)))

export const selectPendingRequests = createSelector([selectRequests], (items) =>
  items
    .filter((r) => r.status === 'PENDING')
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))),
)

const toTs = (value) => {
  const ts = Date.parse(String(value || ''))
  return Number.isFinite(ts) ? ts : 0
}

export const approvedRequestsSelector = createSelector([selectRequests], (items) =>
  items
    .filter((r) => r.status === 'APPROVED')
    .sort((a, b) => toTs(b.approvedAt) - toTs(a.approvedAt)),
)

export const selectApprovedPosts = approvedRequestsSelector
export const approvedPostsSelector = approvedRequestsSelector

export default requestsSlice.reducer
