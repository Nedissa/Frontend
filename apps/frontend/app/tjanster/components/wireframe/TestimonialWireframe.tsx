import { WireframeSection } from './WireframePrimitives';

export function TestimonialWireframe({ quote, projectTitle, category }: { quote: string; projectTitle: string; category: string }) {
  return (
    <WireframeSection className="border-t border-neutral-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium">Kundröster</span>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-2 m-0">
            Vad kunden säger om samarbetet.
          </h2>
        </div>

        <div className="bg-neutral-100 rounded-lg p-6 flex flex-col gap-3">
          <span className="text-sm text-neutral-500 tracking-widest">★★★★★</span>
          <p className="text-sm leading-relaxed text-neutral-700 m-0">&ldquo;{quote}&rdquo;</p>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-9 h-9 rounded-full bg-neutral-300 flex items-center justify-center text-neutral-600 text-xs font-mono">
              [Foto]
            </div>
            <div>
              <div className="text-sm font-semibold text-neutral-900">[Kundnamn]</div>
              <div className="text-xs text-neutral-500">{projectTitle} · {category}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-neutral-900' : 'bg-neutral-300'}`} />
        ))}
      </div>
    </WireframeSection>
  );
}
