import { WireframeSection } from './WireframePrimitives';

const PLACEHOLDER_METRICS = [
  { value: '[XX]', label: 'veckor leveranstid' },
  { value: '[XX]', label: 'sidor byggda' },
  { value: '[XX]%', label: 'snabbare laddtid' },
  { value: '[XX]', label: 'integrationer' },
];

export function MetricsWireframe() {
  return (
    <WireframeSection className="border-t border-neutral-200">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {PLACEHOLDER_METRICS.map((m) => (
          <div key={m.label} className="flex flex-col gap-2">
            <span className="text-[clamp(28px,3vw,40px)] font-bold tracking-tight text-neutral-900">
              {m.value}
            </span>
            <span className="text-sm text-neutral-600">{m.label}</span>
          </div>
        ))}
      </div>
    </WireframeSection>
  );
}
