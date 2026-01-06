import React from 'react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'

import authReducer from '../redux/authSlice'
import commentsReducer from '../redux/commentsSlice'
import dashboardReducer from '../redux/dashboardSlice'
import likesReducer from '../redux/likesSlice'
import requestsReducer from '../redux/requestsSlice'
import settingsReducer from '../redux/settingsSlice'
import usersReducer from '../redux/usersSlice'

export function makeStore(preloadedState) {
  return configureStore({
    reducer: {
      auth: authReducer,
      likes: likesReducer,
      comments: commentsReducer,
      requests: requestsReducer,
      settings: settingsReducer,
      users: usersReducer,
      dashboard: dashboardReducer,
    },
    preloadedState,
  })
}

export function renderWithProviders(
  ui,
  {
    preloadedState,
    store = makeStore(preloadedState),
    route = '/',
  } = {},
) {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </Provider>
  )

  return {
    store,
    ...render(ui, { wrapper: Wrapper }),
  }
}
