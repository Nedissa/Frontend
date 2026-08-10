import type { ProjectStep } from '../../projekt-data';
import { Eyebrow, ImagePlaceholder, SecondaryButton, WireframeSection } from './WireframePrimitives';

const FALLBACK_STEPS: ProjectStep[] = [
  { title: 'Översikt', description: 'Startsidan sätter tonen. Tydlig identitet och en snabb väg till det besökaren letar efter.' },
  { title: 'Nyckelsida', description: 'En central sida i flödet, byggd för att göra nästa steg enkelt och tydligt.' },
  { title: 'Detalj', description: 'Finjusteringar i typografi, färg och mellanrum som ger helheten dess känsla.' },
];

export function TimelineWireframe({ projectTitle, steps }: { projectTitle: string; steps?: ProjectStep[] }) {
  const items = steps && steps.length > 0 ? steps : FALLBACK_STEPS;

  return (
    <WireframeSection className="border-t border-neutral-200">
      <div className="flex flex-col items-center text-center gap-4 mb-16">
        <Eyebrow>Processen</Eyebrow>
        <h2 className="text-[clamp(28px,3.5vw,40px)] font-bold tracking-tight text-neutral-900 m-0 max-w-[600px]">
          En kronologi av skapande och lärdom.
        </h2>
        <p className="text-sm text-neutral-600 max-w-[60ch] m-0">
          Så tog {projectTitle} form, steg för steg, från första skiss till lanserad plattform.
        </p>
      </div>

      <div className="relative max-w-[720px] mx-auto pl-10 md:pl-12">
        <div className="absolute left-[7px] md:left-[9px] top-2 bottom-2 w-px bg-neutral-300" />

        <div className="flex flex-col gap-16">
          {items.map((step) => (
            <div key={step.title} className="relative">
              <div className="absolute -left-10 md:-left-12 top-1.5 w-4 h-4 rounded-full bg-neutral-900 border-4 border-neutral-50" />

              <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium">{step.title}</span>
              <h3 className="text-xl font-bold tracking-tight text-neutral-900 mt-1 mb-3">{step.title}</h3>
              <p className="text-sm leading-[1.7] text-neutral-600 mb-4">{step.description}</p>
              <SecondaryButton href="#">Visa steg ↗</SecondaryButton>
              <div className="mt-6">
                <ImagePlaceholder label={`${projectTitle} - ${step.title} - 4:3`} aspect="aspect-[4/3]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </WireframeSection>
  );
}
