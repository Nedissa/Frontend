'use client';
import { motion } from 'framer-motion';

const RINGS = [260, 340];

const ORBITS = [
  { radius: 260, size: 8, duration: 16, delay: 0, opacity: 0.95 },
  { radius: 260, size: 5, duration: 16, delay: 8, opacity: 0.6 },
  { radius: 340, size: 9, duration: 22, delay: 0, opacity: 0.9 },
  { radius: 340, size: 5, duration: 22, delay: 11, opacity: 0.55 },
];

export function OrbitParticles() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: 'absolute',
        top: '42%',
        left: '50%',
        width: 0,
        height: 0,
        zIndex: 0,
      }}
    >
      {/* Two distinct rings around the helmet */}
      {RINGS.map((r) => (
        <div
          key={r}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: r * 2,
            height: r * 2,
            marginLeft: -r,
            marginTop: -r,
            borderRadius: '50%',
            border: '1.5px solid rgba(232,197,71,0.85)',
          }}
        />
      ))}

      {/* Orbiting particles along the rings */}
      {ORBITS.map((o, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: o.radius * 2,
            height: o.radius * 2,
            marginLeft: -o.radius,
            marginTop: -o.radius,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: o.duration, delay: -o.delay, repeat: Infinity, ease: 'linear' }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              width: o.size,
              height: o.size,
              marginLeft: -o.size / 2,
              borderRadius: '50%',
              background: '#e8c547',
              opacity: o.opacity,
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
