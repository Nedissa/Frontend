import { FadeIn } from './FadeIn';
import { SectionHeader } from './SectionHeader';
import { ServiceSection } from './ServiceSection';
import { DonutChart } from './DonutChart';
import { AnimatedBars } from './AnimatedBars';
import { AnimatedDots } from './AnimatedDots';
import { CountUp } from './CountUp';

const PROJECT_TYPES = [
  { label: 'Webbutveckling', value: 40, color: '#030303' },
  { label: 'E-handel', value: 30, color: '#e8c547' },
  { label: 'CMS', value: 20, color: '#a8a8a8' },
  { label: 'Optimering & SEO', value: 10, color: '#e2e2e2' },
];

const WORK_BARS = [
  { label: 'Test & QA', value: 15, color: '#9a9a9a' },
  { label: 'Design', value: 25, color: '#030303' },
  { label: 'Utveckling', value: 45, color: '#e8c547' },
  { label: 'Lansering', value: 35, color: '#b8b8b8' },
];

const HEADLINE_STATS = [
  { value: '20', suffix: '+', desc: 'Nöjda kunder som rekommenderar oss vidare.' },
  { value: '100', suffix: '%', desc: 'Mobiloptimerat. Varje hemsida byggs helt responsivt för att ge en perfekt upplevelse på mobilen.' },
  { value: '90', suffix: '%', desc: 'I Google PageSpeed. Vi kodar och optimerar sajten för högsta möjliga betyg och laddtid.' },
];

export function ProcessStatsSection() {
  return (
    <ServiceSection id="teknologier" background="#f5f5f3">
      <SectionHeader num="07" label="Vår process" extra="© 2026" />

      <div
        className="grid-responsive-3 grid gap-[64px] mb-[16px]"
        style={{ gridTemplateColumns: 'repeat(3,1fr)', marginTop: '100px' }}
      >
        <FadeIn>
          <div className="h-full box-border">
            <h3 className="text-[20px] font-bold text-[#030303] m-0 mb-[12px]">Projekttyper</h3>
            <div className="animate-blink w-[32px] h-[2px] mb-[32px]" style={{ background: 'rgb(200,200,200)' }} />

            <div className="flex items-end gap-[32px] h-[200px]">
              <DonutChart data={PROJECT_TYPES} centerLabel="100" />

              <div className="flex flex-col gap-[10px] mb-[8px]">
                {PROJECT_TYPES.map((d) => (
                  <div key={d.label} className="flex items-center gap-[8px] text-[14px] text-[#030303]">
                    <span
                      className="w-[8px] h-[8px] rounded-full shrink-0"
                      style={{
                        background: d.color,
                        border: d.color === '#e2e2e2' ? '1px solid rgb(200,200,200)' : 'none',
                      }}
                      aria-hidden="true"
                    />
                    {d.label} <span style={{ color: 'rgb(104,105,99)' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.06}>
          <div className="h-full box-border">
            <h3 className="text-[20px] font-bold text-[#030303] m-0 mb-[12px]">Var arbetet läggs</h3>
            <div className="w-[32px] h-[2px] mb-[32px]" style={{ background: 'rgb(200,200,200)' }} />

            <AnimatedBars max={45} bars={WORK_BARS} />
            <div className="flex gap-[20px] mt-[12px]">
              {['Test', 'Design', 'Utveckling', 'Lansering'].map((l) => (
                <div key={l} className="flex-1 text-center text-[13px] font-semibold text-[#030303]">{l}</div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="h-full box-border">
            <h3 className="text-[20px] font-bold text-[#030303] m-0 mb-[12px]">Tjänster per projekt</h3>
            <div className="w-[32px] h-[2px] mb-[32px]" style={{ background: 'rgb(200,200,200)' }} />

            <div className="flex items-end gap-[28px] h-[200px]">
              <AnimatedDots count={32} filled={24} />

              <div className="flex flex-col gap-[10px] self-center">
                <div className="flex items-center gap-[8px] text-[14px] text-[#030303]">
                  <span className="w-[8px] h-[8px] rounded-full bg-[#030303] shrink-0" aria-hidden="true" />
                  Ingår
                </div>
                <div className="flex items-center gap-[8px] text-[14px] text-[#030303]">
                  <span className="w-[8px] h-[8px] rounded-full bg-[#d8d8d8] shrink-0" aria-hidden="true" />
                  Tillval
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      <div
        className="grid-responsive-3 grid gap-[64px]"
        style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '48px' }}
      >
        {HEADLINE_STATS.map((stat) => (
          <FadeIn key={stat.desc}>
            <div className="pt-[32px] flex justify-between items-start" style={{ borderTop: '3px solid rgb(210,210,210)' }}>
              <div
                className="font-extrabold leading-none text-[#030303] whitespace-nowrap"
                style={{ fontSize: 'clamp(40px,5vw,64px)', letterSpacing: '-0.03em' }}
              >
                <CountUp value={`${stat.value}${stat.suffix}`} />
              </div>
              <p className="text-[14px] leading-[1.5] m-0 pt-[10px] max-w-[160px] text-left" style={{ color: 'rgb(104,105,99)' }}>
                {stat.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </ServiceSection>
  );
}
