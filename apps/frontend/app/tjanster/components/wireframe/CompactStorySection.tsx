import { WireframeSection } from './WireframePrimitives';

type StoryCard = { eyebrow: string; heading: string; text: string };

export function CompactStorySection({ cards }: { cards: StoryCard[] }) {
  if (cards.length === 0) return null;

  return (
    <WireframeSection>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.eyebrow} className="bg-neutral-100 rounded-lg p-8 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium">{card.eyebrow}</span>
            <h3 className="text-xl font-bold tracking-tight text-neutral-900 m-0">{card.heading}</h3>
            <p className="text-sm leading-relaxed text-neutral-600 m-0">{card.text}</p>
          </div>
        ))}
      </div>
    </WireframeSection>
  );
}
