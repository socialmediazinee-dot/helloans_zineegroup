export type EmiBank = {
  id: string
  name: string
  /** Logo path under /assets/images (e.g. 'HDFC.png'). Optional; fallback to initial if missing. */
  logo?: string
  interestRate: number // p.a.
  processingFee: string
  minAmount: number
  maxAmount: number
  minTenureYrs: number
  maxTenureYrs: number
  description: string
  features: string[]
  applyUrl: string
}

export const emiBanks: EmiBank[] = [
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    logo: '/assets/images/HDFC.svg',
    interestRate: 10.5,
    processingFee: 'Up to 2.5% of loan amount',
    minAmount: 50000,
    maxAmount: 4000000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description:
      'HDFC Bank offers personal loans with quick disbursal and flexible tenure. Ideal for salaried and self-employed individuals with minimal documentation.',
    features: ['Quick approval in 2–3 days', 'No prepayment charges', 'Flexible EMI options', 'Doorstep document pickup'],
    applyUrl: 'https://www.hdfcbank.com/personal/loans',
  },
  {
    id: 'axis',
    name: 'Axis Bank',
    logo: '/assets/images/AX.png',
    interestRate: 10.75,
    processingFee: '1%–2% of loan amount',
    minAmount: 50000,
    maxAmount: 4000000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description:
      'Axis Bank personal loans come with competitive rates and instant approval for existing customers. No collateral required.',
    features: ['Instant approval for existing customers', 'Disbursal within 24 hours', 'No security required', 'Balance transfer facility'],
    applyUrl: 'https://www.axisbank.com/retail/loans',
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    logo: '/assets/images/partners/icici.svg',
    interestRate: 10.99,
    processingFee: 'Up to 2.25% of loan amount',
    minAmount: 50000,
    maxAmount: 5000000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description:
      'ICICI Bank provides personal loans with minimal documentation and same-day disbursal for pre-approved customers.',
    features: ['Same-day disbursal for pre-approved', 'Minimal documentation', 'No part-prepayment charges', '24/7 customer support'],
    applyUrl: 'https://www.icicibank.com/Personal-Banking/loan/personal-loan',
  },
  {
    id: 'kotak',
    name: 'Kotak Mahindra Bank',
    logo: '/assets/images/Kotak-1.png',
    interestRate: 11.0,
    processingFee: 'Up to 2.5% of loan amount',
    minAmount: 50000,
    maxAmount: 5000000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description:
      'Kotak personal loans offer flexible repayment tenures and quick processing. Suitable for both salaried and self-employed.',
    features: ['Flexible tenure up to 5 years', 'Quick online application', 'No hidden charges', 'Optional insurance cover'],
    applyUrl: 'https://www.kotak.com/en/personal-banking/loans/personal-loan.html',
  },
  {
    id: 'sbi',
    name: 'State Bank of India',
    logo: '/assets/images/SBI.png',
    interestRate: 10.25,
    processingFee: '1% of loan amount (min ₹1,000)',
    minAmount: 25000,
    maxAmount: 2000000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description:
      'SBI personal loans are ideal for government employees and pensioners with lower interest rates and transparent processing.',
    features: ['Lower interest for government employees', 'No prepayment penalty', 'Wide branch network', 'Pensioner loans available'],
    applyUrl: 'https://www.sbi.co.in/web/personal-banking/loans/personal-loans',
  },
  {
    id: 'bob',
    name: 'Bank of Baroda',
    logo: '/assets/images/BOB.png',
    interestRate: 10.4,
    processingFee: 'Up to 2% of loan amount',
    minAmount: 50000,
    maxAmount: 3000000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description:
      'Bank of Baroda offers personal loans with competitive rates and special schemes for existing account holders.',
    features: ['Special rates for Baroda account holders', 'Quick processing', 'No prepayment charges', 'Online application'],
    applyUrl: 'https://www.bankofbaroda.in/personal-banking/loans/personal-loans',
  },
  {
    id: 'indusind',
    name: 'IndusInd Bank',
    logo: '/assets/images/partners/indusind.jpeg',
    interestRate: 10.75,
    processingFee: 'Up to 2% of loan amount',
    minAmount: 50000,
    maxAmount: 5000000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description:
      'IndusInd Bank offers instant personal loans with digital application and fast disbursal for eligible customers.',
    features: ['Digital application', 'Fast disbursal', 'No collateral', 'Flexible EMI'],
    applyUrl: 'https://www.indusind.com/retail/personal-loan.html',
  },
  {
    id: 'idfc',
    name: 'IDFC First Bank',
    logo: '/assets/images/partners/idfc.webp',
    interestRate: 10.5,
    processingFee: 'Up to 2% of loan amount',
    minAmount: 50000,
    maxAmount: 5000000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description:
      'IDFC First Bank personal loans focus on transparency with no hidden charges and quick online approval.',
    features: ['Transparent pricing', 'Quick online approval', 'No hidden charges', 'Flexible tenure'],
    applyUrl: 'https://www.idfcfirstbank.com/personal-loan',
  },
  {
    id: 'bajaj',
    name: 'Bajaj Finserv',
    logo: '/assets/images/partners/bajaj.png',
    interestRate: 11.5,
    processingFee: 'Up to 2% of loan amount',
    minAmount: 50000,
    maxAmount: 5000000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description:
      'Bajaj Finserv offers instant personal loans with minimal documentation and same-day disbursal in many cases.',
    features: ['Same-day disbursal', 'Minimal documentation', 'Flexible EMI', 'No prepayment charges'],
    applyUrl: 'https://www.bajajfinserv.in/personal-loan',
  },
]
