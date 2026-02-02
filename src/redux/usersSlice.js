import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { fetchStagiaires } from '../services/api'

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (args = {}, { rejectWithValue }) => {
  try {
    const page = Number(args?.page || 0)
    const limit = Number(args?.limit || 0)

    const isPaginated = page > 0 && limit > 0

    const params = {}
    if (page > 0) params.page = page
    if (limit > 0) params.limit = limit

    const res = await fetchStagiaires(params)
    const list = Array.isArray(res?.data) ? res.data : []

    const totalCountRaw = res?.headers?.['x-total-count']
    const totalCount = Number(totalCountRaw)

    if (!isPaginated) {
      return {
        items: list,
        totalCount: Number.isFinite(totalCount) ? totalCount : list.length,
      }
    }

    const totalPages = Number.isFinite(totalCount)
      ? Math.max(1, Math.ceil(totalCount / limit))
      : Math.max(1, page + (list.length === limit ? 1 : 0))

    return {
      items: list,
      currentPage: page,
      totalPages,
      limit,
      totalCount: Number.isFinite(totalCount) ? totalCount : null,
    }
  } catch (err) {
    return rejectWithValue('Failed to load users.')
  }
})

const initialState = {
  items: [],
  currentPage: 1,
  totalPages: 1,
  limit: 10,
  totalCount: null,
  loading: false,
  error: '',
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : []
    },
    setUsersPage: (state, action) => {
      const n = Number(action.payload)
      state.currentPage = Number.isFinite(n) && n > 0 ? n : 1
    },
    setUsersLimit: (state, action) => {
      const n = Number(action.payload)
      state.limit = n === 5 ? 5 : 10
      state.currentPage = 1
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.items = Array.isArray(action.payload?.items) ? action.payload.items : []

        if (action.payload?.currentPage) state.currentPage = Number(action.payload.currentPage)
        if (action.payload?.totalPages) state.totalPages = Number(action.payload.totalPages)
        if (action.payload?.limit) state.limit = Number(action.payload.limit)
        if (action.payload?.totalCount !== undefined) state.totalCount = action.payload.totalCount
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = String(action.payload || 'Failed to load users.')
      })
  },
})

export const { setUsers, setUsersLimit, setUsersPage } = usersSlice.actions

export const selectUsers = (state) => state.users.items
export const selectUsersLoading = (state) => state.users.loading
export const selectUsersError = (state) => state.users.error
export const selectUsersCurrentPage = (state) => state.users.currentPage
export const selectUsersTotalPages = (state) => state.users.totalPages
export const selectUsersLimit = (state) => state.users.limit
export const selectUsersTotalCount = (state) => state.users.totalCount

export default usersSlice.reducer
