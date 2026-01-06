import { createSelector, createSlice } from '@reduxjs/toolkit'

import { loadLikes, saveLikes } from '../utils/socialStorage'

const persisted = loadLikes()

const initialState = {
  items: Array.isArray(persisted) ? persisted : [],
}

const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    setLikes: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : []
      saveLikes(state.items)
    },
    toggleLike: (state, action) => {
      const { postId, userId } = action.payload
      const idx = state.items.findIndex((l) => String(l.postId) === String(postId) && String(l.userId) === String(userId))
      if (idx >= 0) {
        state.items.splice(idx, 1)
        saveLikes(state.items)
        return
      }
      state.items.push({ postId, userId })
      saveLikes(state.items)
    },
  },
})

export const { setLikes, toggleLike } = likesSlice.actions

export const selectLikes = (state) => state.likes.items

export const makeSelectLikesCountByPostId = (postId) =>
  createSelector([selectLikes], (items) => items.filter((l) => String(l.postId) === String(postId)).length)

export const makeSelectIsLikedByUser = (postId, userId) =>
  createSelector([selectLikes], (items) =>
    items.some((l) => String(l.postId) === String(postId) && String(l.userId) === String(userId)),
  )

export default likesSlice.reducer
