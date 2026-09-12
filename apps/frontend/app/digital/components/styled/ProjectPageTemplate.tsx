'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { useInView, animate } from 'framer-motion';
import { Database, Layout, Code, Gauge, Eye, CheckCircle, MagnifyingGlass, Robot } from '@phosphor-icons/react';
import type { Project } from '../../projekt-data';
import { PerformanceBadge } from './PerformanceBadge';
import type { PagespeedResults } from './pagespeed-data';

const MOBILE_HERO_SLUGS = ['sagateatern', 'crownmatch', 'techpilots', 'ljuva-hem-i-mark', 'pistolero-studio', 'wastgota-bil'];
function mobileHeroFrameImage(slug: string): string | undefined {
  return MOBILE_HERO_SLUGS.includes(slug) ? `/digital/projekt/${slug}/mockup-mobile-hero.avif` : undefined;
}

function ProjectBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block px-3.5 py-1 bg-[#030303] rounded-full text-xs font-bold text-white uppercase tracking-widest w-fit">
      {children}
    </span>
  );
}

function stripHighlightMarkup(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1');
}

function TypewriterTitle({ title }: { title: string }) {
  const [charsShown, setCharsShown] = useState(0);

  useEffect(() => {
    setCharsShown(0);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setCharsShown(i);
      if (i >= title.length) clearInterval(interval);
    }, 45);
    return () => clearInterval(interval);
  }, [title]);

  const words = title.split(' ');
  const lastWord = words.pop() ?? '';
  const leadWords = words.join(' ');
  const leadEnd = leadWords ? leadWords.length + 1 : 0;

  const visibleLead = leadWords.slice(0, Math.max(0, Math.min(charsShown, leadWords.length)));
  const visibleLast = lastWord.slice(0, Math.max(0, charsShown - leadEnd));

  return (
    <>
      {leadWords && <span className="text-[#9a9a95]">{visibleLead}{visibleLead.length < leadWords.length ? '' : ' '}</span>}
      <span className="text-[#030303]">{visibleLast}</span>
      <span className="inline-block w-[0.06em] h-[0.85em] bg-[#030303] ml-1 align-middle animate-pulse" style={{ opacity: charsShown >= title.length ? 0 : 1 }} />
    </>
  );
}

function SplitTitle({ title, as: Tag = 'h3', size = 'text-[clamp(22px,4.5vw,44px)]' }: { title: string; as?: 'h1' | 'h2' | 'h3'; size?: string }) {
  const words = title.split(' ').filter((w) => w.toLowerCase() !== 'och');
  const lastWord = words.pop() ?? '';
  let row1 = '';
  let row2 = '';
  if (words.length === 1) {
    row1 = words[0];
    row2 = '';
  } else if (words.length > 1) {
    row1 = words[0];
    row2 = words.slice(1).join(' ');
  }
  return (
    <Tag className={`${size} font-black uppercase leading-[0.95] tracking-tight m-0 break-words`}>
      <span className="text-[#9a9a95] block">{row1}</span>
      {row2 && <span className="text-[#9a9a95] block">{row2}</span>}
      <span className="text-[#030303] block">{lastWord}</span>
    </Tag>
  );
}

function CaseBlock({ label, text, mobileDevice, mobileTitle, mobileExtra, footer }: { label: string; text: string; mobileDevice?: ReactNode; mobileTitle?: string; mobileExtra?: ReactNode; footer?: ReactNode }) {
  return (
    <div className="flex flex-col gap-6 min-w-0 rounded-2xl bg-[#f7f6f4] p-6">
      <ProjectBadge>{label}</ProjectBadge>
      {mobileDevice && <div className="lg:hidden w-full min-w-0 overflow-hidden">{mobileDevice}</div>}
      {mobileTitle && <SplitTitle title={mobileTitle} />}
      <p className="leading-relaxed w-full m-0 pt-6 border-t border-black/10 text-base text-[#5c5c58]">{stripHighlightMarkup(text)}</p>
      {mobileExtra && <div className="lg:hidden w-full min-w-0">{mobileExtra}</div>}
      {footer}
    </div>
  );
}

/* eslint-disable @next/next/no-img-element -- SVG-ikoner, next/image blockerar SVG utan dangerouslyAllowSVG i next.config */
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
/* eslint-enable @next/next/no-img-element */

