import { fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { vi } from 'vitest'

import MyRequestsPage from '../pages/MyRequestsPage'
import RequestsAdminPage from '../pages/RequestsAdminPage'
import { fetchDemandes } from '../services/api'
import { renderWithProviders } from './testUtils'

vi.mock('../services/api', async () => {
  const actual = await vi.importActual('../services/api')
  return {
    ...actual,
    fetchDemandes: vi.fn(async () => ({ data: [] })),
    createDemande: vi.fn(async (payload) => ({ data: { ...payload, id: 'r-new' } })),
    updateDemande: vi.fn(async (id, payload) => ({ data: { ...payload, id } })),
    deleteDemande: vi.fn(async () => ({ data: {} })),
  }
})

describe('Request system', () => {
  test('visitor can create and cancel a pending request', async () => {
    fetchDemandes.mockResolvedValueOnce({ data: [] })

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

  test('admin can approve a pending request', async () => {
    const pendingRequest = {
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
    }

    fetchDemandes.mockResolvedValueOnce({ data: [pendingRequest] })

    renderWithProviders(<RequestsAdminPage />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: { id: 'a1', admin: true, prenom: 'A', nom: 'D', pseudo: 'admin' },
        },
        requests: {
          items: [
            pendingRequest,
          ],
        },
      },
    })

    const approveBtn = await screen.findByRole('button', { name: /approve/i })
    fireEvent.click(approveBtn)

    expect(screen.getByText(/No pending requests/i)).toBeInTheDocument()
  })
 })
