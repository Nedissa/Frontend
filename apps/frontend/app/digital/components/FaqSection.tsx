'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRightIcon } from '@phosphor-icons/react';
import { FadeIn } from './FadeIn';
import { SectionHeader } from './SectionHeader';
import { FAQS } from '../faq-data';

function FaqCard({ index, q, a }: { index: number; q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="faq-card"
      data-open={open || undefined}
      style={{
        textAlign: 'left',
        padding: '32px 28px',
        minHeight: '220px',
        borderTop: '1px solid rgb(230,230,230)',
        borderLeft: '1px solid rgb(230,230,230)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="faq-card-badge" style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Dölj svar' : 'Visa svar'}
          className="faq-card-icon"
          style={{
            flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', fontWeight: 300,
            background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', lineHeight: 1,
            transform: open ? 'rotate(45deg)' : 'none',
            transition: 'transform 0.25s ease, font-size 0.15s ease, color 0.15s ease',
          }}
        >
          +
        </button>
      </div>

      <span className="faq-card-question" style={{ fontSize: '19px', fontWeight: 700, lineHeight: 1.3 }}>
        {q}
      </span>

      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.35s cubic-bezier(0.65, 0, 0.35, 1)',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <p className="faq-card-answer" style={{ fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

function ContactCard() {
  return (
    <Link
      href="/digital/kontakt"
      className="faq-contact-card"
      style={{
        position: 'relative',
        textAlign: 'left',
        padding: '32px 28px',
        minHeight: '220px',
        background: '#f5f5f3',
        borderTop: '1px solid rgb(230,230,230)',
        borderLeft: '1px solid rgb(230,230,230)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        textDecoration: 'none',
      }}
    >
      <span
        className="faq-contact-icon"
        style={{
          position: 'absolute',
          right: '28px',
          bottom: '28px',
          width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: '#030303',
        }}
      >
        <ArrowUpRightIcon size={16} color="#fff" weight="bold" />
      </span>
      <div>
        <span style={{ fontSize: '19px', fontWeight: 700, color: '#030303', display: 'block', marginBottom: '8px' }}>
          Har du fler frågor?
        </span>
        <span style={{ fontSize: '14px', color: 'rgb(104,105,99)' }}>
          Hör av dig så svarar vi direkt.
        </span>
      </div>
    </Link>
  );
}

function FaqIntro() {
  return (
    <div
      className="faq-intro"
      style={{
        position: 'relative',
        background: '#030303',
        padding: '40px 32px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      <div className="pricing-noise absolute inset-0" />

      <div className="relative z-10" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <p style={{ fontSize: '13px', fontWeight: 700, color: '#e8c547', letterSpacing: '0.04em', textTransform: 'uppercase', margin: '0 0 24px' }}>
          Frågor &amp; svar
        </p>
        <h3 style={{ fontSize: 'clamp(32px,3vw,44px)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 20px', color: '#fff' }}>
          Allt du behöver veta innan vi börjar
        </h3>
        <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', margin: 0, maxWidth: '360px' }}>
          Från pris till leveranstid — här är svaren på det vi får frågan om oftast.
        </p>

        <div className="faq-intro-quote" style={{ marginTop: 'auto', paddingTop: '48px' }}>
          <span style={{ fontSize: '32px', color: '#e8c547', lineHeight: 1, display: 'block', marginBottom: '12px' }} aria-hidden="true">
            &ldquo;
          </span>
          <p style={{ fontSize: '17px', fontWeight: 600, lineHeight: 1.5, color: '#fff', margin: '0 0 20px', maxWidth: '340px' }}>
            Fantastiskt service och väldigt bra känsla för webbdesign, har refererat flera vänner som också vart väldigt nöjda med arbetet som har gjorts. Väldigt lätt att få kontakt när man behöver hjälp eller vill ändra något.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                background: '#e8c547', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '15px', fontWeight: 700, color: '#030303',
              }}
              aria-hidden="true"
            >
              M
            </span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Mirza Pepic</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Wästgöta Bil AB</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="section-padding" style={{ padding: '140px 30px', background: '#fff', color: '#030303', boxSizing: 'border-box' }}>
      <style>{`
        .faq-card { background: transparent; }
        .faq-card-badge { background: #f5f5f3; color: rgb(104,105,99); }
        .faq-card-icon, .faq-card-question { color: #030303; }
        .faq-card-answer { color: rgb(104,105,99); }

        .faq-contact-icon svg {
          transition: transform 0.25s ease;
        }

        /* Hover-effekter gäller bara riktiga pekdon (mus) — på touch skulle
           :hover annars fastna kvar efter en tryckning tills man trycker
           någon annanstans, vilket känns klumpigt. */
        @media (hover: hover) and (pointer: fine) {
          .faq-card:hover {
            background: #0a0a0a;
          }
          .faq-card:hover .faq-card-badge {
            background: #e8c547;
            color: #030303;
          }
          .faq-card:hover .faq-card-icon,
          .faq-card:hover .faq-card-question {
            color: #fff;
          }
          .faq-card:hover .faq-card-answer {
            color: rgba(255,255,255,0.7);
          }
          .faq-card-icon:hover {
            font-size: 26px;
          }
          .faq-contact-card:hover .faq-contact-icon svg {
            transform: rotate(45deg);
          }
        }

        /* På touch styrs det mörka kortläget istället av att frågan är öppen. */
        @media not all and (hover: hover) and (pointer: fine) {
          .faq-card[data-open] {
            background: #0a0a0a;
          }
          .faq-card[data-open] .faq-card-badge {
            background: #e8c547;
            color: #030303;
          }
          .faq-card[data-open] .faq-card-icon,
          .faq-card[data-open] .faq-card-question {
            color: #fff;
          }
          .faq-card[data-open] .faq-card-answer {
            color: rgba(255,255,255,0.7);
          }
        }

        @media (max-width: 900px) {
          .faq-card-grid {
            grid-template-columns: 1fr !important;
          }
          .faq-intro {
            padding: 28px 24px !important;
          }
          .faq-intro-quote {
            padding-top: 28px !important;
          }
        }
      `}</style>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <SectionHeader num="10" label="Vanliga frågor" extra="© 2026" />

        <FadeIn>
          <div
            className="grid-responsive-2"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '0',
              alignItems: 'stretch',
            }}
          >
            <FaqIntro />

            <div
              className="faq-card-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                borderRight: '1px solid rgb(230,230,230)',
                borderBottom: '1px solid rgb(230,230,230)',
              }}
            >
              {FAQS.map((f, index) => (
                <FaqCard key={f.q} index={index} q={f.q} a={f.a} />
              ))}
              <ContactCard />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
