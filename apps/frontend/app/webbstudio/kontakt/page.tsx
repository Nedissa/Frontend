'use client';
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FaqSection } from '../components/FaqSection';

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.2)',
  color: '#fff',
  fontSize: '15px',
  padding: '10px 0',
  outline: 'none',
};

export default function KontaktPage() {
  const [submitting, setSubmitting] = useState(false);
  const wedgeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wedgeRef, offset: ['start end', 'end start'] });
  const wedgeYRaw = useTransform(scrollYProgress, [0.3, 0.7], [200, 0]);
  const wedgeY = useSpring(wedgeYRaw, { stiffness: 200, damping: 40, mass: 0.6 });

  return (
    <main style={{ position: 'relative', color: '#fff', fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div className="contact-hero" style={{ position: 'relative', height: '100vh', boxSizing: 'border-box', background: 'linear-gradient(160deg, rgb(12,13,18) 0%, #030303 140%)', overflow: 'hidden' }}>
      <div className="grid-responsive-2" style={{ position: 'relative', maxWidth: '1320px', margin: '0 auto', padding: '140px 32px 60px', height: '100%', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'stretch' }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: '4px',
          background: 'radial-gradient(circle at 30% 20%, #1a1a1a 0%, #0a0a0a 55%, #030303 100%)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', boxSizing: 'border-box' }}>
          <h1 style={{ fontSize: 'clamp(36px,4.5vw,56px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 24px' }}>
            Kontakta oss
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, maxWidth: '420px', margin: '0 0 48px' }}>
            Välj ett paket, skicka en jobbförfrågan, och ert projekt startar upp inom 24 timmar.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); setSubmitting(true); }}
            style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}
          >
            <div className="grid-contact" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <label htmlFor="firstName" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Förnamn*</label>
                <input id="firstName" required placeholder="Jim" style={inputStyle} />
              </div>
              <div>
                <label htmlFor="lastName" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Efternamn*</label>
                <input id="lastName" required placeholder="Hopper" style={inputStyle} />
              </div>
            </div>

            <div className="grid-contact" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <label htmlFor="category" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Kategori</label>
                <select id="category" style={{ ...inputStyle, appearance: 'none' as const }}>
                  <option style={{ color: '#030303' }} value="">Välj kategori</option>
                  <option style={{ color: '#030303' }} value="webbplats">Webbplats</option>
                  <option style={{ color: '#030303' }} value="e-handel">E-handel</option>
                  <option style={{ color: '#030303' }} value="ovrigt">Övrigt</option>
                </select>
              </div>
              <div>
                <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>E-post</label>
                <input id="email" type="email" required placeholder="namn@techpilots.se" style={inputStyle} />
              </div>
            </div>

            <div>
              <label htmlFor="message" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Meddelande</label>
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

      <div ref={wedgeRef} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '320px', zIndex: 5, overflow: 'hidden' }}>
        <motion.div
          style={{
            position: 'absolute', left: 0, right: 0, top: 0,
            height: '320px',
            y: wedgeY,
            background: '#fff',
            clipPath: 'polygon(0 100%, 140% 20%, 140% 100%)',
          }}
        />
      </div>
      </div>

      <FaqSection />
    </main>
  );
}
