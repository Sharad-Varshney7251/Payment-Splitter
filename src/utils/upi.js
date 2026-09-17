/**
 * UPI Protocol, URI Generation & Validation Utilities
 */

import { toUpiAmountString } from './currency.js';

/**
 * Validates the syntactic structure of a UPI Virtual Payment Address (VPA).
 * Note: Client-side regex verifies format only; it does not and cannot verify
 * bank account existence or active registration without banking API access.
 *
 * @param {string} upiId
 * @returns {{ isValid: boolean, error: string|null }}
 */
export function validateUpiId(upiId) {
  if (!upiId || typeof upiId !== 'string' || upiId.trim() === '') {
    return {
      isValid: false,
      error: 'UPI ID is required.'
    };
  }

  const trimmed = upiId.trim();

  // Standard UPI VPA format: [username]@[bankhandle]
  // Username: letters, numbers, dots, hyphens, underscores (2-256 chars)
  // Bank handle: letters (2-64 chars)
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

  if (!upiRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Invalid UPI ID format. Expected format: username@bankhandle (e.g. merchant@upi or user@okicici).'
    };
  }

  return { isValid: true, error: null };
}

/**
 * Constructs a compliant UPI payment deep-link URI.
 *
 * Specification:
 * upi://pay?pa={vpa}&pn={name}&am={amount}&cu=INR&tn={note}
 *
 * All parameters are strictly RFC 3986 encoded to prevent injection or malformed URIs.
 *
 * @param {Object} options
 * @param {string} options.upiId - Recipient UPI VPA (required)
 * @param {number} options.amountPaise - Payment amount in integer paise (required)
 * @param {string} [options.payeeName] - Legal or display name of recipient
 * @param {string} [options.note] - Transaction remark or note
 * @returns {string}
 */
export function generateUpiUri({ upiId, amountPaise, payeeName = '', note = '' }) {
  if (!upiId) throw new Error('UPI ID is required for generating a payment URI.');

  const params = new URLSearchParams();

  // Payee Address
  params.set('pa', upiId.trim());

  // Payee Name (optional but recommended for user confirmation)
  if (payeeName && payeeName.trim()) {
    params.set('pn', payeeName.trim());
  }

  // Payment Amount
  params.set('am', toUpiAmountString(amountPaise));

  // Currency Code (INR)
  params.set('cu', 'INR');

  // Transaction Note
  if (note && note.trim()) {
    params.set('tn', note.trim());
  }

  return `upi://pay?${params.toString()}`;
}

/**
 * Detects whether the current client device is likely a mobile device.
 *
 * @returns {boolean}
 */
export function isMobileDevice() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

/**
 * Attempts to launch a UPI application via deep link.
 * On desktop environments, notifies user to scan the QR code instead.
 *
 * @param {string} upiUri
 * @returns {{ launched: boolean, reason?: string }}
 */
export function launchUpiApp(upiUri) {
  if (!isMobileDevice()) {
    return {
      launched: false,
      reason: 'UPI deep-links are primarily supported on mobile devices with UPI apps installed. Please scan the QR code above using PhonePe, Google Pay, Paytm, or BHIM.'
    };
  }

  try {
    window.location.href = upiUri;
    return { launched: true };
  } catch (err) {
    return {
      launched: false,
      reason: 'Could not open UPI app automatically. Please scan the QR code instead.'
    };
  }
}
