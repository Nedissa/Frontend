'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { useInView, animate } from 'framer-motion';
import { Database, Layout, Code } from '@phosphor-icons/react';
import type { Project } from '../../projekt-data';
import { PerformanceBadge } from './PerformanceBadge';
import type { PagespeedResults } from './pagespeed-data';
import { scoreColor } from '../../seo-analys/shared';
import { SectionHeader } from '../SectionHeader';

const MOBILE_HERO_SLUGS = ['sagateatern', 'crownmatch', 'techpilots', 'ljuva-hem-i-mark', 'pistolero-studio', 'wastgota-bil'];
function mobileHeroFrameImage(slug: string): string | undefined {
  return MOBILE_HERO_SLUGS.includes(slug) ? `/digital/projekt/${slug}/mockup-mobile-hero.avif` : undefined;
}

// Samma fasta ram-höjd (aspect ratio) för fullstorlekscreenshoten på mobil, oavsett projekt eller källbildens egen höjd.
const MOBILE_FULL_SIZE_CROP_ASPECT_RATIO = '2515 / 4449';

// Fullstorlek-mockup: hela sidans skärmdump utan telefon-chrome, i vit ram.
// aspectRatio styr formen när ingen fast höjd finns (mobil); height styr den när en fast höjd redan är känd (desktop, matchar case-kolumnen).
function FullSizeMockup({ src, alt, accentColor, stripeBaseColor, aspectRatio, height, priority, sizes }: { src: string; alt: string; accentColor?: string; stripeBaseColor?: string; aspectRatio?: string; height?: number; priority?: boolean; sizes: string }) {
  return (
    <StripedFrame accentColor={accentColor} stripeBaseColor={stripeBaseColor}>
      <div
        className="relative w-full border-2 border-black/25 bg-white overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.18)]"
        style={height ? { height, borderRadius: 10 } : { aspectRatio: aspectRatio ?? MOBILE_FULL_SIZE_CROP_ASPECT_RATIO, borderRadius: 10 }}
      >
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-top" priority={priority} />
      </div>
    </StripedFrame>
  );
}

// Desktop-mockup: bred 16:9 skärmdump för hero-sektionen.
function DesktopMockup({ src, alt, accentColor, stripeBaseColor }: { src: string; alt: string; accentColor?: string; stripeBaseColor?: string }) {
  return (
    <StripedFrame accentColor={accentColor} stripeBaseColor={stripeBaseColor}>
      <div className="relative w-full overflow-hidden border-2 border-black/25 shadow-[0_25px_50px_rgba(0,0,0,0.18)]" style={{ aspectRatio: '16 / 9', borderRadius: 10 }}>
        <Image src={src} alt={alt} fill sizes="(max-width: 1440px) 100vw, 1440px" className="object-cover object-top" priority fetchPriority="high" />
      </div>
    </StripedFrame>
  );
}

function StripedFrame({ accentColor, stripeBaseColor, maxWidth, fillHeight, children }: { accentColor?: string; stripeBaseColor?: string; maxWidth?: number; fillHeight?: boolean; children: ReactNode }) {
  return (
    <div
      className={`w-full ${fillHeight ? 'h-full' : ''} flex justify-center items-center relative overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.18)]`}
      style={{
        maxWidth,
        padding: 20,
        borderRadius: 10,
        backgroundImage: `linear-gradient(135deg, ${accentColor ?? '#0a0a0a'} 50%, ${stripeBaseColor ?? '#ffffff'} 50%)`,
      }}
    >
      {children}
    </div>
  );
}

// Telefonram-mockup för PageSpeed-sektionen på desktop. Oförändrad sedan tidigare bekräftat fungerande version.
function MobileMockup({ slug, accentColor, stripeBaseColor, priority, frameImageScale = 1.7 }: { slug: string; accentColor?: string; stripeBaseColor?: string; priority?: boolean; frameImageScale?: number }) {
  const src = mobileHeroFrameImage(slug);
  if (!src) return null;
  return (
    <StripedFrame accentColor={accentColor} stripeBaseColor={stripeBaseColor} maxWidth={1400} fillHeight>
      <Image
        src={src}
        alt=""
        width={720}
        height={1280}
        priority={priority}
        style={{ width: '100%', height: 'auto', borderRadius: 10, filter: 'drop-shadow(0 25px 40px rgba(0,0,0,0.35))', transform: `scale(${frameImageScale})`, transformOrigin: 'center' }}
      />
    </StripedFrame>
  );
}

