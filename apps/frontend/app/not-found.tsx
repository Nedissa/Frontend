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
      <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 800, color: '#000', lineHeight: 1.1, marginBottom: '16px' }}>
        Vi jobbar för fullt
      </h1>
      <p style={{ fontSize: '1rem', color: '#666', maxWidth: '440px', lineHeight: 1.6, marginBottom: '40px' }}>
        Den här sidan är under utveckling. Vi förbättrar ständigt vår butik och våra sidor. Kom tillbaka snart!
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
