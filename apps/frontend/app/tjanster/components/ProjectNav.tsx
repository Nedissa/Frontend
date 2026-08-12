'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { label: 'Hem', num: '01', href: '/tjanster' },
  { label: 'Om', num: '02', href: '/tjanster#om' },
  { label: 'Projekt', num: '03', href: '/tjanster#projekt' },
  { label: 'Priser', num: '04', href: '/tjanster#priser' },
  { label: 'Kontakt', num: '05', href: '/tjanster/kontakt' },
];

// Scroll-progress ring drawn around the mobile burger button.
const BURGER_RING_RADIUS = 18.5;
const BURGER_RING_CIRCUMFERENCE = 2 * Math.PI * BURGER_RING_RADIUS;

const BURGER_BAR_STYLE: React.CSSProperties = {
  position: 'absolute',
  width: '18px',
  height: '2px',
  background: '#030303',
  borderRadius: '1px',
  transition: 'transform 0.3s cubic-bezier(0.76, 0, 0.24, 1)',
};

const LOGO_CIRCLE_STYLE: React.CSSProperties = {
  width: '52px',
  height: '52px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const LOGO_IMG_STYLE: React.CSSProperties = {
  width: '40px',
  height: '40px',
  filter: 'none',
};

export function ProjectNav() {
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navHidden, setNavHidden] = useState(false);
  const pathname = usePathname();

  // Re-read the hash on navigation, when the menu toggles, and on hashchange.
  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, [pathname, open]);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);

      const y = window.scrollY;
      const delta = y - lastY;
      if (y < 80) {
        setNavHidden(false);
      } else if (delta > 4) {
        setNavHidden(true);
      } else if (delta < -4) {
        setNavHidden(false);
      }
      lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isLinkActive = (href: string): boolean => {
    const [linkPath, linkAnchor] = href.split('#');
    return pathname === linkPath && (linkAnchor ? hash === `#${linkAnchor}` : hash === '');
  };

  // Klick från projektsidan till en förstasides-sektion är en riktig sidladdning (annan route).
  // Next.js hash-scroll efter sidladdning är opålitlig, så vi navigerar utan hash och lagrar
  // målankaret i sessionStorage — förstasidan läser det vid mount och scrollar dit manuellt.
  const handleAnchorNavigate = (anchor: string) => () => {
    sessionStorage.setItem('webbstudio-scroll-to', anchor);
  };

  return (
    <nav
      className="site-nav"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, width: '100%', height: '72px', zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px',
        background: '#fff',
        boxShadow: '0 1px 0 rgba(3,3,3,0.08)',
        boxSizing: 'border-box',
        transform: navHidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.3s ease',
      }}
    >
      <Link href="/tjanster" className="site-nav-logo nav-logo-mobile" style={{ ...LOGO_CIRCLE_STYLE, position: 'relative', zIndex: 110 }}>
        <img src="/logo.png" alt="Techpilots" style={LOGO_IMG_STYLE} />
      </Link>

      <Link href="/tjanster" className="site-nav-logo hide-mobile" style={LOGO_CIRCLE_STYLE}>
        <img src="/logo.png" alt="Techpilots" style={LOGO_IMG_STYLE} />
      </Link>

      <div className="nav-links-desktop" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '96px', zIndex: 60 }}>
        {links.map((l) => {
          const isActive = isLinkActive(l.href);
          const [linkPath, linkAnchor] = l.href.split('#');
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={linkAnchor ? handleAnchorNavigate(linkAnchor) : undefined}
              className="nav-link"
              style={{ fontSize: '13px', fontWeight: 600, textDecoration: 'none', color: isActive ? '#D75E15' : '#030303' }}
            >
              {l.label}
              <sup style={{ fontSize: '9px', color: isActive ? 'rgba(215,94,21,0.6)' : 'rgba(3,3,3,0.4)', marginLeft: '3px', verticalAlign: 'super' }}>{l.num}</sup>
            </Link>
          );
        })}
      </div>

      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Stäng meny' : 'Öppna meny'}
        className="nav-burger"
        style={{
          display: 'none',
          width: '40px', height: '40px', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(3,3,3,0.1)', border: '1px solid rgba(3,3,3,0.2)', borderRadius: '50%', cursor: 'pointer', flexShrink: 0,
          position: 'relative', zIndex: 110,
        }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
          <circle cx="20" cy="20" r={BURGER_RING_RADIUS} fill="none" stroke="rgba(215,94,21,0.9)" strokeWidth="1.5" strokeDasharray={BURGER_RING_CIRCUMFERENCE} strokeDashoffset={BURGER_RING_CIRCUMFERENCE * (1 - scrollProgress)} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.15s linear' }} />
        </svg>
        <span style={{ ...BURGER_BAR_STYLE, transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }} />
        <span style={{ ...BURGER_BAR_STYLE, transform: open ? 'rotate(-45deg)' : 'rotate(90deg)' }} />
      </button>

      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgb(240,239,237)',
          display: 'flex', flexDirection: 'column',
          clipPath: open ? 'circle(150% at calc(100% - 52px) 48px)' : 'circle(0% at calc(100% - 52px) 48px)',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'clip-path 0.5s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '104px', padding: '0 32px' }}>
          {links.map((l) => {
            const isActive = isLinkActive(l.href);
            const [linkPath, linkAnchor] = l.href.split('#');
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => { setOpen(false); if (linkAnchor) handleAnchorNavigate(linkAnchor)(); }}
                className="nav-link"
                style={{
                  fontSize: '32px', fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.02em',
                  color: isActive ? '#D75E15' : '#030303',
                  padding: '20px 0',
                  borderTop: '1px solid rgba(3,3,3,0.12)',
                  opacity: open ? 1 : 0,
                  transition: `opacity 0.3s ease ${open ? '0.25s' : '0s'}`,
                }}
              >
                {l.label}
                <sup style={{ fontSize: '13px', color: 'rgba(3,3,3,0.4)', marginLeft: '8px', verticalAlign: 'super' }}>{l.num}</sup>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