// Telefonram-mockup för Lösning-kortet på mobil. Egen isolerad väg: hela lådan (bakgrund+telefon)
// görs bredare tillsammans, ingen klippning av delar av bilden. Ändringar här påverkar aldrig PageSpeed-mockupen ovan.
function MobileMockupCard({ slug, accentColor, stripeBaseColor, widthPercent = 130 }: { slug: string; accentColor?: string; stripeBaseColor?: string; widthPercent?: number }) {
  const src = mobileHeroFrameImage(slug);
  if (!src) return null;
  return (
    <div className="flex justify-center" style={{ marginLeft: `-${(widthPercent - 100) / 2}%`, marginRight: `-${(widthPercent - 100) / 2}%` }}>
      <div className="flex justify-center items-center relative overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.18)]" style={{ width: `${widthPercent}%`, padding: 20, borderRadius: 10, backgroundImage: `linear-gradient(135deg, ${accentColor ?? '#0a0a0a'} 50%, ${stripeBaseColor ?? '#ffffff'} 50%)` }}>
        <Image
          src={src}
          alt=""
          width={720}
          height={1280}
          style={{ width: '100%', height: 'auto', borderRadius: 10, filter: 'drop-shadow(0 25px 40px rgba(0,0,0,0.35))' }}
        />
      </div>
    </div>
  );
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
  const [state, setState] = useState({ animate: false, charsShown: title.length });

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) return;
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setState({ animate: true, charsShown: i });
      if (i >= title.length) clearInterval(interval);
    }, 45);
    return () => clearInterval(interval);
  }, [title]);

  const { animate, charsShown } = state;
  const words = title.split(' ');
  const lastWord = words.pop() ?? '';
  const leadWords = words.join(' ');
  const leadEnd = leadWords ? leadWords.length + 1 : 0;

  const visibleLead = animate ? leadWords.slice(0, Math.max(0, Math.min(charsShown, leadWords.length))) : leadWords;
  const visibleLast = animate ? lastWord.slice(0, Math.max(0, charsShown - leadEnd)) : lastWord;

  return (
    <>
      {leadWords && <span className="text-[#9a9a95]">{visibleLead}{visibleLead.length < leadWords.length ? '' : ' '}</span>}
      <span className="text-[#030303]">{visibleLast}</span>
      {animate && <span className="inline-block w-[0.06em] h-[0.85em] bg-[#030303] ml-1 align-middle animate-pulse" style={{ opacity: charsShown >= title.length ? 0 : 1 }} />}
    </>
  );
}

function SplitTitle({ title, as: Tag = 'h3', size = 'text-[clamp(22px,4.5vw,44px)]' }: { title: string; as?: 'h1' | 'h2' | 'h3'; size?: string }) {
  const words = title.split(' ').filter((w) => w.toLowerCase() !== 'och');
  const lastWord = words.pop() ?? '';
  const row1 = words.join(' ');
  return (
    <Tag className={`${size} font-black uppercase leading-[0.95] tracking-tight m-0 break-words`}>
      {row1 && <span className="text-[#9a9a95] block">{row1}</span>}
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

// Delad av CountUp och ScoreDonut: animerar 0→value när elementet scrollar in i vy, en gång.
function useScrollTriggeredCount<T extends Element>(value: number, delay: number, duration: number) {
  const ref = useRef<T>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -150px 0px' });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      const controls = animate(0, value, {
        duration,
        ease: [0.25, 0.1, 0.25, 1],
        onUpdate: setCurrent,
      });
      return () => controls.stop();
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [isInView, value, delay, duration]);

  return { ref, current };
}

function CountUp({ value, delay = 0 }: { value: number; delay?: number }) {
  const { ref, current } = useScrollTriggeredCount<HTMLSpanElement>(value, delay, 2);

  return (
    <span ref={ref} className="inline-block text-right tabular-nums" style={{ minWidth: `${String(value).length}ch` }}>
      {Math.round(current)}
    </span>
  );
}

