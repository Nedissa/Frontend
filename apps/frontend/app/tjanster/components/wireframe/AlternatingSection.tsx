import { WireframeSection, Eyebrow, ImagePlaceholder } from './WireframePrimitives';

export function AlternatingSection({
  eyebrow,
  heading,
  text,
  imageLabel,
  imageFirst,
}: {
  eyebrow: string;
  heading: string;
  text: string;
  imageLabel: string;
  imageFirst: boolean;
}) {
  return (
    <WireframeSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {imageFirst && <ImagePlaceholder label={imageLabel} aspect="aspect-[4/3]" />}
        <div className="flex flex-col gap-5">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="text-[clamp(28px,3.5vw,40px)] font-bold tracking-tight leading-[1.1] text-neutral-900 m-0">
            {heading}
          </h2>
          <p className="text-sm leading-[1.7] text-neutral-600 m-0">{text}</p>
        </div>
        {!imageFirst && <ImagePlaceholder label={imageLabel} aspect="aspect-[4/3]" />}
      </div>
    </WireframeSection>
  );
}
