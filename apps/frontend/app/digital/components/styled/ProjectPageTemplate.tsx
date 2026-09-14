'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { useInView, animate } from 'framer-motion';
import { Database, Layout, Code, Gauge, Eye, CheckCircle, MagnifyingGlass, Robot } from '@phosphor-icons/react';
import type { Project } from '../../projekt-data';
import { PerformanceBadge } from './PerformanceBadge';
import type { PagespeedResults } from './pagespeed-data';
import { scoreColor } from '../../seo-analys/shared';
import { SectionHeader } from '../SectionHeader';

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

function CaseBlock({ label, text, mobileDevice, mobileTitle, mobileExtra, footer, imageFirst = true }: { label: string; text: string; mobileDevice?: ReactNode; mobileTitle?: string; mobileExtra?: ReactNode; footer?: ReactNode; imageFirst?: boolean }) {
  const deviceBlock = mobileDevice && <div className="lg:hidden w-full min-w-0 overflow-hidden">{mobileDevice}</div>;
  const textBlock = (
    <>
      {mobileTitle && <SplitTitle title={mobileTitle} />}
      <p className="leading-relaxed w-full m-0 pt-6 border-t border-black/10 text-base text-[#5c5c58]">{stripHighlightMarkup(text)}</p>
    </>
  );
  return (
    <div className="flex flex-col gap-6 min-w-0 rounded-2xl bg-[#f7f6f4] p-6">
      <ProjectBadge>{label}</ProjectBadge>
      {imageFirst ? (
        <>
          {deviceBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {deviceBlock}
        </>
      )}
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
    <div className="flex flex-col gap-1">
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

function ScoreDonut({ value, delay = 0 }: { value: number; delay?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px' });
  const [progress, setProgress] = useState(0);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const color = scoreColor(value);

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      const controls = animate(0, value, {
        duration: 1.4,
        ease: [0.25, 0.1, 0.25, 1],
        onUpdate: (v) => setProgress(v),
      });
      return () => controls.stop();
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [isInView, value, delay]);

  return (
    <div className="relative shrink-0" style={{ width: 72, height: 72 }}>
      <svg ref={ref} width={72} height={72} viewBox="0 0 72 72" className="-rotate-90">
        <circle cx={36} cy={36} r={radius - 4} fill="#030303" />
        <circle cx={36} cy={36} r={radius} fill="none" stroke="#ebebea" strokeWidth={6} />
        <circle
          cx={36}
          cy={36}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (progress / 100) * circumference}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-black tabular-nums text-white">
        {Math.round(progress)}
      </span>
    </div>
  );
}

function PageSpeedComparisonCard({ icon, oldValue, newValue, label, description, delay, accentColor, stripeBaseColor }: { icon: ReactNode; oldValue?: number | string; newValue: number | string; label: string; description: string; delay?: number; accentColor?: string; stripeBaseColor?: string }) {
  return (
    <div className="h-full flex flex-col gap-6 rounded-2xl bg-white p-6 md:p-7 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-black/10">
            <span className="flex items-center gap-2">
              <span className="hidden md:flex items-center justify-center w-6 h-6 rounded-full shrink-0 bg-[#030303] text-white">{icon}</span>
              <span className="text-sm font-bold uppercase tracking-widest text-[#030303]">{label}</span>
            </span>
            {typeof newValue === 'number' ? <ScoreDonut value={newValue} delay={delay} /> : <span className="text-3xl font-black text-[#030303]">{newValue}</span>}
          </div>
          <span className="text-base leading-[1.7] text-[#5c5c58]">{description}</span>
        </div>
        {oldValue !== undefined && typeof oldValue === 'number' && typeof newValue === 'number' && oldValue > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#d97757]">Tidigare: {oldValue}</span>
            <span className="text-sm font-black text-white bg-[#3fb950] rounded-full px-3 py-1">
              +{Math.round(((newValue - oldValue) / oldValue) * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function AgenticBadge({ newResult }: { newResult: PagespeedResults['mobile'] }) {
  if (!newResult) return null;

  const geoChecks = [
    (newResult.geoBlockedCrawlers?.length ?? 0) === 0,
    newResult.geoVisibleWithoutJs ?? false,
    newResult.geoHasStructuredData ?? false,
  ];
  const geoScore = geoChecks.filter(Boolean).length;

  return (
    <div
      className="flex flex-col items-center justify-center gap-1 rounded-full bg-[#030303] shrink-0"
      style={{ width: 140, height: 140 }}
      title={`Agentisk webbläsning ${geoScore}/3`}
    >
      <Robot size={32} weight="fill" className="text-white" />
      <span className="text-lg font-bold text-white">{geoScore}/3</span>
    </div>
  );
}

function PageSpeedComparison({ oldPageSpeed, newResult, accentColor, stripeBaseColor }: { oldPageSpeed?: Project['oldPageSpeed']; newResult: PagespeedResults['mobile']; accentColor?: string; stripeBaseColor?: string }) {
  if (!newResult) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl w-full">
      <PageSpeedComparisonCard
        icon={<Gauge size={18} weight="fill" />}
        oldValue={oldPageSpeed?.performance}
        newValue={newResult.performance}
        label="Prestanda"
        description="Laddningstid och upplevd snabbhet på webbplatsen."
        delay={0}
        accentColor={accentColor}
        stripeBaseColor={stripeBaseColor}
      />
      <PageSpeedComparisonCard
        icon={<Eye size={18} weight="fill" />}
        oldValue={oldPageSpeed?.accessibility}
        newValue={newResult.accessibility}
        label="Tillgänglighet"
        description="Hur väl sidan fungerar för alla besökare."
        delay={0.6}
        accentColor={accentColor}
        stripeBaseColor={stripeBaseColor}
      />
      <PageSpeedComparisonCard
        icon={<CheckCircle size={18} weight="fill" />}
        oldValue={oldPageSpeed?.bestPractices}
        newValue={newResult.bestPractices}
        label="Bästa metoder"
        description="Följsamhet mot moderna webbstandarder."
        delay={1.2}
        accentColor={accentColor}
        stripeBaseColor={stripeBaseColor}
      />
      <PageSpeedComparisonCard
        icon={<MagnifyingGlass size={18} weight="fill" />}
        oldValue={oldPageSpeed?.seo}
        newValue={newResult.seo}
        label="SEO"
        description="Hur redo sidan är att hittas i sökmotorer."
        delay={1.8}
        accentColor={accentColor}
        stripeBaseColor={stripeBaseColor}
      />
      </div>
    </div>
  );
}

const DEVICE_FRAME_MAX_WIDTH: Record<'mobil' | 'surfplatta' | 'dator', number> = {
  mobil: 190,
  surfplatta: 370,
  dator: 690,
};

const DEVICE_ASPECT_RATIO: Record<'mobil' | 'surfplatta' | 'dator', number> = {
  mobil: 511 / 917,
  surfplatta: 2048 / 2732,
  dator: 2515 / 1414,
};

function DeviceImage({ label, src, specs, deviceType, accentColor, stripeBaseColor, hideSpecs, website, title, compact: compactProp, aspectRatio: aspectRatioProp, phoneFrame, frameImage, frameImageScale = 1.9, imageFit = 'contain', priority, width: widthProp }: { label: string; src?: string; specs?: string[]; deviceType: 'mobil' | 'surfplatta' | 'dator'; accentColor?: string; stripeBaseColor?: string; hideSpecs?: boolean; website?: string; title: string; compact?: boolean; aspectRatio?: number; phoneFrame?: boolean; frameImage?: string; frameImageScale?: number; imageFit?: 'contain' | 'cover'; priority?: boolean; width?: number }) {
  const width = widthProp ?? DEVICE_FRAME_MAX_WIDTH[deviceType];
  const aspectRatio = aspectRatioProp ?? DEVICE_ASPECT_RATIO[deviceType];
  const compact = compactProp ?? deviceType === 'mobil';

  if (frameImage) {
    const displayWidth = 1400;
    const stripeColor = accentColor ?? '#0a0a0a';
    const baseColor = stripeBaseColor ?? '#ffffff';
    return (
      <div
        className="w-full h-full flex justify-center items-end relative overflow-hidden"
        style={{
          maxWidth: displayWidth,
          borderRadius: 10,
          backgroundImage: `radial-gradient(circle at 15% 15%, ${stripeColor} 0%, transparent 55%), linear-gradient(${baseColor}, ${baseColor})`,
        }}
      >
        <Image
          src={frameImage}
          alt=""
          width={1920}
          height={1440}
          priority={priority}
          style={{ width: '100%', height: 'auto', borderRadius: 10, filter: 'drop-shadow(0 25px 40px rgba(0,0,0,0.35))', transform: `scale(${frameImageScale})`, transformOrigin: 'bottom center' }}
        />
      </div>
    );
  }

  if (phoneFrame) {
    return (
      <div className="w-full border-t border-black/10 pt-10 flex flex-col items-start lg:items-center gap-6">
        <div className="relative inline-flex w-full shadow-[0_25px_50px_rgba(0,0,0,0.18)] box-border" style={{ maxWidth: width + 12, padding: 6, background: 'linear-gradient(160deg, #3a3a3c 0%, #0a0a0a 30%, #0a0a0a 70%, #3a3a3c 100%)', borderRadius: 10 }}>
            <span className="absolute -left-[3px] top-[15%] w-[3px] h-5 bg-[#1c1c1e] rounded-l-sm" />
            <span className="absolute -left-[3px] top-[22%] w-[3px] h-8 bg-[#1c1c1e] rounded-l-sm" />
            <span className="absolute -left-[3px] top-[31%] w-[3px] h-8 bg-[#1c1c1e] rounded-l-sm" />
            <span className="absolute -right-[3px] top-[18%] w-[3px] h-11 bg-[#1c1c1e] rounded-r-sm" />
          <div className="relative w-full bg-white overflow-hidden ring-1 ring-black/40" style={{ aspectRatio: 390 / 690, borderRadius: 10 }}>
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#030303] rounded-full z-10 flex items-center justify-end pr-1.5">
              <span className="w-1 h-1 rounded-full bg-[#1c1c1e] ring-1 ring-[#2a2a2a]" />
            </div>
            {src ? (
              <Image
                src={src}
                alt={label}
                fill
                sizes={`(max-width: ${width}px) 100vw, ${width}px`}
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
          padding: 6,
          borderRadius: 10,
          backgroundImage: `radial-gradient(circle at 50% 50%, ${accentColor ?? '#0a0a0a'} 0%, transparent 85%), linear-gradient(${stripeBaseColor ?? '#ffffff'}, ${stripeBaseColor ?? '#ffffff'})`,
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
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-[30px] box-border pb-16 md:pb-24 lg:pb-32">
        <div className="max-w-[1440px] mx-auto flex flex-col items-start gap-6 mb-16">
          <h1 className="w-full text-[clamp(48px,9vw,120px)] font-black uppercase tracking-tight leading-[0.95] m-0">
            <TypewriterTitle title={project.title} />
          </h1>
          <div className="w-full max-w-md grid grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-black/10">
            <MetaRow label="Status" value={project.status} />
            <MetaRow label="Kund typ" value={project.category} />
            <div className="col-span-2 pt-4 border-t border-black/10">
              <MetaRow label="Datum" value={project.year} />
            </div>
          </div>
        </div>

        {heroImage && (
          <div className="mb-16 md:mb-48">
            <SectionHeader num="01" label={project.title} hasVisibleHeading />
            <div
              className="w-full overflow-hidden"
              style={{
                padding: 6,
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
          </div>
        )}

        {(pagespeedResults?.mobile ?? pagespeedResults?.desktop) && (
          <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen mb-16 md:mb-48 bg-[#f5f5f3] px-6 md:px-[max(30px,calc((100vw-1440px)/2+30px))] pt-10 md:pt-16">
            <div className="border-t border-black/20">
              <SectionHeader num="02" label="Google-resultat" hasVisibleHeading noBorder />
            </div>
            <div className="flex flex-col gap-8 md:gap-16 pb-6 md:pb-16">
            <div className="flex flex-col gap-4">
              <h2 className="w-fit text-[clamp(22px,4.5vw,44px)] font-black uppercase leading-[0.95] tracking-tight m-0 pb-4 border-b border-black/10">
                <span className="text-[#9a9a95] block">Google-resultat,</span>
                <span className="text-[#030303] block">{project.oldPageSpeed ? 'före och efter' : 'idag'}</span>
              </h2>
              <div className="flex items-center gap-2 self-start rounded-full pl-2 pr-4 py-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element -- SVG-ikon, next/image blockerar SVG utan dangerouslyAllowSVG i next.config */}
                <img src="/icons/brands/lighthouse.svg" alt="" width={20} height={20} />
                <span className="text-sm font-bold uppercase tracking-widest text-[#030303]">Mätt med Google PageSpeed Insights</span>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
              <PageSpeedComparison oldPageSpeed={project.oldPageSpeed} newResult={pagespeedResults?.mobile ?? pagespeedResults?.desktop} accentColor={project.accentColor} stripeBaseColor={project.stripeBaseColor} />
              <div className="hidden lg:flex justify-center items-end lg:flex-1 lg:border-l lg:border-black/10 lg:pl-12">
                <DeviceImage label="Mobil" src={mobileImage} deviceType="mobil" accentColor={project.accentColor} stripeBaseColor={project.stripeBaseColor} website={project.website} title={project.title} hideSpecs compact width={360} frameImage={mobileHeroFrameImage(project.slug)} frameImageScale={1.5} />
              </div>
            </div>
          </div>
          </div>
        )}

        <SectionHeader num="03" label="Utmaning, lösning och resultat" hasVisibleHeading />
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 lg:gap-16">
          <div className="lg:sticky lg:top-16 lg:self-start flex flex-col gap-8 lg:gap-16 min-w-0">
            <div className="flex flex-col gap-8 lg:gap-16">
              {project.challenge && (
                <CaseBlock
                  label="Utmaning"
                  text={project.challenge}
                  mobileTitle={project.challengeTitle}
                  mobileDevice={<DeviceImage label="Dator" src={project.image} specs={project.steps?.[2]?.uxImprovements} deviceType="dator" accentColor={project.accentColor} stripeBaseColor={project.stripeBaseColor} website={project.website} title={project.title} hideSpecs compact aspectRatio={1.8} imageFit="cover" priority />}
                />
              )}
              {project.solution && (
                <div className="pt-8 lg:pt-16 border-t border-black/10">
                  <CaseBlock
                    label="Lösning"
                    text={project.solution}
                    mobileTitle={project.solutionTitle}
                    mobileDevice={<DeviceImage label="Mobil" src={mobileImage} specs={project.steps?.[0]?.uxImprovements} deviceType="mobil" accentColor={project.accentColor} stripeBaseColor={project.stripeBaseColor} website={project.website} title={project.title} hideSpecs frameImage={mobileHeroFrameImage(project.slug)} />}
                    imageFirst={false}
                  />
                </div>
              )}
              {project.result && (
                <div className="pt-8 lg:pt-16 border-t border-black/10">
                <CaseBlock
                  label="Resultat"
                  text={project.result}
                  mobileTitle={project.resultTitle}
                  mobileExtra={pagespeedResults && (pagespeedResults.mobile || pagespeedResults.desktop) && <div className="hidden"><PerformanceBadge results={pagespeedResults} /></div>}
                  footer={
                    <>
                      {project.technologies && project.technologies.length > 0 && <TechStack technologies={project.technologies} />}
                      {project.website && (
                        <div className="flex justify-center pt-8 border-t border-black/10">
                          <a
                            href={`https://${project.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-semibold text-[#030303] no-underline"
                          >
                            Besök webbplatsen
                          </a>
                        </div>
                      )}
                    </>
                  }
                />
                </div>
              )}
            </div>
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
                    backgroundImage: `radial-gradient(circle at 15% 15%, ${project.accentColor ?? '#0a0a0a'} 0%, transparent 75%), linear-gradient(${project.stripeBaseColor ?? '#ffffff'}, ${project.stripeBaseColor ?? '#ffffff'})`,
                  }}
                >
                <div className="relative w-full border-2 border-black/25 bg-white overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.18)]" style={{ height: 1600, borderRadius: 10 }}>
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
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
