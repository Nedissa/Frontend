'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      textAlign: 'center',
      padding: '40px 24px',
    }}>
      <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#aaa', marginBottom: '16px' }}>
        500
      </p>
      <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 800, color: '#000', lineHeight: 1.1, marginBottom: '16px' }}>
        Något gick fel.
      </h1>
      <p style={{ fontSize: '1rem', color: '#666', maxWidth: '400px', lineHeight: 1.6, marginBottom: '40px' }}>
        Ett oväntat fel uppstod. Försök igen eller gå tillbaka till startsidan.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            background: '#000',
            color: '#fff',
            padding: '13px 32px',
            fontSize: '0.875rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            border: 'none',
            borderRadius: '999px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Försök igen
        </button>
        <Link href="/" style={{
          display: 'inline-block',
          background: 'transparent',
          color: '#000',
          padding: '13px 32px',
          fontSize: '0.875rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          textDecoration: 'none',
          borderRadius: '999px',
          border: '1px solid #e5e7eb',
        }}>
          Till startsidan
        </Link>
      </div>
    </div>
  );
}
