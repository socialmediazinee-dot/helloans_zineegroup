'use client'

import LoanCalculator from '@/components/LoanCalculator'
import BankLoanComparison from '@/components/BankLoanComparison'

export default function EmiCalculatorWithComparison() {
  return (
    <>
      <LoanCalculator
        loanType="Personal Loan"
        defaultBanks={[]}
        defaultInterestRate={10.5}
        minAmount={50000}
        maxAmount={5000000}
      />
      <BankLoanComparison />
    </>
  )
}
