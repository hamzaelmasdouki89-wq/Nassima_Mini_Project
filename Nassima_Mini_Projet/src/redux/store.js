import { configureStore } from '@reduxjs/toolkit'

import authReducer from './authSlice'
import commentsReducer from './commentsSlice'
import dashboardReducer from './dashboardSlice'
import likesReducer from './likesSlice'
import requestsReducer from './requestsSlice'
import settingsReducer from './settingsSlice'
import usersReducer from './usersSlice'

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
