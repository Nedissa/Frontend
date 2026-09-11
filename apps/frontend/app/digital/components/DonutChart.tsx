type DonutSlice = { label: string; value: number; color: string };

export function DonutChart({ data, centerLabel }: { data: DonutSlice[]; centerLabel: string }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 45;
  const cx = 70;
  const cy = 70;
  const circumference = 2 * Math.PI * r;

  const slices = data.reduce<{ elements: React.ReactNode[]; offset: number }>(
    (acc, d) => {
      const frac = d.value / total;
      const dash = frac * circumference;
      const gap = circumference - dash;
      const el = (
        <circle
          key={d.label}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={d.color}
          strokeWidth="30"
          strokeDasharray={`${Math.max(dash - 2, 0)} ${gap + 2}`}
          strokeDashoffset={-acc.offset}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      );
      return { elements: [...acc.elements, el], offset: acc.offset + dash };
    },
    { elements: [], offset: 0 }
  ).elements;

  return (
    <svg width="180" height="180" viewBox="0 0 140 140" role="img" aria-label={`Fördelning: ${data.map((d) => `${d.label} ${d.value}`).join(', ')}`}>
      {slices}
      <text x="70" y="75" textAnchor="middle" fontSize="18" fontWeight="700" fill="#030303">{centerLabel}</text>
    </svg>
  );
}
