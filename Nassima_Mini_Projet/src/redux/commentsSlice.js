import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComment: {
      reducer: (state, action) => {
        state.items.push(action.payload)
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
  },
})

export const { addComment } = commentsSlice.actions

export const selectComments = (state) => state.comments.items

export const makeSelectCommentsByPostId = (postId) =>
  createSelector([selectComments], (items) => items.filter((c) => String(c.postId) === String(postId)))

export const makeSelectCommentsCountByPostId = (postId) =>
  createSelector([makeSelectCommentsByPostId(postId)], (items) => items.length)

export default commentsSlice.reducer
