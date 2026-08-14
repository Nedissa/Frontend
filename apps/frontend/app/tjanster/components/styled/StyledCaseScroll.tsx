'use client';
import type { ReactNode } from 'react';
import type { Project } from '../../projekt-data';
import { FadeIn } from '../FadeIn';
import { Eyebrow } from './StyledPrimitives';

function CaseBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex flex-col gap-3">
      <Eyebrow>{label}</Eyebrow>
      <p className="text-base leading-relaxed text-[#5c5c58] max-w-[40ch] m-0">{text}</p>
    </div>
  );
}

const TECH_ICONS: Record<string, ReactNode> = {
  'Framer': (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M4 2h16v7h-8l8 7.5H4V9h8L4 2z" /></svg>
  ),
  'CMS': (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" /><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" /></svg>
  ),
  'UX/UI Design': (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 0 0 20 2.5 2.5 0 0 0 0-5h1a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h2a2 2 0 0 0 0-4z" /><circle cx="7.5" cy="10.5" r="1" fill="currentColor" stroke="none" /><circle cx="7.5" cy="15.5" r="1" fill="currentColor" stroke="none" /></svg>
  ),
  'Custom Code': (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 3 12 9 18" /><polyline points="15 6 21 12 15 18" /></svg>
  ),
  'Next.js': (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M9 8v8l7-8v8" /></svg>
  ),
  'Payload CMS': (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" /><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" /></svg>
  ),
  'Stripe': (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
  ),
};

function TechStack({ technologies }: { technologies: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <Eyebrow>Teknik</Eyebrow>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-black/15 rounded-full text-xs font-medium text-[#5c5c58]"
          >
            {TECH_ICONS[tech] && <span className="shrink-0 text-[#8a8a86]">{TECH_ICONS[tech]}</span>}
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-widest text-[#8a8a86]">{label}</span>
      <span className="text-sm font-bold uppercase text-[#030303]">{value}</span>
    </div>
  );
}

export function StyledCaseScroll({ project }: { project: Project }) {
  if (!project.challenge && !project.solution && !project.result && !project.conclusionImage) return null;

  return (
    <section className="relative pt-32 md:pt-40">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 box-border pb-16 md:pb-24 lg:pb-32">
        <FadeIn>
          <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
            <h1 className="text-[clamp(36px,6vw,52px)] font-bold uppercase tracking-tight leading-[0.95] text-[#030303] m-0">
              {project.title}
            </h1>
            <div className="flex gap-8 shrink-0 mt-6">
              <MetaItem label="Client" value={project.title} />
              <MetaItem label="Service" value={project.category} />
              <MetaItem label="Date" value={project.year} />
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start flex flex-col gap-16">
            <FadeIn>
              <div className="flex flex-col gap-16">
                {project.challenge && <CaseBlock label="Utmaning" text={project.challenge} />}
                {project.solution && <CaseBlock label="Lösning" text={project.solution} />}
                {project.result && <CaseBlock label="Resultat" text={project.result} />}
                {project.technologies && project.technologies.length > 0 && (
                  <TechStack technologies={project.technologies} />
                )}
              </div>
            </FadeIn>

            {project.website && (
              <FadeIn delay={0.1}>
                <a
                  href={`https://${project.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-base text-[#030303] font-medium border-b border-black/20 pb-1 w-fit no-underline transition-colors duration-300 hover:border-black/60"
                >
                  Besök webbplatsen
                </a>
              </FadeIn>
            )}
          </div>

          {project.conclusionImage && (
            <div className="flex flex-col items-center">
              <FadeIn>
                <div className="w-full border border-black/20 bg-white overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center gap-4 px-4 py-2.5 bg-[#f0f0ee] border-b border-black/10">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-[#5c5c58]">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="16" rx="2.5" /><line x1="9.5" y1="4" x2="9.5" y2="20" /></svg>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 6 9 12 15 18" /></svg>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
                    </div>

                    <div className="flex-1 flex items-center gap-2 bg-white border border-black/10 rounded-md px-3 py-1 text-[#8a8a86]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0"><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3z" /></svg>
                      <span className="text-xs truncate">{project.website ?? project.title.toLowerCase().replace(/\s+/g, '')}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-[#5c5c58]">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12" /><polyline points="7 10 12 15 17 10" /><line x1="4" y1="20" x2="20" y2="20" /></svg>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a9 9 0 1 0 9 9" /><path d="M12 3v6h6" /></svg>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="13" height="13" rx="2" /><rect x="8" y="8" width="13" height="13" rx="2" /></svg>
                    </div>
                  </div>
                  <div className="h-[520px] overflow-y-auto overflow-x-hidden">
                    <img
                      src={project.conclusionImage}
                      alt={project.title}
                      className="w-full h-auto block"
                    />
                  </div>
                </div>
              </FadeIn>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
