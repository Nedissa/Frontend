'use client';
import { useEffect, useRef, useState } from 'react';

const PROJECTS = [
  { title: 'Sagateatern', category: 'Webb & Varumärke', year: '2025' },
  { title: 'Pistolero Studio', category: 'Design & UX', year: '2025' },
  { title: 'Nordisk Handel', category: 'E-handel', year: '2024' },
  { title: 'Techpilots.se', category: 'Webb & SEO', year: '2024' },
];

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      const left = leftRef.current;
      if (!section || !left) return;

      const sectionRect = section.getBoundingClientRect();
      const viewportTop = 100;
      const cardHeight = 480;
      const cardGap = 12;
      const numCards = 4;
      const totalCardsHeight = cardHeight * numCards + cardGap * (numCards - 1);
      const panelHeight = left.offsetHeight;

      // How far the panel is allowed to move at most: total card height minus half the last card minus the panel height
      const maxOffset = totalCardsHeight - panelHeight;

      if (sectionRect.top > viewportTop) {
        setOffset(0);
      } else {
        const move = Math.abs(sectionRect.top - viewportTop);
        setOffset(Math.min(move, Math.max(maxOffset, 0)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} style={{ background: '#fff', paddingTop: '120px', paddingBottom: '120px', margin: '0 60px' }}>

      {/* Top nav row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 0',
        borderTop: '1px solid rgb(210,210,210)',
        fontSize: '12px', color: '#030303', letterSpacing: '0.04em',
      }}>
        <span>◆ (02)</span>
        <span>(Projekt)</span>
        <span>© 2026</span>
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '26vw 44vw 30vw', paddingTop: '80px', alignItems: 'start' }}>

        {/* Left panel — JS-driven sticky */}
        <div ref={leftRef} style={{
          transform: `translateY(${offset}px)`,
          transition: 'transform 0.12s ease-out',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingRight: '40px',
        }}>
          <h2 style={{ fontSize: '64px', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, color: '#030303', margin: '0 0 24px' }}>
            TP-26'
          </h2>
          <a href="#" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid rgb(180,180,180)', paddingBottom: '10px',
            fontSize: '16px', fontWeight: 500, color: '#030303', textDecoration: 'none',
            width: 'fit-content', minWidth: '120px',
          }}>
            Projekt <span>↗</span>
          </a>
        </div>

        {/* Middle: project cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {PROJECTS.map((p) => (
            <div key={p.title} style={{
              border: '3px solid #030303', height: '480px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              padding: '28px 32px', cursor: 'pointer', background: '#fff',
              width: '100%', boxSizing: 'border-box',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'rgb(140,140,134)', textTransform: 'uppercase' }}>{p.category}</span>
                <span style={{ fontSize: '12px', color: 'rgb(140,140,134)' }}>{p.year}</span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: 600, letterSpacing: '-0.03em', color: '#030303' }}>
                {p.title}
              </div>
            </div>
          ))}
        </div>

        {/* Right: See all — JS-driven sticky */}
        <div ref={rightRef} style={{
          transform: `translateY(${offset}px)`,
          transition: 'transform 0.12s ease-out',
          paddingLeft: '40px',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            background: 'rgb(240,240,238)', borderRadius: '6px', padding: '10px 14px', cursor: 'pointer',
          }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '4px', background: 'rgb(160,140,130)', flexShrink: 0 }} />
            <span style={{ fontSize: '15px', fontWeight: 500, color: '#030303', whiteSpace: 'nowrap' }}>Se alla (07)</span>
          </div>
        </div>

      </div>
    </section>
  );
}
