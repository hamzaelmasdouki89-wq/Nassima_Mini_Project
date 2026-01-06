import { fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react'

import MyRequestsPage from '../pages/MyRequestsPage'
import RequestsAdminPage from '../pages/RequestsAdminPage'
import { renderWithProviders } from './testUtils'

describe('Request system', () => {
  test('visitor can create and cancel a pending request', async () => {
    renderWithProviders(<MyRequestsPage />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: { id: 'u1', admin: false, prenom: 'V', nom: 'U', pseudo: 'vu' },
        },
        requests: { items: [] },
      },
    })

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Need help' } })
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Please approve' } })
    fireEvent.click(screen.getByRole('button', { name: /create request/i }))

    expect(screen.getByText('Need help')).toBeInTheDocument()
    expect(screen.getByText('PENDING')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

    await waitForElementToBeRemoved(() => screen.queryByText('Need help'))
  })

  test('admin can approve a pending request', () => {
    renderWithProviders(<RequestsAdminPage />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: { id: 'a1', admin: true, prenom: 'A', nom: 'D', pseudo: 'admin' },
        },
        requests: {
          items: [
            {
              id: 'r1',
              title: 'Original',
              description: 'Desc',
              userId: 'u1',
              nom: 'User',
              prenom: 'One',
              pseudo: 'u1',
              avatar: '',
              status: 'PENDING',
              createdAt: new Date('2020-01-01').toISOString(),
              approvedAt: null,
            },
          ],
        },
      },
    })

    fireEvent.click(screen.getByRole('button', { name: /approve/i }))

    expect(screen.getByText(/No pending requests/i)).toBeInTheDocument()
  })
})
