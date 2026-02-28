import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BankList from '@/components/BankList'
import { bankOffers } from '@/data/bankOffers'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Gold Loans | Zineegroup',
    description: 'Get instant funds against your gold jewelry with minimal documentation and attractive rates.',
}

export default function GoldLoansPage() {
    return (
        <>
            <Header />
            <main className="loan-page-main">
                <div className="loan-page-container">
                    <div className="loan-page-header">
                        <h1><span className="loan-title-shimmer">Gold</span> Loans</h1>
                        <p>Your gold can do more for you. Get quick and secure loans against your gold assets.</p>
                    </div>

                    <BankList
                        offers={bankOffers['gold-loans']}
                        categoryTitle="Top Gold Loan Offers"
                        loanCategory="gold-loans"
                    />
                </div>
            </main>
            <Footer />
        </>
    )
}
