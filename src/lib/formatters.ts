/**
 * Currency & numerical formatters following Indian numbering system (Lakhs / Crores).
 */
export const formatAmount = (amount: number): string =>
  '₹' + amount.toLocaleString('en-IN');
