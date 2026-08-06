'use client';
import { useState } from 'react';
import { FadeIn } from './FadeIn';
import { SectionHeader } from './SectionHeader';

const FAQS = [
  { q: 'Vad skiljer oss från andra byråer?', a: 'Vi kombinerar strategi, design och utveckling i ett och samma team, vilket gör processen snabbare och mer sammanhållen.' },
  { q: 'Varför inte anställa en intern designer eller frilansare?', a: 'Med oss får ni ett helt team av specialister till en lägre kostnad än en anställning, utan bindningstid.' },
  { q: 'Är kreativa förfrågningar verkligen obegränsade?', a: 'Ja, inom ramen för ert paket kan ni skicka in så många förfrågningar ni vill, vi arbetar med dem en i taget.' },
  { q: 'Hur snabbt får jag mitt arbete?', a: 'De flesta ärenden levereras inom 2–5 arbetsdagar beroende på omfattning.' },
  { q: 'Vad händer om jag bara har ett enskilt projekt?', a: 'Inga problem, vi tar även enstaka projekt utan löpande avtal.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: '1px solid rgb(230,230,230)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '17px', fontWeight: 500, color: '#030303' }}>{q}</span>
        <span style={{
          fontSize: '20px', fontWeight: 300, color: '#030303', flexShrink: 0, marginLeft: '20px',
          transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.25s ease',
        }}>+</span>
      </button>
      {open && (
        <p style={{ fontSize: '15px', color: 'rgb(104,105,99)', lineHeight: 1.6, margin: '0 0 24px', maxWidth: '520px' }}>{a}</p>
      )}
    </div>
  );
}

function ShowreelCard() {
  const [playing, setPlaying] = useState(false);
  return (
    <div style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden', background: '#000' }}>
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
        <span style={{ fontSize: '13px', color: 'rgb(140,140,140)' }}>Showreel</span>
      </div>
    </div>
  );
}

export function FaqSection() {
  return (
    <section id="faq" style={{ borderTop: '1px solid rgb(234,234,234)', padding: '100px 30px', background: '#fff', color: '#030303' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
        <SectionHeader num="07" label="Vanliga frågor" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '64px', alignItems: 'start' }}>
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
