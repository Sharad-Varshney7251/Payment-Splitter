/**
 * QR Code Rendering and Export Utility for SplitPay
 */

import QRCode from 'qrcode';

/**
 * Default QR code styling options
 */
export const QR_DEFAULT_OPTIONS = {
  errorCorrectionLevel: 'M',
  margin: 2,
  width: 280,
  color: {
    dark: '#0F172A',
    light: '#FFFFFF'
  }
};

/**
 * Renders a UPI payment URI directly onto an HTML5 Canvas element.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {string} upiUri
 * @param {Object} [customOptions]
 * @returns {Promise<void>}
 */
export async function renderQrToCanvas(canvas, upiUri, customOptions = {}) {
  if (!canvas || !upiUri) return;

  const options = {
    ...QR_DEFAULT_OPTIONS,
    ...customOptions
  };

  try {
    await QRCode.toCanvas(canvas, upiUri, options);
  } catch (err) {
    console.error('Failed to render QR to canvas:', err);
    throw new Error('Unable to render QR code.');
  }
}

/**
 * Generates a high-resolution PNG data URL for the given UPI URI.
 *
 * @param {string} upiUri
 * @param {number} [width=512]
 * @returns {Promise<string>}
 */
export async function generateQrDataUrl(upiUri, width = 512) {
  try {
    return await QRCode.toDataURL(upiUri, {
      ...QR_DEFAULT_OPTIONS,
      width,
      margin: 3
    });
  } catch (err) {
    console.error('Failed to generate QR data URL:', err);
    throw new Error('Unable to generate QR image.');
  }
}

/**
 * Triggers a real browser download of the QR code as a PNG file.
 *
 * @param {string} upiUri
 * @param {string} filename - e.g. "splitpay-payment-1.png"
 * @returns {Promise<boolean>}
 */
export async function downloadQrImage(upiUri, filename = 'splitpay-payment.png') {
  try {
    const dataUrl = await generateQrDataUrl(upiUri, 600);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Error downloading QR code:', err);
    return false;
  }
}

