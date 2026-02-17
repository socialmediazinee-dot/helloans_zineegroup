export interface Bank {
    id: string
    name: string
    applicationUrl: string
    interestRate: number
    processingFee: string
    minAmount: number
    maxAmount: number
    minTenure: number
    maxTenure: number
    maxLoanAmount: number
    eligibility: string[]
    features: string[]
    eligibilityDetails: {
        age: string
        employment: string[]
        workExperience: string
        income: string
        documents: string[]
    }
}

const createBank = (id: string, name: string, url: string): Bank => ({
    id,
    name,
    applicationUrl: url,
    interestRate: 10.5, // Default placeholder
    processingFee: 'Contact for details',
    minAmount: 50000,
    maxAmount: 5000000,
    minTenure: 1,
    maxTenure: 5,
    maxLoanAmount: 5000000,
    eligibility: ['Salaried & Self-employed', 'Age: 21-60 years'],
    features: ['Quick Approval', 'Online Process'],
    eligibilityDetails: {
        age: '21-60 years',
        employment: ['Salaried', 'Self-employed'],
        workExperience: '1+ years',
        income: 'Min ₹15,000/mo',
        documents: ['PAN', 'Aadhaar', 'Bank Statements']
    }
})

export const personalLoanPartners: Bank[] = [
    createBank('indusind', 'IndusInd Bank', 'https://induseasycredit.indusind.com/customer/personal-loan/new-lead?utm_source=assisted&utm_medium=IBLV899&utm_campaign=Personal-Loan&utm_content=1'),
    createBank('bajaj', 'Bajaj Finserv', 'https://www.bajajfinservmarkets.in/apply-for-personal-loan-finservmarkets/?utm_source=B2B&utm_medium=E-referral&utm_campaign=OA&utm_content=MYMONEYMANTRA_FINTECH_PRIVATE_LIMITED'),
    createBank('unity', 'Unity Bank', 'https://loans.theunitybank.com/unity-pl-ui/page/exclusion/login/logindetails?utm_source=partnership&utm_medium=mymoneymantra&utm_campaign=ENT-941530'),
    createBank('hero', 'Hero Fincorp', 'https://hipl.onelink.me/1OrE?af_ios_url=https%3A%2F%2Floans.apps.herofincorp.com%2Fen%2Fpersonal-loan&af_android_url=https%3A%2F%2Floans.apps.herofincorp.com%2Fen%2Fpersonal-loan&af_web_dp=https%3A%2F%2Floans.apps.herofincorp.com%2Fen%2Fpersonal-loan&af_xp=custom&pid=Mymoneymantra&is_retargeting=true&af_reengagement_window=30d&c=Mymoneymantra&utm_source=partnership&utm_campaign=mymoneymantra&utm_content=ENT&utm_medium=MMMENT941530'),
    createBank('creditvidya', 'CreditVidya (Prefer)', 'https://marketplace.creditvidya.com/mymoneymantra?utm_source=EARNTRA_941530'),
    createBank('poonawalla', 'Poonawalla Fincorp', 'https://poonawalla.mymoneymantra.com/?sms=false&btb=true&utm_source=pnwpl&utm_medium=mmm&utm_campaign=pnwpl-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5'),
    createBank('incred', 'Incred', 'https://incredpl.mymoneymantra.com?btb=true&utm_source=incred&utm_medium=mmm&utm_campaign=incred-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5'),
    createBank('dmi', 'DMI Finance', 'https://dmi.mymoneymantra.com/?sms=false&btb=true&utm_source=dmipl&utm_medium=mmm&utm_campaign=dmipl-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5'),
    createBank('fimoney', 'Fi Money', 'https://fimoney.mymoneymantra.com/?sms=false&btb=true&utm_source=fimnpl&utm_medium=mmm&utm_campaign=fimnpl-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5'),
    createBank('idfc', 'IDFC FIRST Bank', 'https://idfcfirstpl.mymoneymantra.com?sms=false&btb=true&utm_source=idfcpl&utm_medium=mmm&utm_campaign=idfcpl-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5'),
    createBank('protium', 'Protium', 'https://protium.mymoneymantra.com/?sms=false&btb=true&utm_source=protium&utm_medium=mmm&utm_campaign=protium-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5'),
    createBank('muthoot', 'Muthoot Finance', 'https://muthoot.mymoneymantra.com/?sms=false&btb=true&v1=EDI&utm_source=medi&utm_medium=mmm&utm_campaign=medi-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5'),
]

export const businessLoanPartners: Bank[] = [
    createBank('abfl', 'Aditya Birla Finance (ABFL)', 'https://abflbl.mymoneymantra.com/?btb=true&utm_source=abfl&utm_medium=mmm&utm_campaign=abfl-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5'),
    createBank('tatacapital', 'Tata Capital', 'https://tatacapitalbl.mymoneymantra.com/?sms=false&btb=true&utm_source=tatabl&utm_medium=mmm&utm_campaign=tatabl-mmm-941530&pid=Y2VjZmM3MjAtZjk5OS0xMWVlLTgyYjktMDdlOGJkMWUzOTA5'),
]
