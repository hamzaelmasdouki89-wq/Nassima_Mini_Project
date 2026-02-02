import axios from 'axios'
import { mockUsers } from './mockData.js'

const isDev = typeof import.meta !== 'undefined' && import.meta?.env?.DEV
const USE_MOCK = false

export const api = axios.create({
  baseURL: isDev ? '/mockapi' : 'https://6935e745fa8e704dafbf386c.mockapi.io/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const settingsApi = axios.create({
  baseURL: isDev ? '/settingsapi' : 'https://670ed5b73e7151861655eaa3.mockapi.io/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Mock API functions for development
const mockApiResponse = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data })
    }, delay)
  })
}

export const fetchStagiaires = async (params = {}) => {
  if (USE_MOCK) return mockApiResponse(mockUsers)
  return api.get('users', { params })
}

export const createStagiaire = (payload) => {
  if (USE_MOCK) {
    const newUser = { id: Date.now().toString(), ...payload }
    mockUsers.push(newUser)
    return mockApiResponse(newUser)
  }
  return api.post('users', payload)
}

export const fetchStagiaireById = (id) => {
  if (USE_MOCK) {
    const user = mockUsers.find(u => u.id === id)
    return mockApiResponse(user)
  }
  return api.get(`users/${id}`)
}

export const updateStagiaire = (id, payload) => {
  if (USE_MOCK) {
    const userIndex = mockUsers.findIndex(u => u.id === id)
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...payload }
      return mockApiResponse(mockUsers[userIndex])
    }
    return mockApiResponse(null)
  }
  return api.put(`users/${id}`, payload)
}

export const deleteStagiaire = (id) => {
  if (USE_MOCK) {
    const userIndex = mockUsers.findIndex(u => u.id === id)
    if (userIndex !== -1) {
      mockUsers.splice(userIndex, 1)
      return mockApiResponse({ success: true })
    }
    return mockApiResponse({ success: false })
  }
  return api.delete(`users/${id}`)
}

export const fetchDemandes = (params = {}) => api.get('demandes', { params })
export const createDemande = (payload) => api.post('demandes', payload)
export const updateDemande = (id, payload) => api.put(`demandes/${id}`, payload)
export const deleteDemande = (id) => api.delete(`demandes/${id}`)

export const fetchStagiaireAccounts = async (params = {}) => {
  if (USE_MOCK) return mockApiResponse(mockUsers)
  return settingsApi.get('Stagiaire', { params })
}

export const createStagiaireAccount = (payload) => {
  if (USE_MOCK) {
    const newUser = { id: Date.now().toString(), ...payload }
    mockUsers.push(newUser)
    return mockApiResponse(newUser)
  }
  return settingsApi.post('Stagiaire', payload)
}

export const fetchStagiaireSettingsById = (id) => {
  if (USE_MOCK) {
    const user = mockUsers.find(u => u.id === id)
    return mockApiResponse(user)
  }
  return settingsApi.get(`Stagiaire/${id}`)
}

export const updateStagiaireSettings = (id, payload) => {
  if (USE_MOCK) {
    const userIndex = mockUsers.findIndex(u => u.id === id)
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...payload }
      return mockApiResponse(mockUsers[userIndex])
    }
    return mockApiResponse(null)
  }
  return settingsApi.put(`Stagiaire/${id}`, payload)
}
