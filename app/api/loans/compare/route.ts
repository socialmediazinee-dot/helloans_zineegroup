import { NextResponse } from 'next/server'

export const revalidate = 60

interface LoanCompareEntry {
  id: string
  bank: string
  logo: string
  type: 'bank' | 'nbfc'
  interestRate: number
  processingFee: string
  minAmount: number
  maxAmount: number
  minTenureYrs: number
  maxTenureYrs: number
  description: string
  eligibility: string
  features: string
  additional: string[]
}

const CACHE_DURATION = 60 * 1000

let personalCache: { data: LoanCompareEntry[]; time: number } | null = null
let businessCache: { data: LoanCompareEntry[]; time: number } | null = null

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

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Sheet columns (in order):
 *   Bank Name, ID (slug), Logo Path, Type (bank|nbfc),
 *   Interest Rate, Processing Fee,
 *   Min Amount, Max Amount, Min Tenure Yrs, Max Tenure Yrs,
 *   Description, Eligibility, Features (pipe-separated),
 *   Additional
 */
function parseCompareCSV(csv: string): LoanCompareEntry[] {
  const lines = csv
    .trim()
    .split('\n')
    .filter((l) => l.trim())
  if (lines.length < 2) return []

  return lines
    .slice(1)
    .map((line) => {
      const cols = parseCSVLine(line).map((c) => c.trim())
      const bank = cols[0] || ''
      const rawType = (cols[3] || 'bank').toLowerCase()
      return {
        id: cols[1]?.trim() || slugify(bank),
        bank,
        logo: cols[2] || '',
        type: (rawType === 'nbfc' ? 'nbfc' : 'bank') as 'bank' | 'nbfc',
        interestRate: parseFloat(cols[4]) || 0,
        processingFee: cols[5] || '',
        minAmount: parseInt(cols[6]) || 0,
        maxAmount: parseInt(cols[7]) || 0,
        minTenureYrs: parseInt(cols[8]) || 0,
        maxTenureYrs: parseInt(cols[9]) || 0,
        description: cols[10] || '',
        eligibility: cols[11] || '',
        features: (cols[12] || ''),
        additional: cols[13] || '',
          .split('|')
          .map((f) => f.trim())
          .filter(Boolean),
        
      }
    })
    .filter((e) => e.bank)
}

async function fetchSheet(
  url: string | undefined,
  cache: { data: LoanCompareEntry[]; time: number } | null
): Promise<{
  data: LoanCompareEntry[]
  cache: { data: LoanCompareEntry[]; time: number } | null
}> {
  if (!url) return { data: [], cache }

  const now = Date.now()
  if (cache && now - cache.time < CACHE_DURATION) {
    return { data: cache.data, cache }
  }

  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) return { data: cache?.data || [], cache }

  const csv = await res.text()
  const data = parseCompareCSV(csv)
  const newCache = data.length > 0 ? { data, time: now } : cache
  return { data: newCache?.data || [], cache: newCache }
}

export async function GET() {
  try {
    const [personalResult, businessResult] = await Promise.all([
      fetchSheet(process.env.GOOGLE_SHEET_PERSONAL_LOANS_CSV, personalCache),
      fetchSheet(process.env.GOOGLE_SHEET_BUSINESS_LOANS_CSV, businessCache),
    ])

    personalCache = personalResult.cache
    businessCache = businessResult.cache

    return NextResponse.json({
      personalLoans: personalResult.data,
      businessLoans: businessResult.data,
    })
  } catch (error) {
    console.error('Loan compare error:', error instanceof Error ? error.message : 'unknown')
    return NextResponse.json({ personalLoans: [], businessLoans: [] })
  }
}
