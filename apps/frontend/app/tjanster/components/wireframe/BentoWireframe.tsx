import type { Project } from '../../projekt-data';
import { ImagePlaceholder, WireframeSection } from './WireframePrimitives';

const PLACEHOLDER_METRICS = [
  { value: '[XX]', label: 'veckor leveranstid' },
  { value: '[XX]', label: 'sidor byggda' },
  { value: '[XX]%', label: 'snabbare laddtid' },
];

export function BentoWireframe({ project }: { project: Project }) {
  return (
    <WireframeSection className="border-t border-neutral-200">
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6">
        {/* Stor bild, spänner 2x2 */}
        <ImagePlaceholder
          label={`${project.title} - Projektöversikt - 4:3`}
          aspect="aspect-square"
          className="md:col-span-2 md:row-span-2"
        />

        {/* Metrics-kort */}
        <div className="md:col-span-2 bg-neutral-100 rounded-lg p-6 grid grid-cols-3 gap-4">
          {PLACEHOLDER_METRICS.map((m) => (
            <div key={m.label} className="flex flex-col gap-1">
              <span className="text-2xl font-bold tracking-tight text-neutral-900">{m.value}</span>
              <span className="text-xs text-neutral-600 leading-tight">{m.label}</span>
            </div>
          ))}
        </div>

        {/* Tech-stack pills */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="bg-neutral-100 rounded-lg p-6 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium">Verktyg</span>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 bg-neutral-200 rounded-full text-xs font-medium text-neutral-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Citat */}
        <div
          className={`bg-neutral-900 text-neutral-50 rounded-lg p-6 flex flex-col justify-between gap-4 ${
            project.technologies && project.technologies.length > 0 ? '' : 'md:col-span-2'
          }`}
        >
          <span className="text-3xl leading-none text-neutral-500">&ldquo;</span>
          <p className="text-sm leading-relaxed m-0">{project.solution}</p>
          <span className="text-xs text-neutral-400">[Kundnamn] · {project.category}</span>
        </div>
      </div>
    </WireframeSection>
  );
}
