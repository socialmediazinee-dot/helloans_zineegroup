'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import RupeeIcon from '@/components/RupeeIcon'

interface LoanEntry {
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
  features: string[]
}

const formatNumber = (amount: number) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)

function EntryLogo({ entry, size = 48 }: { entry: LoanEntry; size?: number }) {
  const [error, setError] = useState(false)

  if (entry.logo && !error) {
    return (
      <span className="compare-bank-logo-img-wrap" style={{ width: size, height: size }}>
        <Image
          src={entry.logo}
          alt=""
          width={size}
          height={size}
          className="compare-bank-logo-img"
          onError={() => setError(true)}
          unoptimized={entry.logo.startsWith('http')}
        />
      </span>
    )
  }
  return (
    <span className="compare-bank-logo-fallback" style={{ width: size, height: size }}>
      {entry.bank.charAt(0)}
    </span>
  )
}

/* ─── Reusable section: 2 bank slots + 1 NBFC slot + comparison table ─── */

function CompareSection({
  title,
  subtitle,
  allEntries,
  bankLabel,
  nbfcLabel,
  bankTheme,
  nbfcTheme,
}: {
  title: React.ReactNode
  subtitle: string | React.ReactNode
  allEntries: LoanEntry[]
  bankLabel: string
  nbfcLabel: string
  bankTheme: string
  nbfcTheme: string
}) {
  const { t } = useLanguage()

  const banks = useMemo(() => allEntries.filter((e) => e.type === 'bank'), [allEntries])
  const nbfcs = useMemo(() => allEntries.filter((e) => e.type === 'nbfc'), [allEntries])

  const [selectedBanks, setSelectedBanks] = useState<(LoanEntry | null)[]>([null, null])
  const [selectedNbfc, setSelectedNbfc] = useState<LoanEntry | null>(null)

  const [initialized, setInitialized] = useState(false)
  useEffect(() => {
    if (!initialized && (banks.length > 0 || nbfcs.length > 0)) {
      setSelectedBanks([banks[0] || null, banks[1] || null])
      setSelectedNbfc(nbfcs[0] || null)
      setInitialized(true)
    }
  }, [banks, nbfcs, initialized])

  const resolvedBanks = useMemo(
    () => selectedBanks.map((s) => (s ? banks.find((b) => b.id === s.id) ?? s : null)),
    [selectedBanks, banks]
  )

  const resolvedNbfc = useMemo(
    () => (selectedNbfc ? nbfcs.find((n) => n.id === selectedNbfc.id) ?? selectedNbfc : null),
    [selectedNbfc, nbfcs]
  )

  const availableBanks = useMemo(() => {
    const ids = new Set(selectedBanks.filter(Boolean).map((b) => b!.id))
    return banks.filter((b) => !ids.has(b.id))
  }, [selectedBanks, banks])

  const addBank = (bank: LoanEntry, slot: number) => {
    setSelectedBanks((prev) => {
      const next = [...prev]
      next[slot] = bank
      return next
    })
  }

  const removeBank = (slot: number) => {
    setSelectedBanks((prev) => {
      const next = [...prev]
      next[slot] = null
      return next
    })
  }

  if (allEntries.length === 0) return null

  const columns: { entry: LoanEntry; theme: string }[] = []
  if (resolvedBanks[0]) columns.push({ entry: resolvedBanks[0], theme: bankTheme })
  if (resolvedBanks[1]) columns.push({ entry: resolvedBanks[1], theme: bankTheme })
  if (resolvedNbfc) columns.push({ entry: resolvedNbfc, theme: nbfcTheme })

  return (
    <div className="compare-section-block">
      <h2 className="compare-bank-loans-title">{title}</h2>
      <p className="compare-bank-loans-subtitle">
        {typeof subtitle === 'string' ? (() => {
          const boldPhrase = 'up to 3 banks to compare'
          const lower = subtitle.toLowerCase()
          const idx = lower.indexOf(boldPhrase.toLowerCase())
          if (idx === -1) return subtitle
          return <>{subtitle.slice(0, idx)}<strong>{subtitle.slice(idx, idx + boldPhrase.length)}</strong>{subtitle.slice(idx + boldPhrase.length)}</>
        })() : subtitle}
      </p>

      <div className="compare-bank-slots">
        {/* Slot 0 & 1: Banks */}
        {[0, 1].map((slot) => {
          const bank = resolvedBanks[slot]
          return (
            <div key={slot} className="compare-bank-slot">
              <div className={`compare-slot-header compare-slot-header-${bankTheme}`}>
                {bankLabel}
              </div>
              {bank ? (
                <div className="compare-bank-slot-card selected">
                  <div className="compare-bank-slot-logo">
                    <EntryLogo entry={bank} size={100} />
                  </div>
                  <div className="compare-bank-slot-name">{bank.bank}</div>
                  <div className="compare-bank-slot-rate">{bank.interestRate}% p.a.</div>
                  <button
                    type="button"
                    className="compare-bank-slot-remove"
                    onClick={() => removeBank(slot)}
                    aria-label={`Compare here ${bank.bank}`}
                  >
                    Compare here
                  </button>
                </div>
              ) : (
                <div className="compare-bank-slot-card add">
                  <span className="compare-bank-slot-add-label">{t('compare.addBank')}</span>
                  {availableBanks.length > 0 ? (
                    <select
                      className="compare-bank-slot-select"
                      value=""
                      onChange={(e) => {
                        const id = e.target.value
                        if (!id) return
                        const found = banks.find((x) => x.id === id)
                        if (found) addBank(found, slot)
                        e.target.value = ''
                      }}
                    >
                      <option value="">{t('compare.chooseBank')}</option>
                      {availableBanks.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.bank} ({b.interestRate}%)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="compare-bank-slot-full">{t('compare.noMoreBanks')}</span>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* Slot 2: NBFC / Over Draft */}
        <div className="compare-bank-slot">
          <div className={`compare-slot-header compare-slot-header-${nbfcTheme}`}>
            {nbfcLabel}
          </div>
          {resolvedNbfc ? (
            <div className={`compare-bank-slot-card selected compare-${nbfcTheme}-slot`}>
              <div className="compare-bank-slot-logo">
                <EntryLogo entry={resolvedNbfc} size={100} />
              </div>
              <div className="compare-bank-slot-name">{resolvedNbfc.bank}</div>
              <div className="compare-bank-slot-rate">{resolvedNbfc.interestRate}% p.a.</div>
              <button
                type="button"
                className="compare-bank-slot-remove"
                onClick={() => setSelectedNbfc(null)}
                aria-label={`Compare here ${resolvedNbfc.bank}`}
              >
                Compare here
              </button>
            </div>
          ) : (
            <div className={`compare-bank-slot-card add compare-${nbfcTheme}-slot-add`}>
              <span className="compare-bank-slot-add-label">{t('compare.addNbfc')}</span>
              <select
                className="compare-bank-slot-select"
                value=""
                onChange={(e) => {
                  const id = e.target.value
                  if (!id) return
                  const n = nbfcs.find((x) => x.id === id)
                  if (n) setSelectedNbfc(n)
                  e.target.value = ''
                }}
              >
                <option value="">{t('compare.chooseNbfc')}</option>
                {nbfcs.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.bank} ({n.interestRate}%)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Comparison table */}
      {columns.length > 0 && (
        <div className="compare-bank-table-wrapper compare-table-pro">
          <h3 className="compare-bank-table-title">{t('compare.comparison')}</h3>
          <div className="compare-bank-table-scroll">
            <table className="compare-bank-table compare-table-pro-table">
              <thead>
                <tr>
                  <th className="compare-bank-th compare-bank-th-label">{t('compare.parameter')}</th>
                  {columns.map(({ entry, theme }) => (
                    <th key={entry.id} className={`compare-bank-th compare-bank-th-${theme}`}>
                      <div className="compare-bank-th-logo">
                        <EntryLogo entry={entry} size={56} />
                      </div>
                      <div className="compare-bank-th-name">{entry.bank}</div>
                      <div className="compare-bank-th-rate">{entry.interestRate}% p.a.</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="compare-bank-td-label">{t('compare.processingFee')}</td>
                  {columns.map(({ entry }) => (
                    <td key={entry.id} className="compare-bank-td compare-bank-td-desc">
                      {entry.processingFee}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="compare-bank-td-label">{t('compare.loanAmountRange')}</td>
                  {columns.map(({ entry }) => (
                    <td key={entry.id} className="compare-bank-td compare-bank-td-desc">
                      <RupeeIcon size={13} />
                      {formatNumber(entry.minAmount)} – <RupeeIcon size={13} />
                      {formatNumber(entry.maxAmount)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="compare-bank-td-label">{t('compare.tenureRange')}</td>
                  {columns.map(({ entry }) => (
                    <td key={entry.id} className="compare-bank-td compare-bank-td-desc">
                      {entry.minTenureYrs}–{entry.maxTenureYrs} {t('compare.years')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="compare-bank-td-label">{t('compare.description')}</td>
                  {columns.map(({ entry }) => (
                    <td key={entry.id} className="compare-bank-td compare-bank-td-desc">
                      {entry.description}
                    </td>
                  ))}
                </tr>
                {columns.some(({ entry }) => entry.eligibility) && (
                  <tr>
                    <td className="compare-bank-td-label">Eligibility</td>
                    {columns.map(({ entry }) => (
                      <td key={entry.id} className="compare-bank-td compare-bank-td-desc">
                        {entry.eligibility}
                      </td>
                    ))}
                  </tr>
                )}
                {columns.some(({ entry }) => entry.features.length > 0) && (
                  <tr>
                    <td className="compare-bank-td-label">{t('compare.keyFeatures')}</td>
                    {columns.map(({ entry }) => (
                      <td key={entry.id} className="compare-bank-td compare-bank-td-features">
                        <ul>
                          {entry.features.map((f, j) => (
                            <li key={j}>{f}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                )}
                <tr className="compare-bank-td-actions-row">
                  <td className="compare-bank-td-label">{t('compare.apply')}</td>
                  {columns.map(({ entry, theme }) => (
                    <td key={entry.id} className="compare-bank-td">
                      <Link
                        href={`/apply/${entry.id}`}
                        className={`compare-bank-apply-btn${theme === 'nbfc' ? ' compare-apply-nbfc' : ''}${theme === 'business' ? ' compare-apply-business' : ''}`}
                      >
                        Apply Now
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Main component ─── */

export default function BankLoanComparison() {
  const { t } = useLanguage()

  const [personalEntries, setPersonalEntries] = useState<LoanEntry[]>([])
  const [businessEntries, setBusinessEntries] = useState<LoanEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/loans/compare')
      .then((res) => res.json())
      .then((data) => {
        if (data.personalLoans?.length > 0) setPersonalEntries(data.personalLoans)
        if (data.businessLoans?.length > 0) setBusinessEntries(data.businessLoans)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const plTitle = (() => {
    const title = t('compare.title')
    const idx = title.indexOf(' ')
    if (idx === -1) return <span className="shimmer-text">{title}</span>
    return (
      <>
        <span className="shimmer-text">{title.substring(0, idx)}</span>
        {title.substring(idx)}
      </>
    )
  })()

  if (loading) {
    return (
      <section className="compare-bank-loans-section" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ fontSize: '1.1rem', opacity: 0.7 }}>Loading loan comparison data…</p>
      </section>
    )
  }

  if (personalEntries.length === 0 && businessEntries.length === 0) {
    return null
  }

  return (
    <section className="compare-bank-loans-section">
      <CompareSection
        title={plTitle}
        subtitle={t('compare.subtitle')}
        allEntries={personalEntries}
        bankLabel="Personal Loan"
        nbfcLabel="Over Draft"
        bankTheme="bank"
        nbfcTheme="nbfc"
      />

      <CompareSection
        title={
          <>
            <span className="shimmer-text">Compare</span>
            {' Business Loans'}
          </>
        }
        subtitle={<>Select <strong>up to 3 lenders to compare</strong> fees, eligibility, and features side by side.</>}
        allEntries={businessEntries}
        bankLabel="Business Loan"
        nbfcLabel="Over Draft"
        bankTheme="business"
        nbfcTheme="nbfc"
      />
    </section>
  )
}
