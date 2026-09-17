/**
 * Precision Money & Currency Utilities for SplitPay
 *
 * ALL financial calculations are done in INTEGER PAISE (1 Rupee = 100 Paise)
 * to avoid IEEE 754 floating point arithmetic anomalies (e.g., 0.1 + 0.2 = 0.30000000000000004).
 */

/**
 * Converts an INR rupee amount (string or number) into integer paise.
 * Uses exact string parsing to prevent any floating point rounding artifacts.
 *
 * @param {string|number} rupees
 * @returns {number} integer paise
 */
export function toPaise(rupees) {
  if (rupees === null || rupees === undefined || rupees === '') {
    return 0;
  }

  const cleanStr = String(rupees).trim().replace(/,/g, '');
  if (!cleanStr || isNaN(Number(cleanStr))) {
    return 0;
  }

  const isNegative = cleanStr.startsWith('-');
  const unsignedStr = isNegative ? cleanStr.slice(1) : cleanStr;

  const parts = unsignedStr.split('.');
  const wholePart = parseInt(parts[0] || '0', 10);

  let fracPart = 0;
  if (parts.length > 1) {
    // Take up to 2 decimal places, pad with trailing zeros
    const rawFrac = (parts[1] || '').padEnd(2, '0').slice(0, 2);
    fracPart = parseInt(rawFrac, 10);
  }

  const totalPaise = wholePart * 100 + fracPart;
  return isNegative ? -totalPaise : totalPaise;
}

/**
 * Converts integer paise back to a standard Rupee decimal number.
 *
 * @param {number} paise
 * @returns {number}
 */
export function toRupees(paise) {
  if (!paise || isNaN(paise)) return 0;
  return Math.round(paise) / 100;
}

/**
 * Converts integer paise to a Rupee string suitable for UPI URIs (e.g., "1999" or "1999.50")
 * Does not include comma formatting or currency symbol.
 *
 * @param {number} paise
 * @returns {string}
 */
export function toUpiAmountString(paise) {
  const safePaise = Math.max(0, Math.round(paise || 0));
  const rupees = Math.floor(safePaise / 100);
  const remainder = safePaise % 100;

  if (remainder === 0) {
    return `${rupees}`;
  }
  return `${rupees}.${remainder.toString().padStart(2, '0')}`;
}

/**
 * Formats an amount in integer paise using the Indian numbering system (e.g. ₹1,00,000 or ₹1,999.50)
 *
 * @param {number} paise - Amount in integer paise
 * @param {boolean} forceDecimals - Whether to always show two decimal places
 * @returns {string}
 */
export function formatINR(paise, forceDecimals = false) {
  const safePaise = Math.round(paise || 0);
  const isNegative = safePaise < 0;
  const absPaise = Math.abs(safePaise);

  const rupees = Math.floor(absPaise / 100);
  const remainder = absPaise % 100;

  // Format the whole number part with Indian numbering system (Lakhs & Crores)
  const rupeeStr = rupees.toString();
  let formattedRupees = '';

  if (rupeeStr.length <= 3) {
    formattedRupees = rupeeStr;
  } else {
    const lastThree = rupeeStr.substring(rupeeStr.length - 3);
    const otherNumbers = rupeeStr.substring(0, rupeeStr.length - 3);
    formattedRupees = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }

  let result = (isNegative ? '-' : '') + '₹' + formattedRupees;

  if (forceDecimals || remainder > 0) {
    result += '.' + remainder.toString().padStart(2, '0');
  }

  return result;
}

/**
 * Validates whether an amount string is a valid positive financial amount
 *
 * @param {string|number} value
 * @param {number} maxRupees - Upper safety ceiling (defaults to 10,00,000 for standard UPI transactions)
 * @returns {{ isValid: boolean, error: string|null }}
 */
export function validateAmount(value, maxRupees = 1000000) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return { isValid: false, error: 'Please enter a total amount.' };
  }

  const clean = String(value).trim().replace(/,/g, '');
  if (!/^\d+(\.\d{1,2})?$/.test(clean)) {
    return { isValid: false, error: 'Please enter a valid numeric amount (up to 2 decimal places).' };
  }

  const paise = toPaise(clean);
  if (paise <= 0) {
    return { isValid: false, error: 'Amount must be greater than ₹0.' };
  }

  const maxPaise = maxRupees * 100;
  if (paise > maxPaise) {
    return { isValid: false, error: `Amount cannot exceed ${formatINR(maxPaise)}.` };
  }

  return { isValid: true, error: null };
}

