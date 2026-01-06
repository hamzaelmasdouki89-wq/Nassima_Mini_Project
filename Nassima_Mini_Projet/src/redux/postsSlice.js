import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [
    {
      id: 'post-1',
      author: {
        prenom: 'PX',
        nom: 'Team',
        pseudo: 'px',
        avatar: 'https://via.placeholder.com/48',
      },
      content: 'Welcome to PX Feed. Like, comment, and share posts like on x.com.',
      createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    },
    {
      id: 'post-2',
      author: {
        prenom: 'Design',
        nom: 'System',
        pseudo: 'design',
        avatar: 'https://via.placeholder.com/48',
      },
      content:
        'Clean UI, soft borders, and smooth transitions. This feed is mobile-first and Bootstrap-based.',
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
  ],
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
})

export const selectPosts = (state) => state.posts.items

export default postsSlice.reducer
