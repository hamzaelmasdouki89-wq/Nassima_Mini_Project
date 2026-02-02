// Mock data for development testing - Updated with real user data
export const mockUsers = [
  {
    "nom": "Anas",
    "prenom": "Hrdouch",
    "pseudo": "User715",
    "age": 21,
    "email": "Anas21@gmail.com",
    "MotDePasse": "Anas@2103",
    "Pays": "Morocco",
    "couleur": "#f42151",
    "Devise": "USD",
    "admin": true,
    "avatar": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/733.jpg",
    "photo": "https://loremflickr.com/640/480/people?random=0.7500211132432872",
    "id": "9",
    "confirmPassword": "Anas@2103"
  },
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
  }
]

// Add these users to the global scope for the original API to find
if (typeof window !== 'undefined') {
  window.mockUsers = mockUsers
}

// Mock API responses
export const mockApiResponses = {
  users: mockUsers,
  stagiaire: mockUsers
}
