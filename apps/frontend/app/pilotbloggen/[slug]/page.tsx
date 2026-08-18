import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/app/components/layout/MainLayout';
import { GuideQuestions } from '@/app/components/guide/GuideQuestions';

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'https://cms.techpilots.se';

interface RichTextNode {
  type: string;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  children?: RichTextNode[];
  tag?: string;
  url?: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  content?: { root: { children: RichTextNode[] } };
  heroImage?: { url: string; alt?: string };
  meta?: { description?: string; image?: { url: string } };
  relatedPosts?: { id: string; title: string; slug: string; heroImage?: { url: string }; meta?: { image?: { url: string } } }[];
}

function readingTime(post: Post): string {
  const text = post.content?.root?.children
    ?.flatMap(node => node.children?.map(c => c.text).filter(Boolean) || [])
    .join(' ') || '';
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min läsning`;
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/posts?where[slug][equals]=${slug}&where[_status][equals]=published&depth=1`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.docs?.[0] || null;
  } catch {
    return null;
  }
}

function renderNode(node: RichTextNode, key: number): React.ReactNode {
  if (node.type === 'text') {
    let el: React.ReactNode = node.text;
    if (node.bold) el = <strong key={key}>{el}</strong>;
    if (node.italic) el = <em key={key}>{el}</em>;
    return el;
  }
  const children = node.children?.map((child, i) => renderNode(child, i));
  switch (node.type) {
    case 'paragraph': return <p key={key} style={{ marginBottom: '16px', lineHeight: 1.8 }}>{children}</p>;
    case 'heading': return node.tag === 'h2'
      ? <h2 key={key} style={{ fontSize: '1.4rem', fontWeight: 700, margin: '32px 0 12px' }}>{children}</h2>
      : <h3 key={key} style={{ fontSize: '1.1rem', fontWeight: 700, margin: '24px 0 8px' }}>{children}</h3>;
    case 'ul': return <ul key={key} style={{ paddingLeft: '24px', marginBottom: '16px', lineHeight: 1.8 }}>{children}</ul>;
    case 'ol': return <ol key={key} style={{ paddingLeft: '24px', marginBottom: '16px', lineHeight: 1.8 }}>{children}</ol>;
    case 'li': return <li key={key}>{children}</li>;
    case 'link': return <a key={key} href={node.url} style={{ color: '#000', textDecoration: 'underline' }}>{children}</a>;
    default: return <span key={key}>{children}</span>;
  }
}

export default async function BloggPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <MainLayout>
      <div className="content-container" style={{ padding: '64px 24px' }}>
        <Link href="/pilotbloggen" style={{ fontSize: '0.85rem', color: '#666', textDecoration: 'none', display: 'inline-block', marginBottom: '32px' }}>
          ← Tillbaka till bloggen
        </Link>

        {/* Hero image / placeholder */}
        <div style={{
          width: '100%',
          height: '420px',
          marginBottom: '40px',
          borderRadius: '16px',
          background: post.heroImage?.url || post.meta?.image?.url
            ? `url(${post.heroImage?.url || post.meta?.image?.url}) center/cover no-repeat`
            : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        }} />

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
          <p style={{ fontSize: '0.8rem', color: '#999' }}>
            {new Date(post.createdAt).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <span style={{ fontSize: '0.8rem', color: '#ccc' }}>·</span>
          <p style={{ fontSize: '0.8rem', color: '#999' }}>{readingTime(post)}</p>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '32px' }}>{post.title}</h1>
        <div style={{ fontSize: '1.05rem', color: '#333', lineHeight: 1.9 }}>
          {post.content?.root?.children?.map((node, i) => renderNode(node, i))}
        </div>

        <div style={{ marginTop: '48px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px' }}>Frågor & svar</h2>
          <GuideQuestions guideSlug={post.slug} />
        </div>

        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div style={{ marginTop: '56px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px' }}>Relaterade artiklar</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {post.relatedPosts.map(related => {
                const relatedImage = related.heroImage?.url || related.meta?.image?.url;
                return (
                  <Link key={related.id} href={`/pilotbloggen/${related.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{
                      width: '100%',
                      height: '140px',
                      borderRadius: '12px',
                      marginBottom: '10px',
                      background: relatedImage ? `url(${relatedImage}) center/cover no-repeat` : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                    }} />
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.3 }}>{related.title}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
