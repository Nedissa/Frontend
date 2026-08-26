'use client';
import { motion } from 'framer-motion';

export function QaBar({ label, delay, isInView }: { label: string; delay: number; isInView: boolean }) {
  return (
    <div>
      <div className="text-[13px] font-medium text-[#030303] mb-[4px]">{label}</div>
      <div className="w-full h-[4px] rounded-full overflow-hidden" style={{ background: '#e2e2e2' }}>
        <motion.div
          className="h-full w-full rounded-full origin-left"
          style={{ background: 'linear-gradient(90deg, #030303 0%, #e8c547 100%)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isInView ? 1 : 0 }}
          transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>
    </div>
  );
}
