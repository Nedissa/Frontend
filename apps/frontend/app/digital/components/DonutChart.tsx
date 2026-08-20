type DonutSlice = { label: string; value: number; color: string };

export function DonutChart({ data, centerLabel }: { data: DonutSlice[]; centerLabel: string }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 45;
  const cx = 70;
  const cy = 70;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg width="180" height="180" viewBox="0 0 140 140" role="img" aria-label={`Fördelning: ${data.map((d) => `${d.label} ${d.value}`).join(', ')}`}>
      {data.map((d) => {
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
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
        offset += dash;
        return el;
      })}
      <text x="70" y="75" textAnchor="middle" fontSize="18" fontWeight="700" fill="#030303">{centerLabel}</text>
    </svg>
  );
}
