import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { fetchStagiaires } from '../services/api'

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const res = await fetchStagiaires()
  return Array.isArray(res?.data) ? res.data : []
})

const initialState = {
  items: [],
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false
        state.error = 'Failed to load users.'
      })
  },
})

export const { setUsers } = usersSlice.actions

export const selectUsers = (state) => state.users.items
export const selectUsersLoading = (state) => state.users.loading
export const selectUsersError = (state) => state.users.error

export default usersSlice.reducer
