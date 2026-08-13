'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { hexToRgb } from './StyledPrimitives';

export type GlowRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

function buildGradient(color: string) {
  const rgb = hexToRgb(color);
  return `radial-gradient(circle at 50% 50%, rgba(${rgb},1) 0%, rgba(${rgb},0.92) 10%, rgba(${rgb},0.7) 20%, rgba(${rgb},0.48) 30%, rgba(${rgb},0.3) 40%, rgba(${rgb},0.16) 50%, rgba(${rgb},0.06) 62%, rgba(255,255,255,0) 78%)`;
}

export function TravelingGlow({ rect, color }: { rect: GlowRect | null; color: string }) {
  if (!rect) return null;

  return (
    <motion.div
      className="absolute pointer-events-none z-0"
      animate={{
        top: rect.top - rect.height * 0.45,
        left: rect.left - rect.width * 0.45,
        width: rect.width * 1.9,
        height: rect.height * 1.9,
      }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={color}
          className="absolute inset-0"
          style={{ background: buildGradient(color) }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </AnimatePresence>
    </motion.div>
  );
}
