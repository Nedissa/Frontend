'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { ServiceSection } from './ServiceSection';
import { FadeIn } from './FadeIn';
import { PRICES, SEO_PRICES, type PricePackage } from '../pricing-data';
import { CalPopupButton } from './CalPopupButton';

// Samma mönster som scrollToAnchorId i SiteNav — landar mitt i sektionen (kompenserar
// för fixed navbar) istället för webbläsarens standard-hopp som klipper av toppen.
function scrollToSeoTest(e: React.MouseEvent) {
  e.preventDefault();
  const el = document.getElementById('seo-test');
  if (!el) return;
  const NAVBAR_HEIGHT = 72;
  const rect = el.getBoundingClientRect();
  const sectionMiddle = rect.top + window.scrollY + rect.height / 2 - window.innerHeight / 2;
  window.scrollTo({ top: Math.max(0, sectionMiddle + NAVBAR_HEIGHT / 2), behavior: 'smooth' });
}

function PricingCard({ p, delay }: { p: PricePackage; delay: number }) {
  const [showIncVat, setShowIncVat] = useState(false);
  const numericPrice = parseInt(p.price.replace(/\s/g, ''), 10);
  const displayPrice = showIncVat
    ? Math.round((numericPrice * 1.25) / 10) * 10
    : numericPrice;
  const formattedPrice = displayPrice.toLocaleString('sv-SE');
  const bindingNote = p.bindingMonths
    ? `${p.bindingMonths} mån bindningstid · ${(displayPrice * p.bindingMonths).toLocaleString('sv-SE')} kr totalt`
    : undefined;
  const combinedNote = [bindingNote, p.note].filter(Boolean).join(' · ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1], delay }}
      className="relative"
    >
      <motion.div
        className="pricing-card relative rounded-[5px] flex flex-col box-border"
        whileHover={{
          y: -8,
          boxShadow: p.popular ? '0 0 0 2px #e8c547, 0 24px 48px rgba(0,0,0,0.14)' : '0 24px 48px rgba(0,0,0,0.14)',
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          ...(p.popular ? { marginBottom: '-24px' } : {}),
          boxShadow: p.popular ? '0 0 0 2px #e8c547' : 'none',
        }}
      >
        {p.popular && (
          <span
            className="absolute -top-[14px] left-1/2 -translate-x-1/2 z-20 text-[12px] font-bold uppercase px-[16px] py-[6px] rounded-full"
            style={{ background: '#e8c547', color: '#030303', letterSpacing: '0.04em' }}
          >
            Mest valda
          </span>
        )}
        <div
          className="relative rounded-[5px] flex flex-col box-border"
          style={{
            background: p.dark
              ? 'linear-gradient(160deg, rgb(12,13,18) 0%, #030303 140%)'
              : 'linear-gradient(160deg, #f7f7f6 0%, #efeeec 140%)',
            overflow: 'hidden',
          }}
        >
        <div className="relative" style={{ minHeight: '180px', background: p.headerGradient ?? '#030303' }}>
          <div className="pricing-noise absolute inset-0" />
          <div className="relative z-10 flex flex-col justify-center h-full" style={{ padding: '0 32px', minHeight: '180px' }}>
            <h3 className="text-[22px] font-semibold m-0 mb-[12px] text-white">{p.name}</h3>
            <p className="pricing-desc text-[14px] leading-[1.5] m-0" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {p.desc}
            </p>
          </div>
          <svg
            className="absolute -bottom-px left-0 w-full"
            viewBox="0 0 400 24"
            preserveAspectRatio="none"
            style={{ height: '24px' }}
            aria-hidden="true"
          >
            <path
              d="M0,24 L0,10 Q100,-4 200,10 T400,10 L400,24 Z"
              fill={p.dark ? 'rgb(12,13,18)' : '#f7f7f6'}
            />
          </svg>
        </div>

        <div
          className="flex flex-col gap-[32px]"
          style={{ padding: p.dark ? '20px 40px 24px' : '16px 32px 24px' }}
        >
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
              {formattedPrice}
            </span>
            <span
              className="text-[15px]"
              style={{ color: p.dark ? 'rgba(255,255,255,0.5)' : 'rgb(104,105,99)' }}
            >
              {p.suffix}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowIncVat((v) => !v)}
            className="text-[13px] mt-[4px] underline bg-transparent"
            style={{ color: p.dark ? 'rgba(255,255,255,0.4)' : 'rgb(140,140,134)' }}
          >
            {showIncVat ? 'Inkl. moms · Visa exkl.' : 'Exkl. moms · Visa inkl.'}
          </button>
        </div>

        <div>
          {p.ctaLabel ? (
            <a
              href="#seo-test"
              onClick={scrollToSeoTest}
              className="flex items-center gap-[10px] text-[16px] font-semibold pb-[12px] no-underline"
              style={{
                color: p.dark ? '#e8c547' : '#030303',
                borderBottom: `1px solid ${p.dark ? 'rgba(232,197,71,0.4)' : 'rgb(104,105,99)'}`,
              }}
            >
              {p.ctaLabel}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0" aria-hidden="true">
                <path d="M2 2L12 2L12 12L2 2Z" fill={p.dark ? '#e8c547' : '#030303'} />
              </svg>
            </a>
          ) : (
            <CalPopupButton
              className="flex items-center gap-[10px] text-[16px] font-semibold pb-[12px] no-underline"
              style={{
                color: p.dark ? '#e8c547' : '#030303',
                borderBottom: `1px solid ${p.dark ? 'rgba(232,197,71,0.4)' : 'rgb(104,105,99)'}`,
              }}
            >
              Boka samtal
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0" aria-hidden="true">
                <path d="M2 2L12 2L12 12L2 2Z" fill={p.dark ? '#e8c547' : '#030303'} />
              </svg>
            </CalPopupButton>
          )}
          <div style={{ fontSize: '12px', marginTop: '8px', color: p.dark ? 'rgba(255,255,255,0.5)' : 'rgb(104,105,99)' }}>
            {combinedNote || 'Gratis · samma dag offert'}
          </div>
        </div>

        <div>
          <div
            className="text-[18px] font-semibold m-0 mb-[16px]"
            style={{ color: p.dark ? '#fff' : '#030303' }}
          >
            Inkluderat
          </div>
          <ul className="pricing-features list-none m-0 p-0 flex flex-col gap-[12px]">
            {p.features.map((f) => (
              <li
                key={f}
                className="text-[14px] flex gap-[8px] items-start font-medium"
                style={{ color: p.dark ? 'rgba(255,255,255,0.5)' : 'rgb(104,105,99)' }}
              >
                <span
                  className="flex items-center justify-center shrink-0 rounded-full"
                  style={{
                    width: '18px',
                    height: '18px',
                    marginTop: '1px',
                    background: p.headerGradient ?? '#030303',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 700,
                    lineHeight: 1,
                    textAlign: 'center',
                  }}
                  aria-hidden="true"
                >
                  +
                </span>{' '}
                {f}
              </li>
            ))}
          </ul>
        </div>

        {p.upgradeNote && (
          <div
            className="text-[12px] leading-[1.5] pt-[16px]"
            style={{
              borderTop: `1px solid ${p.dark ? 'rgba(255,255,255,0.12)' : 'rgb(230,230,230)'}`,
              color: p.dark ? 'rgba(255,255,255,0.4)' : 'rgb(140,140,134)',
            }}
          >
            {p.upgradeNote}
          </div>
        )}
        </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function PricingSection() {
  const [showSeo, setShowSeo] = useState(false);
  const prices = showSeo ? SEO_PRICES : PRICES;

  return (
    <ServiceSection id="priser">
      <SectionHeader num="05" label="Priser" extra="© 2026" />

      <FadeIn className="flex items-center justify-center gap-[12px] mb-[96px]">
        <span className="text-[16px] font-semibold" style={{ color: !showSeo ? '#030303' : 'rgb(140,140,134)' }}>
          Webbplats
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={showSeo}
          aria-label="Växla mellan Webbplats- och SEO-priser"
          onClick={() => setShowSeo((v) => !v)}
          className="relative shrink-0 rounded-full transition-colors"
          style={{ width: '64px', height: '34px', background: '#030303', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
        >
          <span
            className="absolute top-[3px] rounded-full bg-white transition-transform"
            style={{ width: '28px', height: '28px', left: '3px', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', transform: showSeo ? 'translateX(30px)' : 'translateX(0)' }}
          />
        </button>
        <span className="text-[16px] font-semibold" style={{ color: showSeo ? '#030303' : 'rgb(140,140,134)' }}>
          SEO
        </span>
      </FadeIn>

      <FadeIn delay={0.1} className="grid-responsive-3 grid gap-[32px] items-start" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        <AnimatePresence mode="wait">
          <motion.div key={showSeo ? 'seo' : 'web'} className="contents">
            {prices.map((p, i) => (
              <PricingCard key={p.name} p={p} delay={i * 0.08} />
            ))}
          </motion.div>
        </AnimatePresence>
      </FadeIn>
    </ServiceSection>
  );
}
