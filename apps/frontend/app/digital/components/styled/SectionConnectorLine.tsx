'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export function SectionConnectorLine() {
  const lineRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      const start = document.querySelector('[data-line-start]');
      const end = document.querySelector('[data-line-end]');
      if (!start || !end) return;

      const pageTop = document.documentElement.getBoundingClientRect().top;
      const startTop = start.getBoundingClientRect().top - pageTop;
      const endRect = end.getBoundingClientRect();
      const endCenter = endRect.top + endRect.height / 2 - pageTop;
      setRect({ top: startTop, height: endCenter - startTop });
    };

    measure();
    window.addEventListener('resize', measure);
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    return () => {
      window.removeEventListener('resize', measure);
      observer.disconnect();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ['start 0.75', 'end 0.4'],
  });
  const progressHeight = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  return (
    <div
      ref={lineRef}
      className="absolute left-1/2 -translate-x-1/2 w-0.5 pointer-events-none z-0"
      style={{ top: rect?.top ?? 0, height: rect?.height ?? 0 }}
    >
      <div className="absolute inset-0 bg-gray-300" />
      <motion.div className="absolute inset-x-0 top-0 bg-black origin-top" style={{ scaleY: progressHeight, height: '100%' }} />
    </div>
  );
}
