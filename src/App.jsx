import React, { useState, useRef } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import PaymentForm from './components/PaymentForm.jsx';
import PaymentSummary from './components/PaymentSummary.jsx';
import QRCard from './components/QRCard.jsx';
import EmptyState from './components/EmptyState.jsx';
import SafetyNotice from './components/SafetyNotice.jsx';
import Footer from './components/Footer.jsx';
import { ToastProvider } from './components/Toast.jsx';
import { useTheme } from './hooks/useTheme.js';

export function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [activeSplit, setActiveSplit] = useState(null);
  const paymentSectionRef = useRef(null);
  const resultsSectionRef = useRef(null);

  const handleStartCreating = () => {
    if (paymentSectionRef.current) {
      paymentSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGenerateSplit = (splitResult) => {
    setActiveSplit(splitResult);
    // Smooth scroll to generated results
    setTimeout(() => {
      if (resultsSectionRef.current) {
        resultsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleReset = () => {
    setActiveSplit(null);
    if (paymentSectionRef.current) {
      paymentSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Global Navigation Header */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onReset={handleReset}
        hasGeneratedSplit={!!activeSplit}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onStartCreating={handleStartCreating} />

        {/* Payment Generator Section */}
        <section
          id="payment-section"
          ref={paymentSectionRef}
          className="py-12 md:py-16 scroll-mt-16 relative"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                Configure & Split
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Create Your Payment Split
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Choose your split method and generate ready-to-scan UPI QR codes for each part.
              </p>
            </div>

            {/* Payment Input Form */}
            <PaymentForm onGenerateSplit={handleGenerateSplit} />

            {/* Split Results or Empty State */}
            <div ref={resultsSectionRef} className="mt-14 scroll-mt-20">
              {activeSplit ? (
                <div>
                  <PaymentSummary
                    totalPaise={activeSplit.totalPaise}
                    splitParts={activeSplit.splitData.map(s => s.amountPaise)}
                    splitMode={activeSplit.splitMode}
                    onReset={handleReset}
                  />

                  {/* QR Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeSplit.splitData.map((part, idx) => (
                      <QRCard
                        key={part.id || idx}
                        index={idx}
                        totalParts={activeSplit.splitData.length}
                        amountPaise={part.amountPaise}
                        upiUri={part.upiUri}
                        upiId={part.upiId}
                        payeeName={part.payeeName}
                        note={part.note}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorks />

        {/* UPI Privacy & Safety Section */}
        <SafetyNotice />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
