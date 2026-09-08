'use client';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Database, Layout, Code } from '@phosphor-icons/react';
import type { Project } from '../../projekt-data';
import { Eyebrow } from './StyledPrimitives';
import { PerformanceBadge, type PagespeedResult } from './PerformanceBadge';

const MOBILE_HERO_SLUGS = ['sagateatern', 'crownmatch', 'techpilots', 'ljuva-hem-i-mark', 'pistolero-studio', 'wastgota-bil'];
function mobileHeroFrameImage(slug: string): string | undefined {
  return MOBILE_HERO_SLUGS.includes(slug) ? `/digital/projekt/${slug}/mockup-mobile-hero.avif` : undefined;
}

function stripHighlightMarkup(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1');
}

function CaseBlock({ label, text, showLine, mobileDevice, mobileTitle }: { label: string; text: string; showLine?: boolean; mobileDevice?: ReactNode; mobileTitle?: string }) {
  const lineRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="relative flex gap-5 min-w-0">
      <div className="relative flex flex-col items-center shrink-0 pt-1.5">
        <span className="relative flex items-center justify-center w-7 h-7 shrink-0">
          <span className="absolute inset-0 rounded-full bg-[#e8c547]/25 blur-[3px]" />
          <span className="absolute inset-1 rounded-full bg-[#e8c547]/40" />
          <span className="relative w-2 h-2 rounded-full bg-[#030303]" />
        </span>
        <span
          ref={lineRef}
          className={`absolute top-7 w-[2px] bg-gradient-to-b from-[#e8c547]/50 to-black/10 ${showLine ? '' : 'hidden'}`}
          style={{ height: 'calc(100% + 4rem)' }}
        />
      </div>
      <div className="flex flex-col gap-3 min-w-0 w-full">
        <Eyebrow>{label}</Eyebrow>
        {mobileDevice && <div className="lg:hidden w-full min-w-0 overflow-hidden">{mobileDevice}</div>}
        {mobileTitle && <p className="text-lg font-bold text-[#030303] m-0">{mobileTitle}</p>}
        <p className="text-base leading-relaxed text-[#5c5c58] max-w-[40ch] m-0">{stripHighlightMarkup(text)}</p>
      </div>
    </div>
  );
}

const TECH_ICONS: Record<string, ReactNode> = {
  'Framer': <img src="/icons/tech/framer.svg" alt="" width={16} height={16} />,
  'Framer CMS': <img src="/icons/tech/framer.svg" alt="" width={16} height={16} />,
  'React': <img src="/icons/tech/react.svg" alt="" width={16} height={16} />,
  'CMS': <Database size={16} weight="fill" />,
  'UX/UI Design': <Layout size={16} weight="fill" />,
  'Custom Code': <Code size={16} weight="fill" />,
  'Next.js': <img src="/icons/tech/nextjs.svg" alt="" width={16} height={16} />,
  'Payload CMS': <img src="/icons/tech/payloadcms.svg" alt="" width={16} height={16} />,
  'Stripe': <img src="/icons/tech/stripe.svg" alt="" width={16} height={16} />,
  'TypeScript': <img src="/icons/tech/typescript.svg" alt="" width={16} height={16} />,
  'Tailwind CSS': <img src="/icons/tech/tailwindcss.svg" alt="" width={16} height={16} />,
  'Node.js': <img src="/icons/tech/nodejs.svg" alt="" width={16} height={16} />,
  'Medusa': <img src="/icons/tech/medusa.svg" alt="" width={16} height={16} />,
  'PostgreSQL': <img src="/icons/tech/postgresql.svg" alt="" width={16} height={16} />,
  'Framer Motion': <img src="/icons/tech/framer.svg" alt="" width={16} height={16} />,
};

