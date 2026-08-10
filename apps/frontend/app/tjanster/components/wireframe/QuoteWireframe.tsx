import { WireframeSection } from './WireframePrimitives';

export function QuoteWireframe({ quote, projectTitle, category }: { quote: string; projectTitle: string; category: string }) {
  return (
    <WireframeSection className="border-t border-neutral-200">
      <div className="max-w-[600px] mx-auto flex flex-col gap-4 items-center text-center">
        <span className="text-4xl leading-none text-neutral-300">&ldquo;</span>
        <p className="text-lg leading-[1.65] text-neutral-800 m-0">{quote}</p>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-11 h-11 rounded-full bg-neutral-300 flex items-center justify-center text-neutral-600 text-sm font-mono">
            [Foto]
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-neutral-900">[Kundnamn]</div>
            <div className="text-xs text-neutral-500">{projectTitle} · {category}</div>
          </div>
        </div>
      </div>
    </WireframeSection>
  );
}
