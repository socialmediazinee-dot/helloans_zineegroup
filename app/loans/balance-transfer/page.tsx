import LoanCalculator from '@/components/LoanCalculator'
import BankList from '@/components/BankList'
import { bankOffers } from '@/data/bankOffers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Balance Transfer Loan Calculator | Zineegroup',
  description: 'Transfer your existing loan and save on interest. Calculate your new EMI after balance transfer.',
}

export default function BalanceTransferPage() {
  return (
    <>
      <Header />
      <main className="loan-page-main">
        <div className="loan-page-container">
          <div className="loan-page-header">
            <h1><span className="loan-title-shimmer">Balance</span> Transfer</h1>
            <p>Transfer your existing loan to us and save on interest rates with better terms and conditions.</p>
          </div>

          <BankList
            offers={bankOffers['balance-transfer']}
            categoryTitle="Balance Transfer Offers"
            loanCategory="balance-transfer"
          />

          <LoanCalculator
            loanType="Balance Transfer Loan"
            defaultInterestRate={9.5}
            minAmount={100000}
            maxAmount={5000000}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
