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

export default function WebbstudioPage() {
  return (
    <main className="main-mobile-order" style={{ background: '#fff', color: '#030303', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Hero */}
      <HeroSection />

      {/* Logo ticker — shown here on mobile only (order-1 within a flex column) */}
      <section className="logo-ticker-mobile-first" style={{ borderTop: '1px solid rgb(220,220,220)', borderBottom: '1px solid rgb(220,220,220)', padding: '40px 0', overflow: 'hidden', background: '#fff' }}>
        <div className="animate-marquee" style={{ display: 'flex', alignItems: 'center', gap: '0', whiteSpace: 'nowrap' }}>
          {LOGOS.map((logo, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <span className="logo-ticker-text" style={{
                fontSize: '34px',
                fontWeight: 700,
                color: '#1a1a1a',
                letterSpacing: '0',
                padding: '0 36px',
              }}>{logo}</span>
              <span style={{ width: '1px', height: '52px', background: 'rgb(210,210,210)', display: 'inline-block' }} />
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
      <section id="priser" className="section-padding" style={{ padding: '140px 30px', minHeight: '100vh', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <SectionHeader num="05" label="Priser" extra="© 2026" />

          <div className="grid-responsive-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', alignItems: 'start' }}>
            {PRICES.map((p, i) => (
              <FadeIn key={p.name} delay={i * 0.08}>
                <div style={{ background: p.dark ? 'linear-gradient(160deg, rgb(12,13,18) 0%, #030303 140%)' : '#f5f5f5', borderRadius: '4px', padding: p.dark ? '48px 40px 24px' : '40px 32px 24px', display: 'flex', flexDirection: 'column', gap: '32px', boxSizing: 'border-box' }}>
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 600, color: p.dark ? '#fff' : '#030303', margin: '0 0 16px' }}>{p.name}</h3>
                    <p style={{ fontSize: '14px', color: p.dark ? 'rgba(255,255,255,0.5)' : 'rgb(104,105,99)', lineHeight: 1.5, margin: 0 }}>{p.desc}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <span style={{ fontSize: '16px', color: p.dark ? 'rgba(255,255,255,0.5)' : 'rgb(104,105,99)' }}>kr</span>
                    <span style={{ fontSize: 'clamp(32px,4vw,56px)', fontWeight: 700, letterSpacing: '-0.03em', color: p.dark ? '#fff' : '#030303', lineHeight: 1 }}>
                      {p.price}
                    </span>
                    <span style={{ fontSize: '15px', color: p.dark ? 'rgba(255,255,255,0.5)' : 'rgb(104,105,99)' }}>{p.suffix}</span>
                  </div>

                  <Link
                    href="/webbstudio#kontakt"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      fontSize: '16px', fontWeight: 600,
                      color: p.dark ? '#e8c547' : '#030303',
                      textDecoration: 'none',
                      paddingBottom: '12px',
                      borderBottom: `1px solid ${p.dark ? 'rgba(232,197,71,0.4)' : 'rgb(104,105,99)'}`,
                    }}
                  >
                    Börja nu
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M2 2L12 2L12 12L2 2Z" fill={p.dark ? '#e8c547' : '#030303'} />
                    </svg>
                  </Link>

                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: p.dark ? '#fff' : '#030303', margin: '0 0 16px' }}>Inkluderat</div>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {p.features.map(f => (
                        <li key={f} style={{ fontSize: '14px', color: p.dark ? 'rgba(255,255,255,0.5)' : 'rgb(104,105,99)', display: 'flex', gap: '8px', alignItems: 'flex-start', fontWeight: 500 }}>
                          <span style={{ color: '#e8c547', marginTop: '1px' }}>+</span> {f}
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
      <section id="kunder" className="section-padding" style={{ padding: '140px 30px', minHeight: '100vh', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <SectionHeader num="06" label="Kunder" extra="© 2026" />

          <FadeIn>
            <h2 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95, color: '#030303', textTransform: 'uppercase', margin: '0 0 24px' }}>
              Kunder<br />Partners
            </h2>
          </FadeIn>

          <div className="animate-blink" style={{ width: '32px', height: '2px', background: 'rgb(200,200,200)', marginBottom: '56px' }} />

          <div className="grid-responsive-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '16px', alignItems: 'stretch' }}>
            {/* Rating */}
            <FadeIn>
              <div style={{ background: '#f5f5f5', borderRadius: '4px', padding: '40px 32px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-0.02em', color: '#030303', marginBottom: '12px' }}>4.9/5</div>
                <div style={{ fontSize: '20px', color: '#f5b700', letterSpacing: '2px', marginBottom: 'auto' }}>★★★★★</div>
                <p style={{ fontSize: '15px', color: 'rgb(104,105,99)', lineHeight: 1.5, margin: '40px 0 0' }}>
                  Våra kunder uppskattar det vi gör, vilket märks tydligt i deras positiva omdömen <span style={{ color: '#e8c547', fontWeight: 600 }}>2026.</span>
                </p>
              </div>
            </FadeIn>

            {/* Customer image with quote */}
            <FadeIn delay={0.08}>
              <div className="customer-image-card" style={{
                position: 'relative', borderRadius: '4px', overflow: 'hidden', height: '100%', minHeight: '600px',
                display: 'flex', alignItems: 'flex-end', boxSizing: 'border-box',
              }}>
                <img
                  src="/webbstudio/kunder-partners.webp"
                  alt=""
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />
                <div style={{ position: 'relative', padding: '32px', color: '#fff' }}>
                  <p style={{ fontSize: '17px', fontWeight: 700, lineHeight: 1.4, margin: '0 0 16px' }}>
                    {TESTIMONIALS[0].quote}
                  </p>
                  <div style={{ fontSize: '15px', fontWeight: 700 }}>{TESTIMONIALS[0].name}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{TESTIMONIALS[0].role}</div>
                </div>
              </div>
            </FadeIn>

            {/* Quote */}
            <FadeIn delay={0.16}>
              <div style={{ position: 'relative', background: '#f5f5f5', borderRadius: '4px', padding: '40px 32px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', top: '20px', right: '20px' }}>
                  <path d="M2 2L12 2L12 12L2 2Z" fill="#e8c547" />
                </svg>
                <div style={{ fontSize: '40px', fontWeight: 800, color: '#030303', lineHeight: 1, marginBottom: '16px' }}>&ldquo;</div>
                <p style={{ fontSize: '16px', color: '#030303', lineHeight: 1.6, margin: '0 0 32px' }}>
                  {TESTIMONIALS[1].quote}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%', background: '#030303',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', fontWeight: 700, flexShrink: 0,
                  }}>G</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#030303' }}>{TESTIMONIALS[1].name}</div>
                    <div style={{ fontSize: '13px', color: 'rgb(104,105,99)' }}>{TESTIMONIALS[1].role}</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section id="teknologier" className="section-padding" style={{ padding: '140px 30px', background: '#f5f5f3', minHeight: '100vh', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <SectionHeader num="07" label="Vår process" extra="© 2026" />

          <div className="grid-responsive-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '64px', marginBottom: '16px' }}>
            {/* Project types - donut */}
            <FadeIn>
              <div style={{ height: '100%', boxSizing: 'border-box' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#030303', margin: '0 0 12px' }}>Projekttyper</h3>
                <div className="animate-blink" style={{ width: '32px', height: '2px', background: 'rgb(200,200,200)', marginBottom: '32px' }} />

                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '32px', height: '200px' }}>
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

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '8px' }}>
                    {PROJECT_TYPES.map((d) => (
                      <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#030303' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color, border: d.color === '#e2e2e2' ? '1px solid rgb(200,200,200)' : 'none', flexShrink: 0 }} />
                        {d.label} <span style={{ color: 'rgb(104,105,99)' }}>{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Where the work goes - bars */}
            <FadeIn delay={0.06}>
              <div style={{ height: '100%', boxSizing: 'border-box' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#030303', margin: '0 0 12px' }}>Var arbetet läggs</h3>
                <div style={{ width: '32px', height: '2px', background: 'rgb(200,200,200)', marginBottom: '32px' }} />

                <AnimatedBars
                  max={45}
                  bars={[
                    { label: 'Test & QA', value: 15, color: '#9a9a9a' },
                    { label: 'Design', value: 25, color: '#030303' },
                    { label: 'Utveckling', value: 45, color: '#e8c547' },
                    { label: 'Lansering', value: 35, color: '#b8b8b8' },
                  ]}
                />
                <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                  {['Test', 'Design', 'Utveckling', 'Lansering'].map((l) => (
                    <div key={l} style={{ flex: 1, textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#030303' }}>{l}</div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Services per project - dot grid */}
            <FadeIn delay={0.12}>
              <div style={{ height: '100%', boxSizing: 'border-box' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#030303', margin: '0 0 12px' }}>Tjänster per projekt</h3>
                <div style={{ width: '32px', height: '2px', background: 'rgb(200,200,200)', marginBottom: '32px' }} />

                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '28px', height: '200px' }}>
                  <AnimatedDots count={32} filled={24} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignSelf: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#030303' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#030303', flexShrink: 0 }} />
                      Ingår
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#030303' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d8d8d8', flexShrink: 0 }} />
                      Tillval
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="grid-responsive-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '64px', marginBottom: '64px' }}>
            {[
              'Fördelning av de projekttyper vi tar oss an.',
              'Timmarna i ett projekt, uppdelade efter arbetsmoment.',
              'Så mycket ingår som standard i varje projekt.',
            ].map((desc, i) => (
              <p key={desc} className={i === 1 ? 'hide-mobile' : undefined} style={{ borderTop: '1px solid rgb(230,230,230)', paddingTop: '28px', fontSize: '14px', color: 'rgb(104,105,99)', lineHeight: 1.5, margin: 0, textAlign: 'left' }}>{desc}</p>
            ))}
          </div>

          <div className="grid-responsive-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '64px' }}>
            {[
              { value: '20', suffix: '+', desc: 'Nöjda kunder som rekommenderar oss vidare.' },
              { value: '100', suffix: '%', desc: 'Mobiloptimerat. Varje hemsida byggs helt responsivt för att ge en perfekt upplevelse på mobilen.' },
              { value: '90', suffix: '%', desc: 'I Google PageSpeed. Vi kodar och optimerar sajten för högsta möjliga betyg och laddtid.' },
            ].map((stat) => (
              <FadeIn key={stat.desc}>
                <div style={{ borderTop: '3px solid rgb(210,210,210)', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 'clamp(40px,5vw,64px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#030303', lineHeight: 1, whiteSpace: 'nowrap' }}>
                    <CountUp value={`${stat.value}${stat.suffix}`} />
                  </div>
                  <p style={{ fontSize: '14px', color: 'rgb(104,105,99)', lineHeight: 1.5, margin: 0, paddingTop: '10px', maxWidth: '160px', textAlign: 'left' }}>{stat.desc}</p>
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
