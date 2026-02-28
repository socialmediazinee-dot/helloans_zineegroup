import { NextResponse } from 'next/server'

export const revalidate = 300

export interface BankRequirement {
  loanCategory: string
  bankName: string
  requirements: string[]
}

/**
 * Reads bank requirements from a publicly-published Google Sheet.
 *
 * Setup:
 *   1. Create a Google Sheet with columns:
 *      loan_category | bank_name | requirement_1 | requirement_2 | requirement_3 | requirement_4 | requirement_5 | requirement_6
 *   2. File → Share → Publish to web → choose CSV → copy the URL
 *   3. Set GOOGLE_SHEET_REQUIREMENTS_CSV in .env.local to that URL
 */
export async function GET() {
  const csvUrl = process.env.GOOGLE_SHEET_REQUIREMENTS_CSV
  if (!csvUrl) {
    return NextResponse.json({ requirements: [], source: 'none' })
  }

  try {
    const res = await fetch(csvUrl, { next: { revalidate: 300 } })
    if (!res.ok) {
      console.error('Google Sheet requirements fetch failed:', res.status)
      return NextResponse.json({ requirements: [], source: 'error' })
    }

    const csv = await res.text()
    const requirements = parseCsv(csv)

    return NextResponse.json({ requirements, source: 'sheet' })
  } catch (err) {
    console.error('Requirements sheet error:', err instanceof Error ? err.message : 'unknown')
    return NextResponse.json({ requirements: [], source: 'error' })
  }
}

function parseCsv(csv: string): BankRequirement[] {
  const lines = csv.split('\n').filter((l) => l.trim())
  if (lines.length < 2) return []

  return lines.slice(1).map((line) => {
    const cols = parseCSVLine(line)
    const reqs = cols.slice(2).map((c) => c.trim()).filter(Boolean)
    return {
      loanCategory: (cols[0] || '').trim(),
      bankName: (cols[1] || '').trim(),
      requirements: reqs,
    }
  }).filter((r) => r.loanCategory && r.bankName && r.requirements.length > 0)
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
