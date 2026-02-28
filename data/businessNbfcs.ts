export type BusinessNbfc = {
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

export const businessNbfcs: BusinessNbfc[] = [
  {
    id: 'bajaj-biz',
    name: 'Bajaj Finserv',
    logo: '/assets/images/partners/bajaj.png',
    interestRate: 14.0,
    processingFee: 'Up to 3% of loan amount',
    minAmount: 100000,
    maxAmount: 5000000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description: 'Bajaj Finserv business loans with instant approval and same-day disbursal for eligible businesses.',
    eligibility: 'Business vintage of 2+ years, min turnover ₹10L p.a., CIBIL 685+',
    features: ['Same-day disbursal', 'Flexi loan option', 'No collateral required', 'Part-prepayment allowed'],
    applyUrl: 'https://www.bajajfinserv.in/business-loan',
  },
  {
    id: 'tata-biz',
    name: 'Tata Capital',
    logo: '/assets/images/partners/tata.png',
    interestRate: 13.5,
    processingFee: 'Up to 2.5% of loan amount',
    minAmount: 100000,
    maxAmount: 7500000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description: 'Tata Capital business loans with competitive rates and flexible repayment for SMEs and professionals.',
    eligibility: 'Business vintage of 3+ years, min turnover ₹12L p.a., CIBIL 675+',
    features: ['Quick approval', 'Flexible tenure', 'No hidden charges', 'Dedicated support'],
    applyUrl: 'https://www.tatacapital.com/business-loan',
  },
  {
    id: 'adityabirla-biz',
    name: 'Aditya Birla Capital',
    logo: '/assets/images/partners/abfl.webp',
    interestRate: 14.5,
    processingFee: 'Up to 2.5% of loan amount',
    minAmount: 100000,
    maxAmount: 5000000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description: 'Aditya Birla Capital business loans with digital application and fast disbursal for growing businesses.',
    eligibility: 'Business vintage of 2+ years, min turnover ₹10L p.a., CIBIL 680+',
    features: ['Digital application', 'Fast disbursal', 'Transparent pricing', 'No collateral up to ₹30L'],
    applyUrl: 'https://www.adityabirlacapital.com/business-loan',
  },
  {
    id: 'cholamandalam-biz',
    name: 'Cholamandalam',
    logo: '/assets/images/cholamandalam.png',
    interestRate: 15.0,
    processingFee: '2%–3% of loan amount',
    minAmount: 100000,
    maxAmount: 5000000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description: 'Cholamandalam business loans with wide eligibility and quick processing for small and medium enterprises.',
    eligibility: 'Business vintage of 2+ years, valid GST registration, CIBIL 650+',
    features: ['Wide eligibility', 'Quick processing', 'Flexible repayment', 'Simple documentation'],
    applyUrl: 'https://www.cholamandalam.com/business-loan',
  },
  {
    id: 'poonawalla-biz',
    name: 'Poonawalla Fincorp',
    logo: '/assets/images/partners/poonawalla.png',
    interestRate: 13.75,
    processingFee: 'Up to 2.5% of loan amount',
    minAmount: 100000,
    maxAmount: 5000000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description: 'Poonawalla Fincorp business loans with digital-first approach and quick disbursal for MSMEs and entrepreneurs.',
    eligibility: 'Business vintage of 2+ years, min turnover ₹10L p.a., CIBIL 675+',
    features: ['Fully digital process', 'Quick disbursal', 'No collateral up to ₹30L', 'Flexible repayment options'],
    applyUrl: 'https://www.poonawallafincorp.com/business-loan',
  },
  {
    id: 'piramal-biz',
    name: 'Piramal Capital',
    logo: '/assets/images/Piramal_Finance_logo.svg',
    interestRate: 14.25,
    processingFee: 'Up to 2.5% of loan amount',
    minAmount: 100000,
    maxAmount: 7500000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description: 'Piramal Capital business loans with competitive rates and hassle-free process for entrepreneurs.',
    eligibility: 'Business vintage of 3+ years, min turnover ₹15L p.a., CIBIL 680+',
    features: ['Competitive rates', 'Hassle-free process', 'Quick disbursal', 'Flexible tenure'],
    applyUrl: 'https://www.piramalcapital.com/business-loan',
  },
]
