'use client';
import Link from 'next/link';

const links = [
  { label: 'Hem', num: '01', href: '/webbstudio' },
  { label: 'Projekt', num: '02', href: '/webbstudio#projekt' },
  { label: 'Om', num: '03', href: '/webbstudio#kunder' },
  { label: 'Kontakt', num: '04', href: '/webbstudio/kontakt' },
];

export function SiteNav() {
  return (
    <nav style={{ position: 'absolute', top: '28px', left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: 'transparent' }}>
      <Link href="/webbstudio" style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/logo.png" alt="Techpilots" style={{ width: '16px', height: '16px', filter: 'brightness(0) invert(1)' }} />
      </Link>

      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '72px' }}>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="nav-link" style={{ fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
            {l.label}
            <sup style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginLeft: '3px' }}>{l.num}</sup>
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '28px', padding: '8px 20px 8px 8px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgb(120,90,80)', flexShrink: 0 }} />
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#fff' }}>Nedal Issa</span>
      </div>
    </nav>
  );
}
