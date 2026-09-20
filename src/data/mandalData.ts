/**
 * Centralized mock data & financial figures for E-PavtiBook landing demonstrations.
 * Ensures consistent figures across narrative (ProductStory) and feature (MandalBenefits) sections.
 */

export const MANDAL_FINANCES = {
  finalCollection: 256850,
  finalExpense: 27200,
  get finalBalance() {
    return this.finalCollection - this.finalExpense; // 229650
  },
} as const;

export const SAMPLE_PAVTI = {
  receiptNo: 'EP-2026-001247',
  donorName: 'Amit Deshmukh',
  donorNameMr: 'अमित देशमुख',
  donorNameHi: 'अमित देशमुख',
  amount: 1100,
  mandalName: 'Shri Shiv Chhatrapati Mandal',
  mandalNameMr: 'श्री शिव छत्रपती मंडळ',
  mandalNameHi: 'श्री शिव छत्रपति मंडल',
} as const;

export const SACRED_QUOTES = {
  mr: 'श्रद्धा जिथे आहे, तिथे हिशोबही स्पष्ट असावा.',
  hi: 'जहाँ श्रद्धा है, वहाँ हिसाब भी स्पष्ट होना चाहिए।',
} as const;
