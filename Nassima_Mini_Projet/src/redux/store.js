import { configureStore } from '@reduxjs/toolkit'

import authReducer from './authSlice'
import commentsReducer from './commentsSlice'
import dashboardReducer from './dashboardSlice'
import likesReducer from './likesSlice'
import requestsReducer from './requestsSlice'
import settingsReducer from './settingsSlice'
import usersReducer from './usersSlice'

import { setComments } from './commentsSlice'
import { setLikes } from './likesSlice'
import { loadComments, loadLikes } from '../utils/socialStorage'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    likes: likesReducer,
    comments: commentsReducer,
    requests: requestsReducer,
    settings: settingsReducer,
    users: usersReducer,
    dashboard: dashboardReducer,
  },
})

store.dispatch(setLikes(loadLikes()))
store.dispatch(setComments(loadComments()))
