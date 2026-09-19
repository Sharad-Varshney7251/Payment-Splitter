# SplitPay — Smart Payment Splitter

> **Smart payment splitting, made simple.**  
> A client-side, fintech-grade payment splitting and UPI QR code generator built with React, Vite, and Tailwind CSS.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

---

## 1. Overview

**SplitPay** is a utility designed to break down a total financial amount into multiple manageable parts and instantly produce individual, ready-to-scan **UPI QR codes** alongside compliant UPI deep links.

### Example Scenario
- **Total Amount**: `₹5,000`
- **Smart Split Cap**: `₹1,999`
- **Generated Payment Parts**:
  - Payment 1: `₹1,999`
  - Payment 2: `₹1,999`
  - Payment 3: `₹1,002`
- **Sum**: Exactly `₹5,000.00` (zero mathematical drift)

> [!NOTE]
> **Important Positioning Notice**: SplitPay is strictly a legitimate payment-splitting and QR-generation utility. It is **NOT** a tax-avoidance, limit-bypassing, or fee-evasion tool. Payment splitting does not change any applicable taxes, reporting rules, transaction limits, or banking regulations.

---

## 2. Key Features

- 📷 **QR Scanner + Auto UPI Detection**:
  - Live browser camera scanning with mobile rear-camera priority (`facingMode: "environment"`).
  - Drag-and-drop or click-to-upload QR image fallback for desktop or gallery images.
  - Automatic parameter extraction: UPI ID (`pa`), Payee Name (`pn`), Amount (`am`), Currency (`cu`), and Note (`tn`).
  - Intelligent amount reconciliation: prompts *"Use ₹X from scanned QR?"* with `[Use Scanned Amount]` / `[Keep My Amount]` without overwriting user data.
  - Non-UPI QR inspection and friendly rejection notice.
- 🎯 **Mathematical Precision (Integer Paise Engine)**: All currency calculations are computed internally in integer paise (`1 Rupee = 100 Paise`), eliminating floating-point errors (e.g. `₹4,999.99` when the total is `₹5,000`).
- ⚡ **Three Flexible Split Strategies**:
  - **Equal Split**: Even division into $N$ parts with deterministic remainder paise balancing.
  - **Smart Split**: Automatic greedy partition capped at a specified ceiling per payment part (e.g. ₹1,999).
  - **Custom Split**: User-defined allocation with live sum validation, remaining paise counter, and excess alerts.
- 📱 **Compliant UPI URI & QR Code Generation**:
  - Constructs standard `upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...` deep links using RFC 3986 parameter encoding.
  - High-resolution client-side canvas QR rendering with crisp scannability.
- 📥 **Export & Sharing Capabilities**:
  - **Download QR**: Exports individual QR codes as PNG image files (`splitpay-payment-1.png`).
  - **Deep-Link Launching**: Mobile UPI app opening with fallback guidance for desktop environments.
  - **Clipboard Copy**: One-click copy for UPI ID and UPI payment link with toast confirmations.
  - **Web Share API**: Native device sharing with clipboard fallback.
- 🔒 **Zero-Knowledge Privacy**:
  - 100% client-side execution in the browser. Camera streams and images are processed in-memory and never uploaded to any server.
  - No database, no backend server, no external API telemetry, no persistent cookies or local credential logging.
- 🌓 **Fintech UI/UX & Dark Mode**:
  - Styled with a sleek slate, emerald, and indigo palette.
  - Persistent theme switching (`localStorage`) and system preference detection.
  - Fully responsive from 320px mobile screens to 4K displays.


---

