import { FadeIn } from './components/FadeIn';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { AwardsSection } from './components/AwardsSection';
import { FeaturesSection } from './components/FeaturesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { CountUp } from './components/CountUp';
import { AnimatedBars } from './components/AnimatedBars';
import { AnimatedDots } from './components/AnimatedDots';
import { PlatformsSection } from './components/PlatformsSection';
import { FaqSection } from './components/FaqSection';
import { CtaSection } from './components/CtaSection';
import { SectionHeader } from './components/SectionHeader';
import Link from 'next/link';
import './studio.css';

const LOGO_NAMES = ['Stripe', 'Klarna', 'Medusa', 'Payload', 'Brevo', 'Vercel', 'Hetzner', 'GitHub'];
const LOGOS = [...LOGO_NAMES, ...LOGO_NAMES];

const PROJECT_TYPES = [
  { label: 'Webbutveckling', value: 40, color: '#030303' },
  { label: 'E-handel', value: 30, color: '#e8c547' },
  { label: 'CMS', value: 20, color: '#a8a8a8' },
  { label: 'Optimering & SEO', value: 10, color: '#e2e2e2' },
];

const PRICES = [
  {
    name: 'Grundläggande',
    price: '14 900',
    suffix: '/ Från',
    desc: 'Grundläggande designstöd för nya varumärken som tar sina första steg.',
    features: ['Skräddarsydd visuell identitet', 'Responsiv, modern webbdesign', 'Konverteringsfokuserad layout'],
    dark: false,
  },
  {
    name: 'Företagswebbplats',
    price: '25 490',
    suffix: '/ Från',
    desc: 'För etablerade bolag som behöver en skalbar webbplats som växer med verksamheten.',
    features: ['CMS-integration', 'Flersidigt innehållssystem', 'Teknisk SEO', 'Core Web Vitals-optimering', 'WCAG-anpassning och tillgänglighet'],
    dark: false,
  },
  {
    name: 'E-handel',
    price: '35 000',
    suffix: '/ Från',
    desc: 'För varumärken som vill äga hela köpupplevelsen eller komma igång snabbt.',
    features: ['Shopify-tema eller Headless', 'Betallösning (Stripe) med Klarna', 'Produkthantering', 'Sömlös kassaupplevelse', 'Snabb, optimerad prestandainstallation', 'Sömlöst CMS och organisation', 'API-integrationer och tredjepartstjänster'],
    dark: true,
  },
];

const TESTIMONIALS = [
  {
    quote: '"Vi behövde en helt ny webbplats som speglar vad Sagateatern faktiskt är idag, en plats där mat och scenkonst möts. Techpilots levererade precis det."',
    name: 'Qia Hjelmäng',
    role: 'Ägare, Sagateatern i Borås',
  },
  {
    quote: '"Äntligen en hemsida som matchar vår studio. Techpilots var otroligt lyhörda för vår stil, från tatuering till skönhetsbehandlingar. De skapade en design som är både snygg och funktionell. Vi är supernöjda med helheten och den personliga kontakten!"',
    name: 'Christian',
    role: 'Ägare, Pistolero Studio',
  },
];

