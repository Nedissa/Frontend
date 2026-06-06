'use client';

import { useState } from 'react';
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
        setErrorMessage('Ett fel uppstod. Försök igen senare.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessage('Ett fel uppstod. Försök igen senare.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    fontSize: '0.9rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    background: '#fff',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    color: '#111',
  };

  return (
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '80px 48px 80px', fontFamily: "'Inter', sans-serif", borderLeft: '1px solid #000', borderRight: '1px solid #000' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '80px', alignItems: 'flex-start' }}>

          {/* Left */}
          <div style={{ paddingTop: '8px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#000', lineHeight: 1.1, marginBottom: '28px' }}>
              Vi hjälper<br />dig gärna.
            </h1>
            <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '4px' }}>Telefon</p>
                <p style={{ fontSize: '0.875rem', color: '#000', fontWeight: 500 }}>+46 10 880 09 81</p>
                <p style={{ fontSize: '0.8rem', color: '#aaa' }}>Mån–Fre 09:00–17:00</p>
              </div>
              <div>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '4px' }}>E-post</p>
                <p style={{ fontSize: '0.875rem', color: '#000', fontWeight: 500 }}>support@techpilots.se</p>
              </div>
              <div>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '4px' }}>Adress</p>
                <p style={{ fontSize: '0.875rem', color: '#000', fontWeight: 500, lineHeight: 1.6 }}>Skogshyddegatan 37<br />506 31 Borås</p>
              </div>
            </div>

            <a
              href="tel:+46108800981"
              style={{
                display: 'inline-block',
                padding: '11px 22px',
                border: '1.5px solid #000',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#fff',
                background: '#000',
                textDecoration: 'none',
              }}
            >
              Ring oss
            </a>
          </div>

          {/* Right — Form */}
          <div style={{ borderLeft: '1px solid #000', paddingLeft: '80px' }}>
            {successMessage && (
              <div style={{ padding: '12px 16px', background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', fontSize: '0.875rem', borderRadius: '8px', marginBottom: '20px' }}>
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', fontSize: '0.875rem', borderRadius: '8px', marginBottom: '20px' }}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111', marginBottom: '8px' }}>Ditt namn</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ange ditt namn"
                  required
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#000')}
                  onBlur={e => (e.target.style.borderColor = '#ddd')}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111', marginBottom: '8px' }}>E-post</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@email.se"
                  required
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#000')}
                  onBlur={e => (e.target.style.borderColor = '#ddd')}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111', marginBottom: '8px' }}>Meddelande</label>
                <textarea
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Beskriv ditt ärende..."
                  required
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => (e.target.style.borderColor = '#000')}
                  onBlur={e => (e.target.style.borderColor = '#ddd')}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111', marginBottom: '8px' }}>Ämne</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: '36px', cursor: 'pointer' }}
                  onFocus={e => (e.target.style.borderColor = '#000')}
                  onBlur={e => (e.target.style.borderColor = '#ddd')}
                >
                  <option value="" disabled>Välj ämne...</option>
                  <option value="order">Fråga om order</option>
                  <option value="retur">Retur / byte</option>
                  <option value="reklamation">Reklamation</option>
                  <option value="produkt">Produktfråga</option>
                  <option value="annat">Annat</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  padding: '16px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  borderRadius: '999px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                  fontFamily: 'inherit',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
              >
                {isLoading ? 'Skickar...' : 'Skicka meddelande'}
              </button>
            </form>
          </div>

        </div>

        {/* Big brand name at bottom */}
        <div style={{ marginTop: '64px', paddingBottom: '24px' }}>
          <p style={{
            fontSize: 'clamp(80px, 16vw, 180px)',
            fontWeight: 800,
            color: '#000',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            margin: 0,
            userSelect: 'none',
          }}>
            Techpilots
          </p>
        </div>

      </div>
  );
}
