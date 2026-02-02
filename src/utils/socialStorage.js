const LIKES_KEY = 'app_likes'
const COMMENTS_KEY = 'app_comments'

const safeParseArray = (raw) => {
  try {
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    return []
  }
}

export const loadLikes = () => {
  if (typeof localStorage === 'undefined') return []
  return safeParseArray(localStorage.getItem(LIKES_KEY))
}

export const saveLikes = (likes) => {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(LIKES_KEY, JSON.stringify(Array.isArray(likes) ? likes : []))
  } catch (e) {
    // ignore
  }
}

export const loadComments = () => {
  if (typeof localStorage === 'undefined') return []
  return safeParseArray(localStorage.getItem(COMMENTS_KEY))
}

export const saveComments = (comments) => {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(Array.isArray(comments) ? comments : []))
  } catch (e) {
    // ignore
  }
}
