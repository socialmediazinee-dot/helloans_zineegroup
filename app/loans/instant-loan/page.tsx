import BankList from '@/components/BankList'
import { bankOffers } from '@/data/bankOffers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Instant Loan Calculator | Zineegroup',
  description: 'Get instant loans for unexpected expenses. Quick approval and fast disbursal.',
}

export default function InstantLoanPage() {
  return (
    <>
      <Header />
      <main className="loan-page-main">
        <div className="loan-page-container">
          <div className="loan-page-header">
            <h1><span className="loan-title-shimmer">Instant</span> Loan</h1>
            <p>A convenient and speedy way to get the funds you require for unanticipated expenses.</p>
          </div>

          <BankList
          offers={bankOffers['instant-loan']}
          categoryTitle={<>Banks &amp; NBFCs offering <span className="loan-title-shimmer">Instant Loan</span></>}
        />
        </div>
      </main>
      <Footer />
    </>
  )
}
