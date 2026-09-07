'use client';

import { useEffect, useState } from 'react';

const HEADLINES = [
  { lead: 'Lyft din digitala', accent: 'närvaro' },
  { lead: 'Byggd på riktig', accent: 'teknisk grund' },
  { lead: 'Kod och design i', accent: 'samma hantverk' },
];

const INTERVAL_MS = 3500;
const TRANSITION_MS = 500;

export function RotatingHeadline() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % HEADLINES.length);
        setVisible(true);
      }, TRANSITION_MS);
    }, INTERVAL_MS);
    return () => clearInterval(cycle);
  }, []);

  const { lead, accent } = HEADLINES[index];

  return (
    <h1
      className="hero-promo-heading"
      style={{
        fontFamily: 'var(--font-sans), system-ui, sans-serif',
        fontSize: 'clamp(26px, 2.4vw, 42px)',
        fontWeight: 700,
        lineHeight: 1.05,
        letterSpacing: '-0.01em',
        color: '#fff',
        margin: '0 0 16px',
        textShadow: '0 4px 24px rgba(0,0,0,0.5)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-10px)',
        transition: `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`,
      }}
    >
      {lead} <br />
      <span style={{ color: '#e8c547' }}>{accent}</span>
    </h1>
  );
}
