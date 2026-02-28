'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'

interface BankLoan {
  bank: string
  loanType: string
  roi: number
}

interface BankRatesContextType {
  rates: BankLoan[]
  isLoading: boolean
  /** Look up ROI for a specific bank + loan type. Returns null if not found. */
  getRate: (bankName: string, loanType: string) => number | null
  /** Get the average ROI across all banks for a given loan type. Returns null if none found. */
  getDefaultRate: (loanType: string) => number | null
  /** Get the first matching ROI for a bank name (any loan type). Returns null if not found. */
  getAnyRate: (bankName: string) => number | null
}

const BankRatesContext = createContext<BankRatesContextType>({
  rates: [],
  isLoading: true,
  getRate: () => null,
  getDefaultRate: () => null,
  getAnyRate: () => null,
})

function normalize(s: string) {
  return s.toLowerCase().trim()
}

function bankNamesMatch(sheetName: string, codeName: string): boolean {
  const a = normalize(sheetName)
  const b = normalize(codeName)
  if (a === b) return true
  if (a.includes(b) || b.includes(a)) return true
  const coreA = a.replace(/\b(bank|finserv|fincorp|capital|finance)\b/g, '').trim()
  const coreB = b.replace(/\b(bank|finserv|fincorp|capital|finance)\b/g, '').trim()
  if (coreA && coreB && (coreA.includes(coreB) || coreB.includes(coreA))) return true
  return false
}

export function BankRatesProvider({ children }: { children: ReactNode }) {
  const [rates, setRates] = useState<BankLoan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stocks')
      .then((res) => res.json())
      .then((data) => {
        if (data.stocks && Array.isArray(data.stocks)) {
          setRates(data.stocks)
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const getRate = useCallback(
    (bankName: string, loanType: string): number | null => {
      const normType = normalize(loanType)
      const match = rates.find(
        (r) => bankNamesMatch(r.bank, bankName) && normalize(r.loanType) === normType
      )
      return match?.roi ?? null
    },
    [rates]
  )

  const getDefaultRate = useCallback(
    (loanType: string): number | null => {
      const normType = normalize(loanType)
      const matching = rates.filter((r) => normalize(r.loanType) === normType)
      if (matching.length === 0) return null
      return matching.reduce((sum, r) => sum + r.roi, 0) / matching.length
    },
    [rates]
  )

  const getAnyRate = useCallback(
    (bankName: string): number | null => {
      const match = rates.find((r) => bankNamesMatch(r.bank, bankName))
      return match?.roi ?? null
    },
    [rates]
  )

  return (
    <BankRatesContext.Provider value={{ rates, isLoading, getRate, getDefaultRate, getAnyRate }}>
      {children}
    </BankRatesContext.Provider>
  )
}

export function useBankRates() {
  return useContext(BankRatesContext)
}
