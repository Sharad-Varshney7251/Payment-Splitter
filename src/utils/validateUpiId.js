/**
 * UPI Virtual Payment Address (VPA) Format Validation
 */

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

