import { DESIGNS } from './design-data';

export default function DesignPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#fafafa', color: '#030303', padding: '48px 32px' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 32px' }}>Design</h1>

        {DESIGNS.length === 0 ? (
          <p style={{ fontSize: '15px', color: '#888' }}>Inga designer tillagda än.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {DESIGNS.map((d) => (
              <div key={d.title} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                {d.image && (
                  // eslint-disable-next-line @next/next/no-img-element -- internt designgalleri, bildstorlekar okända i förväg
                  <img src={d.image} alt={d.title} style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
                )}
                <div style={{ padding: '16px' }}>
                  <h2 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 4px' }}>{d.title}</h2>
                  {d.note && <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>{d.note}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
