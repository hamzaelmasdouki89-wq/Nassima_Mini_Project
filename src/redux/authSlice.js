import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { clearAuthUser, loadAuthUser, saveAuthUser } from '../utils/authStorage'
import { fetchStagiaireAccounts, fetchStagiaires } from '../services/api'
import { passwordMatches } from '../utils/passwordUtils'

const emptyUser = {
  nom: '',
  prenom: '',
  age: null,
  admin: false,
  pseudo: '',
  couleur: '#ffffff',
  language: 'en',
  Devise: '',
  Pays: '',
  avatar: '',
  email: '',
  photo: '',
  id: '',
}

const persistedUser = loadAuthUser()

export const login = createAsyncThunk(
  'auth/login',
  async ({ pseudo, password }, { rejectWithValue }) => {
    const trimmedPseudo = String(pseudo || '').trim()
    const pwd = String(password || '')

    if (!trimmedPseudo || !pwd) {
      return rejectWithValue('Username and password are required.')
    }

    let list = []
    try {
      const res = await fetchStagiaires()
      list = Array.isArray(res?.data) ? res.data : []
    } catch (_err) {
      const res = await fetchStagiaireAccounts()
      list = Array.isArray(res?.data) ? res.data : []
    }

    const found = list.find((u) => {
      const uPseudo = String(u?.pseudo ?? u?.Pseudo ?? u?.username ?? '').trim()
      return uPseudo && uPseudo.toLowerCase() === trimmedPseudo.toLowerCase()
    })

    if (!found) return rejectWithValue('Invalid username or password.')

    const storedPassword = found?.MotDePasse ?? found?.motDePasse ?? found?.password ?? found?.Password
    const ok = await passwordMatches(storedPassword, pwd)
    if (!ok) return rejectWithValue('Invalid username or password.')

    const { MotDePasse: _pwdField, motDePasse: _pwdField2, password: _pwdField3, Password: _pwdField4, confirmPassword: _confirm, ...safeUser } =
      found || {}
    return safeUser
  },
)

const initialState = {
  user: persistedUser ? { ...emptyUser, ...persistedUser } : emptyUser,
  isAuthenticated: Boolean(persistedUser?.id),
  status: 'idle',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { MotDePasse: _pwd, ...safeUser } = action.payload || {}
      state.user = { ...emptyUser, ...safeUser }
      state.isAuthenticated = true

      state.status = 'succeeded'
      state.error = null

      saveAuthUser(state.user)
    },
    logout: (state) => {
      state.user = emptyUser
      state.isAuthenticated = false

      state.status = 'idle'
      state.error = null

      clearAuthUser()
    },
    updateUserFields: (state, action) => {
      state.user = {
        ...state.user,
        ...(action.payload || {}),
      }

      if (state.isAuthenticated) saveAuthUser(state.user)
    },
    updatePreferredColor: (state, action) => {
      state.user = {
        ...state.user,
        couleur: action.payload,
      }

      if (state.isAuthenticated) saveAuthUser(state.user)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'pending'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = { ...emptyUser, ...(action.payload || {}) }
        state.isAuthenticated = Boolean(state.user?.id)
        state.status = 'succeeded'
        state.error = null

        if (state.isAuthenticated) saveAuthUser(state.user)
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error?.message || 'Login failed.'
        state.isAuthenticated = false
        state.user = emptyUser
      })
  },
})

export const { loginSuccess, logout, updateUserFields, updatePreferredColor } = authSlice.actions

export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectBackgroundColor = (state) => state.auth.user?.couleur || '#ffffff'
export const selectAuthStatus = (state) => state.auth.status
export const selectAuthError = (state) => state.auth.error

export default authSlice.reducer
