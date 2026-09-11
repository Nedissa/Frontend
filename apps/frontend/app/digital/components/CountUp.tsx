'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface Props {
  value: string;
  style?: React.CSSProperties;
}

export function CountUp({ value, style }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    // Extract number and suffix (e.g. "20+" → 20, "+"; "98%" → 98, "%"; "2022" → 2022, "")
    const match = value.match(/^(\d+)(.*)$/);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- triggas av isInView (viewport-detektion), kan inte beräknas server-side
    if (!match) { setDisplay(value); return; }

    const target = parseInt(match[1]);
    const suffix = match[2];
    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setDisplay(current + suffix);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, value]);

  return <span ref={ref} style={style}>{display}</span>;
}
