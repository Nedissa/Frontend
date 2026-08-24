'use client';
import Link from 'next/link';
import { SectionHeader } from './SectionHeader';
import { CardParticles } from './CardParticles';
import { BrowserFrame } from './BrowserFrame';
import { PROJECTS } from '../projekt-data';

const CARD_GAP = 56;

export function ProjectsSection() {
  return (
    <section
      id="projekt"
      className="section-projects bg-white pt-[140px] pb-[140px] mx-[60px] box-border"
    >
      <SectionHeader num="06" label="Projekt" extra="© 2026" hasVisibleHeading />

      {/* Main layout */}
      <div
        className="grid-projects grid items-start pt-[80px]"
        style={{ gridTemplateColumns: '26vw 44vw 30vw' }}
      >
        {/* Left panel */}
        <div className="projects-left-panel flex flex-col items-end pr-[40px]">
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
          {PROJECTS.map((p, i) => (
            <div key={p.slug} className="flex flex-col">
              <Link
                href={`/digital/projekt/${p.slug}`}
                className="group flex flex-col cursor-pointer w-full box-border no-underline p-[20px] h-[380px] md:h-[560px]"
                style={{
                  background: 'rgb(240,240,238)',
                  borderRadius: '8px',
                }}
              >
                <div
                  className="relative flex-1 min-h-0 p-[20px] overflow-hidden"
                  style={{
                    background: '#f5f5f3',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, transparent 50%, #030303 50%)',
                      opacity: 0.08,
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #e8c547 50%, transparent 50%)',
                      opacity: 0.08,
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                    style={{
                      WebkitMaskImage: 'linear-gradient(135deg, #000 50%, transparent 50%)',
                      maskImage: 'linear-gradient(135deg, #000 50%, transparent 50%)',
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{ background: '#030303' }}
                    >
                      <CardParticles />
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    {p.cardImage && (
                      <BrowserFrame
                        src={p.cardImage}
                        alt={p.title}
                        website={p.website ?? p.title.toLowerCase().replace(/\s+/g, '')}
                        className="max-w-[75%] mx-auto"
                      />
                    )}
                  </div>
                  <div className="absolute left-[20px] top-[20px] w-[19%] flex flex-col gap-[12px] z-10">
                    <span
                      className="inline-flex w-fit text-[11px] font-bold uppercase"
                      style={{
                        letterSpacing: '0.06em',
                        color: '#fff',
                        background: '#030303',
                        borderRadius: '999px',
                        padding: '6px 14px',
                      }}
                    >
                      Projekt
                    </span>
                  </div>
                  <span
                    className="absolute right-[20px] bottom-[20px] flex items-center justify-center w-[36px] h-[36px] rounded-full shrink-0"
                    style={{ background: '#030303' }}
                  >
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </Link>
              <div className="flex items-start justify-between pt-[16px]">
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[16px] font-semibold text-[#030303]">{p.title}</span>
                  <span className="text-[13px]" style={{ color: 'rgb(104,105,99)' }}>{p.category}</span>
                </div>
                <span
                  className="text-[12px]"
                  style={{ color: 'rgb(104,105,99)' }}
                >
                  © 2026
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: See all. Desktop only. */}
        <div className="projects-right-panel hide-mobile pl-[40px]">
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
