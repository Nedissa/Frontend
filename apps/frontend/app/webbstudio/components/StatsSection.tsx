'use client';
import { FadeIn } from './FadeIn';
import { CountUp } from './CountUp';
import { SectionHeader } from './SectionHeader';

export function StatsSection() {
  return (
    <section id="om" className="section-padding" style={{ background: '#fff', padding: '140px 30px' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <SectionHeader num="01" label="Om oss" extra="© 2026" />
      </div>
      <div className="grid-stats" style={{ maxWidth: '1440px', margin: '0 auto', display: 'grid', gridTemplateColumns: '280px 1fr', alignItems: 'start' }}>

        <FadeIn>
          <div className="hide-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '260px' }}>
            <div style={{ height: '20px' }} />
            <div className="animate-blink" style={{ width: '32px', height: '2px', background: 'rgb(200,200,200)' }} />
          </div>
        </FadeIn>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

          {/* Row 1: Launched projects + Customer satisfaction */}
          <div className="grid-responsive-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>

            <FadeIn delay={0.05}>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#030303', marginBottom: '10px' }}>Lanserade projekt</div>
                <div style={{ borderTop: '3px solid rgb(210,210,210)', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ fontSize: '72px', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, color: '#030303', flexShrink: 0 }}>
                    <CountUp value="11+" />
                  </div>
                  <div style={{ color: 'rgb(104,105,99)', fontSize: '13px', lineHeight: 1.5 }}>
                    Projekt har lanserats framgångsrikt sedan 2024
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#030303', marginBottom: '10px' }}>Kundnöjdhet</div>
                <div style={{ borderTop: '3px solid rgb(210,210,210)', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ fontSize: '72px', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, color: '#030303', flexShrink: 0 }}>
                    <CountUp value="98%" />
                  </div>
                  <div style={{ color: 'rgb(104,105,99)', fontSize: '13px', lineHeight: 1.5 }}>
                    Andel av våra fullt nöjda kunder.
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Row 2: Founding year — entire block in the right column */}
          <FadeIn delay={0.15}>
            <div className="grid-responsive-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#030303', marginBottom: '10px' }}>Techpilots</div>
                <div style={{ borderTop: '3px solid rgb(210,210,210)', paddingTop: '20px' }}>
                  <p style={{ fontSize: 'clamp(14px,1.2vw,17px)', color: 'rgb(104,105,99)', lineHeight: 1.65, margin: 0 }}>
                    Webbyrå, digitalpartner, utvecklingsteam. Oavsett vad vi kallas använder vi vår kompetens inom strategi, design och utveckling för att skapa och vårda digitala lösningar på och omkring webben. Byggda från grunden, med behovsstyrda tekniska val, är resultaten gjorda för att växa i takt med er verksamhet.
                  </p>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#030303', marginBottom: '10px' }}>Grundningsår</div>
                <div style={{ borderTop: '3px solid rgb(210,210,210)', paddingTop: '20px' }}>
                  <div style={{ fontSize: '72px', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, color: '#030303', marginBottom: '12px' }}>
                    <CountUp value="2024" />
                  </div>
                  <div style={{ color: 'rgb(104,105,99)', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>
                    Året grundarna lanserade sitt första projekt.
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgb(100,80,70)', border: '2px solid #fff', marginRight: '-8px', zIndex: 2, position: 'relative' }} />
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgb(70,65,85)', border: '2px solid #fff', zIndex: 1, position: 'relative' }} />
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}
