'use client';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Database, Layout, Code } from '@phosphor-icons/react';
import type { Project } from '../../projekt-data';
import { FadeIn } from '../FadeIn';
import { Eyebrow } from './StyledPrimitives';

function CaseBlock({ label, text, showLine, mobileDevice, mobileTitle }: { label: string; text: string; showLine?: boolean; mobileDevice?: ReactNode; mobileTitle?: string }) {
  const lineRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="relative flex gap-5 min-w-0">
      <div className="relative flex flex-col items-center shrink-0 pt-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#030303] shrink-0" />
        <span
          ref={lineRef}
          className={`absolute top-2.5 w-px bg-black/10 overflow-hidden ${showLine ? '' : 'hidden'}`}
          style={{ height: 'calc(100% + 4rem)' }}
        >
          <motion.span
            className="block w-full bg-[#030303]/70 origin-top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ height: '100%' }}
          />
        </span>
      </div>
      <div className="flex flex-col gap-3 min-w-0 w-full">
        <Eyebrow>{label}</Eyebrow>
        {mobileDevice && <div className="lg:hidden">{mobileDevice}</div>}
        {mobileTitle && <p className="lg:hidden text-lg font-bold text-[#030303] m-0">{mobileTitle}</p>}
        <p className="text-base leading-relaxed text-[#5c5c58] max-w-[40ch] m-0">{text}</p>
      </div>
    </div>
  );
}

const TECH_ICONS: Record<string, ReactNode> = {
  'Framer': <img src="/icons/tech/framer.svg" alt="" width={16} height={16} />,
  'CMS': <Database size={16} weight="fill" />,
  'UX/UI Design': <Layout size={16} weight="fill" />,
  'Custom Code': <Code size={16} weight="fill" />,
  'Next.js': <img src="/icons/tech/nextjs.svg" alt="" width={16} height={16} />,
  'Payload CMS': <Database size={16} weight="fill" />,
  'Stripe': <img src="/icons/tech/stripe.svg" alt="" width={16} height={16} />,
};

