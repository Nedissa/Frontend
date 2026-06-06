'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function PageHero({ label, title, description }: { label: string; title: string; description?: string }) {
  return (
    <>
      <style>{`
        @keyframes pageHeroShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .page-hero-bg {
          background: linear-gradient(135deg, #0a1628, #2e5f8a, #0d1b2a, #1a3a5c, #0a1628);
          background-size: 300% 300%;
          animation: pageHeroShift 8s ease infinite;
        }
      `}</style>
      <div className="w-full page-hero-bg py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-3">{label}</p>
          <h1 className="text-4xl font-bold text-white mb-3">{title}</h1>
          {description && <p className="text-gray-300 text-base max-w-xl">{description}</p>}
        </div>
      </div>
    </>
  );
}

const sidebarCategories = [
  {
    id: 'kundservice',
    label: 'Kundservice',
    links: [
      { href: '/kontakt', label: 'Kontakta oss' },
      { href: '/faq', label: 'Vanliga frågor' },
    ],
  },
  {
    id: 'leverans',
    label: 'Leverans',
    links: [
      { href: '/frakt-och-leverans', label: 'Frakt och leverans' },
    ],
  },
  {
    id: 'retur',
    label: 'Öppet köp och retur',
    links: [
      { href: '/returpolicy', label: 'Returpolicy' },
      { href: '/reklamation', label: 'Reklamation & service' },
    ],
  },
  {
    id: 'villkor',
    label: 'Villkor och tjänster',
    links: [
      { href: '/villkor', label: 'Försäljningsvillkor' },
      { href: '/integritetspolicy', label: 'Integritetspolicy' },
      { href: '/cookiepolicy', label: 'Cookiepolicy' },
    ],
  },
  {
    id: 'om-oss',
    label: 'Om oss',
    links: [
      { href: '/om-oss', label: 'Vår historia' },
    ],
  },
];

function InfoSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string[]>(() =>
    sidebarCategories
      .filter(cat => cat.links.some(l => l.href === pathname))
      .map(cat => cat.id)
      .concat(sidebarCategories.map(c => c.id))
  );

  const toggle = (id: string) => {
    setOpen(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <aside style={{ width: '220px', flexShrink: 0, fontFamily: "'Manrope', sans-serif" }}>
      <nav>
        {sidebarCategories.map(cat => {
          const isOpen = open.includes(cat.id);
          return (
            <div key={cat.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <button
                onClick={() => toggle(cat.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#111',
                  textAlign: 'left',
                }}
              >
                {cat.label}
                <span style={{ fontSize: '0.75rem', color: '#999', marginLeft: '8px' }}>
                  {isOpen ? '▲' : '▼'}
                </span>
              </button>
              <div style={{
                maxHeight: isOpen ? '300px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease',
              }}>
                <div style={{ paddingBottom: '8px' }}>
                  {cat.links.map(link => {
                    const active = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        style={{
                          display: 'block',
                          padding: '6px 0 6px 12px',
                          fontSize: '0.82rem',
                          color: active ? '#000' : '#555',
                          fontWeight: active ? 700 : 400,
                          borderLeft: active ? '2px solid #000' : '2px solid transparent',
                          textDecoration: 'none',
                        }}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function FadeContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      setVisible(false);
      prevPath.current = pathname;
      const t = setTimeout(() => setVisible(true), 30);
      return () => clearTimeout(t);
    } else {
      setVisible(true);
    }
  }, [pathname]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 280ms ease',
        flex: 1,
        minWidth: 0,
      }}
    >
      {children}
    </div>
  );
}

export function InfoPageLayout({
  title,
  label,
  description,
  updatedDate,
  version,
  children,
}: {
  title: string;
  label?: string;
  description?: string;
  updatedDate?: string;
  version?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        .info-animated-bg {
          background: #fff;
        }
        .info-page-content {
          text-align: left;
        }
        .info-page-content section {
          padding-bottom: 2rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #e5e7eb;
        }
        .info-page-content section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .info-page-content * {
          color: #000 !important;
        }
        .info-page-content h1,
        .info-page-content h2,
        .info-page-content h3,
        .info-page-content h4,
        .info-page-content strong {
          color: #000 !important;
        }
        .info-page-content h2 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        .info-page-content h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
        }
        .info-page-content p {
          font-size: 0.9rem;
          line-height: 1.75;
          margin-bottom: 0.5rem;
        }
        .info-page-content ul {
          list-style: disc;
          padding-left: 1.4rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .info-page-content ol {
          list-style: decimal;
          padding-left: 1.4rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .info-page-content li {
          margin-bottom: 0.35rem;
          font-size: 0.9rem;
          line-height: 1.65;
        }
      `}</style>
      <div className="min-h-screen w-full info-animated-bg" style={{ fontFamily: "'Manrope', sans-serif" }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px 40px', display: 'flex', gap: '48px', alignItems: 'flex-start' }}>

          <InfoSidebar />

          <FadeContent>
            {label && <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">{label}</p>}
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#000', marginBottom: '6px' }}>{title}</h1>
            {description && <p style={{ color: '#555', fontSize: '0.875rem', marginBottom: '20px' }}>{description}</p>}
            {(version || updatedDate) && (
              <div className="flex gap-3 mb-8">
                {version && (
                  <div className="bg-gray-50 px-6 py-3 text-center" style={{ minWidth: '120px' }}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Version</p>
                    <p className="text-sm font-semibold text-gray-700">{version}</p>
                  </div>
                )}
                {updatedDate && (
                  <div className="bg-gray-50 px-6 py-3 text-center" style={{ minWidth: '160px' }}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Senast uppdaterad</p>
                    <p className="text-sm font-semibold text-gray-700">{updatedDate}</p>
                  </div>
                )}
              </div>
            )}
            <div className="px-10 py-10 bg-white" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <div className="info-page-content">
                {children}
              </div>
            </div>
          </FadeContent>

        </div>
      </div>
    </>
  );
}
