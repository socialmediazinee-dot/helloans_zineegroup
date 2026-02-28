export type BankOffer = {
    bankName: string
    link: string
    description?: string
    /** Optional logo path under /assets/images or remote URL */
    logo?: string
    /** Optional brand color used to tint the tile background/border */
    brandColor?: string
    /** When set, "Apply Now" links to /apply/[internalApplySlug]?loanType=[category] */
    internalApplySlug?: string
}

export type OfferCategory =
    | 'personal-loans'
    | 'business-loans'
    | 'instant-loan'
    | 'credit-cards'
    | 'home-loans'
    | 'gold-loans'
    | 'education-loans'
    | 'insurance'
    | 'overdraft'
    | 'secure-loans'
    | 'used-car-loan'
    | 'balance-transfer'
    | 'professional-loans'

/** 7 banks + 6 NBFCs (Bajaj, Tata Capital, Aditya Birla, Cholamandalam, Poonawalla, Piramal) for personal-loans. Other categories show only those that offer that product. */
export const bankOffers: Record<OfferCategory, BankOffer[]> = {
    'personal-loans': [
        {
            bankName: 'ICICI Bank',
            link: '#',
            internalApplySlug: 'icici',
            logo: '/assets/images/partners/icici.jpg',
            brandColor: '#b6401e',
        },
        {
            bankName: 'IndusInd Bank',
            link: '#',
            internalApplySlug: 'indusind',
            logo: '/assets/images/partners/indusind.jpeg',
            brandColor: '#C4122E',
        },
        {
            bankName: 'YES Bank',
            link: '#',
            internalApplySlug: 'yes',
            logo: '/assets/images/partners/yes.png',
            brandColor: '#1e4f9c',
        },
        {
            bankName: 'IDFC First Bank',
            link: '#',
            internalApplySlug: 'idfc',
            logo: '/assets/images/partners/idfc.webp',
            brandColor: '#7a003c',
        },
        {
            bankName: 'Kotak Mahindra Bank',
            link: '#',
            internalApplySlug: 'kotak',
            logo: '/assets/images/Kotak-1.png',
            brandColor: '#d71920',
        },
        {
            bankName: 'HDFC Bank',
            link: '#',
            internalApplySlug: 'hdfc',
            logo: '/assets/images/HDFC.png',
            brandColor: '#004c8f',
        },
        {
            bankName: 'Axis Bank',
            link: '#',
            internalApplySlug: 'axis',
            logo: '/assets/images/AX.png',
            brandColor: '#7b0046',
        },
        // NBFCs
        {
            bankName: 'Bajaj Finserv',
            link: '#',
            internalApplySlug: 'bajaj',
            logo: '/assets/images/partners/bajaj.png',
            brandColor: '#0076b8',
        },
        {
            bankName: 'Tata Capital',
            link: '#',
            internalApplySlug: 'tata',
            logo: '/assets/images/partners/tata.png',
            brandColor: '#2b8fcb',
        },
        {
            bankName: 'Aditya Birla Capital',
            link: '#',
            internalApplySlug: 'adityabirla',
            logo: '/assets/images/partners/abfl.webp',
            brandColor: '#a02030',
        },
        {
            bankName: 'Cholamandalam',
            link: '#',
            internalApplySlug: 'cholamandalam',
            logo: '/assets/images/cholamandalam.png',
            brandColor: '#0d47a1',
        },
        {
            bankName: 'Poonawalla Fincorp',
            link: '#',
            internalApplySlug: 'poonawalla',
            logo: '/assets/images/partners/poonawalla.png',
            brandColor: '#1e88e5',
        },
        {
            bankName: 'Piramal Capital',
            link: '#',
            internalApplySlug: 'piramal',
            logo: '/assets/images/Piramal_Finance_logo.svg',
            brandColor: '#1565c0',
        },
    ],
    // Business Loans: 7 banks + 6 NBFCs
    'business-loans': [
        { bankName: 'ICICI Bank', link: '#', internalApplySlug: 'icici', logo: '/assets/images/partners/icici.jpg', brandColor: '#b6401e' },
        { bankName: 'IndusInd Bank', link: '#', internalApplySlug: 'indusind', logo: '/assets/images/partners/indusind.jpeg', brandColor: '#C4122E' },
        { bankName: 'YES Bank', link: '#', internalApplySlug: 'yes', logo: '/assets/images/partners/yes.png', brandColor: '#1e4f9c' },
        { bankName: 'IDFC First Bank', link: '#', internalApplySlug: 'idfc', logo: '/assets/images/partners/idfc.webp', brandColor: '#7a003c' },
        { bankName: 'Kotak Mahindra Bank', link: '#', internalApplySlug: 'kotak', logo: '/assets/images/Kotak-1.png', brandColor: '#d71920' },
        { bankName: 'HDFC Bank', link: '#', internalApplySlug: 'hdfc', logo: '/assets/images/HDFC.png', brandColor: '#004c8f' },
        { bankName: 'Axis Bank', link: '#', internalApplySlug: 'axis', logo: '/assets/images/AX.png', brandColor: '#7b0046' },
        {
            bankName: 'Bajaj Finserv',
            link: '#',
            internalApplySlug: 'bajaj',
            logo: '/assets/images/partners/bajaj.png',
            brandColor: '#0076b8',
        },
        {
            bankName: 'Tata Capital',
            link: '#',
            internalApplySlug: 'tata',
            logo: '/assets/images/partners/tata.png',
            brandColor: '#2b8fcb',
        },
        {
            bankName: 'Aditya Birla Capital',
            link: '#',
            internalApplySlug: 'adityabirla',
            logo: '/assets/images/partners/abfl.webp',
            brandColor: '#a02030',
        },
        {
            bankName: 'Cholamandalam',
            link: '#',
            internalApplySlug: 'cholamandalam',
            logo: '/assets/images/cholamandalam.png',
            brandColor: '#0d47a1',
        },
        {
            bankName: 'Poonawalla Fincorp',
            link: '#',
            internalApplySlug: 'poonawalla',
            logo: '/assets/images/partners/poonawalla.png',
            brandColor: '#1e88e5',
        },
        {
            bankName: 'Piramal Capital',
            link: '#',
            internalApplySlug: 'piramal',
            logo: '/assets/images/Piramal_Finance_logo.svg',
            brandColor: '#1565c0',
        },
    ],
    // Instant loan: only the 10 partners from Instant Personal Loan carousel (InstantLoanSlide)
    'instant-loan': [
        {
            bankName: 'IndusInd',
            link: 'https://induseasycredit.indusind.com/customer/personal-loan/new-lead?utm_source=assisted&utm_medium=IBLV899&utm_campaign=Personal-Loan&utm_content=1',
            logo: '/assets/images/partners/indusind.jpeg',
            brandColor: '#C4122E',
        },
        {
            bankName: 'Bajaj Finserv',
            link: 'https://www.bajajfinservmarkets.in/apply-for-personal-loan-finservmarkets/?utm_source=B2B&utm_medium=E-referral&utm_campaign=OA&utm_content=MYMONEYMANTRA_FINTECH_PRIVATE_LIMITED',
            logo: '/assets/images/partners/bajaj.png',
            brandColor: '#0076b8',
        },
        {
            bankName: 'Unity Bank',
            link: 'https://loans.theunitybank.com/unity-pl-ui/page/exclusion/login/logindetails?utm_source=partnership&utm_medium=mymoneymantra&utm_campaign=ENT-941530',
            logo: '/assets/images/partners/unity.png',
        },
        {
            bankName: 'Hero FinCorp',
            link: 'https://hipl.onelink.me/1OrE?af_ios_url=https%3A%2F%2Floans.apps.herofincorp.com%2Fen%2Fpersonal-loan&af_android_url=https%3A%2F%2Floans.apps.herofincorp.com%2Fen%2Fpersonal-loan&af_web_dp=https%3A%2F%2Floans.apps.herofincorp.com%2Fen%2Fpersonal-loan&af_xp=custom&pid=Mymoneymantra&is_retargeting=true&af_reengagement_window=30d&c=Mymoneymantra&utm_source=partnership&utm_campaign=mymoneymantra&utm_content=ENT&utm_medium=MMMENT941530',
            logo: '/assets/images/partners/hero.png',
        },
        {
            bankName: 'CreditVidya',
            link: 'https://marketplace.creditvidya.com/mymoneymantra?utm_source=EARNTRA_941530',
            logo: '/assets/images/partners/prefer.jpeg',
        },
        {
            bankName: 'Poonawalla',
            link: 'https://poonawalla.mymoneymantra.com/?sms=false&btb=true&utm_source=pnwpl&utm_medium=mmm&utm_campaign=pnwpl-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5',
            logo: '/assets/images/partners/poonawalla.png',
        },
        {
            bankName: 'InCred',
            link: 'https://incredpl.mymoneymantra.com?btb=true&utm_source=incred&utm_medium=mmm&utm_campaign=incred-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5',
            logo: '/assets/images/partners/incred.png',
        },
        {
            bankName: 'DMI Finance',
            link: 'https://dmi.mymoneymantra.com/?sms=false&btb=true&utm_source=dmipl&utm_medium=mmm&utm_campaign=dmipl-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5',
            logo: '/assets/images/partners/dmi.png',
        },
        {
            bankName: 'Fi Money',
            link: 'https://fimoney.mymoneymantra.com/?sms=false&btb=true&utm_source=fimnpl&utm_medium=mmm&utm_campaign=fimnpl-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5',
            logo: '/assets/images/partners/fi.svg',
        },
        {
            bankName: 'IDFC First',
            link: 'https://idfcfirstpl.mymoneymantra.com?sms=false&btb=true&utm_source=idfcpl&utm_medium=mmm&utm_campaign=idfcpl-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5',
            logo: '/assets/images/partners/idfc.webp',
            brandColor: '#7a003c',
        },
    ],
    // Home Loans: 7 banks + 6 NBFCs
    'home-loans': [
        { bankName: 'HDFC Bank', link: '#', internalApplySlug: 'hdfc', logo: '/assets/images/HDFC.png', brandColor: '#004c8f' },
        { bankName: 'ICICI Bank', link: '#', internalApplySlug: 'icici', logo: '/assets/images/partners/icici.jpg', brandColor: '#b6401e' },
        { bankName: 'Axis Bank', link: '#', internalApplySlug: 'axis', logo: '/assets/images/AX.png', brandColor: '#7b0046' },
        { bankName: 'Kotak Mahindra Bank', link: '#', internalApplySlug: 'kotak', logo: '/assets/images/Kotak-1.png', brandColor: '#d71920' },
        { bankName: 'IDFC First Bank', link: '#', internalApplySlug: 'idfc', logo: '/assets/images/partners/idfc.webp', brandColor: '#7a003c' },
        { bankName: 'IndusInd Bank', link: '#', internalApplySlug: 'indusind', logo: '/assets/images/partners/indusind.jpeg', brandColor: '#C4122E' },
        { bankName: 'YES Bank', link: '#', internalApplySlug: 'yes', logo: '/assets/images/partners/yes.png', brandColor: '#1e4f9c' },
        { bankName: 'Bajaj Finserv', link: '#', internalApplySlug: 'bajaj', logo: '/assets/images/partners/bajaj.png', brandColor: '#0076b8' },
        { bankName: 'Tata Capital', link: '#', internalApplySlug: 'tata', logo: '/assets/images/partners/tata.png', brandColor: '#2b8fcb' },
        { bankName: 'Aditya Birla Capital', link: '#', internalApplySlug: 'adityabirla', logo: '/assets/images/partners/abfl.webp', brandColor: '#a02030' },
        { bankName: 'Cholamandalam', link: '#', internalApplySlug: 'cholamandalam', logo: '/assets/images/cholamandalam.png', brandColor: '#0d47a1' },
        { bankName: 'Poonawalla Fincorp', link: '#', internalApplySlug: 'poonawalla', logo: '/assets/images/partners/poonawalla.png', brandColor: '#1e88e5' },
        { bankName: 'Piramal Capital', link: '#', internalApplySlug: 'piramal', logo: '/assets/images/Piramal_Finance_logo.svg', brandColor: '#1565c0' },
    ],
    // Gold Loan: Top 5 banks + Muthoot NBFC
    'gold-loans': [
        { bankName: 'Punjab National Bank', link: '#', internalApplySlug: 'pnb', logo: '/assets/images/PNB.png', brandColor: '#0b3d91' },
        { bankName: 'State Bank of India', link: '#', internalApplySlug: 'sbi', logo: '/assets/images/SBI.png', brandColor: '#22409a' },
        { bankName: 'HDFC Bank', link: '#', internalApplySlug: 'hdfc', logo: '/assets/images/HDFC.png', brandColor: '#004c8f' },
        { bankName: 'Canara Bank', link: '#', internalApplySlug: 'canara', logo: '/assets/images/CB.png', brandColor: '#fbb034' },
        { bankName: 'Bank of Baroda', link: '#', internalApplySlug: 'bob', logo: '/assets/images/BOB.png', brandColor: '#f26522' },
        {
            bankName: 'Muthoot',
            link: 'https://muthoot.mymoneymantra.com/?sms=false&btb=true&v1=EDI&utm_source=medi&utm_medium=mmm&utm_campaign=medi-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5',
            logo: '/assets/images/partners/muthoot.png',
        },
    ],
    // Education Loans: Top 5 banks
    'education-loans': [
        { bankName: 'Punjab National Bank', link: '#', internalApplySlug: 'pnb', logo: '/assets/images/PNB.png', brandColor: '#0b3d91' },
        { bankName: 'State Bank of India', link: '#', internalApplySlug: 'sbi', logo: '/assets/images/SBI.png', brandColor: '#22409a' },
        { bankName: 'Bank of Baroda', link: '#', internalApplySlug: 'bob', logo: '/assets/images/BOB.png', brandColor: '#f26522' },
        { bankName: 'HDFC Bank', link: '#', internalApplySlug: 'hdfc', logo: '/assets/images/HDFC.png', brandColor: '#004c8f' },
        { bankName: 'ICICI Bank', link: '#', internalApplySlug: 'icici', logo: '/assets/images/partners/icici.jpg', brandColor: '#b6401e' },
    ],
    // Credit cards: only the 14 partners from Instant Credit Cards carousel (InstantLoanSlide)
    'credit-cards': [
        {
            bankName: 'Popcard',
            link: 'https://popcard.mymoneymantra.com?sms=false&btb=true&utm_source=yescc&utm_medium=mmm&utm_campaign=yescc-mmm-941530',
            logo: '/assets/images/partners/popcard.jpg',
        },
        {
            bankName: 'Bank of Baroda',
            link: 'https://bobcard.mymoneymantra.com?sms=false&btb=true&utm_source=bobcc&utm_medium=mmm&utm_campaign=bobcc-mmm-941530',
            logo: '/assets/images/BOB.png',
        },
        {
            bankName: 'Federal Bank',
            link: 'https://federalcc.mymoneymantra.com?sms=false&btb=true&utm_source=fedcc&utm_medium=mmm&utm_campaign=fedcc-mmm-941530',
            logo: '/assets/images/partners/federal.jpeg',
        },
        {
            bankName: 'Kiwi',
            link: 'https://kiwi.mymoneymantra.com?sms=false&btb=true&utm_source=kiwicc&utm_medium=mmm&utm_campaign=kiwicc-mmm-941530',
            logo: '/assets/images/partners/kiwi.jpg',
        },
        {
            bankName: 'Tata Neu',
            link: 'https://tataneu.mymoneymantra.com?sms=false&btb=true&utm_source=neucc&utm_medium=mmm&utm_campaign=neucc-mmm-941530',
            logo: '/assets/images/partners/tataneu.webp',
        },
        {
            bankName: 'SBI Card',
            link: 'https://sbicard.mymoneymantra.com?sms=false&btb=true&utm_source=sbcc&utm_medium=mmm&utm_campaign=sbcc-mmm-941530',
            logo: '/assets/images/SBI.png',
        },
        {
            bankName: 'Axis Bank',
            link: 'https://axis-card.mymoneymantra.com?sms=false&btb=true&utm_source=axs&utm_medium=mmm&utm_campaign=axs-mmm-941530',
            logo: '/assets/images/AX.png',
            brandColor: '#7b0046',
        },
        {
            bankName: 'Scapia',
            link: 'https://scapia.mymoneymantra.com?sms=false&btb=true&utm_source=scacc&utm_medium=mmm&utm_campaign=scacc-mmm-941530',
            logo: '/assets/images/partners/scapia.jpg',
        },
        {
            bankName: 'Magnifi',
            link: 'https://magnifi.mymoneymantra.com?sms=false&btb=true&utm_source=mficc&utm_medium=mmm&utm_campaign=mficc-mmm-941530',
            logo: '/assets/images/partners/magnifi.png',
        },
        {
            bankName: 'IndusInd',
            link: 'https://ccindus.mymoneymantra.com?sms=false&btb=true&utm_source=induscc&utm_medium=mmm&utm_campaign=induscc-mmm-941530',
            logo: '/assets/images/partners/indusind.jpeg',
            brandColor: '#C4122E',
        },
        {
            bankName: 'ICICI Bank',
            link: 'https://icicicc.mymoneymantra.com?sms=false&btb=true&utm_source=icicc&utm_medium=mmm&utm_campaign=icicc-mmm-941530',
            logo: '/assets/images/partners/icici.jpg',
            brandColor: '#b6401e',
        },
        {
            bankName: 'LIC Axis',
            link: 'https://licaxiscc.mymoneymantra.com?sms=false&btb=true&utm_source=axslic&utm_medium=mmm&utm_campaign=axslic-mmm-941530',
            logo: '/assets/images/licaxis-bank.jpg',
        },
        {
            bankName: 'Magnet',
            link: 'https://magnetcard.mymoneymantra.com/?sms=false&btb=true&utm_source=mfdcc&utm_medium=mmm&utm_campaign=mfdcc-mmm-941530',
        },
    ],
    // Insurance: Top 5 banks (by bancassurance commission)
    'insurance': [
        { bankName: 'HDFC Bank', link: '#', internalApplySlug: 'hdfc', logo: '/assets/images/HDFC.png', brandColor: '#004c8f' },
        { bankName: 'ICICI Bank', link: '#', internalApplySlug: 'icici', logo: '/assets/images/partners/icici.jpg', brandColor: '#b6401e' },
        { bankName: 'Axis Bank', link: '#', internalApplySlug: 'axis', logo: '/assets/images/AX.png', brandColor: '#7b0046' },
        { bankName: 'State Bank of India', link: '#', internalApplySlug: 'sbi', logo: '/assets/images/SBI.png', brandColor: '#22409a' },
        { bankName: 'IndusInd Bank', link: '#', internalApplySlug: 'indusind', logo: '/assets/images/partners/indusind.jpeg', brandColor: '#C4122E' },
    ],
    // Overdraft: 7 banks + 6 NBFCs
    'overdraft': [
        { bankName: 'ICICI Bank', link: '#', internalApplySlug: 'icici', logo: '/assets/images/partners/icici.jpg', brandColor: '#b6401e' },
        { bankName: 'IndusInd Bank', link: '#', internalApplySlug: 'indusind', logo: '/assets/images/partners/indusind.jpeg', brandColor: '#C4122E' },
        { bankName: 'YES Bank', link: '#', internalApplySlug: 'yes', logo: '/assets/images/partners/yes.png', brandColor: '#1e4f9c' },
        { bankName: 'IDFC First Bank', link: '#', internalApplySlug: 'idfc', logo: '/assets/images/partners/idfc.webp', brandColor: '#7a003c' },
        { bankName: 'Kotak Mahindra Bank', link: '#', internalApplySlug: 'kotak', logo: '/assets/images/Kotak-1.png', brandColor: '#d71920' },
        { bankName: 'HDFC Bank', link: '#', internalApplySlug: 'hdfc', logo: '/assets/images/HDFC.png', brandColor: '#004c8f' },
        { bankName: 'Axis Bank', link: '#', internalApplySlug: 'axis', logo: '/assets/images/AX.png', brandColor: '#7b0046' },
        { bankName: 'Bajaj Finserv', link: '#', internalApplySlug: 'bajaj', logo: '/assets/images/partners/bajaj.png', brandColor: '#0076b8' },
        { bankName: 'Tata Capital', link: '#', internalApplySlug: 'tata', logo: '/assets/images/partners/tata.png', brandColor: '#2b8fcb' },
        { bankName: 'Aditya Birla Capital', link: '#', internalApplySlug: 'adityabirla', logo: '/assets/images/partners/abfl.webp', brandColor: '#a02030' },
        { bankName: 'Cholamandalam', link: '#', internalApplySlug: 'cholamandalam', logo: '/assets/images/cholamandalam.png', brandColor: '#0d47a1' },
        { bankName: 'Poonawalla Fincorp', link: '#', internalApplySlug: 'poonawalla', logo: '/assets/images/partners/poonawalla.png', brandColor: '#1e88e5' },
        { bankName: 'Piramal Capital', link: '#', internalApplySlug: 'piramal', logo: '/assets/images/Piramal_Finance_logo.svg', brandColor: '#1565c0' },
    ],
    // Secure Loans: 7 banks + 6 NBFCs
    'secure-loans': [
        { bankName: 'ICICI Bank', link: '#', internalApplySlug: 'icici', logo: '/assets/images/partners/icici.jpg', brandColor: '#b6401e' },
        { bankName: 'IndusInd Bank', link: '#', internalApplySlug: 'indusind', logo: '/assets/images/partners/indusind.jpeg', brandColor: '#C4122E' },
        { bankName: 'YES Bank', link: '#', internalApplySlug: 'yes', logo: '/assets/images/partners/yes.png', brandColor: '#1e4f9c' },
        { bankName: 'IDFC First Bank', link: '#', internalApplySlug: 'idfc', logo: '/assets/images/partners/idfc.webp', brandColor: '#7a003c' },
        { bankName: 'Kotak Mahindra Bank', link: '#', internalApplySlug: 'kotak', logo: '/assets/images/Kotak-1.png', brandColor: '#d71920' },
        { bankName: 'HDFC Bank', link: '#', internalApplySlug: 'hdfc', logo: '/assets/images/HDFC.png', brandColor: '#004c8f' },
        { bankName: 'Axis Bank', link: '#', internalApplySlug: 'axis', logo: '/assets/images/AX.png', brandColor: '#7b0046' },
        { bankName: 'Bajaj Finserv', link: '#', internalApplySlug: 'bajaj', logo: '/assets/images/partners/bajaj.png', brandColor: '#0076b8' },
        { bankName: 'Tata Capital', link: '#', internalApplySlug: 'tata', logo: '/assets/images/partners/tata.png', brandColor: '#2b8fcb' },
        { bankName: 'Aditya Birla Capital', link: '#', internalApplySlug: 'adityabirla', logo: '/assets/images/partners/abfl.webp', brandColor: '#a02030' },
        { bankName: 'Cholamandalam', link: '#', internalApplySlug: 'cholamandalam', logo: '/assets/images/cholamandalam.png', brandColor: '#0d47a1' },
        { bankName: 'Poonawalla Fincorp', link: '#', internalApplySlug: 'poonawalla', logo: '/assets/images/partners/poonawalla.png', brandColor: '#1e88e5' },
        { bankName: 'Piramal Capital', link: '#', internalApplySlug: 'piramal', logo: '/assets/images/Piramal_Finance_logo.svg', brandColor: '#1565c0' },
    ],
    // Used Car Loan: only 7 banks (all self-created) – removed random-link NBFCs
    'used-car-loan': [
        { bankName: 'ICICI Bank', link: '#', internalApplySlug: 'icici', logo: '/assets/images/partners/icici.jpg', brandColor: '#b6401e' },
        { bankName: 'IndusInd Bank', link: '#', internalApplySlug: 'indusind', logo: '/assets/images/partners/indusind.jpeg', brandColor: '#C4122E' },
        { bankName: 'YES Bank', link: '#', internalApplySlug: 'yes', logo: '/assets/images/partners/yes.png', brandColor: '#1e4f9c' },
        { bankName: 'IDFC First Bank', link: '#', internalApplySlug: 'idfc', logo: '/assets/images/partners/idfc.webp', brandColor: '#7a003c' },
        { bankName: 'Kotak Mahindra Bank', link: '#', internalApplySlug: 'kotak', logo: '/assets/images/Kotak-1.png', brandColor: '#d71920' },
        { bankName: 'HDFC Bank', link: '#', internalApplySlug: 'hdfc', logo: '/assets/images/HDFC.png', brandColor: '#004c8f' },
        { bankName: 'Axis Bank', link: '#', internalApplySlug: 'axis', logo: '/assets/images/AX.png', brandColor: '#7b0046' },
    ],
    // Balance Transfer: 7 banks + 6 NBFCs
    'balance-transfer': [
        { bankName: 'ICICI Bank', link: '#', internalApplySlug: 'icici', logo: '/assets/images/partners/icici.jpg', brandColor: '#b6401e' },
        { bankName: 'IndusInd Bank', link: '#', internalApplySlug: 'indusind', logo: '/assets/images/partners/indusind.jpeg', brandColor: '#C4122E' },
        { bankName: 'YES Bank', link: '#', internalApplySlug: 'yes', logo: '/assets/images/partners/yes.png', brandColor: '#1e4f9c' },
        { bankName: 'IDFC First Bank', link: '#', internalApplySlug: 'idfc', logo: '/assets/images/partners/idfc.webp', brandColor: '#7a003c' },
        { bankName: 'Kotak Mahindra Bank', link: '#', internalApplySlug: 'kotak', logo: '/assets/images/Kotak-1.png', brandColor: '#d71920' },
        { bankName: 'HDFC Bank', link: '#', internalApplySlug: 'hdfc', logo: '/assets/images/HDFC.png', brandColor: '#004c8f' },
        { bankName: 'Axis Bank', link: '#', internalApplySlug: 'axis', logo: '/assets/images/AX.png', brandColor: '#7b0046' },
        { bankName: 'Bajaj Finserv', link: '#', internalApplySlug: 'bajaj', logo: '/assets/images/partners/bajaj.png', brandColor: '#0076b8' },
        { bankName: 'Tata Capital', link: '#', internalApplySlug: 'tata', logo: '/assets/images/partners/tata.png', brandColor: '#2b8fcb' },
        { bankName: 'Aditya Birla Capital', link: '#', internalApplySlug: 'adityabirla', logo: '/assets/images/partners/abfl.webp', brandColor: '#a02030' },
        { bankName: 'Cholamandalam', link: '#', internalApplySlug: 'cholamandalam', logo: '/assets/images/cholamandalam.png', brandColor: '#0d47a1' },
        { bankName: 'Poonawalla Fincorp', link: '#', internalApplySlug: 'poonawalla', logo: '/assets/images/partners/poonawalla.png', brandColor: '#1e88e5' },
        { bankName: 'Piramal Capital', link: '#', internalApplySlug: 'piramal', logo: '/assets/images/Piramal_Finance_logo.svg', brandColor: '#1565c0' },
    ],
    // Professional Loans: 7 banks + 6 NBFCs
    'professional-loans': [
        { bankName: 'ICICI Bank', link: '#', internalApplySlug: 'icici', logo: '/assets/images/partners/icici.jpg', brandColor: '#b6401e' },
        { bankName: 'IndusInd Bank', link: '#', internalApplySlug: 'indusind', logo: '/assets/images/partners/indusind.jpeg', brandColor: '#C4122E' },
        { bankName: 'YES Bank', link: '#', internalApplySlug: 'yes', logo: '/assets/images/partners/yes.png', brandColor: '#1e4f9c' },
        { bankName: 'IDFC First Bank', link: '#', internalApplySlug: 'idfc', logo: '/assets/images/partners/idfc.webp', brandColor: '#7a003c' },
        { bankName: 'Kotak Mahindra Bank', link: '#', internalApplySlug: 'kotak', logo: '/assets/images/Kotak-1.png', brandColor: '#d71920' },
        { bankName: 'HDFC Bank', link: '#', internalApplySlug: 'hdfc', logo: '/assets/images/HDFC.png', brandColor: '#004c8f' },
        { bankName: 'Axis Bank', link: '#', internalApplySlug: 'axis', logo: '/assets/images/AX.png', brandColor: '#7b0046' },
        { bankName: 'Bajaj Finserv', link: '#', internalApplySlug: 'bajaj', logo: '/assets/images/partners/bajaj.png', brandColor: '#0076b8' },
        { bankName: 'Tata Capital', link: '#', internalApplySlug: 'tata', logo: '/assets/images/partners/tata.png', brandColor: '#2b8fcb' },
        { bankName: 'Aditya Birla Capital', link: '#', internalApplySlug: 'adityabirla', logo: '/assets/images/partners/abfl.webp', brandColor: '#a02030' },
        { bankName: 'Cholamandalam', link: '#', internalApplySlug: 'cholamandalam', logo: '/assets/images/cholamandalam.png', brandColor: '#0d47a1' },
        { bankName: 'Poonawalla Fincorp', link: '#', internalApplySlug: 'poonawalla', logo: '/assets/images/partners/poonawalla.png', brandColor: '#1e88e5' },
        { bankName: 'Piramal Capital', link: '#', internalApplySlug: 'piramal', logo: '/assets/images/Piramal_Finance_logo.svg', brandColor: '#1565c0' },
    ],
}
