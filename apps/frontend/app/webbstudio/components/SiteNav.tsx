'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { label: 'Hem', num: '01', href: '/webbstudio' },
  { label: 'Om', num: '02', href: '/webbstudio#om' },
  { label: 'Projekt', num: '03', href: '/webbstudio#projekt' },
  { label: 'Kontakt', num: '04', href: '/webbstudio/kontakt' },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    setHash(window.location.hash);
  }, [pathname, open]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isLinkActive = (href: string) => {
    const [linkPath, linkAnchor] = href.split('#');
    return pathname === linkPath && (linkAnchor ? hash === `#${linkAnchor}` : hash === '');
  };

  return (
    <nav
      className="site-nav"
      style={{
        position: 'absolute', top: '28px', left: 0, right: 0, width: '100%', zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px',
        background: 'transparent',
        boxSizing: 'border-box',
      }}
    >
      <Link href="/webbstudio" className="site-nav-logo" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', zIndex: 110 }}>
        <img src="/logo.png" alt="Techpilots" style={{ width: '18px', height: '18px', filter: 'brightness(0) invert(1)' }} />
      </Link>

      <div className="nav-links-desktop" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '72px' }}>
        {links.map((l) => {
          const isActive = isLinkActive(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className="nav-link"
              style={{ fontSize: '13px', fontWeight: 600, textDecoration: 'none', color: isActive ? '#e8c547' : '#fff' }}
            >
              {l.label}
              <sup style={{ fontSize: '9px', color: isActive ? 'rgba(232,197,71,0.6)' : 'rgba(255,255,255,0.4)', marginLeft: '3px', verticalAlign: 'super' }}>{l.num}</sup>
            </Link>
          );
        })}
      </div>

      <div className="nav-profile-desktop" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '28px', padding: '8px 20px 8px 8px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgb(120,90,80)', flexShrink: 0 }} />
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#fff' }}>Nedal Issa</span>
      </div>

      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Stäng meny' : 'Öppna meny'}
        className="nav-burger"
        style={{
          display: 'none',
          width: '40px', height: '40px', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', cursor: 'pointer', flexShrink: 0,
          position: 'relative', zIndex: 110,
        }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
          <circle cx="20" cy="20" r="18.5" fill="none" stroke="rgba(232,197,71,0.9)" strokeWidth="1.5" strokeDasharray={2 * Math.PI * 18.5} strokeDashoffset={2 * Math.PI * 18.5 * (1 - scrollProgress)} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.15s linear' }} />
        </svg>
        <span style={{
          position: 'absolute', width: '18px', height: '2px', background: '#fff', borderRadius: '1px',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s cubic-bezier(0.76, 0, 0.24, 1)',
        }} />
        <span style={{
          position: 'absolute', width: '18px', height: '2px', background: '#fff', borderRadius: '1px',
          transform: open ? 'rotate(-45deg)' : 'rotate(90deg)',
          transition: 'transform 0.3s cubic-bezier(0.76, 0, 0.24, 1)',
        }} />
      </button>

      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgb(12,13,18)',
          display: 'flex', flexDirection: 'column',
          clipPath: open ? 'circle(150% at calc(100% - 52px) 48px)' : 'circle(0% at calc(100% - 52px) 48px)',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'clip-path 0.5s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '104px', padding: '0 32px' }}>
          {links.map((l) => {
            const isActive = isLinkActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="nav-link"
                style={{
                  fontSize: '32px', fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.02em',
                  color: isActive ? '#e8c547' : '#fff',
                  padding: '20px 0',
                  borderTop: '1px solid rgba(255,255,255,0.12)',
                  opacity: open ? 1 : 0,
                  transition: `opacity 0.3s ease ${open ? '0.25s' : '0s'}`,
                }}
              >
                {l.label}
                <sup style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginLeft: '8px', verticalAlign: 'super' }}>{l.num}</sup>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
