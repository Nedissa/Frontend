import { FadeIn } from '../FadeIn';
import { StyledSection } from './StyledPrimitives';

export function StyledTestimonial({ quote, projectTitle, category }: { quote: string; projectTitle: string; category: string }) {
  return (
    <StyledSection className="border-t border-black/5">
      <FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D75E15] font-semibold">Kundröster</span>
            <h2 className="text-2xl font-semibold tracking-tight text-[#030303] mt-2 m-0">
              Vad kunden säger om samarbetet.
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-[0_16px_40px_rgba(3,3,3,0.08)] border border-black/5 flex flex-col gap-3 transition-transform duration-500 hover:scale-[1.01]">
            <span className="text-sm text-[#f5b700] tracking-widest">★★★★★</span>
            <p className="text-sm leading-relaxed text-[#3a3a37] m-0">&ldquo;{quote}&rdquo;</p>
            <div className="flex items-center gap-3 mt-1">
              <div className="w-9 h-9 rounded-full bg-[#D75E15] flex items-center justify-center text-white text-xs font-bold">
                {projectTitle[0]}
              </div>
              <div>
                <div className="text-sm font-semibold text-[#030303]">[Kundnamn]</div>
                <div className="text-xs text-[#8a8a86]">{projectTitle} · {category}</div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </StyledSection>
  );
}
