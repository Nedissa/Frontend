import Link from 'next/link';
import { FadeIn } from './FadeIn';
import { SectionHeader } from './SectionHeader';

export function CtaSection() {
  return (
    <section style={{ borderTop: '1px solid rgb(234,234,234)', padding: '140px 30px 200px' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
        <SectionHeader num="08" label="Kontakt" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '40px', alignItems: 'end' }}>
          <FadeIn>
            <h2 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95, color: '#030303', textTransform: 'uppercase', margin: '0 0 24px' }}>
              Redo att bygga<br />något bra?
            </h2>
            <p style={{ fontSize: '16px', color: 'rgb(104,105,99)', maxWidth: '440px', margin: 0, lineHeight: 1.6 }}>
              Boka ett kostnadsfritt möte så går vi igenom ert projekt och vad vi kan göra för er.
            </p>
          </FadeIn>

          <FadeIn delay={0.08}>
            <Link
              href="mailto:info@techpilots.se"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px',
                fontSize: '18px', fontWeight: 600, color: '#030303',
                textDecoration: 'none', paddingBottom: '12px',
                borderBottom: '1px solid #e8c547', minWidth: '260px',
              }}
            >
              Boka ett möte
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                <path d="M2 2L12 2L12 12L2 2Z" fill="#e8c547" />
              </svg>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
