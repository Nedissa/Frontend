'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { SectionHeader } from './SectionHeader';
import { PROJECTS } from '../projekt-data';

const MOBILE_BREAKPOINT = 900;
const STICKY_TOP = 100;
const CARD_HEIGHT = 480;
const CARD_GAP = 12;

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;

    const measure = () => {
      rafId = null;

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

    // Coalesce scroll events till en mätning per animationsframe, annars hinner
    // CSS-transitionen aldrig köra klart innan nästa scroll-event skriver ett nytt
    // värde — det gör att panelen känns hackig istället för att glida mjukt.
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="projekt"
      ref={sectionRef}
      className="section-projects bg-white pt-[140px] pb-[140px] mx-[60px] box-border"
    >
      <SectionHeader num="06" label="Projekt" extra="© 2026" hasVisibleHeading />

      {/* Main layout */}
      <div
        className="grid-projects grid items-start pt-[80px]"
        style={{ gridTemplateColumns: '26vw 44vw 30vw' }}
      >
        {/* Left panel — JS-driven sticky */}
        <div
          ref={leftRef}
          className="projects-left-panel flex flex-col items-end pr-[40px]"
          style={{
            transform: `translateY(${offset}px)`,
            transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <h2
            className="font-bold leading-none text-[#030303] m-0 mb-[24px]"
            style={{ fontSize: 'clamp(40px,6vw,64px)', letterSpacing: '-0.04em' }}
          >
            TP-26'
          </h2>
          <a
            href="#"
            className="flex items-center justify-between pb-[10px] text-[16px] font-medium text-[#030303] no-underline w-fit min-w-[120px]"
            style={{ borderBottom: '1px solid rgb(180,180,180)' }}
          >
            Alla projekt <span>↗</span>
          </a>
        </div>

        {/* Middle: project cards */}
        <div className="flex flex-col" style={{ gap: `${CARD_GAP}px` }}>
          {PROJECTS.map((p) => (
            <Link
              key={p.slug}
              href={`/tjanster/projekt/${p.slug}`}
              className="relative overflow-hidden flex flex-col justify-between px-[32px] py-[28px] cursor-pointer w-full box-border no-underline"
              style={{
                border: '3px solid #030303',
                height: `${CARD_HEIGHT}px`,
                background: p.image
                  ? `url(${p.image}) center/cover no-repeat`
                  : 'repeating-linear-gradient(45deg, #f0f0ee 0px, #f0f0ee 1px, #fff 1px, #fff 24px)',
              }}
            >
              {p.image && <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.25)' }} />}
              <div className="flex justify-between relative z-[1]">
                <span
                  className="text-[12px] uppercase"
                  style={{
                    letterSpacing: '0.08em',
                    color: p.image ? 'rgba(255,255,255,0.7)' : 'rgb(104,105,99)',
                  }}
                >
                  {p.category}
                </span>
                <span
                  className="text-[12px]"
                  style={{ color: p.image ? 'rgba(255,255,255,0.7)' : 'rgb(104,105,99)' }}
                >
                  {p.year}
                </span>
              </div>
              <div
                className="text-[26px] font-semibold relative z-[1]"
                style={{
                  letterSpacing: '-0.03em',
                  color: p.image ? '#fff' : '#030303',
                }}
              >
                {p.title}
              </div>
            </Link>
          ))}
        </div>

        {/* Right: See all — JS-driven sticky. Desktop only. */}
        <div
          className="projects-right-panel hide-mobile pl-[40px]"
          style={{
            transform: `translateY(${offset}px)`,
            transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            className="inline-flex items-center gap-[12px] rounded-[6px] px-[14px] py-[10px] cursor-pointer"
            style={{ background: 'rgb(240,240,238)' }}
          >
            <div
              className="w-[52px] h-[52px] rounded-[4px] shrink-0"
              style={{ background: 'rgb(160,140,130)' }}
            />
            <span className="text-[15px] font-medium text-[#030303] whitespace-nowrap">Se alla (08)</span>
          </div>
        </div>

      </div>
    </section>
  );
}
