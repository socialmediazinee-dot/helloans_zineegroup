/** NBFCs for 3rd column in EMI compare (Bajaj, Tata, Aditya Birla, Cholamandalam, Piramal) */
export type EmiNbfc = {
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
  features: string[]
  applyUrl: string
}

export const emiNbfcs: EmiNbfc[] = [
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
    description: 'Bajaj Finserv offers instant personal loans with minimal documentation and same-day disbursal in many cases.',
    features: ['Same-day disbursal', 'Minimal documentation', 'Flexible EMI', 'No prepayment charges'],
    applyUrl: 'https://www.bajajfinserv.in/personal-loan',
  },
  {
    id: 'tata',
    name: 'Tata Capital',
    logo: '/assets/images/partners/tata.png',
    interestRate: 11.25,
    processingFee: 'Up to 2.5% of loan amount',
    minAmount: 75000,
    maxAmount: 3500000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description: 'Tata Capital personal loans offer competitive rates with quick processing and flexible tenures for salaried and self-employed.',
    features: ['Quick approval', 'Flexible tenure', 'Competitive rates', 'Minimal documentation'],
    applyUrl: 'https://www.tatacapital.com/personal-loan',
  },
  {
    id: 'adityabirla',
    name: 'Aditya Birla Capital',
    logo: '/assets/images/partners/abfl.webp',
    interestRate: 11.75,
    processingFee: 'Up to 2% of loan amount',
    minAmount: 50000,
    maxAmount: 4000000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description: 'Aditya Birla Capital provides personal loans with digital application and fast disbursal for eligible customers.',
    features: ['Digital application', 'Fast disbursal', 'No collateral', 'Transparent pricing'],
    applyUrl: 'https://www.adityabirlacapital.com/personal-loan',
  },
  {
    id: 'cholamandalam',
    name: 'Cholamandalam',
    logo: '/assets/images/cholamandalam.png',
    interestRate: 12.0,
    processingFee: '1%–2.5% of loan amount',
    minAmount: 50000,
    maxAmount: 3000000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description: 'Cholamandalam Investment and Finance offers personal loans with quick processing and wide eligibility.',
    features: ['Quick processing', 'Wide eligibility', 'Flexible repayment', 'Simple documentation'],
    applyUrl: 'https://www.cholamandalam.com/personal-loan',
  },
  {
    id: 'poonawalla',
    name: 'Poonawalla Fincorp',
    logo: '/assets/images/partners/poonawalla.png',
    interestRate: 11.5,
    processingFee: 'Up to 2% of loan amount',
    minAmount: 50000,
    maxAmount: 5000000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description: 'Poonawalla Fincorp offers personal loans with digital-first approach, quick approval and competitive rates.',
    features: ['Fully digital process', 'Quick approval', 'Competitive rates', 'No prepayment charges'],
    applyUrl: 'https://www.poonawallafincorp.com/personal-loan',
  },
  {
    id: 'piramal',
    name: 'Piramal Capital',
    logo: '/assets/images/Piramal_Finance_logo.svg',
    interestRate: 11.99,
    processingFee: 'Up to 2% of loan amount',
    minAmount: 50000,
    maxAmount: 5000000,
    minTenureYrs: 1,
    maxTenureYrs: 5,
    description: 'Piramal Capital & Housing Finance offers personal loans with competitive rates and hassle-free process.',
    features: ['Competitive rates', 'Hassle-free process', 'Quick disbursal', 'Flexible tenure'],
    applyUrl: 'https://www.piramalcapital.com/personal-loan',
  },
]
