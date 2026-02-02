import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { within } from '@testing-library/react'

import RequireAdmin from '../routes/RequireAdmin'
import AdminDashboardPage from '../pages/AdminDashboardPage'
import { renderWithProviders } from './testUtils'

describe('Admin route protection', () => {
  test('non-admin is redirected to /unauthorized', () => {
    renderWithProviders(
      <RequireAdmin>
        <div>Secret</div>
      </RequireAdmin>,
      {
        preloadedState: {
          auth: { isAuthenticated: true, user: { id: 'u1', admin: false } },
          settings: { language: 'en', themeColor: '#fff' },
          requests: { items: [] },
          likes: { items: [] },
          comments: { items: [] },
          users: { items: [] },
          dashboard: { dateRange: '7d', status: 'ALL' },
        },
        route: '/admin/dashboard',
      },
    )

    expect(screen.queryByText('Secret')).not.toBeInTheDocument()
  })
})

describe('Dashboard stats and filters', () => {
  test('stats are derived from state and filters apply', () => {
    renderWithProviders(<AdminDashboardPage />, {
      preloadedState: {
        auth: { isAuthenticated: true, user: { id: 'a1', admin: true } },
        settings: { language: 'en', themeColor: '#fff' },
        users: {
          items: [
            { id: 'a1', admin: true, prenom: 'A', nom: 'D', pseudo: 'admin', Pays: 'FR' },
            { id: 'u1', admin: false, prenom: 'U', nom: 'One', pseudo: 'u1', Pays: 'FR' },
          ],
          loading: false,
          error: '',
        },
        requests: {
          items: [
            {
              id: 'r1',
              userId: 'u1',
              prenom: 'U',
              nom: 'One',
              pseudo: 'u1',
              avatar: '',
              title: 'T1',
              description: 'D1',
              status: 'APPROVED',
              createdAt: new Date().toISOString(),
              approvedAt: new Date().toISOString(),
            },
            {
              id: 'r2',
              userId: 'u1',
              prenom: 'U',
              nom: 'One',
              pseudo: 'u1',
              avatar: '',
              title: 'T2',
              description: 'D2',
              status: 'PENDING',
              createdAt: new Date().toISOString(),
              approvedAt: null,
            },
          ],
        },
        likes: { items: [] },
        comments: { items: [] },
        dashboard: { dateRange: '7d', status: 'ALL' },
      },
    })

    const totalUsersCard = screen.getByText('Total Users').closest('.px-card')
    expect(totalUsersCard).toBeTruthy()
    expect(within(totalUsersCard).getByText('2')).toBeInTheDocument()

    const approvedCard = screen.getByText('Approved Requests').closest('.px-card')
    expect(approvedCard).toBeTruthy()
    expect(within(approvedCard).getByText('1')).toBeInTheDocument()

    // filter only approved
    const statusFilter = screen.getByLabelText('Status filter')

    fireEvent.change(statusFilter, { target: { value: 'APPROVED' } })

    expect(screen.getByText('Requests by status')).toBeInTheDocument()
    expect(screen.getAllByText('0').length).toBeGreaterThan(0)
  })
})
