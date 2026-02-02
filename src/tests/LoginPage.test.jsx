import { fireEvent, screen } from '@testing-library/react'

import LoginPage from '../pages/LoginPage'
import { renderWithProviders } from './testUtils'

describe('LoginPage', () => {
  test('validates required fields and locks after 3 attempts', () => {
    renderWithProviders(<LoginPage />, {
      preloadedState: {
        auth: { isAuthenticated: false, user: { id: '' } },
        requests: { items: [] },
      },
      route: '/login',
    })

    const btn = screen.getByRole('button', { name: /sign in/i })

    fireEvent.click(btn)
    expect(screen.getByText('Username is required.')).toBeInTheDocument()
    expect(screen.getByText('Password is required.')).toBeInTheDocument()
    expect(screen.getByText(/Attempts: 1\/3/)).toBeInTheDocument()

    fireEvent.click(btn)
    fireEvent.click(btn)

    expect(screen.getByText(/Attempts: 3\/3/)).toBeInTheDocument()
    expect(screen.getByText(/Maximum attempts reached/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /locked/i })).toBeDisabled()
  })
})
