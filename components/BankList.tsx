'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BankOffer } from '@/data/bankOffers'
import { useLanguage } from '@/contexts/LanguageContext'

export type LoanCategorySlug = 'personal-loans' | 'business-loans' | 'instant-loan' | 'credit-cards' | 'home-loans' | 'gold-loans' | 'education-loans' | 'insurance' | 'overdraft' | 'secure-loans' | 'used-car-loan'

interface BankListProps {
    offers: BankOffer[]
    categoryTitle: string
    /** e.g. 'personal-loans' | 'business-loans' – used for apply link: /apply/[slug]?loanType= */
    loanCategory?: LoanCategorySlug
}

export default function BankList({ offers, categoryTitle, loanCategory }: BankListProps) {
    const { t } = useLanguage()

    return (
        <div className="bank-list-section">
            <h2 className="bank-list-title">
                {categoryTitle}
            </h2>
            <div className="bank-tiles-grid">
                {offers.map((offer, index) => (
                    <div
                        key={index}
                        className="bank-tile"
                        style={
                            offer.brandColor
                                ? ({ ['--bank-color' as string]: offer.brandColor } as React.CSSProperties)
                                : undefined
                        }
                    >
                        <div className="bank-tile-header">
                            <h3 className="bank-tile-name">
                                <span className="bank-tile-logo-wrap">
                                    {offer.logo ? (
                                        <Image
                                            src={offer.logo}
                                            alt={offer.bankName}
                                            width={40}
                                            height={40}
                                            className="bank-tile-logo-img"
                                        />
                                    ) : (
                                        <span className="bank-tile-logo-fallback">
                                            {offer.bankName.charAt(0)}
                                        </span>
                                    )}
                                </span>
                                {offer.bankName}
                            </h3>
                            {offer.description && (
                                <p className="bank-tile-description">
                                    {offer.description}
                                </p>
                            )}
                        </div>

                        <div className="bank-tile-requirements">
                            <p className="requirements-title">Requirements:</p>
                            <ul className="requirements-list">
                                <li>
                                    <svg className="req-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Valid Identity Proof (Aadhar/PAN)
                                </li>
                                <li>
                                    <svg className="req-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Address Proof
                                </li>
                                <li>
                                    <svg className="req-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {categoryTitle.toLowerCase().includes('business')
                                        ? 'Business Registration Proof'
                                        : 'Income Proof (Salary Slips/ITR)'}
                                </li>
                                <li>
                                    <svg className="req-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Good Credit Score
                                </li>
                            </ul>
                        </div>

                        {offer.internalApplySlug && loanCategory ? (
                            <Link
                                href={`/apply/${offer.internalApplySlug}?loanType=${loanCategory}`}
                                className="bank-tile-apply-btn"
                            >
                                Apply Now
                                <svg className="icon-arrow-right" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        ) : (
                            <a
                                href={offer.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bank-tile-apply-btn"
                            >
                                Apply Now
                                <svg className="icon-arrow-right" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
