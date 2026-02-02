import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'px_settings_v1'

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch (e) {
    return null
  }
}

const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    // ignore
  }
}

const persisted = loadSettings()

const initialState = {
  language: persisted?.language || 'en',
  themeColor: persisted?.themeColor || '#ffffff',
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload
      saveSettings(state)
    },
    setThemeColor: (state, action) => {
      state.themeColor = action.payload
      saveSettings(state)
    },
  },
})

export const { setLanguage, setThemeColor } = settingsSlice.actions

export const selectLanguage = (state) => state.settings.language
export const selectThemeColor = (state) => state.settings.themeColor

export default settingsSlice.reducer
