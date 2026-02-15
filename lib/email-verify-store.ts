/**
 * In-memory email verification code store (like OTP for phone).
 * Keys: normalized email (lowercase). Value: { code, expiresAt }.
 */
const store = new Map<string, { code: string; expiresAt: number }>()
const TTL_MS = 10 * 60 * 1000 // 10 minutes

function normalizeEmail(email: string): string {
  return String(email).trim().toLowerCase()
}

export function setEmailCode(email: string, code: string): void {
  const key = normalizeEmail(email)
  if (!key || !key.includes('@')) return
  store.set(key, { code, expiresAt: Date.now() + TTL_MS })
}

/** Normalize code to digits only for comparison (handles spaces/dashes when pasting). */
function normalizeCode(code: string): string {
  return String(code).replace(/\D/g, '').slice(0, 6)
}

/** Verify and consume code only on success. Wrong code does not delete so user can retry. */
export function consumeEmailCode(email: string, code: string): boolean {
  const key = normalizeEmail(email)
  const entry = store.get(key)
  if (!entry || Date.now() > entry.expiresAt) {
    store.delete(key)
    return false
  }
  const inputCode = normalizeCode(code)
  if (inputCode.length !== 6 || entry.code !== inputCode) {
    return false
  }
  store.delete(key)
  return true
}

export function isValidEmail(email: string): boolean {
  const key = normalizeEmail(email)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)
}
