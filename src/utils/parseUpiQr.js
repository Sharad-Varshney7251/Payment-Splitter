/**
 * QR Content Detection and UPI Protocol Parser
 *
 * Inspects decoded QR strings, identifies UPI payment URIs,
 * extracts parameters safely, and categorizes non-UPI QR contents.
 */

import { validateUpiId } from './validateUpiId.js';

/**
 * Safely parses any decoded QR text.
 *
 * @param {string} rawText
 * @returns {{
 *   isUpi: boolean,
 *   type: 'upi' | 'url' | 'text',
 *   data?: {
 *     upiId: string,
 *     payeeName: string,
 *     amount: string | null,
 *     currency: string,
 *     note: string,
 *     ref: string,
 *     merchantCode: string,
 *     raw: string
 *   },
 *   error?: string,
 *   content?: string
 * }}
 */
export function parseQrContent(rawText) {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    return {
      isUpi: false,
      type: 'text',
      content: '',
      error: 'Empty or invalid QR content.'
    };
  }

  const trimmed = rawText.trim();

  // Check if content matches standard UPI payment protocol scheme
  const isUpiScheme = /^upi:\/\/pay(\?|\/|$)/i.test(trimmed) || /^upi:\/\//i.test(trimmed);

  if (isUpiScheme) {
    try {
      // Extract the query parameters portion
      const queryIndex = trimmed.indexOf('?');
      if (queryIndex === -1) {
        return {
          isUpi: true,
          type: 'upi',
          error: 'UPI QR code is missing payment parameters.',
          data: { raw: trimmed }
        };
      }

      const queryString = trimmed.slice(queryIndex + 1);
      const params = new URLSearchParams(queryString);

      const rawUpiId = params.get('pa') || '';
      const rawPayeeName = params.get('pn') || '';
      const rawAmount = params.get('am') || '';
      const rawCurrency = params.get('cu') || 'INR';
      const rawNote = params.get('tn') || '';
      const rawRef = params.get('tr') || '';
      const rawMerchantCode = params.get('mc') || '';

      const upiId = decodeSafe(rawUpiId).trim();
      const payeeName = decodeSafe(rawPayeeName).trim();
      const amount = rawAmount ? decodeSafe(rawAmount).trim() : null;
      const currency = decodeSafe(rawCurrency).trim() || 'INR';
      const note = decodeSafe(rawNote).trim();
      const ref = decodeSafe(rawRef).trim();
      const merchantCode = decodeSafe(rawMerchantCode).trim();

      // Validate UPI ID presence and format
      if (!upiId) {
        return {
          isUpi: true,
          type: 'upi',
          error: 'Scanned UPI QR is missing the payee UPI ID (pa).',
          data: { raw: trimmed }
        };
      }

      const validation = validateUpiId(upiId);
      if (!validation.isValid) {
        return {
          isUpi: true,
          type: 'upi',
          error: `Scanned UPI ID "${upiId}" has an invalid format.`,
          data: {
            upiId,
            payeeName,
            amount,
            currency,
            note,
            ref,
            merchantCode,
            raw: trimmed
          }
        };
      }

      return {
        isUpi: true,
        type: 'upi',
        data: {
          upiId,
          payeeName,
          amount: amount && !isNaN(Number(amount)) && Number(amount) > 0 ? amount : null,
          currency,
          note,
          ref,
          merchantCode,
          raw: trimmed
        }
      };
    } catch (err) {
      return {
        isUpi: true,
        type: 'upi',
        error: 'Malformed UPI payment URI in QR code.',
        data: { raw: trimmed }
      };
    }
  }

  // Non-UPI QR: identify whether it is a URL or general text
  const isUrl = /^https?:\/\//i.test(trimmed);

  return {
    isUpi: false,
    type: isUrl ? 'url' : 'text',
    content: trimmed
  };
}

/**
 * Safe URI component decoding helper that prevents malformed URI errors
 *
 * @param {string} str
 * @returns {string}
 */
function decodeSafe(str) {
  if (!str) return '';
  try {
    // Replace '+' with space first if standard query string format
    return decodeURIComponent(str.replace(/\+/g, ' '));
  } catch (_) {
    return str;
  }
}

