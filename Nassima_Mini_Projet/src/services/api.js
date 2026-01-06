import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://6935e745fa8e704dafbf386c.mockapi.io/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const settingsApi = axios.create({
  baseURL: 'https://670ed5b73e7151861655eaa3.mockapi.io/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetchStagiaires = (params = {}) => api.get('/users', { params })
export const createStagiaire = (payload) => api.post('/users', payload)
export const fetchStagiaireById = (id) => api.get(`/users/${id}`)
export const updateStagiaire = (id, payload) => api.put(`/users/${id}`, payload)
export const deleteStagiaire = (id) => api.delete(`/users/${id}`)

export const fetchDemandes = (params = {}) => api.get('/demandes', { params })
export const createDemande = (payload) => api.post('/demandes', payload)
export const updateDemande = (id, payload) => api.put(`/demandes/${id}`, payload)
export const deleteDemande = (id) => api.delete(`/demandes/${id}`)

export const fetchStagiaireSettingsById = (id) => settingsApi.get(`/Stagiaire/${id}`)
export const updateStagiaireSettings = (id, payload) => settingsApi.put(`/Stagiaire/${id}`, payload)
