'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FadeIn } from './FadeIn';
import { SectionHeader } from './SectionHeader';
import { ServiceSection } from './ServiceSection';
import { PRICES, type PricePackage } from '../pricing-data';

function PricingCard({ p, delay }: { p: PricePackage; delay: number }) {
  return (
    <FadeIn delay={delay}>
      <motion.div
        className="pricing-card relative rounded-[4px] flex flex-col gap-[32px] box-border"
        whileHover={{ y: -8, boxShadow: '0 24px 48px rgba(0,0,0,0.14)' }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          background: p.dark
            ? 'linear-gradient(160deg, rgb(12,13,18) 0%, #030303 140%)'
            : 'linear-gradient(160deg, #f7f7f6 0%, #efeeec 140%)',
          borderTop: '2px solid #e8c547',
          padding: p.dark ? '48px 40px 24px' : '38px 32px 24px',
          boxShadow: p.popular ? '0 0 0 2px #e8c547' : 'none',
        }}
      >
        {p.popular && (
          <span
            className="absolute -top-[14px] left-1/2 -translate-x-1/2 text-[12px] font-bold uppercase px-[16px] py-[6px] rounded-full"
            style={{ background: '#e8c547', color: '#030303', letterSpacing: '0.04em' }}
          >
            Mest valda
          </span>
        )}

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

        <div>
          <Link
            href="/tjanster/kontakt"
            className="flex items-center justify-between text-[16px] font-semibold pb-[12px] no-underline"
            style={{
              color: p.dark ? '#e8c547' : '#030303',
              borderBottom: `1px solid ${p.dark ? 'rgba(232,197,71,0.4)' : 'rgb(104,105,99)'}`,
            }}
          >
            Boka konsultation
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0" aria-hidden="true">
              <path d="M2 2L12 2L12 12L2 2Z" fill={p.dark ? '#e8c547' : '#030303'} />
            </svg>
          </Link>
          <div style={{ fontSize: '12px', marginTop: '8px', color: p.dark ? 'rgba(255,255,255,0.5)' : 'rgb(104,105,99)' }}>Gratis · samma dag offert</div>
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
                <span style={{ color: p.dark ? '#e8c547' : '#030303', marginTop: '1px' }} aria-hidden="true">+</span> {f}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </FadeIn>
  );
}

export function PricingSection() {
  return (
    <ServiceSection id="priser">
      <SectionHeader num="04" label="Priser" extra="© 2026" />

      <div className="grid-responsive-3 grid gap-[16px] items-start" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        {PRICES.map((p, i) => (
          <PricingCard key={p.name} p={p} delay={i * 0.08} />
        ))}
      </div>
    </ServiceSection>
  );
}
