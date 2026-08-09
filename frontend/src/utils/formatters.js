/**
 * formatters.js — Shared formatting utilities for the MERN Frontend
 * Centralizes currency, price, area, and string formatting logic across the application.
 */

/**
 * Format numeric price into human-readable Indian currency string (e.g. ₹1.45 Cr, ₹75.00 L, ₹45,000/mo)
 * @param {number|string} price - Price value
 * @param {string} purpose - 'Buy' or 'Rent'
 * @param {string} fallback - Fallback string if price is invalid
 * @returns {string} Formatted price string
 */
export const formatPricePreview = (price, purpose = 'Buy', fallback = '₹0') => {
  const val = Number(price);
  if (!val || isNaN(val)) return fallback;

  if (purpose === 'Rent') {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L/mo`;
    return `₹${val.toLocaleString('en-IN')}/mo`;
  }

  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
  return `₹${val.toLocaleString('en-IN')}`;
};

/**
 * Format numeric area into formatted sq.ft string
 * @param {number|string} area - Area value
 * @returns {string} Formatted area string (e.g. "2,400 sq.ft.")
 */
export const formatAreaDisplay = (area) => {
  const num = parseInt(area, 10);
  if (!num || isNaN(num)) return '0 sq.ft.';
  return `${num.toLocaleString('en-IN')} sq.ft.`;
};

/**
 * Format Date into clean readable string (e.g. "08 Aug 2026")
 * @param {string|Date} dateInput
 * @returns {string}
 */
export const formatDateDisplay = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};
