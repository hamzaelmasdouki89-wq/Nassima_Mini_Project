import { describe, expect, test } from 'vitest'

import { validateNewPassword } from '../utils/passwordUtils'

describe('Password validation', () => {
  test('requires uppercase, lowercase, number, special, and min length', () => {
    expect(validateNewPassword('')).toContain('Password must be at least 8 characters.')

    const errors = validateNewPassword('abcdefgh')
    expect(errors).toContain('Password must contain at least one uppercase letter.')
    expect(errors).toContain('Password must contain at least one number.')
    expect(errors).toContain('Password must contain at least one special character.')

    expect(validateNewPassword('Abcdef1!')).toHaveLength(0)
  })
})
