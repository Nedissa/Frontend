export function RotatingHeadline() {
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
      }}
    >
      Lyft din digitala <br />
      <span style={{ color: '#e8c547' }}>närvaro</span>
    </h1>
  );
}
