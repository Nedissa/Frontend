'use client';

import { useState } from 'react';
import { MainLayout } from '@/app/components/MainLayout';
import { InputWithCheck } from '@/app/components/InputWithCheck';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, recipientEmail: 'info@techpilots.se' }),
      });

      if (response.ok) {
        setSuccessMessage('Tack! Ditt meddelande har skickats. Vi svarar inom 24 timmar.');
        setName(''); setEmail(''); setSubject(''); setMessage('');
      } else {
        setErrorMessage('Ett fel uppstod när meddelandet skulle skickas. Försök igen senare.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessage('Ett fel uppstod när meddelandet skulle skickas. Försök igen senare.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    fontSize: '0.9rem',
    border: '1px solid #e5e7eb',
    background: '#f5f5f5',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    color: '#111',
  };

  return (
    <MainLayout>
<div style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 24px 96px', fontFamily: "'Manrope', sans-serif" }}>

        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#000', marginBottom: '12px', lineHeight: 1.1 }}>Kontakta oss</h1>
        <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '56px', maxWidth: '480px' }}>
          Vi hjälper dig gärna. Fyll i formuläret nedan så svarar vi inom 24 timmar.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '80px', alignItems: 'flex-start' }}>

          {/* Form */}
          <div>
            {successMessage && (
              <div style={{ padding: '12px 16px', background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', fontSize: '0.875rem', marginBottom: '20px' }}>
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', fontSize: '0.875rem', marginBottom: '20px' }}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Namn"
                  required
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#000')}
                  onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-post"
                  required
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#000')}
                  onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ämne"
                  required
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#000')}
                  onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <textarea
                  rows={7}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Meddelande"
                  required
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => (e.target.style.borderColor = '#000')}
                  onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  padding: '15px 32px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  borderRadius: '999px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                  fontFamily: 'inherit',
                  letterSpacing: '0.02em',
                }}
              >
                {isLoading ? 'Skickar...' : 'Skicka meddelande'}
              </button>
            </form>
          </div>

          {/* Contact info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: '6px' }}>Adress</p>
              <p style={{ fontSize: '0.875rem', color: '#111', lineHeight: 1.6 }}>
                Techpilots AB<br />
                Skogshyddegatan 37<br />
                506 31 Borås, Sverige
              </p>
            </div>

            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: '6px' }}>E-post</p>
              <p style={{ fontSize: '0.875rem', color: '#111', lineHeight: 1.6 }}>support@techpilots.se</p>
            </div>

            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: '6px' }}>Telefon</p>
              <p style={{ fontSize: '0.875rem', color: '#111', lineHeight: 1.6 }}>
                +46 10 880 09 81<br />
                mån – fre: 09:00 – 17:00
              </p>
            </div>

            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: '10px' }}>Följ oss</p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <a href="https://instagram.com/techpilots" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: '#111' }}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://facebook.com/techpilots" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: '#111' }}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://x.com/techpilots" target="_blank" rel="noopener noreferrer" aria-label="X" style={{ color: '#111' }}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
