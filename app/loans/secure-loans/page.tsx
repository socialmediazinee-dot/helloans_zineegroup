import LoanCalculator from '@/components/LoanCalculator'
import BankList from '@/components/BankList'
import { bankOffers } from '@/data/bankOffers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Secure Loan Calculator | Zineegroup',
  description: 'Calculate secured loan EMI with low interest rates. Use property as security for better loan terms.',
}

export default function SecureLoansPage() {
  return (
    <>
      <Header />
      <main className="loan-page-main">
        <div className="loan-page-container">
          <div className="loan-page-header">
            <h1><span className="loan-title-shimmer">Secure</span> Loans</h1>
            <p>With a secured loan, you're eligible for low interest rates since property is pledged as security.</p>
          </div>

          <BankList
            offers={bankOffers['secure-loans']}
            categoryTitle="Banks & NBFCs offering Secure Loans"
            loanCategory="secure-loans"
          />

          <LoanCalculator
            loanType="Secure Loan"
            defaultInterestRate={8.5}
            minAmount={500000}
            maxAmount={20000000}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
