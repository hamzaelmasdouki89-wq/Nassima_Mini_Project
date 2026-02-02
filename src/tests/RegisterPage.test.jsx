import { fireEvent, screen } from '@testing-library/react'

import RegisterPage from '../pages/RegisterPage'
import { renderWithProviders } from './testUtils'

vi.mock('../services/api', async () => {
  const actual = await vi.importActual('../services/api')
  return {
    ...actual,
    createStagiaireAccount: vi.fn(() => Promise.resolve({ data: {} })),
  }
})

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve([]),
        })
      )
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  test('shows validation errors when submitting empty form', () => {
    renderWithProviders(<RegisterPage />, {
      preloadedState: {
        auth: { isAuthenticated: false, user: { id: '' } },
        requests: { items: [] },
      },
      route: '/register',
    })

    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    expect(screen.getByText('nom is required.')).toBeInTheDocument()
    expect(screen.getByText('Password must be at least 8 characters.')).toBeInTheDocument()
  })
})
