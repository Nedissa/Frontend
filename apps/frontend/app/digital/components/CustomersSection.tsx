import { FadeIn } from './FadeIn';
import { SectionHeader } from './SectionHeader';
import { ServiceSection } from './ServiceSection';

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

export function CustomersSection() {
  return (
    <ServiceSection id="kunder">
      <SectionHeader num="03" label="Kunder" extra="© 2026" hasVisibleHeading />

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
          <div className="bg-[#f5f5f5] rounded-[8px] px-[32px] py-[40px] h-full box-border flex flex-col">
            <div
              className="text-[40px] font-bold text-[#030303] mb-[12px]"
              style={{ letterSpacing: '-0.02em' }}
            >
              4.9/5
            </div>
            <div className="text-[20px] text-[#f5b700] mb-auto" style={{ letterSpacing: '2px' }} aria-hidden="true">★★★★★</div>
            <p className="text-[15px] leading-[1.5] m-0 mt-[40px]" style={{ color: 'rgb(104,105,99)' }}>
              Våra kunder uppskattar det vi gör, vilket märks tydligt i deras positiva omdömen <span className="text-[#e8c547] font-semibold">2026.</span>
            </p>
          </div>
        </FadeIn>

        {/* Customer image with quote */}
        <FadeIn delay={0.08}>
          <div className="customer-image-card relative rounded-[8px] overflow-hidden h-full min-h-[600px] flex items-end box-border">
            <img
              src="/digital/kunder-partners.webp"
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
          <div className="relative bg-[#f5f5f5] rounded-[8px] px-[32px] py-[40px] h-full box-border flex flex-col">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="absolute top-[20px] right-[20px]" aria-hidden="true">
              <path d="M2 2L12 2L12 12L2 2Z" fill="#e8c547" />
            </svg>
            <div className="text-[40px] font-extrabold text-[#030303] leading-none mb-[16px]" aria-hidden="true">&ldquo;</div>
            <p className="text-[16px] text-[#030303] leading-[1.6] m-0 mb-[32px]">
              {TESTIMONIALS[1].quote}
            </p>
            <div className="flex items-center gap-[12px] mt-auto">
              <div className="w-[40px] h-[40px] rounded-full bg-[#030303] text-white flex items-center justify-center text-[18px] font-bold shrink-0" aria-hidden="true">
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
    </ServiceSection>
  );
}
