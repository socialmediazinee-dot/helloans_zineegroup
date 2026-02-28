'use client'

import { useEffect, useState } from 'react'

interface BankLoan {
  bank: string
  loanType: string
  roi: number
}

export default function StockTicker() {
  const [bankLoans, setBankLoans] = useState<BankLoan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBankLoans = async () => {
    try {
      const response = await fetch('/api/stocks')
      if (!response.ok) {
        throw new Error('Failed to fetch bank loan data')
      }
      const data = await response.json()
      if (data.stocks && Array.isArray(data.stocks)) {
        setBankLoans(data.stocks)
        setError(null)
      } else {
        throw new Error('Invalid bank loan data format')
      }
    } catch (err: any) {
      console.error('Error fetching bank loans:', err)
      setError(err.message || 'Failed to load bank loan data')
      // Keep previous data on error to avoid flickering
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Fetch immediately on mount
    fetchBankLoans()

    // Poll every 1 minute — data is cached server-side and updated from Google Sheets
    const interval = setInterval(fetchBankLoans, 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const formatROI = (roi?: number) => {
    if (roi === undefined || roi === null || Number.isNaN(roi)) {
      return 'N/A'
    }
    return `${roi.toFixed(2)}%`
  }

  const isRoiHigh = (loanType: string, roi: number): boolean => {
    const thresholds: Record<string, number> = {
      'Personal Loan': 11.99,
      'Home Loan': 8.99,
      'Business Loan': 18.99,
      'Loan Against Property': 9.99,
    }
    const threshold = thresholds[loanType]
    return threshold !== undefined && roi > threshold
  }

  const groupedByLoanType = (data: BankLoan[]): { loanType: string; loans: BankLoan[] }[] => {
    const map: Record<string, BankLoan[]> = {}
    data.forEach((loan) => {
      if (!map[loan.loanType]) map[loan.loanType] = []
      map[loan.loanType].push(loan)
    })
    return Object.entries(map).map(([loanType, loans]) => ({ loanType, loans }))
  }

  // Loading: show loader
  if (isLoading && bankLoans.length === 0) {
    return (
      <div className="stock-ticker">
        <div className="stock-ticker-content">
          <div className="stock-ticker-item">
            <span className="stock-loading">Loading bank loan rates...</span>
          </div>
        </div>
      </div>
    )
  }

  // No data from sheets: don't show ticker (all data is from your sheets only)
  if (bankLoans.length === 0) {
    return null
  }

  const loanGroups = groupedByLoanType(bankLoans)

  const loanTypeAbbrev: Record<string, string> = {
    'Personal Loan': 'PL',
    'Business Loan': 'BL',
    'Home Loan': 'HL',
    'Loan Against Property': 'LAP',
  }

  const renderGroups = (keySuffix = '') =>
    loanGroups.map((group, groupIndex) => {
      const abbrev = loanTypeAbbrev[group.loanType] || group.loanType
      return (
      <div key={`group-${group.loanType}-${groupIndex}${keySuffix}`} className="stock-ticker-item stock-ticker-group">
        <span className="stock-symbol">{group.loanType}</span>
        {group.loans.map((loan, loanIndex) => (
          <span key={`${group.loanType}-${loan.bank}-${loanIndex}${keySuffix}`} className="stock-ticker-loan">
            <span className="stock-price">{loan.bank}({abbrev})</span>
            <span className={`stock-change ${isRoiHigh(group.loanType, loan.roi) ? 'negative' : 'positive'}`}>{formatROI(loan.roi)}</span>
          </span>
        ))}
      </div>
      )
    })

  return (
    <div className="stock-ticker">
      <div className="stock-ticker-content">
        {renderGroups()}
        {renderGroups('-dup')}
      </div>
    </div>
  )
}
