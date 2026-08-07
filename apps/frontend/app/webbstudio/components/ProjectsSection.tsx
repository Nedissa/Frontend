'use client';
import { useEffect, useRef, useState } from 'react';
import { SectionHeader } from './SectionHeader';

const PROJECTS = [
  { title: 'Sagateatern', category: 'Webb & Varumärke', year: '2025' },
  { title: 'Pistolero Studio', category: 'Design & UX', year: '2025' },
  { title: 'Nordisk Handel', category: 'E-handel', year: '2024' },
  { title: 'Techpilots.se', category: 'Webb & SEO', year: '2024' },
];

const MOBILE_BREAKPOINT = 900;
const STICKY_TOP = 100;
const CARD_HEIGHT = 480;
const CARD_GAP = 12;

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        setOffset(0);
        return;
      }

      const section = sectionRef.current;
      const left = leftRef.current;
      if (!section || !left) return;

      const sectionRect = section.getBoundingClientRect();
      if (sectionRect.top > STICKY_TOP) {
        setOffset(0);
        return;
      }

      // Stop the panel once it reaches the bottom of the card column.
      const totalCardsHeight = CARD_HEIGHT * PROJECTS.length + CARD_GAP * (PROJECTS.length - 1);
      const maxOffset = Math.max(totalCardsHeight - left.offsetHeight, 0);
      const scrolledPast = Math.abs(sectionRect.top - STICKY_TOP);
      setOffset(Math.min(scrolledPast, maxOffset));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="projekt" ref={sectionRef} className="section-projects" style={{ background: '#fff', paddingTop: '140px', paddingBottom: '140px', margin: '0 60px', boxSizing: 'border-box' }}>

      <SectionHeader num="04" label="Projekt" extra="© 2026" />

      {/* Main layout */}
      <div className="grid-projects" style={{ display: 'grid', gridTemplateColumns: '26vw 44vw 30vw', paddingTop: '80px', alignItems: 'start' }}>

        {/* Left panel — JS-driven sticky */}
        <div ref={leftRef} className="projects-left-panel" style={{
          transform: `translateY(${offset}px)`,
          transition: 'transform 0.12s ease-out',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingRight: '40px',
        }}>
          <h2 style={{ fontSize: 'clamp(40px,6vw,64px)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, color: '#030303', margin: '0 0 24px' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${CARD_GAP}px` }}>
          {PROJECTS.map((p) => (
            <div key={p.title} style={{
              border: '3px solid #030303', height: `${CARD_HEIGHT}px`,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              padding: '28px 32px', cursor: 'pointer', background: '#fff',
              width: '100%', boxSizing: 'border-box',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'rgb(104,105,99)', textTransform: 'uppercase' }}>{p.category}</span>
                <span style={{ fontSize: '12px', color: 'rgb(104,105,99)' }}>{p.year}</span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: 600, letterSpacing: '-0.03em', color: '#030303' }}>
                {p.title}
              </div>
            </div>
          ))}
        </div>

        {/* Right: See all — JS-driven sticky */}
        <div className="projects-right-panel" style={{
          transform: `translateY(${offset}px)`,
          transition: 'transform 0.12s ease-out',
          paddingLeft: '40px',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            background: 'rgb(240,240,238)', borderRadius: '6px', padding: '10px 14px', cursor: 'pointer',
          }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '4px', background: 'rgb(160,140,130)', flexShrink: 0 }} />
            <span style={{ fontSize: '15px', fontWeight: 500, color: '#030303', whiteSpace: 'nowrap' }}>Se alla (08)</span>
          </div>
        </div>

      </div>
    </section>
  );
}
