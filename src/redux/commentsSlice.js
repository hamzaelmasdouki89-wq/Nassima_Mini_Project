import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit'

import { loadComments, saveComments } from '../utils/socialStorage'

const persisted = loadComments()

const initialState = {
  items: Array.isArray(persisted) ? persisted : [],
}

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setComments: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : []
      saveComments(state.items)
    },
    addComment: {
      reducer: (state, action) => {
        state.items.push(action.payload)
        saveComments(state.items)
      },
      prepare: ({ postId, userId, nom, prenom, avatar, content }) => ({
        payload: {
          id: nanoid(),
          postId,
          userId,
          nom,
          prenom,
          avatar,
          content,
          createdAt: new Date().toISOString(),
        },
      }),
    },
    deleteComment: (state, action) => {
      const id = String(action.payload)
      state.items = state.items.filter((c) => String(c.id) !== id)
      saveComments(state.items)
    },
  },
})

export const { addComment, deleteComment, setComments } = commentsSlice.actions

export const selectComments = (state) => state.comments.items

export const makeSelectCommentsByPostId = (postId) =>
  createSelector([selectComments], (items) => items.filter((c) => String(c.postId) === String(postId)))

export const makeSelectCommentsCountByPostId = (postId) =>
  createSelector([makeSelectCommentsByPostId(postId)], (items) => items.length)

export default commentsSlice.reducer
