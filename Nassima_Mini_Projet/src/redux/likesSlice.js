import { createSelector, createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    toggleLike: (state, action) => {
      const { postId, userId } = action.payload
      const idx = state.items.findIndex((l) => String(l.postId) === String(postId) && String(l.userId) === String(userId))
      if (idx >= 0) {
        state.items.splice(idx, 1)
        return
      }
      state.items.push({ postId, userId })
    },
  },
})

export const { toggleLike } = likesSlice.actions

export const selectLikes = (state) => state.likes.items

export const makeSelectLikesCountByPostId = (postId) =>
  createSelector([selectLikes], (items) => items.filter((l) => String(l.postId) === String(postId)).length)

export const makeSelectIsLikedByUser = (postId, userId) =>
  createSelector([selectLikes], (items) =>
    items.some((l) => String(l.postId) === String(postId) && String(l.userId) === String(userId)),
  )

export default likesSlice.reducer
