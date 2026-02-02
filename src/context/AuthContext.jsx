import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR'
}

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      }
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      }
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      }
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

// Create context
const AuthContext = createContext()

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('authUser')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: user
        })
      } catch (error) {
        console.error('Failed to parse saved user:', error)
        localStorage.removeItem('authUser')
      }
    }
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('authUser', JSON.stringify(state.user))
    } else {
      localStorage.removeItem('authUser')
    }
  }, [state.user])

  // Login function
  const login = async (pseudo, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START })

    try {
      // Mock API call - replace with your actual API
      const mockUsers = [
        {
          "nom": "Anas",
          "prenom": "Hrdouch",
          "pseudo": "User715",
          "age": 21,
          "email": "Anas21@gmail.com",
          "MotDePasse": "Anas@2103",
          "Pays": "Morocco",
          "couleur": "#f42151",
          "Devise": "USD",
          "admin": true,
          "avatar": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/733.jpg",
          "photo": "https://loremflickr.com/640/480/people?random=0.7500211132432872",
          "id": "9"
        }
      ]

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Find user
      const found = mockUsers.find(
        (u) => u.pseudo.toLowerCase() === pseudo.toLowerCase()
      )

      if (!found) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: 'Invalid username or password'
        })
        return false
      }

      // Check password
      if (found.MotDePasse !== password) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: 'Invalid username or password'
        })
        return false
      }

      // Success
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: found
      })
      return true

    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: 'Login failed. Please try again.'
      })
      return false
    }
  }

  // Logout function
  const logout = () => {
    dispatch({ type: AUTH_ACTIONS.LOGOUT })
  }

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
  }

  const value = {
    ...state,
    login,
    logout,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
