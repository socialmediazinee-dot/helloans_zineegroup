'use client'

import { useEffect, useState } from 'react'

interface StripData {
  line1: string
  line1Color: string
  line2: string
  line2Color: string
  line3: string
  line3Color: string
  imageUrl: string
}

const SHEET_CSV_URL = process.env.NEXT_PUBLIC_PROMO_STRIP_SHEET_URL || ''

function toDirectImageUrl(url: string): string {
  const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (driveMatch) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`
  }
  return url
}

function parseCSV(csv: string): StripData | null {
  const lines = csv.trim().split('\n')
  if (lines.length < 2) return null

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  const values = lines[1].match(/(".*?"|[^",]+)/g)?.map(v => v.trim().replace(/^"|"$/g, '')) || []

  const row: Record<string, string> = {}
  headers.forEach((h, i) => {
    row[h] = values[i] || ''
  })

  return {
    line1: row.line1 || '',
    line1Color: row.line1Color || '#ffffff',
    line2: row.line2 || '',
    line2Color: row.line2Color || '#ffffff',
    line3: row.line3 || '',
    line3Color: row.line3Color || '#ffffff',
    imageUrl: row.imageUrl ? toDirectImageUrl(row.imageUrl) : '',
  }
}

export default function PromoStrip() {
  const [data, setData] = useState<StripData | null>(null)

  useEffect(() => {
    if (!SHEET_CSV_URL) return

    const fetchData = async () => {
      try {
        const res = await fetch(SHEET_CSV_URL, { cache: 'no-store' })
        const csv = await res.text()
        const parsed = parseCSV(csv)
        if (parsed) setData(parsed)
      } catch (err) {
        console.error('PromoStrip: Failed to fetch sheet data', err)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className="promo-strip-spacer" />
      {data && (
        <div className="promo-strip">
          <div className="promo-strip-inner">
            <div className="promo-strip-text">
              {data.line1 && (
                <span className="promo-line promo-line-1" style={{ color: data.line1Color }}>
                  {data.line1}
                </span>
              )}
              {data.line2 && (
                <span className="promo-line promo-line-2" style={{ color: data.line2Color }}>
                  {data.line2}
                </span>
              )}
              {data.line3 && (
                <span className="promo-line promo-line-3" style={{ color: data.line3Color }}>
                  {data.line3}
                </span>
              )}
            </div>
            {data.imageUrl && (
              <div className="promo-strip-image">
                <img src={data.imageUrl} alt="Promo" />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
