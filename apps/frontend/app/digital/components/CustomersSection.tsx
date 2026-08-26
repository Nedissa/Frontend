'use client';
import { useState } from 'react';
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

function HoverWipe({ hovered, origin }: { hovered: boolean; origin: string }) {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: `${origin} center`,
        background: '#030303',
        transition: 'transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)',
      }}
    />
  );
}

function useSideHover() {
  const [hovered, setHovered] = useState(false);
  const [origin, setOrigin] = useState('left');

  const onMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin(e.clientX - rect.left < rect.width / 2 ? 'left' : 'right');
    setHovered(true);
  };

  return { hovered, origin, onMouseEnter, onMouseLeave: () => setHovered(false) };
}

export function CustomersSection() {
  const rating = useSideHover();
  const quote = useSideHover();

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
          <div
            className="relative bg-[#f5f5f5] rounded-[8px] px-[32px] py-[40px] h-full box-border flex flex-col overflow-hidden cursor-default"
            onMouseEnter={rating.onMouseEnter}
            onMouseLeave={rating.onMouseLeave}
          >
            <HoverWipe hovered={rating.hovered} origin={rating.origin} />
            <div
              className="relative z-[1] text-[40px] font-bold mb-[12px]"
              style={{ letterSpacing: '-0.02em', color: rating.hovered ? '#fff' : '#030303', transition: 'color 0.3s' }}
            >
              4.9/5
            </div>
            <div className="relative z-[1] text-[20px] text-[#f5b700] mb-auto" style={{ letterSpacing: '2px' }} aria-hidden="true">★★★★★</div>
            <p
              className="relative z-[1] text-[15px] leading-[1.5] m-0 mt-[40px]"
              style={{ color: rating.hovered ? 'rgba(255,255,255,0.6)' : 'rgb(104,105,99)', transition: 'color 0.3s' }}
            >
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
          <div
            className="relative bg-[#f5f5f5] rounded-[8px] px-[32px] py-[40px] h-full box-border flex flex-col overflow-hidden cursor-default"
            onMouseEnter={quote.onMouseEnter}
            onMouseLeave={quote.onMouseLeave}
          >
            <HoverWipe hovered={quote.hovered} origin={quote.origin} />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="absolute z-[1] top-[20px] right-[20px]" aria-hidden="true">
              <path d="M2 2L12 2L12 12L2 2Z" fill="#e8c547" />
            </svg>
            <div
              className="relative z-[1] text-[40px] font-extrabold leading-none mb-[16px]"
              style={{ color: quote.hovered ? '#fff' : '#030303', transition: 'color 0.3s' }}
              aria-hidden="true"
            >
              &ldquo;
            </div>
            <p
              className="relative z-[1] text-[16px] leading-[1.6] m-0 mb-[32px]"
              style={{ color: quote.hovered ? '#fff' : '#030303', transition: 'color 0.3s' }}
            >
              {TESTIMONIALS[1].quote}
            </p>
            <div className="relative z-[1] flex items-center gap-[12px] mt-auto">
              <div
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-[18px] font-bold shrink-0"
                style={{ background: quote.hovered ? '#e8c547' : '#030303', color: quote.hovered ? '#030303' : '#fff', transition: 'background 0.3s, color 0.3s' }}
                aria-hidden="true"
              >
                G
              </div>
              <div>
                <div
                  className="text-[14px] font-semibold"
                  style={{ color: quote.hovered ? '#fff' : '#030303', transition: 'color 0.3s' }}
                >
                  {TESTIMONIALS[1].name}
                </div>
                <div className="text-[13px]" style={{ color: quote.hovered ? 'rgba(255,255,255,0.6)' : 'rgb(104,105,99)', transition: 'color 0.3s' }}>
                  {TESTIMONIALS[1].role}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </ServiceSection>
  );
}
