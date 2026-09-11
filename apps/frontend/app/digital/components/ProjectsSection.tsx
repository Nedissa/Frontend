'use client';
import Link from 'next/link';
import { SectionHeader } from './SectionHeader';
import { FadeIn } from './FadeIn';
import { CardParticles } from './CardParticles';
import { PROJECTS } from '../projekt-data';

const CARD_GAP = 56;
const FEATURED_SLUGS = ['pistolero-studio', 'crownmatch', 'sagateatern'];
const FEATURED_PROJECTS = FEATURED_SLUGS
  .map((slug) => PROJECTS.find((p) => p.slug === slug))
  .filter((p): p is (typeof PROJECTS)[number] => p !== undefined);

export function ProjectsSection() {
  return (
    <section
      className="section-projects bg-white pt-[140px] pb-[140px] mx-[60px] box-border"
    >
      {/* id sitter på SectionHeader-wrappern (inte <section>) så scrollToAnchorId i SiteNav
          landar vid innehållets faktiska start, inte 140px ovanför i sektionens padding-top. */}
      <div id="projekt">
        <SectionHeader num="07" label="Projekt" extra="© 2026" hasVisibleHeading />
      </div>

      {/* Main layout */}
      <FadeIn
        className="grid-projects grid items-start pt-[80px]"
        style={{ gridTemplateColumns: '26vw 44vw 30vw' }}
      >
        {/* Left panel */}
        <div className="projects-left-panel flex flex-col items-end pr-[40px]">
          <h2
            className="font-bold leading-none text-[#030303] m-0 mb-[24px]"
            style={{ fontSize: 'clamp(40px,6vw,64px)', letterSpacing: '-0.04em' }}
          >
            TP-26&apos;
          </h2>
          <Link
            href="/digital/projekt"
            className="flex items-center justify-between pb-[10px] text-[16px] font-medium text-[#030303] no-underline w-fit min-w-[120px]"
            style={{ borderBottom: '1px solid rgb(180,180,180)' }}
          >
            Alla projekt <span>↗</span>
          </Link>
        </div>

        {/* Middle: project cards */}
        <div className="flex flex-col" style={{ gap: `${CARD_GAP}px` }}>
          {FEATURED_PROJECTS.map((p, i) => (
            <div key={p.slug} className="flex flex-col">
              <Link
                href={`/digital/projekt/${p.slug}`}
                className="project-card-link group flex flex-col cursor-pointer w-full box-border no-underline p-[20px] h-[320px] md:h-[520px]"
                style={{
                  background: 'rgb(240,240,238)',
                  borderRadius: '5px',
                }}
              >
                <div
                  className="relative flex-1 min-h-0 p-[20px] overflow-hidden"
                  style={{
                    background: '#f5f5f3',
                    borderRadius: '5px',
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
                  <div className="project-card-mockup-wrap absolute inset-0 flex items-center justify-center z-0">
                    {p.cardImage && (
                      <img
                        src={p.cardImage}
                        alt={p.title}
                        width={2515}
                        height={1414}
                        className="project-card-browser-frame max-w-[75%] mx-auto border-2 border-black/15 bg-white overflow-hidden"
                        style={{ borderRadius: 5 }}
                      />
                    )}
                  </div>
                </div>
              </Link>
              <div className="project-card-meta flex items-center justify-between pt-[16px]">
                <span className="text-[16px] font-semibold text-[#030303]">{p.title}</span>
                <span className="text-[13px]" style={{ color: 'rgb(104,105,99)' }}>{p.category}</span>
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

        {/* Right: empty spacer column to preserve the 3-column grid ratio. Desktop only. */}
        <div className="projects-right-panel hide-mobile pl-[40px]" />

      </FadeIn>
    </section>
  );
}
