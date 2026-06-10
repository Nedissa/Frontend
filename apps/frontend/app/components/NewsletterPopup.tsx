'use client';

import { useState, useEffect } from 'react';
import { InputWithCheck } from './InputWithCheck';

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const closed = localStorage.getItem('newsletterPopupClosed');
    if (!closed) setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('newsletterPopupClosed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setLoading(false);
    setSubmitted(true);
    setEmail('');
    setTimeout(handleClose, 2000);
  };

  if (!isHydrated || !isOpen) return null;

  return (
    <div className="w-full max-w-3xl">
      <div className="bg-white overflow-hidden shadow-2xl">
        <div className="flex flex-row h-96">
          {/* Image Section */}
          <div className="w-[35%] bg-gray-200 flex items-center justify-center p-6">
            <img
              src="/assets/Produkt bilder/LAPTOP/1978563_1.webp"
              alt="Newsletter"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Content Section */}
          <div className="w-[65%] p-10 flex flex-col justify-center relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Text Content */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 font-semibold tracking-wide mb-3">FÖRSTA GÅNGEN?</p>
              <h2 className="text-2xl font-bold text-black mb-4 whitespace-nowrap">
                Bli medlem och få 10% rabatt
              </h2>
            </div>

            {/* Email Form */}
            {submitted ? (
              <div className="mb-6 py-3 px-4 bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                Tack! Din rabattkod skickas till din e-post.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <InputWithCheck
                      type="email"
                      placeholder="Ange din e-postadress"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="text-sm text-black placeholder-gray-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-6 py-3 font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center disabled:opacity-50"
                    aria-label="Prenumerera"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </form>
            )}

            {/* Description */}
            <p className="text-sm text-gray-600 mb-6">
              Registrera dig idag och få 10% rabatt på ditt första köp. Exklusiva erbjudanden och nyheter direkt i din inkorg.
            </p>

            {/* Social Links - Footer style */}
            <div className="flex gap-3">
              <a href="https://www.facebook.com/techpilots.se/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-black hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/techpilots.se/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-black hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                  <circle cx="17.5" cy="6.5" r="1.5"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/techpilots-webagency" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-black hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
