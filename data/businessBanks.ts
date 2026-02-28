export type BusinessBank = {
  id: string
  name: string
  logo?: string
  interestRate: number
  processingFee: string
  minAmount: number
  maxAmount: number
  minTenureYrs: number
  maxTenureYrs: number
  description: string
  eligibility: string
  features: string[]
  applyUrl: string
}

export const businessBanks: BusinessBank[] = [
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    logo: '/assets/images/HDFC.png',
    interestRate: 11.5,
    processingFee: 'Up to 2.5% of loan amount',
    minAmount: 100000,
    maxAmount: 5000000,
    minTenureYrs: 1,
    maxTenureYrs: 7,
    description:
      'HDFC Bank business loans with quick disbursal and flexible tenure for MSMEs, traders, and self-employed professionals.',
    eligibility: 'Business vintage of 3+ years, min turnover ₹10L p.a., CIBIL 700+',
    features: ['Collateral-free up to ₹50L', 'Overdraft facility available', 'Quick approval in 3 days', 'Doorstep service'],
    applyUrl: 'https://www.hdfcbank.com/sme/loans',
  },
  {
    id: 'axis',
    name: 'Axis Bank',
    logo: '/assets/images/AX.png',
    interestRate: 12.0,
    processingFee: '1.5%–2.5% of loan amount',
    minAmount: 100000,
    maxAmount: 5000000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description:
      'Axis Bank business loans designed for SMEs and entrepreneurs with competitive rates and fast processing.',
    eligibility: 'Business vintage of 2+ years, min turnover ₹15L p.a., CIBIL 675+',
    features: ['Digital application', 'Disbursal within 48 hours', 'No collateral up to ₹40L', 'Balance transfer option'],
    applyUrl: 'https://www.axisbank.com/business-banking/loans',
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    logo: '/assets/images/partners/icici.jpg',
    interestRate: 12.25,
    processingFee: 'Up to 2% of loan amount',
    minAmount: 100000,
    maxAmount: 10000000,
    minTenureYrs: 1,
    maxTenureYrs: 7,
    description:
      'ICICI Bank business loans with high loan amounts and flexible repayment for established businesses and startups.',
    eligibility: 'Business vintage of 3+ years, min turnover ₹12L p.a., CIBIL 700+',
    features: ['Loan up to ₹1 Cr', 'Pre-approved offers for existing customers', 'No prepayment charges after 12 months', '24/7 support'],
    applyUrl: 'https://www.icicibank.com/business-banking/loans/business-loan',
  },
  {
    id: 'kotak',
    name: 'Kotak Mahindra Bank',
    logo: '/assets/images/Kotak-1.png',
    interestRate: 12.5,
    processingFee: 'Up to 2.5% of loan amount',
    minAmount: 100000,
    maxAmount: 7500000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description:
      'Kotak business loans offer quick processing and flexible tenures for small businesses, traders, and manufacturers.',
    eligibility: 'Business vintage of 2+ years, min turnover ₹10L p.a., CIBIL 680+',
    features: ['Flexible tenure up to 5 years', 'Online tracking', 'No hidden charges', 'Top-up loan facility'],
    applyUrl: 'https://www.kotak.com/en/business-banking/loans/business-loan.html',
  },
  {
    id: 'sbi',
    name: 'State Bank of India',
    logo: '/assets/images/SBI.png',
    interestRate: 11.0,
    processingFee: '1% of loan amount (min ₹2,000)',
    minAmount: 50000,
    maxAmount: 5000000,
    minTenureYrs: 1,
    maxTenureYrs: 7,
    description:
      'SBI business loans with low interest rates and government-backed MUDRA schemes for MSMEs and small entrepreneurs.',
    eligibility: 'Business vintage of 2+ years, valid GST registration, CIBIL 650+',
    features: ['MUDRA loan options', 'Lowest interest rates', 'Wide branch network', 'Government subsidy linkage'],
    applyUrl: 'https://www.sbi.co.in/web/business/loans/business-loan',
  },
  {
    id: 'bob',
    name: 'Bank of Baroda',
    logo: '/assets/images/BOB.png',
    interestRate: 11.25,
    processingFee: 'Up to 1.5% of loan amount',
    minAmount: 100000,
    maxAmount: 5000000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description:
      'Bank of Baroda business loans with attractive rates for existing account holders and special MSME schemes.',
    eligibility: 'Business vintage of 3+ years, min turnover ₹10L p.a., CIBIL 675+',
    features: ['Special MSME schemes', 'Low processing fee', 'No prepayment charges', 'Dedicated relationship manager'],
    applyUrl: 'https://www.bankofbaroda.in/business-banking/loans',
  },
  {
    id: 'indusind',
    name: 'IndusInd Bank',
    logo: '/assets/images/partners/indusind.jpeg',
    interestRate: 13.0,
    processingFee: 'Up to 2% of loan amount',
    minAmount: 100000,
    maxAmount: 10000000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description:
      'IndusInd Bank business loans with high loan amounts and digital-first application for growing enterprises.',
    eligibility: 'Business vintage of 3+ years, min turnover ₹15L p.a., CIBIL 700+',
    features: ['Fully digital process', 'High loan amount up to ₹1 Cr', 'No collateral', 'Flexible EMI'],
    applyUrl: 'https://www.indusind.com/business-banking/loans',
  },
]
