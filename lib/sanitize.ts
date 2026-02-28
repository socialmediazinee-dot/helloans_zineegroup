/**
 * Escape HTML special characters to prevent XSS when interpolating user input into HTML emails.
 */
export function escHtml(str: unknown): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Truncate a string to maxLen characters. */
export function truncate(str: unknown, maxLen: number): string {
  const s = String(str ?? '')
  return s.length > maxLen ? s.slice(0, maxLen) : s
}