function TechStack({ technologies }: { technologies: string[] }) {
  return (
    <div className="relative flex gap-5">
      <div className="relative flex flex-col items-center shrink-0 pt-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#030303] shrink-0" />
      </div>
      <div className="flex flex-col gap-3">
        <Eyebrow>Teknik</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-2 px-4 py-2 border border-black/30 rounded-full text-sm font-medium text-[#030303]"
            >
              {TECH_ICONS[tech] && <span className="shrink-0 text-[#030303]">{TECH_ICONS[tech]}</span>}
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetaItem({ label, value, first }: { label: string; value: string; first?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 ${first ? '' : 'border-l border-black/10 pl-8'}`}>
      <span className="text-xs font-medium uppercase tracking-widest text-[#8a8a86]">{label}</span>
      <span className="text-sm font-bold uppercase text-[#030303]">{value}</span>
    </div>
  );
}

const DEVICE_FRAME_MAX_WIDTH: Record<'mobil' | 'surfplatta' | 'dator', number> = {
  mobil: 240,
  surfplatta: 460,
  dator: 640,
};

function DeviceImage({ label, src, specs, deviceType, accentColor, hideSpecs, website, title }: { label: string; src?: string; specs?: string[]; deviceType: 'mobil' | 'surfplatta' | 'dator'; accentColor?: string; hideSpecs?: boolean; website?: string; title: string }) {
  const width = DEVICE_FRAME_MAX_WIDTH[deviceType];
  const compact = deviceType === 'mobil';
  const iconSize = compact ? 11 : 15;
  return (
    <div className="w-full border-t border-black/10 pt-10 flex flex-col items-start lg:items-center gap-6">
      <div className="inline-flex flex-col max-w-full border border-black/20 bg-white overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.08)]" style={{ width: 'fit-content', maxWidth: width }}>
        <div className={`flex items-center gap-3 ${compact ? 'px-3 py-2' : 'px-4 py-2.5'} bg-[#f0f0ee] border-b border-black/10`}>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`${compact ? 'w-2 h-2' : 'w-2.5 h-2.5'} rounded-full bg-[#ff5f57]`} />
            <span className={`${compact ? 'w-2 h-2' : 'w-2.5 h-2.5'} rounded-full bg-[#febc2e]`} />
            <span className={`${compact ? 'w-2 h-2' : 'w-2.5 h-2.5'} rounded-full bg-[#28c840]`} />
          </div>

          {!compact && (
            <div className="flex items-center gap-3 shrink-0 text-[#5c5c58]">
              <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="16" rx="2.5" /><line x1="9.5" y1="4" x2="9.5" y2="20" /></svg>
              <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 6 9 12 15 18" /></svg>
              <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
            </div>
          )}

          <div className={`flex-1 flex items-center gap-1.5 bg-white border border-black/10 rounded-md ${compact ? 'px-2 py-1' : 'px-3 py-1'} text-[#8a8a86] min-w-0`}>
            <svg width={compact ? 10 : 12} height={compact ? 10 : 12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0"><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3z" /></svg>
            <span className={`${compact ? 'text-[10px]' : 'text-xs'} whitespace-nowrap`}>{website ?? title.toLowerCase().replace(/\s+/g, '')}</span>
          </div>

          {!compact && (
            <div className="flex items-center gap-3 shrink-0 text-[#5c5c58]">
              <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12" /><polyline points="7 10 12 15 17 10" /><line x1="4" y1="20" x2="20" y2="20" /></svg>
              <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7" /><polyline points="21 3 21 9 15 9" /></svg>
              <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="13" height="13" rx="2" /><rect x="8" y="8" width="13" height="13" rx="2" /></svg>
            </div>
          )}

          {compact && (
            <div className="flex items-center gap-2 shrink-0 text-[#5c5c58]">
              <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7" /><polyline points="21 3 21 9 15 9" /></svg>
              <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 6 9 12 15 18" /></svg>
              <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
            </div>
          )}
        </div>
        {src ? (
          <img
            src={src}
            alt={label}
            className="w-auto h-auto max-w-full block self-center"
          />
        ) : (
          <div
            className="flex items-center justify-center text-xs font-medium text-[#8a8a86] bg-[repeating-linear-gradient(45deg,#f5f5f3,#f5f5f3_10px,#eeeeec_10px,#eeeeec_20px)]"
            style={{ width, height: width * 1.2 }}
          >
            Bild saknas
          </div>
        )}
      </div>
      {!hideSpecs && specs && specs.length > 0 && (
        <span className="flex items-center gap-4 text-xs font-medium text-[#5c5c58]">
          {specs.map((spec) => (
            <span key={spec} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 shrink-0" style={{ backgroundColor: accentColor ?? '#E8C547' }} />
              {spec}
            </span>
          ))}
        </span>
      )}
    </div>
  );
}

export function ProjectPageTemplate({ project }: { project: Project }) {
  const mobileImage = project.steps?.[0]?.image;

  if (!project.challenge && !project.solution && !project.result && !project.conclusionImage) return null;

  return (
    <section className="case-scroll-no-mobile-anim relative pt-32 md:pt-40">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 box-border pb-16 md:pb-24 lg:pb-32">
        <FadeIn>
          <div className="max-w-[1440px] mx-auto flex flex-col items-start gap-6 mb-16">
            <h1 className="text-[clamp(36px,6vw,52px)] font-bold uppercase tracking-tight leading-[0.95] text-[#030303] m-0">
              {project.title}
            </h1>
            <div className="flex gap-8 shrink-0">
              <MetaItem label="Status" value={project.status} first />
              <MetaItem label="Tjänst" value={project.category} />
              <MetaItem label="Datum" value={project.year} />
            </div>
          </div>
        </FadeIn>

        {project.conclusionImage && (
          <FadeIn>
            <div className="lg:hidden mb-16 w-full border border-black/20 bg-white overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-4 px-4 py-2.5 bg-[#f0f0ee] border-b border-black/10">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>

                <div className="flex-1 flex items-center gap-2 bg-white border border-black/10 rounded-md px-3 py-1 text-[#8a8a86]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0"><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3z" /></svg>
                  <span className="text-xs truncate">{project.website ?? project.title.toLowerCase().replace(/\s+/g, '')}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0 text-[#5c5c58]">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7" /><polyline points="21 3 21 9 15 9" /></svg>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 6 9 12 15 18" /></svg>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
                </div>
              </div>
              <div className="h-[420px] overflow-y-auto overflow-x-hidden">
                <img
                  src={project.conclusionImage}
                  alt={project.title}
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </FadeIn>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="lg:sticky lg:top-16 lg:self-start flex flex-col gap-16 min-w-0">
            <FadeIn>
              <div className="flex flex-col gap-16">
                {project.challenge && (
                  <CaseBlock
                    label="Utmaning"
                    text={project.challenge}
                    showLine={!!(project.solution || project.result)}
                    mobileTitle={project.challengeTitle}
                    mobileDevice={<DeviceImage label="Mobil" src={mobileImage} specs={project.steps?.[0]?.uxImprovements} deviceType="mobil" accentColor={project.accentColor} website={project.website} title={project.title} hideSpecs />}
                  />
                )}
                {project.solution && (
                  <CaseBlock
                    label="Lösning"
                    text={project.solution}
                    showLine={!!project.result}
                    mobileTitle={project.solutionTitle}
                    mobileDevice={<DeviceImage label="Surfplatta" src={project.tabletImage} specs={project.steps?.[1]?.uxImprovements} deviceType="surfplatta" accentColor={project.accentColor} website={project.website} title={project.title} hideSpecs />}
                  />
                )}
                {project.result && (
                  <CaseBlock
                    label="Resultat"
                    text={project.result}
                    showLine={!!(project.technologies && project.technologies.length > 0)}
                    mobileTitle={project.resultTitle}
                    mobileDevice={<DeviceImage label="Dator" src={project.image} specs={project.steps?.[2]?.uxImprovements} deviceType="dator" accentColor={project.accentColor} website={project.website} title={project.title} hideSpecs />}
                  />
                )}
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

          {(project.conclusionImage || mobileImage || project.tabletImage || project.image) && (
            <div className="hidden lg:flex flex-col items-center gap-10">
              {project.conclusionImage && (
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
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7" /><polyline points="21 3 21 9 15 9" /></svg>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="13" height="13" rx="2" /><rect x="8" y="8" width="13" height="13" rx="2" /></svg>
                    </div>
                  </div>
                  <div className="h-[820px] overflow-y-auto overflow-x-hidden">
                    <img
                      src={project.conclusionImage}
                      alt={project.title}
                      className="w-full h-auto block"
                    />
                  </div>
                </div>
              </FadeIn>
              )}

              <DeviceImage label="Mobil" src={mobileImage} specs={project.steps?.[0]?.uxImprovements} deviceType="mobil" accentColor={project.accentColor} website={project.website} title={project.title} />
              <DeviceImage label="Surfplatta" src={project.tabletImage} specs={project.steps?.[1]?.uxImprovements} deviceType="surfplatta" accentColor={project.accentColor} website={project.website} title={project.title} />
              <DeviceImage label="Dator" src={project.image} specs={project.steps?.[2]?.uxImprovements} deviceType="dator" accentColor={project.accentColor} website={project.website} title={project.title} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
