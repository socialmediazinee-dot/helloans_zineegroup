import { NextResponse } from 'next/server'

export const revalidate = 300 // cache for 5 minutes

interface SheetReview {
  name: string
  rating: number
  text: string
  date: string
}

/**
 * Reads approved reviews from a publicly-published Google Sheet.
 *
 * Setup:
 *   1. Create a Google Sheet with columns: Name | Rating | Review | Date
 *   2. File → Share → Publish to web → choose CSV → copy the URL
 *   3. Set GOOGLE_SHEET_REVIEWS_CSV in .env.local to that URL
 */
export async function GET() {
  const csvUrl = process.env.GOOGLE_SHEET_REVIEWS_CSV
  if (!csvUrl) {
    return NextResponse.json({ reviews: [], source: 'none' })
  }

  try {
    const res = await fetch(csvUrl, { next: { revalidate: 300 } })
    if (!res.ok) {
      console.error('Google Sheet fetch failed:', res.status)
      return NextResponse.json({ reviews: [], source: 'error' })
    }

    const csv = await res.text()
    const reviews = parseCsv(csv)

    return NextResponse.json({ reviews, source: 'sheet' })
  } catch (err) {
    console.error('Reviews sheet error:', err instanceof Error ? err.message : 'unknown')
    return NextResponse.json({ reviews: [], source: 'error' })
  }
}

function parseCsv(csv: string): SheetReview[] {
  const lines = csv.split('\n').filter((l) => l.trim())
  if (lines.length < 2) return []

  return lines.slice(1).map((line) => {
    const cols = parseCSVLine(line)
    return {
      name: (cols[0] || '').trim(),
      rating: Math.min(5, Math.max(1, parseInt(cols[1] || '5', 10) || 5)),
      text: (cols[2] || '').trim(),
      date: (cols[3] || '').trim(),
    }
  }).filter((r) => r.name && r.text)
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        current += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
  }
  result.push(current)
  return result
}
