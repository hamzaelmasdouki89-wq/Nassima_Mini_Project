import { createSlice } from '@reduxjs/toolkit'

const emptyUser = {
  nom: '',
  prenom: '',
  age: null,
  admin: false,
  pseudo: '',
  couleur: '#ffffff',
  Devise: '',
  Pays: '',
  avatar: '',
  email: '',
  photo: '',
  id: '',
}

const initialState = {
  user: emptyUser,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { MotDePasse: _pwd, ...safeUser } = action.payload || {}
      state.user = { ...emptyUser, ...safeUser }
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = emptyUser
      state.isAuthenticated = false
    },
    updateUserFields: (state, action) => {
      state.user = {
        ...state.user,
        ...(action.payload || {}),
      }
    },
    updatePreferredColor: (state, action) => {
      state.user = {
        ...state.user,
        couleur: action.payload,
      }
    },
  },
})

export const { loginSuccess, logout, updateUserFields, updatePreferredColor } = authSlice.actions

export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectBackgroundColor = (state) => state.auth.user?.couleur || '#ffffff'

export default authSlice.reducer
