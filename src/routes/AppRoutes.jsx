import { Navigate, Route, Routes } from 'react-router-dom'

import AppLayout from './AppLayout'
import RequireAdmin from './RequireAdmin'
import RequireAge from './RequireAge'
import RequireAuth from './RequireAuth'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import MyRequestsPage from '../pages/MyRequestsPage'
import ProfilePage from '../pages/ProfilePage'
import RequestsAdminPage from '../pages/RequestsAdminPage'
import RegisterPage from '../pages/RegisterPage'
import ChangeColorPage from '../pages/ChangeColorPage'
import UserDetailsPage from '../pages/UserDetailsPage'
import UserEditPage from '../pages/UserEditPage'
import UsersPage from '../pages/UsersPage'
import SettingsPage from '../pages/SettingsPage'
import AdminDashboardPage from '../pages/AdminDashboardPage'
import UnauthorizedPage from '../pages/UnauthorizedPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />

        <Route
          path="/settings"
          element={
            <RequireAuth>
              <SettingsPage />
            </RequireAuth>
          }
        />

        <Route
          path="/change-color"
          element={
            <RequireAuth>
              <RequireAge minAge={15}>
                <ChangeColorPage />
              </RequireAge>
            </RequireAuth>
          }
        />

        <Route
          path="/my-requests"
          element={
            <RequireAuth>
              <MyRequestsPage />
            </RequireAuth>
          }
        />

        <Route
          path="/users"
          element={
            <RequireAuth>
              <RequireAdmin>
                <UsersPage />
              </RequireAdmin>
            </RequireAuth>
          }
        />
        <Route
          path="/users/:id"
          element={
            <RequireAuth>
              <RequireAdmin>
                <UserDetailsPage />
              </RequireAdmin>
            </RequireAuth>
          }
        />
        <Route
          path="/users/:id/edit"
          element={
            <RequireAuth>
              <RequireAdmin>
                <UserEditPage />
              </RequireAdmin>
            </RequireAuth>
          }
        />

        <Route
          path="/requests"
          element={
            <RequireAuth>
              <RequireAdmin>
                <RequestsAdminPage />
              </RequireAdmin>
            </RequireAuth>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <RequireAuth>
              <RequireAdmin>
                <AdminDashboardPage />
              </RequireAdmin>
            </RequireAuth>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