function TechStack({ technologies }: { technologies: string[] }) {
  return (
    <div className="flex flex-col gap-5 pt-8 border-t border-black/10">
      <ProjectBadge>Teknik</ProjectBadge>
      <div className="flex flex-wrap gap-3">
        {technologies.map((tech) => (
          <div
            key={tech}
            className="flex items-center gap-2 p-1 rounded-full bg-black/5"
          >
            <span className="flex items-center justify-center shrink-0 w-6 h-6 rounded-full bg-white [&_img]:w-3.5 [&_img]:h-3.5 [&_svg]:w-3.5 [&_svg]:h-3.5">
              {TECH_ICONS[tech]}
            </span>
            <span className="text-[11px] font-medium text-[#030303] pr-3">{tech}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="w-full flex items-center justify-between py-4 border-t border-black/10">
      <span className="text-xs font-medium uppercase tracking-widest text-[#8a8a86]">{label}</span>
      <span className="text-sm font-bold uppercase text-[#030303]">{value}</span>
    </div>
  );
}

function CountUp({ value, delay = 0 }: { value: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      const controls = animate(0, value, {
        duration: 2,
        ease: [0.25, 0.1, 0.25, 1],
        onUpdate: (v) => setDisplay(Math.round(v)),
      });
      return () => controls.stop();
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [isInView, value, delay]);

  return (
    <span ref={ref} className="inline-block text-right tabular-nums" style={{ minWidth: `${String(value).length}ch` }}>
      {display}
    </span>
  );
}

function PageSpeedComparisonCard({ icon, oldValue, newValue, label, description, delay }: { icon: ReactNode; oldValue?: number | string; newValue: number | string; label: string; description: string; delay?: number }) {
  return (
    <div className="h-full flex flex-col gap-6 md:gap-10 rounded-2xl bg-[#f7f6f4] p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-[#3fb950]">{typeof newValue === 'number' ? <CountUp value={newValue} delay={delay} /> : newValue}</span>
            {oldValue !== undefined && typeof oldValue === 'number' && typeof newValue === 'number' && oldValue > 0 && (
              <span className="text-sm font-bold text-[#3fb950] bg-[#3fb950]/5 rounded-full px-2 py-1">
                +{Math.round(((newValue - oldValue) / oldValue) * 100)}%
              </span>
            )}
          </div>
          {oldValue !== undefined && (
            <span className="text-sm text-[#d97757]">Tidigare: {oldValue}</span>
          )}
        </div>
        <span className="flex items-center justify-center w-11 h-11 rounded-full bg-white text-[#030303]">{icon}</span>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold uppercase tracking-widest text-[#030303] pb-3 border-b border-black/10">{label}</span>
        <span className="text-base leading-relaxed text-[#5c5c58]">{description}</span>
      </div>
    </div>
  );
}

function PageSpeedComparison({ oldPageSpeed, newResult }: { oldPageSpeed?: Project['oldPageSpeed']; newResult: PagespeedResults['mobile'] }) {
  if (!newResult) return null;

  const geoChecks = [
    (newResult.geoBlockedCrawlers?.length ?? 0) === 0,
    newResult.geoVisibleWithoutJs ?? false,
    newResult.geoHasStructuredData ?? false,
  ];
  const geoScore = geoChecks.filter(Boolean).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 self-start rounded-full bg-[#030303] pl-3 pr-4 py-1.5">
        <Robot size={14} weight="fill" className="text-white" />
        <span className="text-sm font-bold uppercase tracking-widest text-white">Agentisk webbläsning {geoScore}/3</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <PageSpeedComparisonCard
        icon={<Gauge size={18} weight="fill" />}
        oldValue={oldPageSpeed?.performance}
        newValue={newResult.performance}
        label="Prestanda"
        description="Laddningstid och upplevd snabbhet på webbplatsen."
        delay={0}
      />
      <PageSpeedComparisonCard
        icon={<Eye size={18} weight="fill" />}
        oldValue={oldPageSpeed?.accessibility}
        newValue={newResult.accessibility}
        label="Tillgänglighet"
        description="Hur väl sidan fungerar för alla besökare."
        delay={0.6}
      />
      <PageSpeedComparisonCard
        icon={<CheckCircle size={18} weight="fill" />}
        oldValue={oldPageSpeed?.bestPractices}
        newValue={newResult.bestPractices}
        label="Bästa metoder"
        description="Följsamhet mot moderna webbstandarder."
        delay={1.2}
      />
      <PageSpeedComparisonCard
        icon={<MagnifyingGlass size={18} weight="fill" />}
        oldValue={oldPageSpeed?.seo}
        newValue={newResult.seo}
        label="SEO"
        description="Hur redo sidan är att hittas i sökmotorer."
        delay={1.8}
      />
      </div>
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
        <div
          className="shadow-[0_8px_24px_rgba(0,0,0,0.18)] overflow-hidden"
          style={{
            borderRadius: 10,
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
        <div className="relative inline-flex shadow-[0_25px_50px_rgba(0,0,0,0.18)]" style={{ width: width + 12, padding: 6, boxSizing: 'border-box', background: 'linear-gradient(160deg, #3a3a3c 0%, #0a0a0a 30%, #0a0a0a 70%, #3a3a3c 100%)', borderRadius: 10 }}>
            <span className="absolute -left-[3px] top-[15%] w-[3px] h-5 bg-[#1c1c1e] rounded-l-sm" />
            <span className="absolute -left-[3px] top-[22%] w-[3px] h-8 bg-[#1c1c1e] rounded-l-sm" />
            <span className="absolute -left-[3px] top-[31%] w-[3px] h-8 bg-[#1c1c1e] rounded-l-sm" />
            <span className="absolute -right-[3px] top-[18%] w-[3px] h-11 bg-[#1c1c1e] rounded-r-sm" />
          <div className="relative bg-white overflow-hidden ring-1 ring-black/40" style={{ width, aspectRatio: 390 / 690, borderRadius: 10 }}>
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
      <div
        className="w-full overflow-hidden"
        style={{
          maxWidth: width,
          padding: 20,
          borderRadius: 10,
          backgroundImage: `radial-gradient(circle at 15% 15%, ${accentColor ?? '#0a0a0a'} 0%, transparent 55%), linear-gradient(${stripeBaseColor ?? '#ffffff'}, ${stripeBaseColor ?? '#ffffff'})`,
        }}
      >
      <div className="relative w-full flex flex-col border-2 border-black/15 bg-white overflow-hidden" style={{ aspectRatio: 1 / (aspectRatio ?? 0.75), borderRadius: 10 }}>
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

export function ProjectPageTemplate({ project, pagespeedResults }: { project: Project; pagespeedResults?: PagespeedResults }) {
  const mobileImage = project.steps?.[0]?.image;
  if (!project.challenge && !project.solution && !project.result && !project.conclusionImage) return null;

  const heroImage = project.cardImage ?? project.image;

  return (
    <section className="case-scroll-no-mobile-anim relative pt-32 md:pt-40">
      <div className="max-w-[1500px] mx-auto w-full px-6 md:px-[30px] box-border pb-16 md:pb-24 lg:pb-32">
        <div className="max-w-[1440px] mx-auto flex flex-col items-start gap-6 mb-16">
          <h1 className="w-full text-[clamp(48px,9vw,120px)] font-black uppercase tracking-tight leading-[0.95] m-0">
            <TypewriterTitle title={project.title} />
          </h1>
          <div className="w-full max-w-md flex flex-col">
            <MetaRow label="Status" value={project.status} />
            <MetaRow label="Kund typ" value={project.category} />
            <MetaRow label="Datum" value={project.year} />
          </div>
        </div>

        {heroImage && (
          <div
            className="w-full mb-16 md:mb-48 shadow-[0_25px_60px_rgba(0,0,0,0.15)]"
            style={{
              padding: 20,
              borderRadius: 10,
              backgroundImage: `radial-gradient(circle at 15% 15%, ${project.accentColor ?? '#0a0a0a'} 0%, transparent 55%), linear-gradient(${project.stripeBaseColor ?? '#ffffff'}, ${project.stripeBaseColor ?? '#ffffff'})`,
            }}
          >
            <div className="relative w-full overflow-hidden border-2 border-black/15" style={{ aspectRatio: '16 / 9', borderRadius: 10 }}>
              <Image
                src={heroImage}
                alt={project.title}
                fill
                sizes="(max-width: 1440px) 100vw, 1440px"
                className="object-cover object-top"
                priority
                fetchPriority="high"
              />
            </div>
          </div>
        )}

        {(pagespeedResults?.mobile ?? pagespeedResults?.desktop) && (
          <div className="mb-16 md:mb-48 flex flex-col gap-8 md:gap-16 rounded-3xl bg-[#f5f5f3] p-6 md:p-12">
            <div className="flex flex-col gap-4">
              <h2 className="text-[clamp(22px,4.5vw,44px)] font-black uppercase leading-[0.95] tracking-tight m-0">
                <span className="text-[#9a9a95]">Google-resultat, </span>
                <span className="text-[#030303]">{project.oldPageSpeed ? 'före och efter' : 'idag'}</span>
              </h2>
              <div className="flex items-center gap-2 self-start pt-4 border-t border-black/10">
                {/* eslint-disable-next-line @next/next/no-img-element -- SVG-ikon, next/image blockerar SVG utan dangerouslyAllowSVG i next.config */}
                <img src="/icons/brands/lighthouse.svg" alt="" width={20} height={20} />
                <span className="text-sm font-bold uppercase tracking-widest text-[#030303]">Mätt med Google PageSpeed Insights</span>
              </div>
            </div>
            <PageSpeedComparison oldPageSpeed={project.oldPageSpeed} newResult={pagespeedResults?.mobile ?? pagespeedResults?.desktop} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 lg:gap-16 border-t border-black/10 pt-10">
          <div className="lg:sticky lg:top-16 lg:self-start flex flex-col gap-8 lg:gap-16 min-w-0">
            <div className="flex flex-col gap-8 lg:gap-16">
              {project.challenge && (
                <CaseBlock
                  label="Utmaning"
                  text={project.challenge}
                  mobileTitle={project.challengeTitle}
                  mobileDevice={<DeviceImage label="Dator" src={project.image} specs={project.steps?.[2]?.uxImprovements} deviceType="dator" accentColor={project.accentColor} website={project.website} title={project.title} hideSpecs compact aspectRatio={1.3} imageFit="cover" priority />}
                />
              )}
              {project.solution && (
                <CaseBlock
                  label="Lösning"
                  text={project.solution}
                  mobileTitle={project.solutionTitle}
                  mobileDevice={<DeviceImage label="Mobil" src={mobileImage} specs={project.steps?.[0]?.uxImprovements} deviceType="mobil" accentColor={project.accentColor} stripeBaseColor={project.stripeBaseColor} website={project.website} title={project.title} hideSpecs frameImage={mobileHeroFrameImage(project.slug)} />}
                />
              )}
              {project.result && (
                <CaseBlock
                  label="Resultat"
                  text={project.result}
                  mobileTitle={project.resultTitle}
                  mobileExtra={pagespeedResults && (pagespeedResults.mobile || pagespeedResults.desktop) && <div className="hidden"><PerformanceBadge results={pagespeedResults} /></div>}
                  footer={project.technologies && project.technologies.length > 0 && <TechStack technologies={project.technologies} />}
                />
              )}
            </div>

            {project.website && (
              <div className="flex justify-center">
                <a
                  href={`https://${project.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-base text-white font-semibold bg-[#030303] px-6 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.1)] no-underline transition-shadow duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
                  style={{ borderRadius: 10 }}
                >
                  Besök webbplatsen
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            )}
          </div>

          {project.conclusionImage && (
            <div className="hidden lg:flex flex-col gap-10">
              {pagespeedResults && (pagespeedResults.mobile || pagespeedResults.desktop) && (
                <div className="hidden"><PerformanceBadge results={pagespeedResults} /></div>
              )}
              <div className="flex flex-col gap-10">
                <div className="flex flex-col items-center gap-6 w-full">
                <div
                  className="w-full shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                  style={{
                    padding: 20,
                    borderRadius: 10,
                    backgroundImage: `radial-gradient(circle at 15% 15%, ${project.accentColor ?? '#0a0a0a'} 0%, transparent 55%), linear-gradient(${project.stripeBaseColor ?? '#ffffff'}, ${project.stripeBaseColor ?? '#ffffff'})`,
                  }}
                >
                <div className="relative w-full border-2 border-black/25 bg-white overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.18)]" style={{ height: 1200, borderRadius: 10 }}>
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
              </div>
              {(mobileImage || mobileHeroFrameImage(project.slug)) && (
                <div className="border-t border-black/10 pt-10 flex justify-center">
                  <DeviceImage label="Mobil" src={mobileImage} specs={project.steps?.[0]?.uxImprovements?.slice(0, 2)} deviceType="mobil" accentColor={project.accentColor} stripeBaseColor={project.stripeBaseColor} website={project.website} title={project.title} frameImage={mobileHeroFrameImage(project.slug)} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
