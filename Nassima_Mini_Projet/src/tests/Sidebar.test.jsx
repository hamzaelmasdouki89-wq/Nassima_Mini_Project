import { screen } from '@testing-library/react'

import Sidebar from '../components/Sidebar'
import { renderWithProviders } from './testUtils'

describe('Sidebar', () => {
  test('shows admin menu for admin user', () => {
    renderWithProviders(<Sidebar />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: { id: '1', admin: true, age: 20, prenom: 'A', nom: 'B', pseudo: 'admin' },
        },
        requests: { items: [] },
      },
    })

    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Requests')).toBeInTheDocument()
    expect(screen.getByText('Change Color')).toBeInTheDocument()
  })

  test('hides Change Color for visitors under 15', () => {
    renderWithProviders(<Sidebar />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: { id: '2', admin: false, age: 10, prenom: 'V', nom: 'U', pseudo: 'visitor' },
        },
        requests: { items: [] },
      },
    })

    expect(screen.getByText('My Requests')).toBeInTheDocument()
    expect(screen.queryByText('Change Color')).not.toBeInTheDocument()
  })
})
