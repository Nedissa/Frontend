'use client';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { QaBar } from './QaBar';

export function QaBarList({ items }: { items: string[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <ul ref={ref} className="list-none m-0 p-0 flex flex-col gap-[14px]">
      {items.map((label, i) => (
        <li key={label}>
          <QaBar label={label} delay={i * 0.08} isInView={isInView} />
        </li>
      ))}
    </ul>
  );
}
