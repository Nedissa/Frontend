'use client';
import { useState } from 'react';
import { FadeIn } from './FadeIn';
import { SectionHeader } from './SectionHeader';

const FAQS = [
  { q: 'Ett lokalt team, inte en anonym byrå', a: 'Vi sitter i Borås och jobbar nära våra kunder, med kort startsträcka och raka besked. Ni pratar alltid med samma team, inte en ny konsult för varje fråga.' },
  { q: 'Ett helt team, till kostnaden av en anställning', a: 'Med oss får ni tillgång till specialister inom design, utveckling och drift, utan rekryteringskostnad eller bindningstid. Ni betalar för resultatet, inte för en anställd.' },
  { q: 'Obegränsat med förfrågningar, ett i taget', a: 'Inom ramen för ert paket kan ni skicka in så många förfrågningar ni vill. Vi arbetar igenom dem löpande, ett ärende i taget, så att kvaliteten alltid håller samma nivå.' },
  { q: 'Snabb leverans utan att tumma på kvalitet', a: 'De flesta ärenden levereras inom 2–5 arbetsdagar beroende på omfattning. Vi håller en tät dialog under tiden så ni alltid vet var i processen ärendet befinner sig.' },
  { q: 'Enskilda projekt utan löpande avtal', a: 'Ni behöver inget abonnemang för att jobba med oss. Vi tar även enstaka projekt, från en mindre uppdatering till en helt ny webbplats.' },
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
    <div style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden', background: '#0a0a0a' }}>
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
        <SectionHeader num="09" label="Vanliga frågor" extra="© 2026" />

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
