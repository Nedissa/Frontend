import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/app/components/MainLayout';

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://89.167.31.77:3000';

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
  meta?: { description?: string };
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/posts?where[slug][equals]=${slug}&where[_status][equals]=published`, {
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
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px' }}>
        <Link href="/blogg" style={{ fontSize: '0.85rem', color: '#666', textDecoration: 'none', display: 'inline-block', marginBottom: '32px' }}>
          ← Tillbaka till bloggen
        </Link>
        <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '12px' }}>
          {new Date(post.createdAt).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '32px' }}>{post.title}</h1>
        <div style={{ fontSize: '1rem', color: '#333' }}>
          {post.content?.root?.children?.map((node, i) => renderNode(node, i))}
        </div>
      </div>
    </MainLayout>
  );
}
