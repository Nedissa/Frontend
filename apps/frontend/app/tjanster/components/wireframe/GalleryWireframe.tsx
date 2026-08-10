import type { ProjectStep } from '../../projekt-data';
import { WireframeSection, ImagePlaceholder } from './WireframePrimitives';

const FALLBACK_LABELS = ['Skrivbordsvy', 'Mobilvy', 'Detaljvy'];

export function GalleryWireframe({ steps }: { steps?: ProjectStep[] }) {
  const labels = steps && steps.length > 0 ? steps.map((s) => s.title) : FALLBACK_LABELS;

  return (
    <WireframeSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImagePlaceholder label={labels[0]} aspect="aspect-[4/3]" className="md:row-span-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
          {labels.slice(1).map((label) => (
            <ImagePlaceholder key={label} label={label} aspect="aspect-video" />
          ))}
        </div>
      </div>
    </WireframeSection>
  );
}
