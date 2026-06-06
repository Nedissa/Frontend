'use client';

import { useState } from 'react';
import { MainLayout } from '@/app/components/MainLayout';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
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
        body: JSON.stringify({ name, email, subject: `[${topic}] ${subject}`, message, recipientEmail: 'info@techpilots.se' }),
      });
      if (response.ok) {
        setSuccessMessage('Tack! Vi svarar inom 24 timmar.');
        setName(''); setEmail(''); setSubject(''); setTopic(''); setMessage('');
      } else {
        setErrorMessage('Ett fel uppstod. Försök igen senare.');
      }
    } catch {
      setErrorMessage('Ett fel uppstod. Försök igen senare.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    fontSize: '0.875rem',
    background: '#f5f5f5',
    border: '1px solid #e5e7eb',
    color: '#111',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    borderRadius: '4px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#333',
    marginBottom: '6px',
  };

  const perks = [
    {
      icon: (
        <svg width="32" height="32" fill="none" stroke="#000" strokeWidth="1.6" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
      title: 'Fri frakt',
      desc: 'Kostnadsfri standardleverans inom hela Sverige',
    },
    {
      icon: (
        <svg width="32" height="32" fill="none" stroke="#000" strokeWidth="1.6" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      ),
      title: 'Kundservice',
      desc: 'Vi svarar inom 24 timmar på vardagar',
    },
    {
      icon: (
        <svg width="32" height="32" fill="none" stroke="#000" strokeWidth="1.6" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      ),
      title: 'Säker betalning',
      desc: 'SSL-krypterad betalning med Visa, Mastercard, Swish & Klarna',
    },
    {
      icon: (
        <svg width="32" height="32" fill="none" stroke="#000" strokeWidth="1.6" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      ),
      title: '30 dagars returrätt',
      desc: 'Ångra köpet utan krångel inom 30 dagar',
    },
  ];

  return (
    <MainLayout>
      <div style={{ background: '#fff', minHeight: '100vh', fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '60px 24px 64px', position: 'relative', zIndex: 1 }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-block', background: 'linear-gradient(135deg, #f5f5f5, #ffffff)', padding: '8px 20px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#333', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
            Kontakta oss
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, color: '#111', lineHeight: 1.1, marginBottom: '16px' }}>
            Vi hjälper dig gärna.
          </h1>
          <p style={{ fontSize: '1rem', color: '#555', maxWidth: '420px', margin: '0 auto', lineHeight: 1.6 }}>
            Har du frågor om en order, produkt eller något annat? Kontakta oss så svarar vi inom 24 timmar.
          </p>
          </div>
        </div>

        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '60px 24px 0', position: 'relative', zIndex: 1 }}>

          {successMessage && (
            <div style={{ padding: '12px 16px', background: '#14532d', border: '1px solid #166534', color: '#86efac', fontSize: '0.875rem', borderRadius: '4px', marginBottom: '20px' }}>
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div style={{ padding: '12px 16px', background: '#450a0a', border: '1px solid #991b1b', color: '#fca5a5', fontSize: '0.875rem', borderRadius: '4px', marginBottom: '20px' }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Ditt namn</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ange ditt namn" required style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#000')}
                  onBlur={e => (e.target.style.borderColor = '#e5e7eb')} />
              </div>
              <div>
                <label style={labelStyle}>Din e-post <span style={{ color: '#000' }}>*</span></label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Ange din e-post" required style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#000')}
                  onBlur={e => (e.target.style.borderColor = '#e5e7eb')} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Ämne</label>
              <select value={topic} onChange={e => setTopic(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23aaa' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: '36px' }}
                onFocus={e => (e.target.style.borderColor = '#000')}
                onBlur={e => (e.target.style.borderColor = '#e5e7eb')}>
                <option value="">Välj kategori...</option>
                <option value="Order">Order & leverans</option>
                <option value="Retur">Retur & byte</option>
                <option value="Reklamation">Reklamation</option>
                <option value="Produkt">Produktfråga</option>
                <option value="Annat">Annat</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Rubrik <span style={{ color: '#000' }}>*</span></label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Ange meddelandets rubrik" required style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#000')}
                onBlur={e => (e.target.style.borderColor = '#e5e7eb')} />
            </div>

            <div>
              <label style={labelStyle}>Ditt meddelande <span style={{ color: '#000' }}>*</span></label>
              <textarea rows={6} value={message} onChange={e => setMessage(e.target.value)} placeholder="Ange ditt meddelande" required
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => (e.target.style.borderColor = '#000')}
                onBlur={e => (e.target.style.borderColor = '#e5e7eb')} />
            </div>

            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <button type="submit" disabled={isLoading} style={{
                background: '#000',
                color: '#fff',
                border: 'none',
                padding: '13px 40px',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
                fontFamily: 'inherit',
              }}>
                {isLoading ? 'Skickar...' : 'Skicka meddelande'}
              </button>
            </div>
          </form>
        </div>

        {/* Perks */}
        <div style={{ maxWidth: '900px', margin: '80px auto 0', borderTop: '1px solid #e5e7eb', paddingTop: '48px', paddingBottom: '60px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {perks.map(perk => (
            <div key={perk.title}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>{perk.icon}</div>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#000', marginBottom: '6px' }}>{perk.title}</p>
              <p style={{ fontSize: '0.78rem', color: '#888', lineHeight: 1.5 }}>{perk.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </MainLayout>
  );
}
