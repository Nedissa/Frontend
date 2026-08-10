import { WireframeSection } from './WireframePrimitives';

export function TechStackWireframe({ technologies }: { technologies: string[] }) {
  if (technologies.length === 0) return null;

  return (
    <WireframeSection className="border-t border-neutral-200">
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 m-0">Verktyg &amp; plattform</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-full text-sm font-medium text-neutral-700"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </WireframeSection>
  );
}
