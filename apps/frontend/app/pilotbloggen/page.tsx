import { MainLayout } from '@/app/components/layout/MainLayout';
import { BlogGrid } from './BlogGrid';
import './blog.css';

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'https://cms.techpilots.se';

interface Post {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  heroImage?: { url: string; alt?: string };
  categories?: { title: string }[];
  meta?: { description?: string; image?: { url: string } };
}

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/posts?where[_status][equals]=published&sort=-createdAt&limit=20&depth=1`, {
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
      <div style={{ padding: '64px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginBottom: '16px' }}>Pilotguiden</p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
            Lär dig tekniken<br /><em style={{ fontStyle: 'italic', fontWeight: 800 }}>innan du köper</em>
          </h1>
          <p style={{ color: '#666', fontSize: '1rem', maxWidth: '1080px', margin: '0 auto', lineHeight: 1.6 }}>
            Praktiska guider som hjälper dig navigera teknikdjungeln så du alltid vet vad du köper och varför.
          </p>
        </div>
        <BlogGrid posts={posts} />
      </div>
    </MainLayout>
  );
}