export default function WebStudioPage() {
  return (
    <main
      className="main-mobile-order bg-white text-[#030303] min-h-screen"
      style={{ fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
    >
      {/* Hero */}
      <HeroSection />

      {/* Logo ticker — shown here on mobile only (order-1 within a flex column) */}
      <section
        className="logo-ticker-mobile-first overflow-hidden bg-white py-[40px]"
        style={{ borderTop: '1px solid rgb(220,220,220)', borderBottom: '1px solid rgb(220,220,220)' }}
      >
        <div className="animate-marquee flex items-center gap-0 whitespace-nowrap">
          {LOGOS.map((logo, i) => (
            <span key={i} className="inline-flex items-center">
              <span
                className="logo-ticker-text text-[34px] font-bold text-[#1a1a1a] px-[36px]"
                style={{ letterSpacing: '0' }}
              >
                {logo}
              </span>
              <span
                className="inline-block w-[1px] h-[52px]"
                style={{ background: 'rgb(210,210,210)' }}
              />
            </span>
          ))}
        </div>
      </section>

      <StatsSection />

      {/* Offers / Awards */}
      <AwardsSection />

      {/* Features */}
      <FeaturesSection />

      {/* Projects */}
      <ProjectsSection />

      {/* Pricing */}
      <section id="priser" className="section-padding py-[140px] px-[30px] min-h-screen box-border">
        <div className="max-w-[1440px] mx-auto">
          <SectionHeader num="05" label="Priser" extra="© 2026" />

          <div className="grid-responsive-3 grid gap-[16px] items-start" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {PRICES.map((p, i) => (
              <FadeIn key={p.name} delay={i * 0.08}>
                <div
                  className="pricing-card rounded-[4px] flex flex-col gap-[32px] box-border"
                  style={{
                    background: p.dark
                      ? 'linear-gradient(160deg, rgb(12,13,18) 0%, #030303 140%)'
                      : 'linear-gradient(160deg, #f7f7f6 0%, #efeeec 140%)',
                    borderTop: '2px solid #e8c547',
                    padding: p.dark ? '48px 40px 24px' : '38px 32px 24px',
                  }}
                >
                  <div>
                    <h3
                      className="text-[22px] font-semibold m-0 mb-[16px]"
                      style={{ color: p.dark ? '#fff' : '#030303' }}
                    >
                      {p.name}
                    </h3>
                    <p
                      className="pricing-desc text-[14px] leading-[1.5] m-0"
                      style={{ color: p.dark ? 'rgba(255,255,255,0.5)' : 'rgb(104,105,99)' }}
                    >
                      {p.desc}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-[10px]">
                      <span
                        className="text-[16px]"
                        style={{ color: p.dark ? 'rgba(255,255,255,0.5)' : 'rgb(104,105,99)' }}
                      >
                        kr
                      </span>
                      <span
                        className="font-bold leading-none"
                        style={{
                          fontSize: 'clamp(32px,4vw,56px)',
                          letterSpacing: '-0.03em',
                          color: p.dark ? '#fff' : '#030303',
                        }}
                      >
                        {p.price}
                      </span>
                      <span
                        className="text-[15px]"
                        style={{ color: p.dark ? 'rgba(255,255,255,0.5)' : 'rgb(104,105,99)' }}
                      >
                        {p.suffix}
                      </span>
                    </div>
                    <div
                      className="text-[13px] mt-[4px]"
                      style={{ color: p.dark ? 'rgba(255,255,255,0.4)' : 'rgb(140,140,134)' }}
                    >
                      Exkl. moms
                    </div>
                  </div>

                  <Link
                    href="/tjanster#kontakt"
                    className="flex items-center justify-between text-[16px] font-semibold pb-[12px] no-underline"
                    style={{
                      color: p.dark ? '#e8c547' : '#030303',
                      borderBottom: `1px solid ${p.dark ? 'rgba(232,197,71,0.4)' : 'rgb(104,105,99)'}`,
                    }}
                  >
                    Börja nu
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                      <path d="M2 2L12 2L12 12L2 2Z" fill={p.dark ? '#e8c547' : '#030303'} />
                    </svg>
                  </Link>

                  <div>
                    <div
                      className="text-[18px] font-semibold m-0 mb-[16px]"
                      style={{ color: p.dark ? '#fff' : '#030303' }}
                    >
                      Inkluderat
                    </div>
                    <ul className="pricing-features list-none m-0 p-0 flex flex-col gap-[12px]">
                      {p.features.map(f => (
                        <li
                          key={f}
                          className="text-[14px] flex gap-[8px] items-start font-medium"
                          style={{ color: p.dark ? 'rgba(255,255,255,0.5)' : 'rgb(104,105,99)' }}
                        >
                          <span style={{ color: p.dark ? '#e8c547' : '#030303', marginTop: '1px' }}>+</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Customers / Partners */}
      <section id="kunder" className="section-padding py-[140px] px-[30px] min-h-screen box-border">
        <div className="max-w-[1440px] mx-auto">
          <SectionHeader num="06" label="Kunder" extra="© 2026" />

          <FadeIn>
            <h2
              className="font-extrabold uppercase m-0 mb-[24px]"
              style={{
                fontSize: 'clamp(36px,5vw,64px)',
                letterSpacing: '-0.03em',
                lineHeight: 0.95,
                color: '#030303',
              }}
            >
              Kunder<br /><span style={{ color: 'rgb(104,105,99)' }}>Partners</span>
            </h2>
          </FadeIn>

          <div
            className="animate-blink w-[32px] h-[2px] mb-[56px]"
            style={{ background: 'rgb(200,200,200)' }}
          />

          <div
            className="grid-responsive-3 grid gap-[16px] items-stretch"
            style={{ gridTemplateColumns: '1fr 1.2fr 1fr' }}
          >
            {/* Rating */}
            <FadeIn>
              <div className="bg-[#f5f5f5] rounded-[4px] px-[32px] py-[40px] h-full box-border flex flex-col">
                <div
                  className="text-[40px] font-bold text-[#030303] mb-[12px]"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  4.9/5
                </div>
                <div className="text-[20px] text-[#f5b700] mb-auto" style={{ letterSpacing: '2px' }}>★★★★★</div>
                <p className="text-[15px] leading-[1.5] m-0 mt-[40px]" style={{ color: 'rgb(104,105,99)' }}>
                  Våra kunder uppskattar det vi gör, vilket märks tydligt i deras positiva omdömen <span className="text-[#e8c547] font-semibold">2026.</span>
                </p>
              </div>
            </FadeIn>

            {/* Customer image with quote */}
            <FadeIn delay={0.08}>
              <div className="customer-image-card relative rounded-[4px] overflow-hidden h-full min-h-[600px] flex items-end box-border">
                <img
                  src="/tjanster/kunder-partners.webp"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }}
                />
                <div className="relative p-[32px] text-white">
                  <p className="text-[17px] font-bold leading-[1.4] m-0 mb-[16px]">
                    {TESTIMONIALS[0].quote}
                  </p>
                  <div className="text-[15px] font-bold">{TESTIMONIALS[0].name}</div>
                  <div className="text-[13px] text-white/70">{TESTIMONIALS[0].role}</div>
                </div>
              </div>
            </FadeIn>

            {/* Quote */}
            <FadeIn delay={0.16}>
              <div className="relative bg-[#f5f5f5] rounded-[4px] px-[32px] py-[40px] h-full box-border flex flex-col">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="absolute top-[20px] right-[20px]">
                  <path d="M2 2L12 2L12 12L2 2Z" fill="#e8c547" />
                </svg>
                <div className="text-[40px] font-extrabold text-[#030303] leading-none mb-[16px]">&ldquo;</div>
                <p className="text-[16px] text-[#030303] leading-[1.6] m-0 mb-[32px]">
                  {TESTIMONIALS[1].quote}
                </p>
                <div className="flex items-center gap-[12px] mt-auto">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#030303] text-white flex items-center justify-center text-[18px] font-bold shrink-0">
                    G
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#030303]">{TESTIMONIALS[1].name}</div>
                    <div className="text-[13px]" style={{ color: 'rgb(104,105,99)' }}>{TESTIMONIALS[1].role}</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section
        id="teknologier"
        className="section-padding py-[140px] px-[30px] min-h-screen box-border"
        style={{ background: '#f5f5f3' }}
      >
        <div className="max-w-[1440px] mx-auto">
          <SectionHeader num="07" label="Vår process" extra="© 2026" />

          <div
            className="grid-responsive-3 grid gap-[64px] mb-[16px]"
            style={{ gridTemplateColumns: 'repeat(3,1fr)' }}
          >
            {/* Project types - donut */}
            <FadeIn>
              <div className="h-full box-border">
                <h3 className="text-[20px] font-bold text-[#030303] m-0 mb-[12px]">Projekttyper</h3>
                <div
                  className="animate-blink w-[32px] h-[2px] mb-[32px]"
                  style={{ background: 'rgb(200,200,200)' }}
                />

                <div className="flex items-end gap-[32px] h-[200px]">
                  <svg width="180" height="180" viewBox="0 0 140 140">
                    {(() => {
                      const data = PROJECT_TYPES;
                      const total = data.reduce((s, d) => s + d.value, 0);
                      const r = 45;
                      const cx = 70, cy = 70;
                      const circumference = 2 * Math.PI * r;
                      let offset = 0;
                      return data.map((d) => {
                        const frac = d.value / total;
                        const dash = frac * circumference;
                        const gap = circumference - dash;
                        const el = (
                          <circle
                            key={d.label}
                            cx={cx}
                            cy={cy}
                            r={r}
                            fill="none"
                            stroke={d.color}
                            strokeWidth="30"
                            strokeDasharray={`${Math.max(dash - 2, 0)} ${gap + 2}`}
                            strokeDashoffset={-offset}
                            transform={`rotate(-90 ${cx} ${cy})`}
                          />
                        );
                        offset += dash;
                        return el;
                      });
                    })()}
                    <text x="70" y="76" textAnchor="middle" fontSize="22" fontWeight="700" fill="#030303">100</text>
                  </svg>

                  <div className="flex flex-col gap-[10px] mb-[8px]">
                    {PROJECT_TYPES.map((d) => (
                      <div key={d.label} className="flex items-center gap-[8px] text-[14px] text-[#030303]">
                        <span
                          className="w-[8px] h-[8px] rounded-full shrink-0"
                          style={{
                            background: d.color,
                            border: d.color === '#e2e2e2' ? '1px solid rgb(200,200,200)' : 'none',
                          }}
                        />
                        {d.label} <span style={{ color: 'rgb(104,105,99)' }}>{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Where the work goes - bars */}
            <FadeIn delay={0.06}>
              <div className="h-full box-border">
                <h3 className="text-[20px] font-bold text-[#030303] m-0 mb-[12px]">Var arbetet läggs</h3>
                <div
                  className="w-[32px] h-[2px] mb-[32px]"
                  style={{ background: 'rgb(200,200,200)' }}
                />

                <AnimatedBars
                  max={45}
                  bars={[
                    { label: 'Test & QA', value: 15, color: '#9a9a9a' },
                    { label: 'Design', value: 25, color: '#030303' },
                    { label: 'Utveckling', value: 45, color: '#e8c547' },
                    { label: 'Lansering', value: 35, color: '#b8b8b8' },
                  ]}
                />
                <div className="flex gap-[20px] mt-[12px]">
                  {['Test', 'Design', 'Utveckling', 'Lansering'].map((l) => (
                    <div key={l} className="flex-1 text-center text-[13px] font-semibold text-[#030303]">{l}</div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Services per project - dot grid */}
            <FadeIn delay={0.12}>
              <div className="h-full box-border">
                <h3 className="text-[20px] font-bold text-[#030303] m-0 mb-[12px]">Tjänster per projekt</h3>
                <div
                  className="w-[32px] h-[2px] mb-[32px]"
                  style={{ background: 'rgb(200,200,200)' }}
                />

                <div className="flex items-end gap-[28px] h-[200px]">
                  <AnimatedDots count={32} filled={24} />

                  <div className="flex flex-col gap-[10px] self-center">
                    <div className="flex items-center gap-[8px] text-[14px] text-[#030303]">
                      <span className="w-[8px] h-[8px] rounded-full bg-[#030303] shrink-0" />
                      Ingår
                    </div>
                    <div className="flex items-center gap-[8px] text-[14px] text-[#030303]">
                      <span className="w-[8px] h-[8px] rounded-full bg-[#d8d8d8] shrink-0" />
                      Tillval
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          <div
            className="grid-responsive-3 grid gap-[64px] mb-[64px]"
            style={{ gridTemplateColumns: 'repeat(3,1fr)' }}
          >
            {[
              'Fördelning av de projekttyper vi tar oss an.',
              'Timmarna i ett projekt, uppdelade efter arbetsmoment.',
              'Så mycket ingår som standard i varje projekt.',
            ].map((desc, i) => (
              <p
                key={desc}
                className={`${i === 1 ? 'hide-mobile' : ''} ${i === 0 ? 'process-desc-clamp' : ''} ${i === 2 ? 'hide-mobile-standard-text' : ''} pt-[28px] text-[14px] leading-[1.5] m-0 text-left`}
                style={{
                  borderTop: '1px solid rgb(230,230,230)',
                  color: 'rgb(104,105,99)',
                }}
              >
                {desc}
              </p>
            ))}
          </div>

          <div
            className="grid-responsive-3 grid gap-[64px]"
            style={{ gridTemplateColumns: 'repeat(3,1fr)' }}
          >
            {[
              { value: '20', suffix: '+', desc: 'Nöjda kunder som rekommenderar oss vidare.' },
              { value: '100', suffix: '%', desc: 'Mobiloptimerat. Varje hemsida byggs helt responsivt för att ge en perfekt upplevelse på mobilen.' },
              { value: '90', suffix: '%', desc: 'I Google PageSpeed. Vi kodar och optimerar sajten för högsta möjliga betyg och laddtid.' },
            ].map((stat) => (
              <FadeIn key={stat.desc}>
                <div
                  className="pt-[32px] flex justify-between items-start"
                  style={{ borderTop: '3px solid rgb(210,210,210)' }}
                >
                  <div
                    className="font-extrabold leading-none text-[#030303] whitespace-nowrap"
                    style={{ fontSize: 'clamp(40px,5vw,64px)', letterSpacing: '-0.03em' }}
                  >
                    <CountUp value={`${stat.value}${stat.suffix}`} />
                  </div>
                  <p
                    className="text-[14px] leading-[1.5] m-0 pt-[10px] max-w-[160px] text-left"
                    style={{ color: 'rgb(104,105,99)' }}
                  >
                    {stat.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <PlatformsSection />

      <FaqSection />

      <CtaSection />

    </main>
  );
}
