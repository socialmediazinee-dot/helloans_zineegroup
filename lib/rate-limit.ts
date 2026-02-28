/**
 * Bare-minimum in-memory rate limiter (no external dependencies).
 * Tracks requests per IP within a sliding window.
 * NOT shared across serverless instances — just prevents obvious abuse from a single instance.
 */

const hits = new Map<string, number[]>()

const CLEANUP_INTERVAL = 60_000
let lastCleanup = Date.now()

function cleanup(windowMs: number) {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  const cutoff = now - windowMs
  hits.forEach((timestamps, key) => {
    const filtered = timestamps.filter((t: number) => t > cutoff)
    if (filtered.length === 0) hits.delete(key)
    else hits.set(key, filtered)
  })
}

export function rateLimit(
  ip: string,
  { maxRequests = 10, windowMs = 60_000 }: { maxRequests?: number; windowMs?: number } = {}
): { allowed: boolean; remaining: number } {
  cleanup(windowMs)

  const now = Date.now()
  const cutoff = now - windowMs
  const timestamps = (hits.get(ip) || []).filter((t) => t > cutoff)

  if (timestamps.length >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  timestamps.push(now)
  hits.set(ip, timestamps)
  return { allowed: true, remaining: maxRequests - timestamps.length }
}
