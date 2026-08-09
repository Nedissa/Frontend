'use client';
import { useState } from 'react';

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(0,0,0,0.2)',
  color: '#030303',
  fontSize: '15px',
  padding: '10px 0',
  outline: 'none',
};

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <main style={{ position: 'relative', color: '#030303', fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div className="contact-hero" style={{ position: 'relative', height: '100vh', boxSizing: 'border-box', background: '#fff', overflow: 'hidden' }}>
      <div className="grid-responsive-2" style={{ position: 'relative', maxWidth: '1320px', margin: '0 auto', padding: '140px 32px 60px', height: '100%', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'stretch' }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: '4px',
          background: 'radial-gradient(circle at 30% 20%, #e8c547 0%, #d9d9d9 55%, #f0f0f0 100%)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', boxSizing: 'border-box' }}>
          <h1 style={{ fontSize: 'clamp(36px,4.5vw,56px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#030303', margin: '0 0 24px' }}>
            Låt oss bygga er webbplats.
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(3,3,3,0.6)', lineHeight: 1.5, maxWidth: '420px', margin: '0 0 48px' }}>
            Berätta lite om ert projekt så hjälper vi er att hitta rätt struktur, omfattning och tidsplan.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); setSubmitting(true); }}
            style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}
          >
            <div className="grid-contact" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <label htmlFor="firstName" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#030303', flexShrink: 0 }} />
                  Förnamn*
                </label>
                <input id="firstName" required placeholder="Jim" style={inputStyle} />
              </div>
              <div>
                <label htmlFor="lastName" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#030303', flexShrink: 0 }} />
                  Efternamn*
                </label>
                <input id="lastName" required placeholder="Hopper" style={inputStyle} />
              </div>
            </div>

            <div className="grid-contact" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <label htmlFor="category" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#030303', flexShrink: 0 }} />
                  Kategori
                </label>
                <select id="category" style={{ ...inputStyle, appearance: 'none' as const }}>
                  <option style={{ color: '#030303' }} value="">Välj kategori</option>
                  <option style={{ color: '#030303' }} value="webbplats">Webbplats</option>
                  <option style={{ color: '#030303' }} value="e-handel">E-handel</option>
                  <option style={{ color: '#030303' }} value="ovrigt">Övrigt</option>
                </select>
              </div>
              <div>
                <label htmlFor="email" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#030303', flexShrink: 0 }} />
                  E-post
                </label>
                <input id="email" type="email" required placeholder="namn@techpilots.se" style={inputStyle} />
              </div>
            </div>

            <div>
              <label htmlFor="message" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#030303', flexShrink: 0 }} />
                Meddelande
              </label>
              <textarea id="message" rows={3} placeholder="Skriv ditt meddelande..." style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: '4px', padding: '16px', borderRadius: '4px', border: 'none',
                background: '#e8c547', color: '#030303', fontSize: '15px', fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {submitting ? 'Skickar...' : 'Skicka'}
            </button>
          </form>
        </div>
      </div>
      </div>
    </main>
  );
}
