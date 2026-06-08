import Link from 'next/link';
import { MainLayout } from '@/app/components/MainLayout';

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'https://cms.techpilots.se';

interface Post {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  meta?: { description?: string };
}

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/posts?where[_status][equals]=published&sort=-createdAt&limit=20`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs || [];
  } catch {
    return [];
  }
}

export default async function BloggPage() {
  const posts = await getPosts();

  return (
    <MainLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Blogg</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>Nyheter och guider från Techpilots</p>

        {posts.length === 0 ? (
          <p style={{ color: '#999' }}>Inga inlägg publicerade ännu.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {posts.map((post) => (
              <Link key={post.id} href={`/pilotbloggen/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '24px' }}>
                  <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '8px' }}>
                    {new Date(post.createdAt).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>{post.title}</h2>
                  {post.meta?.description && (
                    <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.6 }}>{post.meta.description}</p>
                  )}
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#000', marginTop: '12px', display: 'inline-block' }}>
                    Läs mer →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