function ScoreDonut({ value, delay = 0 }: { value: number; delay?: number }) {
  const { ref, current: progress } = useScrollTriggeredCount<SVGSVGElement>(value, delay, 1.4);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const color = scoreColor(value);

  return (
    <div className="relative shrink-0 w-[72px] h-[72px]">
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

function PageSpeedComparisonCard({ oldValue, newValue, label, description, delay }: { oldValue?: number | string; newValue: number | string; label: string; description: string; delay?: number }) {
  return (
    <div className="h-full flex flex-col gap-6 rounded-2xl bg-white p-6 md:p-7 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-black/10">
            <span className="flex items-center gap-2">
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

function PageSpeedComparison({ oldPageSpeed, newResult }: { oldPageSpeed?: Project['oldPageSpeed']; newResult: PagespeedResults['mobile'] }) {
  if (!newResult) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl w-full">
      <PageSpeedComparisonCard
        oldValue={oldPageSpeed?.performance}
        newValue={newResult.performance}
        label="Prestanda"
        description="Laddningstid och upplevd snabbhet på webbplatsen."
        delay={0}
      />
      <PageSpeedComparisonCard
        oldValue={oldPageSpeed?.accessibility}
        newValue={newResult.accessibility}
        label="Tillgänglighet"
        description="Hur väl sidan fungerar för alla besökare."
        delay={0.6}
      />
      <PageSpeedComparisonCard
        oldValue={oldPageSpeed?.bestPractices}
        newValue={newResult.bestPractices}
        label="Bästa metoder"
        description="Följsamhet mot moderna webbstandarder."
        delay={1.2}
      />
      <PageSpeedComparisonCard
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

export function ProjectPageTemplate({ project, pagespeedResults }: { project: Project; pagespeedResults?: PagespeedResults }) {
  const caseColumnRef = useRef<HTMLDivElement>(null);
  const [caseColumnHeight, setCaseColumnHeight] = useState<number>();

  useEffect(() => {
    const el = caseColumnRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setCaseColumnHeight(entry.contentRect.height));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!project.challenge && !project.solution && !project.result && !project.conclusionImage) return null;

  const heroImage = project.cardImage ?? project.image;

  return (
    <section className="case-scroll-no-mobile-anim relative pt-32 md:pt-40">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-[30px] box-border pb-16 md:pb-24 lg:pb-32">
        <SectionHeader num="01" label={project.title} hasVisibleHeading />
        <div className="max-w-[1440px] mx-auto flex flex-col items-start gap-6 mb-16 md:mb-24">
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
            <DesktopMockup src={heroImage} alt={project.title} accentColor={project.accentColor} stripeBaseColor={project.stripeBaseColor} />
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
            <div className="flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-12">
              <PageSpeedComparison oldPageSpeed={project.oldPageSpeed} newResult={pagespeedResults?.mobile ?? pagespeedResults?.desktop} />
              <div className="hidden lg:flex justify-center lg:flex-1 lg:border-l lg:border-black/10 lg:pl-12 overflow-hidden" style={{ maxHeight: 464 }}>
                <MobileMockup slug={project.slug} accentColor={project.accentColor} stripeBaseColor={project.stripeBaseColor} frameImageScale={1.7} />
              </div>
            </div>
          </div>
          </div>
        )}

        <SectionHeader num="03" label="Utmaning, lösning och resultat" hasVisibleHeading />
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 lg:gap-16">
          <div className="lg:sticky lg:top-16 lg:self-start flex flex-col gap-8 lg:gap-16 min-w-0">
            <div ref={caseColumnRef} className="flex flex-col gap-8 lg:gap-16">
              {project.challenge && (
                <CaseBlock
                  label="Utmaning"
                  text={project.challenge}
                  mobileTitle={project.challengeTitle}
                  imageFirst={false}
                  mobileDevice={
                    <FullSizeMockup
                      src={project.image ?? ''}
                      alt={project.title}
                      accentColor={project.accentColor}
                      stripeBaseColor={project.stripeBaseColor}
                      sizes="(max-width: 768px) 100vw, 768px"
                      priority
                    />
                  }
                />
              )}
              {project.solution && (
                <div className="pt-8 lg:pt-16 border-t border-black/10">
                  <CaseBlock
                    label="Lösning"
                    text={project.solution}
                    mobileTitle={project.solutionTitle}
                    mobileDevice={<MobileMockupCard slug={project.slug} accentColor={project.accentColor} stripeBaseColor={project.stripeBaseColor} widthPercent={165} />}
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
                  footer={project.technologies && project.technologies.length > 0 && <TechStack technologies={project.technologies} />}
                />
                </div>
              )}
            </div>
            {project.website && (
              <div className="flex justify-center pt-8 border-t border-black/10">
                <a
                  href={`https://${project.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#030303] text-white px-6 py-3 rounded-full text-sm font-semibold no-underline"
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
                  <FullSizeMockup
                    src={project.conclusionImage}
                    alt={project.title}
                    accentColor={project.accentColor}
                    stripeBaseColor={project.stripeBaseColor}
                    height={caseColumnHeight ? caseColumnHeight - 40 : undefined}
                    aspectRatio="2515 / 7445"
                    sizes="(max-width: 1024px) 0px, 860px"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
