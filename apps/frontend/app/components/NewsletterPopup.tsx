'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { InputWithCheck } from './InputWithCheck';

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsHydrated(true);
    const closed = localStorage.getItem('newsletterPopupClosed');
    if (closed) return;
    const isLoggedIn = document.cookie.includes('is_logged_in=1');
    if (isLoggedIn) return;

    const show = () => {
      setIsOpen(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
      cleanup();
    };

    // Exit intent: mouse moves toward top of browser (desktop)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 20) show();
    };

    // Fallback: 60 seconds (covers mobile where exit intent doesn't work)
    const timer = setTimeout(show, 60000);

    const cleanup = () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return cleanup;
  }, []);

  const handleClose = () => {
    setAnimIn(false);
    setTimeout(() => setIsOpen(false), 300);
    localStorage.setItem('newsletterPopupClosed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Auto-generera lösenord
      const password = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-6).toUpperCase() + '!';

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          firstName: '',
          lastName: '',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 400 && data.error?.includes('redan registrerad')) {
          setError('already_exists');
        } else {
          setError(data.error || 'Något gick fel, försök igen.');
        }
        setLoading(false);
        return;
      }

      // Skicka välkomstmail med lösenordet via newsletter-routen
      fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }).catch(() => {});

      window.dispatchEvent(new Event('authChange'));
    } catch {
      setError('Något gick fel, försök igen.');
      setLoading(false);
      return;
    }
    setLoading(false);
    setSubmitted(true);
    setTimeout(handleClose, 5000);
  };

  if (!isHydrated) return null;

  if (!isOpen && process.env.NODE_ENV === 'development') {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{ position: 'fixed', bottom: 80, right: 16, zIndex: 9999, background: '#111', color: '#fff', fontSize: '11px', padding: '6px 10px', border: 'none', cursor: 'pointer' }}
      >
        Visa popup
      </button>
    );
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center px-4"
      style={{ pointerEvents: animIn ? 'auto' : 'none' }}
    >
      <div
        className="absolute inset-0 bg-black transition-opacity duration-300"
        style={{ opacity: animIn ? 0.4 : 0 }}
        onClick={handleClose}
      />
      <div
        className="relative w-full max-w-3xl transition-all duration-300"
        style={{
          opacity: animIn ? 1 : 0,
          transform: animIn ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
        }}
      >
      <div className="bg-white overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:h-96">
          {/* Image Section — hidden on mobile */}
          <div className="hidden md:flex w-[35%] bg-gray-200 items-center justify-center p-6">
            <img
              src="/assets/Produkt bilder/LAPTOP/1978563_1.webp"
              alt="Newsletter"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Content Section */}
          <div className="w-full md:w-[65%] p-6 md:p-10 flex flex-col justify-center relative overflow-hidden">
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
              <p className="text-xs text-gray-500 font-semibold tracking-wide mb-3">NY KUND?</p>
              <h2 className="text-xl font-black text-black mb-4 whitespace-nowrap">
                Bli medlem och få 10% rabatt
              </h2>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="mb-2">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Ange din e-postadress"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={submitted}
                    className="flex-1 px-4 py-3 text-sm text-black placeholder-gray-500 border border-gray-200 focus:outline-none focus:border-black"
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                  <button
                    type="submit"
                    disabled={loading || submitted}
                    className={`px-6 py-3 font-semibold transition-colors flex items-center justify-center ${submitted ? 'bg-green-600 text-white cursor-default' : 'bg-black text-white hover:bg-gray-900'}`}
                    aria-label="Registrera"
                  >
                    {submitted ? (
                      <span className="text-sm font-bold">Tackar!</span>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    )}
                  </button>
                </div>
                <div style={{ minHeight: '24px' }}>
                  {error === 'already_exists' ? (
                    <p className="text-sm text-red-500">
                      Det finns redan ett konto med den adressen.{' '}
                      <Link href="/inlogg" onClick={handleClose} className="text-black font-semibold">Logga in här</Link>
                    </p>
                  ) : error ? (
                    <p className="text-red-500 text-xs">{error}</p>
                  ) : null}
                </div>
              </div>
            </form>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">
              Skapa konto och få 10% rabatt på ditt första köp. Rabatten läggs till automatiskt i kassan.
            </p>

            {/* Social Links - Footer style */}
            <div className="flex gap-3">
              <a href="https://www.facebook.com/techpilots.se/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-black hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/techpilots.se/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-black hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
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
    </div>
  );
}
