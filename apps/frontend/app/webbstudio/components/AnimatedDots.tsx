'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function AnimatedDots({ count, filled }: { count: number; filled: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '16px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.35, delay: i * 0.025, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            background: i < filled ? '#030303' : '#d8d8d8',
            display: 'inline-block',
          }}
        />
      ))}
    </div>
  );
}