function TechStack({ technologies }: { technologies: string[] }) {
  return (
    <div className="relative flex gap-5">
      <div className="relative flex flex-col items-center shrink-0 pt-1.5">
        <span className="flex items-center justify-center w-7 h-7 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#030303]" />
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <Eyebrow>Teknik</Eyebrow>
        <div className="flex flex-wrap gap-3">
          {technologies.map((tech) => (
            <div
              key={tech}
              className="flex items-center gap-2 p-1 rounded-full bg-[#030303]"
            >
              <span className="flex items-center justify-center shrink-0 w-6 h-6 rounded-full bg-white [&_img]:w-3.5 [&_img]:h-3.5 [&_svg]:w-3.5 [&_svg]:h-3.5">
                {TECH_ICONS[tech]}
              </span>
              <span className="text-[11px] font-medium text-white pr-3">{tech}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetaItem({ label, value, first, className }: { label: string; value: string; first?: boolean; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${first ? '' : 'border-l border-black/10 pl-8'} ${className ?? ''}`}>
      <span className="text-xs font-medium uppercase tracking-widest text-[#8a8a86]">{label}</span>
      <span className="text-sm font-bold uppercase text-[#030303]">{value}</span>
    </div>
  );
}

const DEVICE_FRAME_MAX_WIDTH: Record<'mobil' | 'surfplatta' | 'dator', number> = {
  mobil: 240,
  surfplatta: 460,
  dator: 860,
};

const DEVICE_ASPECT_RATIO: Record<'mobil' | 'surfplatta' | 'dator', number> = {
  mobil: 511 / 917,
  surfplatta: 2048 / 2732,
  dator: 2515 / 1414,
};

function DeviceImage({ label, src, specs, deviceType, accentColor, stripeBaseColor, hideSpecs, website, title, compact: compactProp, aspectRatio: aspectRatioProp, phoneFrame, frameImage, imageFit = 'contain', priority }: { label: string; src?: string; specs?: string[]; deviceType: 'mobil' | 'surfplatta' | 'dator'; accentColor?: string; stripeBaseColor?: string; hideSpecs?: boolean; website?: string; title: string; compact?: boolean; aspectRatio?: number; phoneFrame?: boolean; frameImage?: string; imageFit?: 'contain' | 'cover'; priority?: boolean }) {
  const width = DEVICE_FRAME_MAX_WIDTH[deviceType];
  const aspectRatio = aspectRatioProp ?? DEVICE_ASPECT_RATIO[deviceType];
  const compact = compactProp ?? deviceType === 'mobil';

  if (frameImage) {
    const displayWidth = 800;
    const stripeColor = accentColor ?? '#0a0a0a';
    const baseColor = stripeBaseColor ?? '#ffffff';
    // Faktisk telefon-bounding-box inuti mockup-mobile-hero.avif (1920x1440 källbild): x 680-1240, y 160-1312
    const scale = displayWidth / 1920;
    const phoneLeft = 680 * scale;
    const phoneRight = 1240 * scale;
    const phoneTop = 160 * scale;
    const phoneBottom = 1312 * scale;
    const phoneWidth = phoneRight - phoneLeft;
    const phoneHeight = phoneBottom - phoneTop;
    const margin = 20;
    return (
      <div className="flex flex-col items-center gap-6" style={{ width: phoneWidth + margin * 2 }}>
        {priority && <Image src={frameImage} alt="" width={1} height={1} priority style={{ display: 'none' }} />}
        <span className="text-xs font-semibold uppercase tracking-widest text-[#030303] whitespace-nowrap">{label}</span>
        <div
          className="rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.18)] overflow-hidden"
          style={{
            padding: margin,
            backgroundImage: `radial-gradient(circle at 15% 15%, ${stripeColor} 0%, transparent 55%), linear-gradient(${baseColor}, ${baseColor})`,
          }}
        >
          <div
            style={{
              width: phoneWidth,
              height: phoneHeight,
              backgroundImage: `url(${frameImage})`,
              backgroundSize: `${displayWidth}px auto`,
              backgroundPosition: `-${phoneLeft}px -${phoneTop}px`,
              filter: 'drop-shadow(0 25px 40px rgba(0,0,0,0.35))',
            }}
          />
        </div>
      </div>
    );
  }

  if (phoneFrame) {
    return (
      <div className="w-full border-t border-black/10 pt-10 flex flex-col items-start lg:items-center gap-6">
        <span className="text-xs font-medium uppercase tracking-widest text-[#8a8a86]" style={{ maxWidth: width }}>{label}</span>
        <div className="relative inline-flex rounded-[2.8rem] shadow-[0_25px_50px_rgba(0,0,0,0.18)]" style={{ width: width + 12, padding: 6, boxSizing: 'border-box', background: 'linear-gradient(160deg, #3a3a3c 0%, #0a0a0a 30%, #0a0a0a 70%, #3a3a3c 100%)' }}>
            <span className="absolute -left-[3px] top-[15%] w-[3px] h-5 bg-[#1c1c1e] rounded-l-sm" />
            <span className="absolute -left-[3px] top-[22%] w-[3px] h-8 bg-[#1c1c1e] rounded-l-sm" />
            <span className="absolute -left-[3px] top-[31%] w-[3px] h-8 bg-[#1c1c1e] rounded-l-sm" />
            <span className="absolute -right-[3px] top-[18%] w-[3px] h-11 bg-[#1c1c1e] rounded-r-sm" />
          <div className="relative bg-white overflow-hidden rounded-[2.3rem] ring-1 ring-black/40" style={{ width, aspectRatio: 390 / 690 }}>
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#030303] rounded-full z-10 flex items-center justify-end pr-1.5">
              <span className="w-1 h-1 rounded-full bg-[#1c1c1e] ring-1 ring-[#2a2a2a]" />
            </div>
            {src ? (
              <Image
                src={src}
                alt={label}
                fill
                sizes={`${width}px`}
                className="object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-medium text-[#8a8a86] bg-[repeating-linear-gradient(45deg,#f5f5f3,#f5f5f3_10px,#eeeeec_10px,#eeeeec_20px)]">
                Bild saknas
              </div>
            )}
          </div>
        </div>
        {!hideSpecs && specs && specs.length > 0 && (
          <span className="flex items-center gap-4 text-xs font-medium text-[#5c5c58]">
            {specs.map((spec) => (
              <span key={spec} className="flex items-center gap-2 whitespace-nowrap">
                <span className="w-1.5 h-1.5 shrink-0 bg-[#030303]" />
                {spec}
              </span>
            ))}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="w-full border-t border-black/10 pt-10 flex flex-col items-center gap-6">
      <span className="text-xs font-medium uppercase tracking-widest text-[#8a8a86]" style={{ maxWidth: width }}>{label}</span>
      <div
        className="w-full overflow-hidden"
        style={{
          maxWidth: width,
          padding: 20,
          borderRadius: 5,
          backgroundImage: `radial-gradient(circle at 15% 15%, ${accentColor ?? '#0a0a0a'} 0%, transparent 55%), linear-gradient(${stripeBaseColor ?? '#ffffff'}, ${stripeBaseColor ?? '#ffffff'})`,
        }}
      >
      <div className="relative w-full flex flex-col border-2 border-black/15 bg-white overflow-hidden" style={{ aspectRatio: 1 / (aspectRatio ?? 0.75), borderRadius: 5 }}>
        {src ? (
          <Image
            src={src}
            alt={label}
            fill
            sizes={`(max-width: ${width}px) 100vw, ${width}px`}
            className={imageFit === 'cover' ? 'object-cover object-top' : 'object-contain'}
            priority={priority}
            fetchPriority={priority ? 'high' : undefined}
          />
        ) : (
          <div
            className="flex items-center justify-center text-xs font-medium text-[#8a8a86] bg-[repeating-linear-gradient(45deg,#f5f5f3,#f5f5f3_10px,#eeeeec_10px,#eeeeec_20px)]"
            style={{ width, aspectRatio }}
          >
            Bild saknas
          </div>
        )}
      </div>
      </div>
      {!hideSpecs && specs && specs.length > 0 && (
        <span className="flex items-center gap-4 text-xs font-medium text-[#5c5c58]">
          {specs.map((spec) => (
            <span key={spec} className="flex items-center gap-2 whitespace-nowrap">
              <span className="w-1.5 h-1.5 shrink-0 bg-[#030303]" />
              {spec}
            </span>
          ))}
        </span>
      )}
    </div>
  );
}

export function ProjectPageTemplate({ project, pagespeedResult }: { project: Project; pagespeedResult?: PagespeedResult | null }) {
  const mobileImage = project.steps?.[0]?.image;

  if (!project.challenge && !project.solution && !project.result && !project.conclusionImage) return null;

  return (
    <section className="case-scroll-no-mobile-anim relative pt-32 md:pt-40">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 box-border pb-16 md:pb-24 lg:pb-32">
        <div className="max-w-[1440px] mx-auto flex flex-col items-start gap-6 mb-16">
          <h1 className="text-[clamp(36px,6vw,52px)] font-bold uppercase tracking-tight leading-[0.95] text-[#030303] m-0">
            {project.title}
          </h1>
          <div className="flex gap-4 md:gap-8 shrink-0 flex-wrap">
            <MetaItem label="Status" value={project.status} first className="w-[90px] md:w-[110px] shrink-0" />
            <MetaItem label="Kund typ" value={project.category} className="w-[120px] md:w-[160px] shrink-0" />
            <MetaItem label="Datum" value={project.year} className="w-[60px] md:w-[80px] shrink-0" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-16">
          <div className="lg:sticky lg:top-16 lg:self-start flex flex-col gap-16 min-w-0">
            <div className="flex flex-col gap-16">
              {project.challenge && (
                <CaseBlock
                  label="Utmaning"
                  text={project.challenge}
                  showLine={!!(project.solution || project.result)}
                  mobileTitle={project.challengeTitle}
                  mobileDevice={<DeviceImage label="Dator" src={project.image} specs={project.steps?.[2]?.uxImprovements} deviceType="dator" accentColor={project.accentColor} website={project.website} title={project.title} hideSpecs compact aspectRatio={1.3} imageFit="cover" priority />}
                />
              )}
              {project.solution && (
                <CaseBlock
                  label="Lösning"
                  text={project.solution}
                  showLine={!!project.result}
                  mobileTitle={project.solutionTitle}
                />
              )}
              {project.result && (
                <CaseBlock
                  label="Resultat"
                  text={project.result}
                  showLine={!!(project.technologies && project.technologies.length > 0)}
                  mobileTitle={project.resultTitle}
                  mobileDevice={<DeviceImage label="Mobil" src={mobileImage} specs={project.steps?.[0]?.uxImprovements} deviceType="mobil" accentColor={project.accentColor} stripeBaseColor={project.stripeBaseColor} website={project.website} title={project.title} hideSpecs frameImage={mobileHeroFrameImage(project.slug)} />}
                />
              )}
              {project.technologies && project.technologies.length > 0 && (
                <TechStack technologies={project.technologies} />
              )}
              {pagespeedResult && <PerformanceBadge result={pagespeedResult} />}
            </div>

            {project.website && (
              <div className="flex justify-center">
                <a
                  href={`https://${project.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-base text-[#030303] font-medium border-b border-black/20 pb-1 w-fit no-underline transition-colors duration-300 hover:border-black/60"
                >
                  Besök webbplatsen
                </a>
              </div>
            )}
          </div>

          {(project.conclusionImage || mobileImage) && (
            <div className="hidden lg:flex flex-col gap-10 border-t border-black/10 pt-10">
              <p className="text-xs text-[#8a8a86] m-0">Bilder visar sidan vid lansering. Vi erbjuder även löpande förvaltning och uppdateringar efter lansering.</p>
              <div className="flex items-start gap-10">
              <DeviceImage label="Mobil" src={mobileImage} specs={project.steps?.[0]?.uxImprovements?.slice(0, 2)} deviceType="mobil" accentColor={project.accentColor} stripeBaseColor={project.stripeBaseColor} website={project.website} title={project.title} frameImage={mobileHeroFrameImage(project.slug)} />

              {project.conclusionImage && (
                <div className="flex flex-col items-center gap-6 flex-1 min-w-0">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#030303] w-full text-center">Dator</span>
                <div
                  className="w-full rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                  style={{
                    padding: 20,
                    backgroundImage: `radial-gradient(circle at 15% 15%, ${project.accentColor ?? '#0a0a0a'} 0%, transparent 55%), linear-gradient(${project.stripeBaseColor ?? '#ffffff'}, ${project.stripeBaseColor ?? '#ffffff'})`,
                  }}
                >
                <div className="relative w-full rounded-lg border-2 border-black/15 bg-white overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.18)]" style={{ height: 680 }}>
                  <Image
                    src={project.conclusionImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 0px, 860px"
                    className="object-cover object-top"
                  />
                </div>
                </div>
                </div>
              )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
