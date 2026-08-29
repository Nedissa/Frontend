'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { FacebookLogo, InstagramLogo, LinkedinLogo, ClockIcon, PhoneIcon, EnvelopeSimpleIcon, MapPinIcon } from '@phosphor-icons/react';
import { FloatingParticles } from './FloatingParticles';

const QUICK_LINKS = [
  { label: 'Hem', href: '/digital' },
  { label: 'Om', href: '/digital#om' },
  { label: 'Projekt', href: '/digital#projekt' },
  { label: 'Priser', href: '/digital#priser' },
  { label: 'Kontakt', href: '/digital/kontakt' },
  { label: 'Webbutik', href: '/' },
];

const TERMS_LINKS = [
  { label: 'Affärsvillkor', href: '/digital/villkor/affarsvillkor' },
  { label: 'Integritetspolicy', href: '/digital/villkor/integritet' },
  { label: 'Cookiepolicy', href: '/digital/villkor/cookies' },
];

const RESPONSIBILITY_LINKS = [
  { label: 'Miljöansvar', href: '/digital/villkor/miljoansvar' },
  { label: 'Kryptering', href: '/digital/villkor/kryptering' },
  { label: 'Tillgänglighet', href: '/digital/villkor/tillganglighet' },
];

const CONTACT_ROWS = [
  {
    label: 'Mån-fre 09:00-17:00',
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
  const footerRef = useRef<HTMLElement>(null);

  return (
    <footer
      id="kontakt"
      ref={footerRef}
      className="site-footer"
      style={{ position: 'relative', background: 'linear-gradient(160deg, rgb(12,13,18) 0%, #030303 140%)', padding: '120px 60px 80px', overflow: 'hidden' }}
    >
      <FloatingParticles sectionRef={footerRef} />
      <div style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div
          className="grid-footer"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
            gap: '40px',
            alignItems: 'start',
            marginBottom: '80px',
          }}
        >
          {/* Column 1: Logo + description */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1.5px solid #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <img src="/techpilots-logo-new.svg" alt="Techpilots" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
              </div>

              <h2
                style={{
                  fontSize: 'clamp(24px,2.5vw,32px)',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1.05,
                }}
              >
                TECHPILOTS
              </h2>
            </div>

            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: '0 0 24px', maxWidth: '360px' }}>
              Vi hjälper varumärken växa digitalt genom skräddarsydd design, webbutveckling och teknisk SEO.
            </p>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
              {SOCIAL_ICONS.map((s) => (
                <Link key={s.label} href={s.href} target="_blank" aria-label={s.label} className="nav-link" style={{ display: 'flex' }}>
                  {s.icon}
                </Link>
              ))}
            </div>

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
          <div className="footer-col" style={{ marginTop: '60px' }}>
            <div style={columnHeadingStyle}>Snabblänkar</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {QUICK_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="nav-link" style={{ fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Terms */}
          <div className="footer-col" style={{ marginTop: '60px' }}>
            <div style={columnHeadingStyle}>Juridiskt</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {TERMS_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="nav-link" style={{ fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Responsibility */}
          <div className="footer-col" style={{ marginTop: '60px' }}>
            <div style={columnHeadingStyle}>Ansvar &amp; säkerhet</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {RESPONSIBILITY_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="nav-link" style={{ fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>
                  {l.label}
                </Link>
              ))}
            </div>
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
          <span style={{ fontSize: '13px', color: '#fff' }}>Techpilots AB. Alla rättigheter förbehållna.</span>
        </div>
      </div>
    </footer>
  );
}
