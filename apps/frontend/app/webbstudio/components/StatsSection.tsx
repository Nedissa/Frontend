'use client';
import { FadeIn } from './FadeIn';
import { CountUp } from './CountUp';
import { SectionHeader } from './SectionHeader';

export function StatsSection() {
  return (
    <section id="om" className="section-padding bg-white py-[140px] px-[30px]">
      <div className="max-w-[1440px] mx-auto">
        <SectionHeader num="01" label="Om oss" extra="© 2026" />
      </div>
      <div className="grid-stats max-w-[1440px] mx-auto grid items-start" style={{ gridTemplateColumns: '280px 1fr' }}>

        <FadeIn>
          <div className="hide-mobile flex flex-col gap-[260px]">
            <div className="h-[20px]" />
            <div className="animate-blink w-[32px] h-[2px]" style={{ background: 'rgb(200,200,200)' }} />
          </div>
        </FadeIn>

        <div className="flex flex-col gap-[48px]">

          {/* Row 1: Launched projects + Customer satisfaction */}
          <div className="grid-responsive-2 grid gap-[60px]" style={{ gridTemplateColumns: '1fr 1fr' }}>

            <FadeIn delay={0.05}>
              <div>
                <div className="text-[22px] font-bold text-[#030303] mb-[10px]">Lanserade projekt</div>
                <div className="flex items-center gap-[24px] pt-[20px]" style={{ borderTop: '3px solid rgb(210,210,210)' }}>
                  <div className="text-[72px] font-bold leading-none text-[#030303] shrink-0" style={{ letterSpacing: '-0.04em' }}>
                    <CountUp value="11+" />
                  </div>
                  <div className="text-[13px] leading-[1.5]" style={{ color: 'rgb(104,105,99)' }}>
                    Projekt har lanserats framgångsrikt sedan 2024
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div>
                <div className="text-[22px] font-bold text-[#030303] mb-[10px]">Kundnöjdhet</div>
                <div className="flex items-center gap-[24px] pt-[20px]" style={{ borderTop: '3px solid rgb(210,210,210)' }}>
                  <div className="text-[72px] font-bold leading-none text-[#030303] shrink-0" style={{ letterSpacing: '-0.04em' }}>
                    <CountUp value="98%" />
                  </div>
                  <div className="text-[13px] leading-[1.5]" style={{ color: 'rgb(104,105,99)' }}>
                    Andel av våra fullt nöjda kunder.
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Row 2: Founding year — entire block in the right column */}
          <FadeIn delay={0.15}>
            <div className="grid-responsive-2 grid gap-[60px]" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <div className="text-[22px] font-bold text-[#030303] mb-[10px]">Techpilots</div>
                <div className="pt-[20px]" style={{ borderTop: '3px solid rgb(210,210,210)' }}>
                  <p className="m-0 leading-[1.65]" style={{ fontSize: 'clamp(14px,1.2vw,17px)', color: 'rgb(104,105,99)' }}>
                    Webbyrå, digitalpartner, utvecklingsteam. Oavsett vad vi kallas använder vi vår kompetens inom strategi, design och utveckling för att skapa och vårda digitala lösningar på och omkring webben. Byggda från grunden, med behovsstyrda tekniska val, är resultaten gjorda för att växa i takt med er verksamhet.
                  </p>
                </div>
              </div>
              <div>
                <div className="text-[22px] font-bold text-[#030303] mb-[10px]">Grundningsår</div>
                <div className="pt-[20px]" style={{ borderTop: '3px solid rgb(210,210,210)' }}>
                  <div className="text-[72px] font-bold leading-none text-[#030303] mb-[12px]" style={{ letterSpacing: '-0.04em' }}>
                    <CountUp value="2024" />
                  </div>
                  <div className="text-[13px] leading-[1.5] mb-[16px]" style={{ color: 'rgb(104,105,99)' }}>
                    Året grundarna lanserade sitt första projekt.
                  </div>
                  <div className="flex">
                    <div className="w-[30px] h-[30px] rounded-full border-2 border-white -mr-[8px] z-[2] relative" style={{ background: 'rgb(100,80,70)' }} />
                    <div className="w-[30px] h-[30px] rounded-full border-2 border-white z-[1] relative" style={{ background: 'rgb(70,65,85)' }} />
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
