/**
 * In-memory email verification code store with attempt tracking.
 */
const store = new Map<string, { code: string; expiresAt: number; attempts: number }>()
const TTL_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 5
const MAX_STORE_SIZE = 10_000

function normalizeEmail(email: string): string {
  return String(email).trim().toLowerCase()
}

function evictExpired() {
  if (store.size < MAX_STORE_SIZE) return
  const now = Date.now()
  store.forEach((entry, key) => {
    if (now > entry.expiresAt) store.delete(key)
  })
}

export function setEmailCode(email: string, code: string): void {
  evictExpired()
  const key = normalizeEmail(email)
  if (!key || !key.includes('@')) return
  store.set(key, { code, expiresAt: Date.now() + TTL_MS, attempts: 0 })
}

function normalizeCode(code: string): string {
  return String(code).replace(/\D/g, '').slice(0, 6)
}

export function consumeEmailCode(email: string, code: string): boolean {
  const key = normalizeEmail(email)
  const entry = store.get(key)
  if (!entry || Date.now() > entry.expiresAt) {
    store.delete(key)
    return false
  }
  if (entry.attempts >= MAX_ATTEMPTS) {
    store.delete(key)
    return false
  }
  const inputCode = normalizeCode(code)
  if (inputCode.length !== 6 || entry.code !== inputCode) {
    entry.attempts++
    return false
  }
  store.delete(key)
  return true
}

export function isValidEmail(email: string): boolean {
  const key = normalizeEmail(email)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)
}
