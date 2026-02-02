import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function ContextHomePage() {
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="container py-4" style={{ maxWidth: 800 }}>
      {isAuthenticated && user ? (
        <>
          {/* Welcome Section */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-success">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h2 className="card-title text-success mb-1">
                        Welcome, <strong>{user.nom && user.prenom ? `${user.nom} ${user.prenom}` : user.pseudo}</strong>! 🎉
                      </h2>
                      <p className="card-text text-muted mb-0">
                        @{user.pseudo} • {user.email}
                      </p>
                    </div>
                    <div className="text-end">
                      {user.avatar && (
                        <img 
                          src={user.avatar} 
                          alt="Avatar" 
                          className="rounded-circle mb-2"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                      )}
                      <br />
                      <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Details Section */}
          <div className="row mb-4">
            <div className="col-12">
              <h3 className="h5 mb-3">User Information</h3>
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Full Name:</strong> {user.nom} {user.prenom}</p>
                      <p><strong>Username:</strong> {user.pseudo}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Age:</strong> {user.age}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Country:</strong> {user.Pays}</p>
                      <p><strong>Currency:</strong> {user.Devise}</p>
                      <p><strong>Admin:</strong> {user.admin ? 'Yes' : 'No'}</p>
                      <p><strong>Theme Color:</strong> 
                        <span 
                          className="ms-2 badge border"
                          style={{ backgroundColor: user.couleur, color: 'white' }}
                        >
                          {user.couleur}
                        </span>
                      </p>
                    </div>
                  </div>
                  {user.photo && (
                    <div className="mt-3">
                      <strong>Photo:</strong><br />
                      <img 
                        src={user.photo} 
                        alt="User" 
                        className="mt-2 rounded"
                        style={{ maxWidth: '200px', height: 'auto' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* App Content */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h3 className="h5 mb-3">Dashboard</h3>
                  <p className="text-muted">
                    This is the main content area. You can add your application features here.
                  </p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary">View Profile</button>
                    <button className="btn btn-outline-secondary">Settings</button>
                    {user.admin && (
                      <button className="btn btn-warning">Admin Panel</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card">
              <div className="card-body text-center">
                <h2 className="card-title mb-3">Welcome to the App</h2>
                <p className="card-text mb-4">
                  Please log in to access your personalized dashboard.
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.href = '/login'}
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
