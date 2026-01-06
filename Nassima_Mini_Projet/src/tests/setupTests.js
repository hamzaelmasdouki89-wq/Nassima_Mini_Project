import '@testing-library/jest-dom'

import { webcrypto } from 'node:crypto'

window.scrollTo = () => {}

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto
}
