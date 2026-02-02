const STORAGE_KEY = 'authUser'

const pickAuthUser = (user) => {
  const src = user && typeof user === 'object' ? user : {}
  return {
    id: String(src.id || ''),
    nom: String(src.nom || ''),
    prenom: String(src.prenom || ''),
    pseudo: String(src.pseudo || ''),
    email: String(src.email || ''),
    age: src.age === null || src.age === undefined ? null : Number(src.age),
    admin: Boolean(src.admin),
    avatar: String(src.avatar || ''),
    couleur: String(src.couleur || '#ffffff'),
    language: String(src.language || ''),
  }
}

export const loadAuthUser = () => {
  try {
    if (typeof localStorage === 'undefined') return null
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null

    const picked = pickAuthUser(parsed)
    if (!picked.id) return null
    return picked
  } catch (e) {
    return null
  }
}

export const saveAuthUser = (user) => {
  try {
    if (typeof localStorage === 'undefined') return
    const picked = pickAuthUser(user)
    if (!picked.id) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(picked))
  } catch (e) {
    // ignore
  }
}

export const clearAuthUser = () => {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    // ignore
  }
}
