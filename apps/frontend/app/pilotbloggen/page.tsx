import Link from 'next/link';
import { MainLayout } from '@/app/components/MainLayout';
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

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  if (months > 0) return `${months} mån sedan`;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days} d sedan`;
  return 'Idag';
}


const GRADIENTS = [
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
  'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
  'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
];

function PostCard({ post, index }: { post: Post; index: number }) {
  const imageUrl = post.heroImage?.url || post.meta?.image?.url || null;
  const categories = post.categories?.map(c => c.title) || [];
  return (
    <Link href={`/pilotbloggen/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article className="blog-card">
        <div style={{
          width: '100%',
          height: '340px',
          flexShrink: 0,
          background: imageUrl ? `url(${imageUrl}) center/cover no-repeat` : GRADIENTS[index % GRADIENTS.length],
        }}>
        </div>
        <div style={{ padding: '20px 24px 24px', flex: 1 }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px', alignItems: 'center' }}>
            {(categories.length > 0 ? categories : ['Techpilots']).map((cat, i) => (
              <span key={i} style={{
                fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: '#555',
                background: '#f3f4f6', borderRadius: '4px', padding: '3px 8px',
              }}>{cat}</span>
            ))}
            <span style={{ fontSize: '0.72rem', color: '#aaa', marginLeft: 'auto' }}>{timeAgo(post.createdAt)}</span>
          </div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '8px' }}>{post.title}</h2>
          {post.meta?.description && (
            <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {post.meta.description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

export default async function BloggPage() {
  const posts = await getPosts();

  return (
    <MainLayout>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginBottom: '16px' }}>Insights</p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
            Nyheter &amp; guider från<br /><em style={{ fontStyle: 'italic', fontWeight: 800 }}>Techpilots</em>
          </h1>
          <p style={{ color: '#666', fontSize: '1rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Reflektioner, perspektiv och praktiska guider för dig som vill hålla dig uppdaterad.
          </p>
        </div>

        <div className="blog-grid">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
