'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'


export default function InstantLoanSlide() {
    const { t } = useLanguage()
    const [showAllModal, setShowAllModal] = useState(false)

    // Partner Data
    const personalLoanPartners = [
        { name: 'IndusInd', url: 'https://induseasycredit.indusind.com/customer/personal-loan/new-lead?utm_source=assisted&utm_medium=IBLV899&utm_campaign=Personal-Loan&utm_content=1', logo: '/assets/images/partners/indusind.jpeg' },
        { name: 'Bajaj Finserv', url: 'https://www.bajajfinservmarkets.in/apply-for-personal-loan-finservmarkets/?utm_source=B2B&utm_medium=E-referral&utm_campaign=OA&utm_content=MYMONEYMANTRA_FINTECH_PRIVATE_LIMITED', logo: '/assets/images/partners/bajaj.png' },
        { name: 'Unity Bank', url: 'https://loans.theunitybank.com/unity-pl-ui/page/exclusion/login/logindetails?utm_source=partnership&utm_medium=mymoneymantra&utm_campaign=ENT-941530', logo: '/assets/images/partners/unity.png' },
        { name: 'Hero FinCorp', url: 'https://hipl.onelink.me/1OrE?af_ios_url=https%3A%2F%2Floans.apps.herofincorp.com%2Fen%2Fpersonal-loan&af_android_url=https%3A%2F%2Floans.apps.herofincorp.com%2Fen%2Fpersonal-loan&af_web_dp=https%3A%2F%2Floans.apps.herofincorp.com%2Fen%2Fpersonal-loan&af_xp=custom&pid=Mymoneymantra&is_retargeting=true&af_reengagement_window=30d&c=Mymoneymantra&utm_source=partnership&utm_campaign=mymoneymantra&utm_content=ENT&utm_medium=MMMENT941530', logo: '/assets/images/partners/hero.png' },
        { name: 'CreditVidya', url: 'https://marketplace.creditvidya.com/mymoneymantra?utm_source=EARNTRA_941530', logo: '/assets/images/partners/prefer.jpeg' },
        { name: 'Poonawalla', url: 'https://poonawalla.mymoneymantra.com/?sms=false&btb=true&utm_source=pnwpl&utm_medium=mmm&utm_campaign=pnwpl-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5', logo: '/assets/images/partners/poonawalla.png' },
        { name: 'InCred', url: 'https://incredpl.mymoneymantra.com?btb=true&utm_source=incred&utm_medium=mmm&utm_campaign=incred-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5', logo: '/assets/images/partners/incred.png' },
        { name: 'DMI Finance', url: 'https://dmi.mymoneymantra.com/?sms=false&btb=true&utm_source=dmipl&utm_medium=mmm&utm_campaign=dmipl-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5', logo: '/assets/images/partners/dmi.png' },
        { name: 'Fi Money', url: 'https://fimoney.mymoneymantra.com/?sms=false&btb=true&utm_source=fimnpl&utm_medium=mmm&utm_campaign=fimnpl-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5', logo: '/assets/images/partners/fi.svg' },
        { name: 'IDFC First', url: 'https://idfcfirstpl.mymoneymantra.com?sms=false&btb=true&utm_source=idfcpl&utm_medium=mmm&utm_campaign=idfcpl-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5', logo: '/assets/images/partners/idfc.webp' },
    ]

    const businessLoanPartners = [
        { name: 'Protium', url: 'https://protium.mymoneymantra.com/?sms=false&btb=true&utm_source=protium&utm_medium=mmm&utm_campaign=protium-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5', logo: '/assets/images/partners/protium.jpg' },
        { name: 'Muthoot', url: 'https://muthoot.mymoneymantra.com/?sms=false&btb=true&v1=EDI&utm_source=medi&utm_medium=mmm&utm_campaign=medi-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5', logo: '/assets/images/partners/muthoot.png' },
        { name: 'ABFL', url: 'https://abflbl.mymoneymantra.com/?btb=true&utm_source=abfl&utm_medium=mmm&utm_campaign=abfl-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5', logo: '/assets/images/partners/abfl.webp' },
        { name: 'Tata Capital', url: 'https://tatacapitalbl.mymoneymantra.com/?sms=false&btb=true&utm_source=tatabl&utm_medium=mmm&utm_campaign=tatabl-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5', logo: '/assets/images/partners/tata.png' },
    ]

    const creditCardPartners = [
        { name: 'Popcard', url: 'https://popcard.mymoneymantra.com?sms=false&btb=true&utm_source=yescc&utm_medium=mmm&utm_campaign=yescc-mmm-941530', logo: '/assets/images/partners/popcard.jpg' },
        { name: 'Bank of Baroda', url: 'https://bobcard.mymoneymantra.com?sms=false&btb=true&utm_source=bobcc&utm_medium=mmm&utm_campaign=bobcc-mmm-941530', logo: '/assets/images/BOB.png' }, // Using existing asset
        { name: 'Federal Bank', url: 'https://federalcc.mymoneymantra.com?sms=false&btb=true&utm_source=fedcc&utm_medium=mmm&utm_campaign=fedcc-mmm-941530', logo: '/assets/images/partners/federal.jpeg' },
        { name: 'AU Bank', url: 'https://aucc.mymoneymantra.com/?sms=false&btb=true&utm_source=aucc&utm_medium=mmm&utm_campaign=aucc-mmm-941530', logo: '/assets/images/partners/au.png' },
        { name: 'Kiwi', url: 'https://kiwi.mymoneymantra.com?sms=false&btb=true&utm_source=kiwicc&utm_medium=mmm&utm_campaign=kiwicc-mmm-941530', logo: '/assets/images/partners/kiwi.jpg' },
        { name: 'Tata Neu', url: 'https://tataneu.mymoneymantra.com?sms=false&btb=true&utm_source=neucc&utm_medium=mmm&utm_campaign=neucc-mmm-941530', logo: '/assets/images/partners/tataneu.webp' },
        { name: 'SBI Card', url: 'https://sbicard.mymoneymantra.com?sms=false&btb=true&utm_source=sbcc&utm_medium=mmm&utm_campaign=sbcc-mmm-941530', logo: '/assets/images/SBI.png' }, // Using existing asset
        { name: 'Axis Bank', url: 'https://axis-card.mymoneymantra.com?sms=false&btb=true&utm_source=axs&utm_medium=mmm&utm_campaign=axs-mmm-941530', logo: '/assets/images/AX.png' }, // Using existing asset
        { name: 'Scapia', url: 'https://scapia.mymoneymantra.com?sms=false&btb=true&utm_source=scacc&utm_medium=mmm&utm_campaign=scacc-mmm-941530', logo: '/assets/images/partners/scapia.jpg' },
        { name: 'Magnifi', url: 'https://magnifi.mymoneymantra.com?sms=false&btb=true&utm_source=mficc&utm_medium=mmm&utm_campaign=mficc-mmm-941530', logo: '/assets/images/partners/magnifi.png' },
        { name: 'IndusInd', url: 'https://ccindus.mymoneymantra.com?sms=false&btb=true&utm_source=induscc&utm_medium=mmm&utm_campaign=induscc-mmm-941530', logo: '/assets/images/partners/indusind.jpeg' },
        { name: 'ICICI Bank', url: 'https://icicicc.mymoneymantra.com?sms=false&btb=true&utm_source=icicc&utm_medium=mmm&utm_campaign=icicc-mmm-941530', logo: '/assets/images/partners/icici.jpg' },
        { name: 'LIC Axis', url: 'https://licaxiscc.mymoneymantra.com?sms=false&btb=true&utm_source=axslic&utm_medium=mmm&utm_campaign=axslic-mmm-941530', logo: null }, // Still missing LIC Axis? checking list again later if uploaded differently
        { name: 'Magnet', url: 'https://magnetcard.mymoneymantra.com/?sms=false&btb=true&utm_source=mfdcc&utm_medium=mmm&utm_campaign=mfdcc-mmm-941530', logo: null },
    ]

    const lapPartners = [
        { name: 'Jio Finance', url: 'https://jiolap.mymoneymantra.com/?btb=true&utm_source=jiolap&utm_medium=mmm&utm_campaign=jiolap-mmm-941530', logo: '/assets/images/partners/jio.jpeg' },
    ]

    const slides = [
        { title: 'INSTANT', subtitle: 'PERSONAL LOAN', typeLabel: 'personal', partners: personalLoanPartners },
        { title: 'INSTANT', subtitle: 'BUSINESS LOAN', typeLabel: 'business', partners: businessLoanPartners },
        { title: 'INSTANT', subtitle: 'CREDIT CARDS', typeLabel: 'credit card', partners: creditCardPartners },
        { title: 'INSTANT', subtitle: 'LOAN AGAINST PROPERTY', typeLabel: 'loan against property', partners: lapPartners },
    ]

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const currentSlide = slides[currentSlideIndex]

    useEffect(() => {
        if (showAllModal) return;
        const timer = setInterval(() => {
            setCurrentSlideIndex((prev) => (prev + 1) % slides.length)
        }, 5000) // 5 seconds per slide
        return () => clearInterval(timer)
    }, [showAllModal])

    const renderPartnerCard = (partner: any, index: number) => {
        return (
            <a
                key={index}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="modern-card"
            >
                {partner.logo ? (
                    <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={120}
                        height={80}
                        style={{ objectFit: 'contain', borderRadius: '8px', maxWidth: '100%', maxHeight: '100%' }}
                    />
                ) : (
                    <span className="modern-card-text">{partner.name}</span>
                )}
            </a>
        )
    }

    return (
        <div className="modern-carousel">
            {/* Modal Overlay */}
            {showAllModal && (
                <div className="modern-modal-overlay">
                    <div className="modern-modal-content">
                        <div className="modern-modal-header">
                            <h3>All Partners - {currentSlide.title} {currentSlide.subtitle}</h3>
                            <button
                                className="modern-close-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowAllModal(false);
                                }}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="modern-modal-grid">
                            {currentSlide.partners.map((logo, i) => renderPartnerCard(logo, i))}
                        </div>
                    </div>
                </div>
            )}

            <div key={currentSlideIndex} className="modern-carousel-left" style={{ animation: 'fadeIn 0.5s ease' }}>
                <div className="modern-title-card">
                    <h2 className="modern-title">
                        {currentSlide.title}⚡️<br />
                        <span className="modern-title-blue">{currentSlide.subtitle}</span>
                    </h2>
                </div>
                <div className="modern-subtitle">
                    Get pre-approved instant {currentSlide.typeLabel}{currentSlide.typeLabel === 'credit card' ? '' : ' loan'}
                </div>
                {/* Dots Indicator */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '20px' }}>
                    {slides.map((_, idx) => (
                        <div
                            key={idx}
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: idx === currentSlideIndex ? '#1e40af' : '#cbd5e1',
                                transition: 'all 0.3s'
                            }}
                        />
                    ))}
                </div>
                {/* Manual Navigation */}
                <div className="carousel-nav-container">
                    <button
                        className="carousel-nav-btn"
                        onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                        aria-label="Previous Slide"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        className="carousel-nav-btn"
                        onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
                        aria-label="Next Slide"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="modern-carousel-right">
                <div className="modern-grid" key={currentSlideIndex} style={{ animation: 'fadeIn 0.5s ease' }}>
                    {/* Conditional Rendering for View All */}
                    {currentSlide.partners.length > 9 ? (
                        <>
                            {currentSlide.partners.slice(0, 8).map((logo, i) => renderPartnerCard(logo, i))}
                            {/* View All Button */}
                            <button
                                className="view-all-btn"
                                onClick={() => setShowAllModal(true)}
                            >
                                <span>View</span>
                                <span>All</span>
                            </button>
                        </>
                    ) : (
                        currentSlide.partners.slice(0, 9).map((logo, i) => renderPartnerCard(logo, i))
                    )}
                </div>
            </div>
        </div>
    )
}
