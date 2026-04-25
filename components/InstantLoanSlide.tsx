'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

const slides = [
    {
        title: 'INSTANT',
        subtitle: 'PERSONAL',
        subtitle2: 'LOAN',
        typeLabel: 'personal',
        highlights: [
            { icon: '⏱️', text: '', bold: '5 Minutes Fast Approval' },
            { icon: '💰', text: '', bold: '30 Minutes Amount Credit' },
            { icon: '📄', text: '', bold: 'No Documents Required' },
            { icon: '🚫', text: '', bold: 'No Physical Verification' },
            { icon: '✅', text: '', bold: 'No Additional Charges' },
            { icon: '📋', text: '', bold: 'Required Basic Details Only' },
            { icon: '📱', text: '', bold: 'Total Digital Process' },
        ],
        socialProof: '10 lakhs+ customers have availed loans!',
        href: '/apply/instant?loanType=personal-loans',
    },
    {
        title: 'INSTANT',
        subtitle: 'BUSINESS',
        subtitle2: 'LOAN',
        typeLabel: 'business',
        highlights: [
            { icon: '₹', text: 'Loan from', bold: '₹1L to ₹5 Crore' },
            { icon: '◎', text: 'Interest starting', bold: '@14.99%' },
            { icon: '📄', text: '', bold: 'Minimal Documentation' },
            { icon: '⏱️', text: '', bold: 'Quick Disbursal in 48 Hrs' },
            { icon: '🔄', text: 'Tenure upto', bold: '5 years' },
            { icon: '🏢', text: '', bold: 'For All Business Types' },
            { icon: '🔒', text: '', bold: 'Collateral Free Options' },
        ],
        socialProof: '5 lakhs+ businesses funded!',
        href: '/apply/instant?loanType=business-loans',
    },
]

export default function InstantLoanSlide() {
    const { t } = useLanguage()
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const currentSlide = slides[currentSlideIndex]

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlideIndex((prev) => (prev + 1) % slides.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="modern-carousel">
            <div key={currentSlideIndex} className="instant-loan-card" style={{ animation: 'fadeIn 0.5s ease' }}>
                <div className="instant-loan-left">
                    <div className="instant-loan-header">
                        <h2 className="modern-title">
                            {currentSlide.title}⚡️<br />
                            <span className="modern-title-blue">{currentSlide.subtitle}</span><br />
                            <span className="modern-title-blue">{currentSlide.subtitle2}</span>
                        </h2>
                        <p className="instant-loan-tagline">
                            Get pre-approved instant {currentSlide.typeLabel} loan
                        </p>
                    </div>

                    <div className="instant-loan-actions">
                        <div className="instant-loan-social-proof">
                            <span className="instant-loan-social-emoji">🔥</span>
                            {currentSlide.socialProof}
                        </div>
                    </div>

                    <div className="instant-loan-actions">
                        <Link href={currentSlide.href} className="instant-loan-apply-btn">
                            Apply Now
                        </Link>
                    </div>

                    <div className="instant-loan-nav-row">
                        <div className="instant-loan-dots">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`instant-loan-dot ${idx === currentSlideIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentSlideIndex(idx)}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                        <div className="carousel-nav-container">
                            <button
                                className="carousel-nav-btn"
                                onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                                aria-label="Previous Slide"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button
                                className="carousel-nav-btn"
                                onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
                                aria-label="Next Slide"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="instant-loan-right">
                    <ul className="instant-loan-highlights">
                        {currentSlide.highlights.map((item, i) => (
                            <li key={i} className="instant-loan-highlight-item">
                                <span className="instant-loan-highlight-icon">{item.icon}</span>
                                <span className="instant-loan-highlight-text">
                                    {item.text} &nbsp;<strong>{item.bold}</strong>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