## 3. Technology Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Bundler & Tooling**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Iconography**: [Lucide React](https://lucide.dev/)
- **QR Code Engine**: [qrcode](https://github.com/soldair/node-qrcode) (canvas rendering and PNG dataURL exports)
- **Delight & Micro-interactions**: [canvas-confetti](https://github.com/catdad/canvas-confetti)

---

## 4. Project Structure

```text
Payment_divider/
├── public/
│   └── favicon.svg              # Brand vector icon
├── src/
│   ├── components/
│   │   ├── AmountInput.jsx      # Formatted rupee input with quick chips
│   │   ├── CustomSplit.jsx      # Dynamic custom part allocator
│   │   ├── EmptyState.jsx       # Initial state placeholder
│   │   ├── EqualSplit.jsx       # Stepper & presets for equal parts
│   │   ├── Footer.jsx           # Disclaimers and footer navigation
│   │   ├── Header.jsx           # Brand bar, theme toggle, mobile drawer
│   │   ├── Hero.jsx             # Headline, CTA, and animated split preview
│   │   ├── HowItWorks.jsx       # 3-step walkthrough
│   │   ├── Logo.jsx             # Vector geometric logo component
│   │   ├── PaymentForm.jsx      # Main form controller and validation
│   │   ├── PaymentSummary.jsx   # Post-split dashboard and progress bar
│   │   ├── QRCard.jsx           # Canvas QR, download, copy, and share actions
│   │   ├── SafetyNotice.jsx     # Security tips, PIN warnings, privacy notice
│   │   ├── SmartSplit.jsx       # Maximum cap selector and regulatory info
│   │   ├── SplitSelector.jsx    # Segmented control for split strategy
│   │   ├── ThemeToggle.jsx      # Accessible light/dark toggle button
│   │   └── Toast.jsx            # Non-blocking notification system
│   ├── hooks/
│   │   └── useTheme.js          # Theme hook with localStorage persistence
│   ├── utils/
│   │   ├── currency.js          # Integer paise conversions & INR formatters
│   │   ├── qr.js                # Canvas rendering & PNG file export
│   │   ├── splitAmount.js       # Mathematical split algorithms
│   │   └── upi.js               # UPI URI generation & deep link launcher
│   ├── App.jsx                  # Main application orchestrator
│   ├── index.css                # Tailwind v4 configuration & glassmorphism
│   └── main.jsx                 # React root mounting
├── index.html                   # SEO metadata, Open Graph, Google fonts
├── package.json                 # Dependencies & scripts
└── vite.config.js               # Vite & Tailwind configuration
```

---

## 5. Mathematical Integrity & Paise Arithmetic

SplitPay eliminates IEEE-754 floating point imprecision (e.g. `0.1 + 0.2 = 0.30000000000000004`):

1. **Conversion**: Any input `₹X.YY` is converted to integer paise using direct string splitting:
   $$\text{Paise} = (\text{Whole} \times 100) + \text{Fractional}$$
2. **Equal Split Balancing**: When dividing total paise $T$ into $N$ parts:
   $$\text{Base} = \lfloor T / N \rfloor, \quad R = T \pmod N$$
   The first $R$ parts receive $\text{Base} + 1$ paise, and the remaining receive $\text{Base}$ paise.
3. **Smart Split Algorithm**: Greedily allocates $\min(\text{Remaining}, \text{Cap})$ until the balance is 0.
4. **Invariant**:
   $$\sum_{i=1}^N \text{Part}_i \equiv \text{Original Total}$$
   Guaranteed across all calculations.

---

## 6. Payment Verification Limitation

> [!WARNING]
> **SplitPay does NOT verify payment completion.**  
> Generating a QR code, displaying a QR code, scanning a QR code, opening a UPI app, or clicking a deep link does **not** prove that funds were transferred or received. In this MVP, statuses are clearly displayed as **"QRs Ready / Payment Not Verified"**. Always verify transactions in your official banking or UPI app.

---

## 7. Security & UPI Safety Rules

- **Never share your UPI PIN**: A UPI PIN is only required to send money, never to receive money.
- **Never share OTPs, Card PINs, or CVVs**: SplitPay will never ask for banking credentials.
- **Verify Payee Identity**: Always verify the recipient's name and amount on the UPI confirmation screen before authorizing payment.

---

## 8. Installation & Development

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### Commands

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Create optimized production build
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 9. Future Improvements (Post-MVP Roadmap)

- [ ] Webhook/Bank API integration for live payment status verification
- [ ] Export payment split manifests as downloadable PDF invoices / receipts
- [ ] Offline PWA (Progressive Web App) support for offline QR generation
- [ ] Dynamic currency conversion presets for international travel / cross-border UPI

---

## 10. License

SplitPay is distributed under the MIT License.
