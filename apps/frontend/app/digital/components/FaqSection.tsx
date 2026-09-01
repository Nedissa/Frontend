'use client';
import { useState } from 'react';
import { FadeIn } from './FadeIn';
import { SectionHeader } from './SectionHeader';
import { FAQS } from '../faq-data';

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ borderTop: '1px solid rgb(230,230,230)' }}>
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-expanded={open}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 12px', margin: '0 -12px', background: hovered ? 'rgba(0,0,0,0.03)' : 'none',
          border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: '4px',
          transition: 'background 0.2s ease',
        }}
      >
        <span style={{ fontSize: '17px', fontWeight: 500, color: '#030303' }}>{q}</span>
        <span style={{
          fontSize: '20px', fontWeight: 300, color: '#030303', flexShrink: 0, marginLeft: '20px',
          transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.25s ease',
        }} aria-hidden="true">+</span>
      </button>
      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.35s cubic-bezier(0.65, 0, 0.35, 1)',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <p style={{ fontSize: '15px', color: 'rgb(104,105,99)', lineHeight: 1.6, margin: '0 0 24px', maxWidth: '520px' }}>{a}</p>
        </div>
      </div>
    </div>
  );
}

function ShowreelCard() {
  const [playing, setPlaying] = useState(false);
  return (
    <div style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden', background: '#0a0a0a', isolation: 'isolate' }}>
      {playing ? (
        <video
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          controls
          autoPlay
          style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div style={{ width: '100%', height: '220px', background: 'rgb(210,210,210)' }} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: '#f5f5f5' }}>
        <button
          onClick={() => setPlaying(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#030303', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          ▶ Play
        </button>
        <span style={{ fontSize: '13px', color: 'rgb(104,105,99)' }}>Showreel</span>
      </div>
    </div>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="section-padding" style={{ padding: '140px 30px', background: '#fff', color: '#030303', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <SectionHeader num="10" label="Vanliga frågor" extra="© 2026" />

        <div className="grid-responsive-2" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '64px', alignItems: 'start' }}>
          <FadeIn>
            <ShowreelCard />
          </FadeIn>

          <FadeIn delay={0.08}>
            <div>
              {FAQS.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
