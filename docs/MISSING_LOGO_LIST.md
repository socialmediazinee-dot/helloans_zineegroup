# Missing logos across the website

Checked all logo/image paths referenced in the codebase against `public/`.

---

## Total missing: **1**

| # | Referenced path | Used for | Note |
|---|-----------------|----------|------|
| 1 | `/assets/images/partners/yes.png` | YES Bank (bankOffers, tiles, education-loans, etc.) | File does not exist. YES Bank logo exists at `/assets/banks/yes-bank-logo-png.png` (used only on apply page). |

---

## Fix

Either:

1. **Add the file:**  
   Save the YES Bank logo as  
   `public/assets/images/partners/yes.png`  
   so all references (BankList, loan tiles, etc.) resolve.

2. **Or point code to existing asset:**  
   Change every reference from  
   `'/assets/images/partners/yes.png'`  
   to  
   `'/assets/banks/yes-bank-logo-png.png'`  
   in `data/bankOffers.ts` (and anywhere else that uses the partners path).

---

## Intentionally no logo (not missing files)

- **LIC Axis** (InstantLoanSlide credit card) – `logo: null`
- **Magnet** (InstantLoanSlide credit card) – `logo: null`  

These use the first-letter fallback in the UI; no logo file is expected.

---

## All other logos present

All other referenced logos exist under `public/`, including:

- Header: `Logo-Helloans.png`
- Partners section: CB, AX, HDFC, Kotak-1, PNB, BOB
- Loan tiles: `loan-tiles-icons.png`, all `/assets/icons/*.png`
- Apply page: icici, indusind, yes-bank-logo-png (banks), idfc, Kotak-1, HDFC, AX, bajaj, au, abfl, hdfc_form
- bankOffers / InstantLoanSlide: indusind, bajaj, unity, hero, prefer, poonawalla, incred, dmi, fi, idfc, protium, muthoot, abfl, popcard, BOB, federal, au, kiwi, tataneu, SBI, scapia, magnifi, tata, jio, etc.
- Social: linkedin, instagram, facebook, youtube
