'use client';

import Link from 'next/link';
import { FacebookLogo, InstagramLogo, LinkedinLogo, ClockIcon, PhoneIcon, EnvelopeSimpleIcon, MapPinIcon } from '@phosphor-icons/react';

const QUICK_LINKS = [
  { label: 'Hem', href: '/webbstudio' },
  { label: 'Om', href: '/webbstudio#om' },
  { label: 'Projekt', href: '/webbstudio#projekt' },
  { label: 'Priser', href: '/webbstudio#priser' },
  { label: 'Kontakt', href: '/webbstudio/kontakt' },
];

const CONTACT_ROWS = [
  {
    label: 'Alltid tillgängliga',
    icon: <ClockIcon size={18} weight="fill" />,
  },
  {
    label: '+010-880 09 81',
    href: 'tel:+0108800981',
    icon: <PhoneIcon size={18} weight="fill" />,
  },
  {
    label: 'info@techpilots.se',
    href: 'mailto:info@techpilots.se',
    icon: <EnvelopeSimpleIcon size={18} weight="fill" />,
  },
  {
    label: '506 31 Borås',
    icon: <MapPinIcon size={18} weight="fill" />,
  },
];

const SOCIAL_ICONS = [
  {
    label: 'Facebook',
    href: 'https://facebook.com/techpilots.se',
    icon: <FacebookLogo size={22} weight="fill" />,
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/techpilots.se',
    icon: <InstagramLogo size={22} weight="fill" />,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/techpilots-webagency',
    icon: <LinkedinLogo size={22} weight="fill" />,
  },
];

const columnHeadingStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.5)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '28px',
};

export function Footer() {
  return (
    <footer id="kontakt" style={{ background: 'linear-gradient(160deg, rgb(12,13,18) 0%, #030303 140%)', padding: '100px 60px 40px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '56px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1.5px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              marginBottom: '20px',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="12" r="2.5" />
              <circle cx="5" cy="6" r="1.6" />
              <circle cx="19" cy="6" r="1.6" />
              <circle cx="5" cy="18" r="1.6" />
              <circle cx="19" cy="18" r="1.6" />
              <path d="M9.8 10.2L6.4 7.4M14.2 10.2l3.4-2.8M9.8 13.8l-3.4 2.8M14.2 13.8l3.4 2.8" />
            </svg>
          </div>

          <h2
            style={{
              fontSize: 'clamp(28px,3.5vw,44px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#fff',
              margin: '0 0 20px',
              lineHeight: 1.05,
            }}
          >
            TECHPILOTS STUDIO
          </h2>

          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: '0 0 24px', maxWidth: '500px' }}>
            Vi hjälper varumärken växa digitalt genom skräddarsydd design, webbutveckling och teknisk SEO.
          </p>

          <div style={{ display: 'flex', gap: '16px' }}>
            {SOCIAL_ICONS.map((s) => (
              <Link key={s.label} href={s.href} target="_blank" aria-label={s.label} className="nav-link" style={{ display: 'flex' }}>
                {s.icon}
              </Link>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1.4fr',
            gap: '40px',
            alignItems: 'start',
            marginBottom: '80px',
          }}
        >
          {/* Column 1: Contact */}
          <div>
            <div style={columnHeadingStyle}>Kontakt</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {CONTACT_ROWS.map((row) => {
                const content = (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff' }}>
                    <span style={{ display: 'flex', color: '#fff' }}>{row.icon}</span>
                    <span style={{ fontSize: '15px', fontWeight: 500 }}>{row.label}</span>
                  </span>
                );
                return row.href ? (
                  <a key={row.label} href={row.href} style={{ textDecoration: 'none' }}>{content}</a>
                ) : (
                  <div key={row.label}>{content}</div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick links */}
          <div>
            <div style={columnHeadingStyle}>Snabblänkar</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {QUICK_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="nav-link" style={{ fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <div style={columnHeadingStyle}>Nyhetsbrev</div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: '0 0 16px' }}>
              Insikter, studioupdateringar och utvalda inspirationer, skickas ibland, aldrig spam.
            </p>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="E-postadress"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '14px',
                  border: 'none',
                  borderRadius: '2px',
                  background: '#fff',
                  color: '#030303',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '14px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '2px',
                  background: '#e8c547',
                  color: '#030303',
                  cursor: 'pointer',
                }}
              >
                Prenumerera
              </button>
            </form>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '40px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: '13px', color: '#fff' }}>Registrerad för F-skatt</span>
          <span style={{ fontSize: '13px', color: '#fff' }}>Techpilots. Alla rättigheter förbehållna.</span>
        </div>
      </div>
    </footer>
  );
}
