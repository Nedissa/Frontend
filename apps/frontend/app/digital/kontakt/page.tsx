'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Great_Vibes } from 'next/font/google';
import { ShootingStars } from '../components/ShootingStars';

const scriptFont = Great_Vibes({ subsets: ['latin'], weight: '400' });

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
      <div className="contact-hero" style={{ position: 'relative', minHeight: '100vh', boxSizing: 'border-box', background: '#fff', display: 'flex', alignItems: 'center' }}>
      <div className="grid-responsive-2" style={{ position: 'relative', maxWidth: '1320px', margin: '0 auto', padding: '140px 32px 60px', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'stretch', width: '100%' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '4px', overflow: 'hidden', background: '#f5f5f0', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 0, height: 0, borderStyle: 'solid', borderWidth: '0 24px 24px 0', borderColor: 'transparent #030303 transparent transparent' }} />
          <ShootingStars color="#030303" />
          <span style={{ position: 'relative', display: 'inline-block', alignSelf: 'flex-start', background: '#030303', color: '#fff', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', padding: '6px 14px', borderRadius: '4px', marginBottom: '24px' }}>
            KOSTNADSFRI RÅDGIVNING
          </span>
          <h2 style={{ position: 'relative', fontSize: 'clamp(40px,5.2vw,64px)', fontWeight: 800, letterSpacing: '-0.03em', textTransform: 'uppercase', color: '#030303', margin: 0, lineHeight: 0.95 }}>
            Redo att ta <span style={{ color: '#e8c547' }}>nästa</span> steg?
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
            <div style={{ position: 'relative', width: '160px', height: '160px', borderRadius: '4px', overflow: 'hidden', border: '2px solid #030303', background: '#030303', flexShrink: 0 }}>
              <Image src="/digital/nedal-issa-cutout.png" alt="Nedal Issa" fill style={{ objectFit: 'cover', objectPosition: 'bottom' }} />
            </div>
            <div>
              <p className={scriptFont.className} style={{ fontSize: '40px', fontWeight: 400, color: '#030303', margin: '0 0 2px', lineHeight: 1 }}>
                Nedal Issa
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(3,3,3,0.6)', textTransform: 'uppercase', letterSpacing: '0.03em', margin: 0 }}>
                Head of Techpilots
              </p>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ position: 'relative', borderTop: '1px solid rgba(3,3,3,0.2)', paddingTop: '32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            <span style={{ fontSize: '48px', lineHeight: 1, fontWeight: 800, color: '#030303', fontFamily: 'Georgia, serif', margin: '0 0 4px' }}>
              &quot;
            </span>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <span style={{ width: '3px', alignSelf: 'stretch', background: '#030303', flexShrink: 0, borderRadius: '2px' }} />
              <p style={{ fontSize: '18px', lineHeight: 1.5, fontStyle: 'italic', fontWeight: 400, color: 'rgba(3,3,3,0.75)', margin: 0 }}>
                Vi på Ljuva Hem är supernöjda med vår nya hemsida! Techpilots förstod direkt vikten av att förmedla trygghet till våra kunder inom hemstädning. Processen var smidig och vi har redan märkt att fler lokala kunder hittar oss i Mark och Kinna. Rekommenderas varmt för alla företag.
              </p>
            </div>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#030303', margin: '0 0 2px 0' }}>
              Ljuva Hem i Mark
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', boxSizing: 'border-box' }}>
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
                <input id="firstName" required placeholder="Anna" style={inputStyle} />
              </div>
              <div>
                <label htmlFor="lastName" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#030303', flexShrink: 0 }} />
                  Efternamn*
                </label>
                <input id="lastName" required placeholder="Andersson" style={inputStyle} />
              </div>
            </div>

            <div className="grid-contact" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <label htmlFor="category" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#030303', flexShrink: 0 }} />
                  Kategori
                </label>
                <select id="category" defaultValue="" style={{ ...inputStyle, appearance: 'none' as const }}>
                  <option style={{ color: '#030303' }} value="" disabled hidden>Välj kategori</option>
                  <option style={{ color: '#030303', borderBottom: '1px solid rgba(0,0,0,0.1)' }} value="webbplats">Webbplats</option>
                  <option style={{ color: '#030303', borderBottom: '1px solid rgba(0,0,0,0.1)' }} value="e-handel">E-handel</option>
                  <option style={{ color: '#030303', borderBottom: '1px solid rgba(0,0,0,0.1)' }} value="seo">SEO (Sökoptimering)</option>
                  <option style={{ color: '#030303', borderBottom: '1px solid rgba(0,0,0,0.1)' }} value="webbhotell">Hosting &amp; Drift</option>
                  <option style={{ color: '#030303', borderBottom: '1px solid rgba(0,0,0,0.1)' }} value="support">Teknisk support</option>
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
              <textarea
                id="message"
                rows={3}
                placeholder="Skriv ditt meddelande..."
                style={{
                  ...inputStyle,
                  border: '1px solid rgba(0,0,0,0.15)',
                  borderRadius: '4px',
                  padding: '12px',
                  resize: 'none',
                }}
              />
            </div>

            <div style={{ marginTop: '4px' }}>
              <p style={{ fontSize: '13px', color: 'rgba(3,3,3,0.5)', lineHeight: 1.5, margin: '0 0 12px' }}>
                Vi återkommer inom 24 timmar.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="contact-btn-primary"
                  style={{
                    padding: '16px', borderRadius: '4px', border: 'none',
                    fontSize: '15px', fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  {submitting ? 'Skickar...' : 'Skicka meddelandet'}
                  <span className="contact-btn-icon">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      </div>
    </main>
  );
}
