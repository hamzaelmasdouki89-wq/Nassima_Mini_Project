import { createSlice } from '@reduxjs/toolkit'

import { clearAuthUser, loadAuthUser, saveAuthUser } from '../utils/authStorage'

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

const initialState = {
  user: persistedUser ? { ...emptyUser, ...persistedUser } : emptyUser,
  isAuthenticated: Boolean(persistedUser?.id),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { MotDePasse: _pwd, ...safeUser } = action.payload || {}
      state.user = { ...emptyUser, ...safeUser }
      state.isAuthenticated = true

      saveAuthUser(state.user)
    },
    logout: (state) => {
      state.user = emptyUser
      state.isAuthenticated = false

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
})

export const { loginSuccess, logout, updateUserFields, updatePreferredColor } = authSlice.actions

export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectBackgroundColor = (state) => state.auth.user?.couleur || '#ffffff'

export default authSlice.reducer
