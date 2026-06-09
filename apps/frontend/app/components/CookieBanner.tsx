'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie } from '@phosphor-icons/react';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) setVisible(true);
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
    setVisible(false);
    loadTidio();
  }

  function decline() {
    localStorage.setItem('cookie_consent', 'declined');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
      background: '#fff', border: '1px solid #e5e7eb',
      borderRadius: '0px', padding: '20px',
      width: '290px', boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
    }}>
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
  );
}
