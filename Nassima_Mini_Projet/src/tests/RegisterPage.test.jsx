import { fireEvent, screen } from '@testing-library/react'

import RegisterPage from '../pages/RegisterPage'
import { renderWithProviders } from './testUtils'

vi.mock('../services/api', () => ({
  createStagiaire: vi.fn(() => Promise.resolve({ data: {} })),
}))

describe('RegisterPage', () => {
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
