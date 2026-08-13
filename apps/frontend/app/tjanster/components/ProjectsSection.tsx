'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { SectionHeader } from './SectionHeader';
import { PROJECTS } from '../projekt-data';

const MOBILE_BREAKPOINT = 900;
const STICKY_TOP = 100;
const CARD_HEIGHT = 480;
const CARD_GAP = 24;

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
              className="group flex flex-col cursor-pointer w-full box-border no-underline p-[20px]"
              style={{
                height: `${CARD_HEIGHT}px`,
                background: 'rgb(240,240,238)',
                borderRadius: '16px',
              }}
            >
              <div
                className="relative flex-1 min-h-0 p-[20px]"
                style={{
                  background: '#f5f5f3',
                  borderRadius: '10px',
                }}
              >
                {p.cardImage && p.accentColor && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${p.accentColor}80 0%, transparent 70%)`,
                    }}
                  />
                )}
                <div className="absolute inset-0 flex items-end justify-center">
                  {p.cardImage && (
                    <img
                      src={p.cardImage}
                      alt={p.title}
                      className="max-w-[100%] max-h-[100%] object-contain"
                    />
                  )}
                </div>
                <div className="absolute left-[20px] right-[20px] top-[20px] flex flex-col gap-[8px]">
                  <div
                    className="text-[26px] font-semibold"
                    style={{ letterSpacing: '-0.03em', color: '#030303' }}
                  >
                    {p.title}
                  </div>
                  <span
                    className="text-[12px] uppercase"
                    style={{ letterSpacing: '0.08em', color: 'rgb(104,105,99)' }}
                  >
                    {p.category}
                  </span>
                  <span
                    className="inline-flex w-fit text-[11px] font-bold uppercase mt-[8px]"
                    style={{
                      letterSpacing: '0.06em',
                      color: '#030303',
                      background: '#e8c547',
                      borderRadius: '999px',
                      padding: '6px 14px',
                    }}
                  >
                    Projekt
                  </span>
                </div>
                <span
                  className="absolute right-[20px] bottom-[20px] flex items-center justify-center w-[36px] h-[36px] rounded-full shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-[6px]"
                  style={{ background: '#030303' }}
                >
                  <svg
                    className="transition-transform duration-300 ease-out group-hover:translate-x-[3px]"
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
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
