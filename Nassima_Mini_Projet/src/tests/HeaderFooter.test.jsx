import { screen } from '@testing-library/react'

import Footer from '../components/Footer'
import Header from '../components/Header'
import { renderWithProviders } from './testUtils'

describe('Header/Footer', () => {
  test('renders header with user info and logout button', () => {
    renderWithProviders(<Header />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: { id: '1', admin: false, age: 20, prenom: 'John', nom: 'Doe', pseudo: 'jdoe', avatar: '' },
        },
        requests: { items: [] },
      },
    })

    expect(screen.getByText('PX')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  })

  test('renders footer address', () => {
    renderWithProviders(<Footer />, {
      preloadedState: {
        auth: { isAuthenticated: true, user: { id: '1' } },
        requests: { items: [] },
      },
    })

    expect(screen.getByText(/Avenue Example/i)).toBeInTheDocument()
  })
})
