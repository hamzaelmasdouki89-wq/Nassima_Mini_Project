import { fireEvent, screen, waitFor, within } from '@testing-library/react'

import PostCard from '../components/PostCard'
import { renderWithProviders } from './testUtils'

describe('Home feed interactions', () => {
  test('guest can view counts but cannot interact', () => {
    renderWithProviders(
      <PostCard
        post={{
          id: 'p1',
          userId: 'u1',
          prenom: 'A',
          nom: 'B',
          pseudo: 'ab',
          avatar: '',
          title: 'Title',
          description: 'Hello',
          status: 'APPROVED',
          createdAt: new Date().toISOString(),
          approvedAt: new Date().toISOString(),
        }}
      />,
      {
        preloadedState: {
          auth: { isAuthenticated: false, user: { id: '' } },
          likes: { items: [{ postId: 'p1', userId: 'x' }] },
          comments: {
            items: [
              {
                id: 'c1',
                postId: 'p1',
                userId: 'x',
                nom: 'X',
                prenom: 'Y',
                avatar: '',
                content: 'Nice',
                createdAt: new Date().toISOString(),
              },
            ],
          },
          requests: { items: [] },
        },
      },
    )

    expect(screen.getByLabelText('Like')).toBeDisabled()
    expect(screen.getByLabelText('Comments')).toBeDisabled()
    expect(screen.getByLabelText('Share')).toBeDisabled()

    expect(within(screen.getByLabelText('Like')).getByText('1')).toBeInTheDocument()
    expect(within(screen.getByLabelText('Comments')).getByText('1')).toBeInTheDocument()
  })

  test('authenticated user can like/unlike', () => {
    const { store } = renderWithProviders(
      <PostCard
        post={{
          id: 'p1',
          userId: 'u1',
          prenom: 'A',
          nom: 'B',
          pseudo: 'ab',
          avatar: '',
          title: 'Title',
          description: 'Hello',
          status: 'APPROVED',
          createdAt: new Date().toISOString(),
          approvedAt: new Date().toISOString(),
        }}
      />,
      {
        preloadedState: {
          auth: { isAuthenticated: true, user: { id: 'u1', prenom: 'U', nom: 'One', pseudo: 'u1' } },
          likes: { items: [] },
          comments: { items: [] },
          requests: { items: [] },
        },
      },
    )

    fireEvent.click(screen.getByLabelText('Like'))
    expect(store.getState().likes.items).toHaveLength(1)

    fireEvent.click(screen.getByLabelText('Like'))
    expect(store.getState().likes.items).toHaveLength(0)
  })

  test('authenticated user can open comment section and add comment', async () => {
    renderWithProviders(
      <PostCard
        post={{
          id: 'p1',
          userId: 'u1',
          prenom: 'A',
          nom: 'B',
          pseudo: 'ab',
          avatar: '',
          title: 'Title',
          description: 'Hello',
          status: 'APPROVED',
          createdAt: new Date().toISOString(),
          approvedAt: new Date().toISOString(),
        }}
      />,
      {
        preloadedState: {
          auth: {
            isAuthenticated: true,
            user: { id: 'u1', prenom: 'U', nom: 'One', pseudo: 'u1', avatar: '' },
          },
          likes: { items: [] },
          comments: { items: [] },
          requests: { items: [] },
        },
      },
    )

    fireEvent.click(screen.getByLabelText('Comments'))

    const textarea = await screen.findByPlaceholderText(/write a comment/i)
    fireEvent.change(textarea, { target: { value: 'My comment' } })
    fireEvent.click(screen.getByRole('button', { name: 'Comment' }))

    await waitFor(() => {
      expect(screen.getByText('My comment')).toBeInTheDocument()
    })
  })
})
