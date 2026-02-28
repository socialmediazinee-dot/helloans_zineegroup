import { NextResponse } from 'next/server'

const PERSONAL_CSV_URL = process.env.GOOGLE_SHEET_PERSONAL_LOANS_CSV || ''
const BUSINESS_CSV_URL = process.env.GOOGLE_SHEET_BUSINESS_LOANS_CSV || ''
const HOME_PROPERTY_CSV_URL = process.env.GOOGLE_SHEET_HOME_PROPERTY_LOANS_CSV || ''

interface TickerEntry {
  bank: string
  loanType: string
  roi: number
}

const CACHE_DURATION = 60 * 1000
let cachedData: TickerEntry[] | null = null
let lastFetchTime = 0

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

function extractTickerEntries(csv: string, loanType: string): TickerEntry[] {
  const lines = csv.trim().split('\n').filter((l) => l.trim())
  if (lines.length < 2) return []

  return lines
    .slice(1)
    .map((line) => {
      const cols = parseCSVLine(line).map((c) => c.trim())
      const bank = cols[0] || ''
      const type = (cols[3] || '').toLowerCase()
      const roi = parseFloat(cols[4]) || 0
      if (!bank || !roi || type === 'nbfc') return null
      return { bank, loanType, roi }
    })
    .filter(Boolean) as TickerEntry[]
}

/** Ticker-only sheet: 4 columns — Bank Name, Type (bank|nbfc), Interest Rate, Product (Home Loan | Loan Against Property). Banks only. */
function extractHomePropertyTickerEntries(csv: string): TickerEntry[] {
  const lines = csv.trim().split('\n').filter((l) => l.trim())
  if (lines.length < 2) return []

  const normalized = (s: string) => (s || '').toLowerCase().trim().replace(/\s+/g, ' ')
  const out: TickerEntry[] = []

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]).map((c) => c.trim())
    const bank = cols[0] || ''
    const type = (cols[1] || '').toLowerCase()
    const roi = parseFloat(cols[2]) || 0
    if (!bank || !roi || type === 'nbfc') continue
    const product = normalized(cols[3] || '')
    if (product.includes('loan against property') || product === 'lap') {
      out.push({ bank, loanType: 'Loan Against Property', roi })
    } else if (product.includes('home loan') || product === 'home') {
      out.push({ bank, loanType: 'Home Loan', roi })
    }
  }
  return out
}

async function fetchTickerData(): Promise<TickerEntry[]> {
  const now = Date.now()
  if (cachedData && now - lastFetchTime < CACHE_DURATION) {
    return cachedData
  }

  const results: TickerEntry[] = []

  const [personalRes, businessRes, homePropertyRes] = await Promise.all([
    PERSONAL_CSV_URL ? fetch(PERSONAL_CSV_URL, { next: { revalidate: 60 } }) : null,
    BUSINESS_CSV_URL ? fetch(BUSINESS_CSV_URL, { next: { revalidate: 60 } }) : null,
    HOME_PROPERTY_CSV_URL ? fetch(HOME_PROPERTY_CSV_URL, { next: { revalidate: 60 } }) : null,
  ])

  if (personalRes?.ok) {
    const csv = await personalRes.text()
    results.push(...extractTickerEntries(csv, 'Personal Loan'))
  }

  if (businessRes?.ok) {
    const csv = await businessRes.text()
    results.push(...extractTickerEntries(csv, 'Business Loan'))
  }

  if (homePropertyRes?.ok) {
    const csv = await homePropertyRes.text()
    results.push(...extractHomePropertyTickerEntries(csv))
  }

  if (results.length > 0) {
    cachedData = results
    lastFetchTime = now
  }

  return results
}

export async function GET() {
  try {
    const stocks = await fetchTickerData()
    if (stocks.length === 0) {
      return NextResponse.json({ stocks: [] }, { status: 200 })
    }
    return NextResponse.json({ stocks }, { status: 200 })
  } catch (error) {
    console.error('Ticker fetch error:', error instanceof Error ? error.message : 'unknown')
    return NextResponse.json({ stocks: [] }, { status: 200 })
  }
}
