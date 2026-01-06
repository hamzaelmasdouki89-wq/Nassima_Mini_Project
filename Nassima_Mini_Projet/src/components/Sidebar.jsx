import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { useT } from '../i18n/i18n'
import { selectIsAuthenticated, selectUser } from '../redux/authSlice'

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `px-nav-link ${isActive ? 'active' : ''}`}
      end
    >
      <i className={`bi ${icon} px-nav-icon`} />
      <span className="px-nav-label">{label}</span>
    </NavLink>
  )
}

export default function Sidebar() {
  const t = useT()
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isAdmin = Boolean(user?.admin)
  const age = Number(user?.age)
  const canChangeColor = isAdmin || (Number.isFinite(age) && age >= 15)

  const guest = [
    { to: '/', icon: 'bi-house-door', label: 'Accueil' },
    { to: '/login', icon: 'bi-box-arrow-in-right', label: 'Login' },
  ]

  const common = [
    { to: '/', icon: 'bi-house-door', label: 'Accueil' },
    { to: '/profile', icon: 'bi-person', label: 'Profile' },
    { to: '/settings', icon: 'bi-gear', label: t('settings') },
  ]

  const visitor = [
    ...(canChangeColor ? [{ to: '/change-color', icon: 'bi-palette2', label: 'Change Color' }] : []),
    { to: '/my-requests', icon: 'bi-inbox', label: 'My Requests' },
  ]

  const admin = [
    { to: '/change-color', icon: 'bi-palette2', label: 'Change Color' },
    { to: '/admin/dashboard', icon: 'bi-graph-up', label: t('admin_dashboard') },
    { to: '/users', icon: 'bi-people', label: 'Users' },
    { to: '/requests', icon: 'bi-clipboard-check', label: 'Requests' },
  ]

  const items = !isAuthenticated ? guest : isAdmin ? [...common, ...admin] : [...common, ...visitor]

  return (
    <>
      <aside className="d-none d-lg-block px-sidebar">
        <nav className="px-nav flex-column">
          {items.map((it) => (
            <SidebarLink key={it.to} {...it} />
          ))}
        </nav>
      </aside>

      <nav className="d-lg-none px-bottom-nav border-top">
        <div className="container-fluid">
          <div className="d-flex justify-content-around py-2">
            {items.slice(0, 4).map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                className={({ isActive }) => `px-bottom-link ${isActive ? 'active' : ''}`}
                end
              >
                <i className={`bi ${it.icon}`} />
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}
