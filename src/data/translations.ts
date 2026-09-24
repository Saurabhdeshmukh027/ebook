/**
 * Shared translation strings used across multiple components.
 *
 * Component-specific translations remain in each component's own CONTENT dictionary.
 * This file handles strings that appear in multiple places or need cross-component reuse.
 *
 * Brand terms kept as-is: E-PavtiBook, Digital Pavti, Navratri, Mandal, UPI
 */

import type { Language } from '../types';

export const COMMON = {
  en: {
    // Navigation & CTAs
    getStarted: 'Get Started',
    closeMenu: 'Close menu',
    openMenu: 'Open menu',

    // Digital Pavti showcase (shared across BenefitPavti, DigitalPavtiTransform)
    digitalPavti: 'Digital Pavti',
    donor: 'Donor',
    amount: 'Amount',
    purpose: 'Purpose',
    mode: 'Mode',
    share: 'Share',
    download: 'Download',
    sharePavtiAriaLabel: 'Share digital pavti',
    downloadPdfAriaLabel: 'Download PDF',
    donorCopy: 'Donor copy',
    mandalCopy: 'Mandal copy',

    // Sample data / illustrative
    sampleDataNote: 'Sample data — illustrative only',
    recordedInEpavtibook: 'Recorded in E-PavtiBook',

    // Balance / Expense totals
    totalExpense: 'TOTAL EXPENSE',
    collectionTotal: 'COLLECTION TOTAL',
    collection: 'COLLECTION',
    expenses: 'EXPENSES',
    balance: 'BALANCE',
    pavti: 'PAVTI',
    expense: 'EXPENSE',

    // Balance note
    balanceNote: 'Every rupee accounted for. Every donor can verify. Every committee member can trust.',

    // Transform captions
    captionPaper: 'Traditional paper pavti — tactile, trusted, familiar',
    captionTransition: 'Light passes through — information reorganizes',
    captionDigital: 'E-PavtiBook digital pavti — same trust, transparent record',

    // BenefitPayments plan preview cards
    gold: 'Gold',
    platinum: 'Platinum',
    perSeason: '/ season',
    goldFeatures: 'Digital Pavti + Collection + Expenses + Balance + <strong>Online Payments</strong>',
    platinumFeatures: 'Gold + <strong>Multi-device sync</strong> + <strong>Priority support</strong>',

    // Page meta
    pageTitle: 'E-PavtiBook | Digital Pavti for Devi Mandals',
    metaDescription: 'E-PavtiBook - Digital Pavti & Transparent Accounting for Navratri Devi Mandals',

    // Accessibility
    unifiedRecordAriaLabel: 'Unified E-PavtiBook record showing all four components',
  },
  mr: {
    getStarted: 'सुरू करा',
    closeMenu: 'मेनू बंद करा',
    openMenu: 'मेनू उघडा',

    digitalPavti: 'डिजिटल पावती',
    donor: 'देणीदार',
    amount: 'रक्कम',
    purpose: 'उद्देश',
    mode: 'पद्धत',
    share: 'शेअर करा',
    download: 'डाउनलोड',
    sharePavtiAriaLabel: 'डिजिटल पावती शेअर करा',
    downloadPdfAriaLabel: 'PDF डाउनलोड करा',
    donorCopy: 'देणीदाराची प्रत',
    mandalCopy: 'मंडळाची प्रत',

    sampleDataNote: 'नमुना माहिती — केवळ स्पष्टीकरणासाठी',
    recordedInEpavtibook: 'E-PavtiBook मध्ये नोंदले',

    totalExpense: 'एकूण खर्च',
    collectionTotal: 'एकूण संकलन',
    collection: 'संकलन',
    expenses: 'खर्च',
    balance: 'शिल्लक',
    pavti: 'पावती',
    expense: 'खर्च',

    balanceNote: 'प्रत्येक रुपयाचा हिशोब. प्रत्येक देणीदार तपासू शकतो. प्रत्येक कमिटी सदस्य विश्वास ठेवू शकतो.',

    captionPaper: 'पारंपरिक कागदी पावती — स्पर्शनीय, विश्वासार्ह, परिचित',
    captionTransition: 'प्रकाश पार होतो — माहिती पुनर्रचित होते',
    captionDigital: 'E-PavtiBook डिजिटल पावती — तोच विश्वास, पारदर्शक नोंद',

    gold: 'गोल्ड',
    platinum: 'प्लॅटिनम',
    perSeason: '/ हंगाम',
    goldFeatures: 'डिजिटल पावती + संकलन + खर्च + शिल्लक + <strong>ऑनलाइन पेमेंट</strong>',
    platinumFeatures: 'गोल्ड + <strong>मल्टी-डिव्हाइस सिंक</strong> + <strong>प्राधान्य सपोर्ट</strong>',

    pageTitle: 'E-PavtiBook | देवी मंडळांसाठी डिजिटल पावती',
    metaDescription: 'E-PavtiBook — नवरात्री देवी मंडळांसाठी डिजिटल पावती आणि पारदर्शक हिशोब',

    unifiedRecordAriaLabel: 'E-PavtiBook एकत्रित रेकॉर्ड — चारही घटक दाखवतो',
  },
  hi: {
    getStarted: 'शुरू करें',
    closeMenu: 'मेनू बंद करें',
    openMenu: 'मेनू खोलें',

    digitalPavti: 'डिजिटल पावती',
    donor: 'दाता',
    amount: 'राशि',
    purpose: 'उद्देश्य',
    mode: 'माध्यम',
    share: 'शेयर करें',
    download: 'डाउनलोड',
    sharePavtiAriaLabel: 'डिजिटल पावती शेयर करें',
    downloadPdfAriaLabel: 'PDF डाउनलोड करें',
    donorCopy: 'दाता की प्रति',
    mandalCopy: 'मंडल की प्रति',

    sampleDataNote: 'नमूना डेटा — केवल उदाहरण के लिए',
    recordedInEpavtibook: 'E-PavtiBook में दर्ज',

    totalExpense: 'कुल खर्च',
    collectionTotal: 'कुल संग्रह',
    collection: 'संग्रह',
    expenses: 'खर्च',
    balance: 'बैलेंस',
    pavti: 'पावती',
    expense: 'खर्च',

    balanceNote: 'हर रुपये का हिसाब। हर दाता सत्यापित कर सकता है। हर कमेटी सदस्य विश्वास रख सकता है।',

    captionPaper: 'पारंपरिक कागजी पावती — स्पर्श योग्य, विश्वसनीय, परिचित',
    captionTransition: 'प्रकाश गुजरता है — जानकारी पुनर्गठित होती है',
    captionDigital: 'E-PavtiBook डिजिटल पावती — वही विश्वास, पारदर्शक रिकॉर्ड',

    gold: 'गोल्ड',
    platinum: 'प्लॅटिनम',
    perSeason: '/ सीजन',
    goldFeatures: 'डिजिटल पावती + संग्रह + खर्च + बैलेंस + <strong>ऑनलाइन भुगतान</strong>',
    platinumFeatures: 'गोल्ड + <strong>मल्टी-डिवाइस सिंक</strong> + <strong>प्राथमिकता सपोर्ट</strong>',

    pageTitle: 'E-PavtiBook | देवी मंडलों के लिए डिजिटल पावती',
    metaDescription: 'E-PavtiBook — नवरात्रि देवी मंडलों के लिए डिजिटल पावती और पारदर्शक हिसाब',

    unifiedRecordAriaLabel: 'E-PavtiBook एकीकृत रिकॉर्ड — सभी चार घटक दिखाता है',
  },
} as const;

/** Type-safe accessor for common translations */
export type CommonTranslations = typeof COMMON.en;

/** Helper to get translations for a given language */
export function t(language: Language) {
  return COMMON[language];
}
