import { fireEvent, screen, waitFor } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import SettingsPage from '../pages/SettingsPage'
import { renderWithProviders } from './testUtils'

vi.mock('../services/api', async () => {
  const actual = await vi.importActual('../services/api')
  return {
    ...actual,
    fetchStagiaireById: vi.fn(async () => ({ data: {} })),
    updateStagiaire: vi.fn(async () => ({ data: {} })),
    fetchStagiaireSettingsById: vi.fn(async () => ({ data: { MotDePasse: 'hash' } })),
    updateStagiaireSettings: vi.fn(async () => ({ data: {} })),
  }
})

describe('Settings: avatar and language', () => {
  test('avatar upload shows preview after selecting a valid file', async () => {
    const { container } = renderWithProviders(<SettingsPage />, {
      preloadedState: {
        auth: { isAuthenticated: true, user: { id: 'u1', prenom: 'U', nom: 'One', pseudo: 'u1', avatar: '' } },
        settings: { language: 'en', themeColor: '#fff' },
        requests: { items: [] },
        likes: { items: [] },
        comments: { items: [] },
        users: { items: [] },
        dashboard: { dateRange: '7d', status: 'ALL' },
      },
    })

    fireEvent.click(screen.getByRole('button', { name: /profile picture/i }))

    const file = new File(['hello'], 'avatar.png', { type: 'image/png' })
    const input = await screen.findByLabelText('Avatar file')

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      const img = container.querySelector('img[alt="avatar preview"]')
      expect(img).toBeTruthy()
      expect(img.getAttribute('src') || '').toContain('data:')
    })
  })

  test('language switching updates visible UI text instantly', async () => {
    renderWithProviders(<SettingsPage />, {
      preloadedState: {
        auth: { isAuthenticated: true, user: { id: 'u1', prenom: 'U', nom: 'One', pseudo: 'u1', avatar: '' } },
        settings: { language: 'en', themeColor: '#fff' },
        requests: { items: [] },
        likes: { items: [] },
        comments: { items: [] },
        users: { items: [] },
        dashboard: { dateRange: '7d', status: 'ALL' },
      },
    })

    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /language preferences/i }))

    const select = await screen.findByLabelText('Language')
    fireEvent.change(select, { target: { value: 'fr' } })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Paramètres' })).toBeInTheDocument()
    })
  })
})
