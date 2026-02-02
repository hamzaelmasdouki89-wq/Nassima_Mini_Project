// Test login functionality
const mockUsers = [
  {
    id: '1',
    pseudo: 'admin',
    MotDePasse: 'admin123',
    nom: 'Admin',
    prenom: 'User',
    email: 'admin@example.com',
    admin: true,
    couleur: '#007bff',
    language: 'en'
  },
  {
    id: '2',
    pseudo: 'user',
    MotDePasse: 'password123',
    nom: 'Regular',
    prenom: 'User',
    email: 'user@example.com',
    admin: false,
    couleur: '#28a745',
    language: 'en'
  },
  {
    id: '3',
    pseudo: 'test',
    MotDePasse: 'test123',
    nom: 'Test',
    prenom: 'User',
    email: 'test@example.com',
    admin: false,
    couleur: '#ffc107',
    language: 'en'
  }
]

// Simple password matching function
async function passwordMatches(stored, input) {
  const s = String(stored || '')
  const p = String(input || '')
  if (!s) return false
  return s === p // Simple comparison for testing
}

async function testLogin() {
  console.log('Testing login functionality...')
  console.log('Available users:', mockUsers.map(u => ({ pseudo: u.pseudo, password: u.MotDePasse })))
  
  // Test admin login
  const adminUser = mockUsers.find(u => u.pseudo === 'admin')
  if (adminUser) {
    const adminMatch = await passwordMatches(adminUser.MotDePasse, 'admin123')
    console.log('Admin login test:', adminMatch ? 'SUCCESS' : 'FAILED')
  }
  
  // Test user login
  const regularUser = mockUsers.find(u => u.pseudo === 'user')
  if (regularUser) {
    const userMatch = await passwordMatches(regularUser.MotDePasse, 'password123')
    console.log('User login test:', userMatch ? 'SUCCESS' : 'FAILED')
  }
  
  // Test wrong password
  const wrongMatch = await passwordMatches(adminUser.MotDePasse, 'wrongpassword')
  console.log('Wrong password test:', wrongMatch ? 'UNEXPECTED SUCCESS' : 'CORRECTLY FAILED')
}

// Run test
testLogin()
