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

/** Only 7 banks (ICICI, IndusInd, YES, IDFC, Kotak, HDFC, Axis) + 3 NBFCs (Bajaj Finserv, Tata Capital, Aditya Birla Finance). Each category shows only those that offer that product. */
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
    ],
    // Business Loans: only ready-made (Poonawalla) + self-created (IDFC) – no random links
    'business-loans': [
        {
            bankName: 'IDFC First Bank',
            link: '#',
            internalApplySlug: 'idfc',
            logo: '/assets/images/partners/idfc.webp',
            brandColor: '#7a003c',
        },
        {
            bankName: 'Poonawalla',
            link: 'https://poonawalla.mymoneymantra.com/?sms=false&btb=true&utm_source=pnwpl&utm_medium=mmm&utm_campaign=pnwpl-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5',
            logo: '/assets/images/partners/poonawalla.png',
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
    // Home Loans: all 7 banks use self-created bank page (internal apply)
    'home-loans': [
        { bankName: 'HDFC Bank', link: '#', internalApplySlug: 'hdfc', logo: '/assets/images/HDFC.png', brandColor: '#004c8f' },
        { bankName: 'ICICI Bank', link: '#', internalApplySlug: 'icici', logo: '/assets/images/partners/icici.jpg', brandColor: '#b6401e' },
        { bankName: 'Axis Bank', link: '#', internalApplySlug: 'axis', logo: '/assets/images/AX.png', brandColor: '#7b0046' },
        { bankName: 'Kotak Mahindra Bank', link: '#', internalApplySlug: 'kotak', logo: '/assets/images/Kotak-1.png', brandColor: '#d71920' },
        { bankName: 'IDFC First Bank', link: '#', internalApplySlug: 'idfc', logo: '/assets/images/partners/idfc.webp', brandColor: '#7a003c' },
        { bankName: 'IndusInd Bank', link: '#', internalApplySlug: 'indusind', logo: '/assets/images/partners/indusind.jpeg', brandColor: '#C4122E' },
        { bankName: 'YES Bank', link: '#', internalApplySlug: 'yes', logo: '/assets/images/partners/yes.png', brandColor: '#1e4f9c' },
    ],
    // Gold Loan: HDFC + one from carousel (Muthoot – business loan slide, gold loan NBFC)
    'gold-loans': [
        {
            bankName: 'HDFC Bank',
            link: 'https://www.hdfc.bank.in/loans/gold-loan',
            logo: '/assets/images/HDFC.png',
            brandColor: '#004c8f',
        },
        {
            bankName: 'Muthoot',
            link: 'https://muthoot.mymoneymantra.com/?sms=false&btb=true&v1=EDI&utm_source=medi&utm_medium=mmm&utm_campaign=medi-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5',
            logo: '/assets/images/partners/muthoot.png',
        },
    ],
    'education-loans': [
        {
            bankName: 'HDFC Bank',
            link: 'https://www.hdfc.bank.in/loans/education-loan',
            logo: '/assets/images/HDFC.png',
            brandColor: '#004c8f',
        },
        {
            bankName: 'ICICI Bank',
            link: 'https://www.icicibank.com/education-loan',
            logo: '/assets/images/partners/icici.jpg',
            brandColor: '#b6401e',
        },
        {
            bankName: 'Axis Bank',
            link: 'https://www.axisbank.com/retail/loans/education-loan',
            logo: '/assets/images/AX.png',
            brandColor: '#7b0046',
        },
        {
            bankName: 'Kotak Mahindra Bank',
            link: 'https://www.kotak.com/en/personal-banking/loans/education-loan.html',
            logo: '/assets/images/Kotak-1.png',
            brandColor: '#d71920',
        },
        {
            bankName: 'IDFC First Bank',
            link: 'https://www.idfcfirstbank.com/education-loan',
            logo: '/assets/images/partners/idfc.webp',
            brandColor: '#7a003c',
        },
        {
            bankName: 'IndusInd Bank',
            link: 'https://www.indusind.com/in/en/personal/loans/education-loan.html',
            logo: '/assets/images/partners/indusind.jpeg',
            brandColor: '#C4122E',
        },
        {
            bankName: 'YES Bank',
            link: 'https://www.yesbank.in/retail-banking/loans/education-loan',
            logo: '/assets/images/partners/yes.png',
            brandColor: '#1e4f9c',
        },
        {
            bankName: 'Tata Capital',
            link: 'https://www.tatacapital.com/education-loan',
            logo: '/assets/images/partners/tata.png',
            brandColor: '#2b8fcb',
        },
        {
            bankName: 'Aditya Birla Finance',
            link: 'https://www.adityabirlacapital.com/loans/education-loan',
            logo: '/assets/images/partners/abfl.webp',
            brandColor: '#a02030',
        },
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
            bankName: 'AU Bank',
            link: 'https://aucc.mymoneymantra.com/?sms=false&btb=true&utm_source=aucc&utm_medium=mmm&utm_campaign=aucc-mmm-941530',
            logo: '/assets/images/partners/au.png',
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
        },
        {
            bankName: 'Magnet',
            link: 'https://magnetcard.mymoneymantra.com/?sms=false&btb=true&utm_source=mfdcc&utm_medium=mmm&utm_campaign=mfdcc-mmm-941530',
        },
    ],
    // Insurance: all 7 banks use self-created bank page (internal apply)
    'insurance': [
        { bankName: 'HDFC Bank', link: '#', internalApplySlug: 'hdfc', logo: '/assets/images/HDFC.png', brandColor: '#004c8f' },
        { bankName: 'ICICI Bank', link: '#', internalApplySlug: 'icici', logo: '/assets/images/partners/icici.jpg', brandColor: '#b6401e' },
        { bankName: 'Axis Bank', link: '#', internalApplySlug: 'axis', logo: '/assets/images/AX.png', brandColor: '#7b0046' },
        { bankName: 'Kotak Mahindra Bank', link: '#', internalApplySlug: 'kotak', logo: '/assets/images/Kotak-1.png', brandColor: '#d71920' },
        { bankName: 'IndusInd Bank', link: '#', internalApplySlug: 'indusind', logo: '/assets/images/partners/indusind.jpeg', brandColor: '#C4122E' },
        { bankName: 'IDFC First Bank', link: '#', internalApplySlug: 'idfc', logo: '/assets/images/partners/idfc.webp', brandColor: '#7a003c' },
        { bankName: 'YES Bank', link: '#', internalApplySlug: 'yes', logo: '/assets/images/partners/yes.png', brandColor: '#1e4f9c' },
    ],
    // Overdraft: only 3 – Bajaj, AU Small Finance Bank, Aditya Birla – all use self-created bank page
    'overdraft': [
        { bankName: 'Bajaj Finserv', link: '#', internalApplySlug: 'bajaj', logo: '/assets/images/partners/bajaj.png', brandColor: '#0076b8' },
        { bankName: 'AU Small Finance Bank', link: '#', internalApplySlug: 'au', logo: '/assets/images/partners/au.png', brandColor: '#0076b8' },
        { bankName: 'Aditya Birla Finance', link: '#', internalApplySlug: 'adityabirla', logo: '/assets/images/partners/abfl.webp', brandColor: '#a02030' },
    ],
    // Secure Loans: only 7 banks (all self-created) – removed random-link NBFCs
    'secure-loans': [
        { bankName: 'ICICI Bank', link: '#', internalApplySlug: 'icici', logo: '/assets/images/partners/icici.jpg', brandColor: '#b6401e' },
        { bankName: 'IndusInd Bank', link: '#', internalApplySlug: 'indusind', logo: '/assets/images/partners/indusind.jpeg', brandColor: '#C4122E' },
        { bankName: 'YES Bank', link: '#', internalApplySlug: 'yes', logo: '/assets/images/partners/yes.png', brandColor: '#1e4f9c' },
        { bankName: 'IDFC First Bank', link: '#', internalApplySlug: 'idfc', logo: '/assets/images/partners/idfc.webp', brandColor: '#7a003c' },
        { bankName: 'Kotak Mahindra Bank', link: '#', internalApplySlug: 'kotak', logo: '/assets/images/Kotak-1.png', brandColor: '#d71920' },
        { bankName: 'HDFC Bank', link: '#', internalApplySlug: 'hdfc', logo: '/assets/images/HDFC.png', brandColor: '#004c8f' },
        { bankName: 'Axis Bank', link: '#', internalApplySlug: 'axis', logo: '/assets/images/AX.png', brandColor: '#7b0046' },
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
}
