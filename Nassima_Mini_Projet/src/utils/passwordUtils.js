export const hasUpper = (value) => /[A-Z]/.test(value)
export const hasLower = (value) => /[a-z]/.test(value)
export const hasNumber = (value) => /\d/.test(value)
export const hasSpecial = (value) => /[^A-Za-z0-9]/.test(value)

export const validateNewPassword = (value) => {
  const pwd = String(value || '')
  const errors = []
  if (pwd.length < 8) errors.push('Password must be at least 8 characters.')
  if (!hasUpper(pwd)) errors.push('Password must contain at least one uppercase letter.')
  if (!hasLower(pwd)) errors.push('Password must contain at least one lowercase letter.')
  if (!hasNumber(pwd)) errors.push('Password must contain at least one number.')
  if (!hasSpecial(pwd)) errors.push('Password must contain at least one special character.')
  return errors
}

const toHex = (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export const hashPassword = async (value) => {
  const input = String(value || '')

  try {
    if (
      typeof crypto !== 'undefined' &&
      crypto?.subtle?.digest &&
      typeof TextEncoder !== 'undefined'
    ) {
      const text = new TextEncoder().encode(input)
      const digest = await crypto.subtle.digest('SHA-256', text)
      return toHex(digest)
    }
  } catch (_err) {
    // ignore
  }

  return input
}

export const passwordMatches = async (stored, input) => {
  const s = String(stored || '')
  const p = String(input || '')
  if (!s) return false
  if (s === p) return true
  const hashed = await hashPassword(p)
  return s === hashed
}
