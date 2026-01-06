import { fireEvent, screen } from '@testing-library/react'

import ChangeColorPage from '../pages/ChangeColorPage'
import ProfilePage from '../pages/ProfilePage'
import { renderWithProviders } from './testUtils'

describe('Profile + ChangeColor', () => {
  test('renders profile data', () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: { id: '1', prenom: 'Jane', nom: 'Doe', pseudo: 'janed', email: 'j@d.com', age: 22, admin: false },
        },
        requests: { items: [] },
      },
    })

    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('@janed')).toBeInTheDocument()
    expect(screen.getByText(/read-only for visitors/i)).toBeInTheDocument()
  })

  test('updates preferred color', () => {
    const { store } = renderWithProviders(<ChangeColorPage />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: { id: '1', prenom: 'A', nom: 'B', pseudo: 'ab', couleur: '#ffffff', admin: true },
        },
        requests: { items: [] },
      },
    })

    const color = screen.getByLabelText(/preferred color/i)
    fireEvent.change(color, { target: { value: '#ff0000' } })

    expect(store.getState().auth.user.couleur).toBe('#ff0000')
    expect(screen.getByText(/#ff0000/i)).toBeInTheDocument()
  })
})
