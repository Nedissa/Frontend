'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface Bar {
  label: string;
  value: number;
  color: string;
}

export function AnimatedBars({ bars, max }: { bars: Bar[]; max: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', height: '200px' }}>
      {bars.map((d, i) => (
        <div key={d.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: isInView ? `${(d.value / max) * 100}%` : 0 }}
            transition={{ duration: 0.9, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              width: '100%',
              maxWidth: '180px',
              background: d.color,
              borderRadius: '3px 3px 0 0',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: '10px',
              boxSizing: 'border-box',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 700, color: d.color === '#030303' ? '#fff' : '#030303' }}>{d.value}%</span>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
