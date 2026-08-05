'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie } from '@phosphor-icons/react';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
    }
    if (consent === 'accepted') loadTidio();
  }, []);

  function loadTidio() {
    if (document.querySelector('script[src*="tidio"]')) return;
    const s = document.createElement('script');
    s.src = '//code.tidio.co/mrr6vc2ikwk66iondgijldmmcjnllu2q.js';
    s.async = true;
    document.head.appendChild(s);
  }

  function accept() {
    localStorage.setItem('cookie_consent', 'accepted');
    setAnimIn(false);
    setTimeout(() => setVisible(false), 300);
    loadTidio();
  }

  function decline() {
    localStorage.setItem('cookie_consent', 'declined');
    setAnimIn(false);
    setTimeout(() => setVisible(false), 300);
  }

  if (!visible) return null;

  return (
    <>
      <style>{`
        .cookie-banner-desktop {
          position: fixed; bottom: 24px; right: 24px; z-index: 9999;
          background: #fff; border: 1px solid #e5e7eb;
          padding: 20px; width: 290px; box-shadow: 0 8px 32px rgba(0,0,0,0.14);
          transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease;
        }
        @media (max-width: 640px) {
          .cookie-banner-desktop {
            left: 12px; right: 12px; bottom: 12px;
            width: auto; border: 1px solid #e5e7eb;
            box-shadow: 0 8px 32px rgba(0,0,0,0.14);
          }
        }
      `}</style>
      <div className="cookie-banner-desktop" style={{ transform: animIn ? 'translateY(0)' : 'translateY(24px)', opacity: animIn ? 1 : 0 }}>
      <div style={{ marginBottom: '10px' }}>
        <Cookie size={28} weight="fill" color="#111" style={{ marginBottom: '6px' }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111', display: 'block' }}>Vi använder cookies</span>
      </div>
      <p style={{ fontSize: '0.76rem', color: '#777', margin: '0 0 14px 0', lineHeight: 1.6 }}>
        För att ge dig en bättre upplevelse. Läs vår{' '}
        <Link href="/cookiepolicy" style={{ color: '#111', fontWeight: 600 }}>cookiepolicy</Link>
        {' '}och{' '}
        <Link href="/integritetspolicy" style={{ color: '#111', fontWeight: 600 }}>integritetspolicy</Link>.
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={decline}
          style={{ flex: 1, background: '#f4f4f5', border: 'none', padding: '8px 0', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', borderRadius: '0px', color: '#555' }}
        >
          Avvisa
        </button>
        <button
          onClick={accept}
          style={{ flex: 1, background: '#111', color: '#fff', border: 'none', padding: '8px 0', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', borderRadius: '0px' }}
        >
          Acceptera
        </button>
      </div>
    </div>
    </>
  );
}

