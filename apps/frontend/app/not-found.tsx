import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      textAlign: 'center',
      padding: '40px 24px',
    }}>
      <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#aaa', marginBottom: '16px' }}>
        404
      </p>
      <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 800, color: '#000', lineHeight: 1.1, marginBottom: '16px' }}>
        Sidan hittades inte.
      </h1>
      <p style={{ fontSize: '1rem', color: '#666', maxWidth: '400px', lineHeight: 1.6, marginBottom: '40px' }}>
        Sidan du letar efter finns inte eller har flyttats. Gå tillbaka till startsidan och fortsätt handla.
      </p>
      <Link href="/" style={{
        display: 'inline-block',
        background: '#000',
        color: '#fff',
        padding: '13px 32px',
        fontSize: '0.875rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textDecoration: 'none',
        borderRadius: '999px',
      }}>
        Till startsidan
      </Link>
    </div>
  );
}
