'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HardDrive, Wifi, Gamepad2, Monitor, Wrench, Smartphone, Tv, Newspaper } from 'lucide-react';

const GRADIENTS = [
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
  'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
  'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
];

const CATEGORY_ICONS: Record<string, typeof HardDrive> = {
  'lagring': HardDrive,
  'nätverk': Wifi,
  'gaming': Gamepad2,
  'datorer': Monitor,
  'komponenter': Wrench,
  'mobiltelefoner': Smartphone,
  'tv & hifi': Tv,
};

function iconForCategory(category?: string) {
  if (!category) return Newspaper;
  return CATEGORY_ICONS[category.toLowerCase()] || Newspaper;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  if (months > 0) return `${months} mån sedan`;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days} d sedan`;
  return 'Idag';
}

function readingTime(description?: string): string {
  const words = description ? description.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 40));
  return `${minutes} min läsning`;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  heroImage?: { url: string; alt?: string };
  categories?: { title: string }[];
  meta?: { description?: string; image?: { url: string } };
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const imageUrl = post.heroImage?.url || post.meta?.image?.url || null;
  const categories = post.categories?.map(c => c.title) || [];
  const CategoryIcon = iconForCategory(categories[0]);
  return (
    <Link href={`/pilotbloggen/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article className="blog-card">
        <div style={{
          width: '100%',
          height: '340px',
          flexShrink: 0,
          position: 'relative',
          background: imageUrl ? `url(${imageUrl}) center/cover no-repeat` : GRADIENTS[index % GRADIENTS.length],
        }}>
          <span className="blog-card-icon" style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '36px', height: '36px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* eslint-disable-next-line react-hooks/static-components -- väljer bara bland statiskt importerade ikonkomponenter, skapar inget nytt */}
            <CategoryIcon size={18} strokeWidth={2} color="#0f2448" />
          </span>
        </div>
        <div style={{ padding: '20px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
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
            <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '10px' }}>
              {post.meta.description}
            </p>
          )}
          <span style={{ fontSize: '0.72rem', color: '#999', marginTop: 'auto', paddingBottom: '8px' }}>{readingTime(post.meta?.description)}</span>
        </div>
      </article>
    </Link>
  );
}

export function BlogGrid({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState('Alla');

  const allCategories = ['Alla', ...Array.from(
    new Set(posts.flatMap(p => p.categories?.map(c => c.title) || []))
  )];

  const filtered = active === 'Alla'
    ? posts
    : posts.filter(p => p.categories?.some(c => c.title === active));

  return (
    <>
      <div style={{ overflowX: 'auto', scrollbarWidth: 'none', marginBottom: '40px' }}>
        <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid #e5e7eb', width: 'max-content', minWidth: '100%' }}>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                padding: '12px 24px',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: 'none',
                borderBottom: active === cat ? '2px solid #0f2448' : '2px solid transparent',
                background: 'transparent',
                color: active === cat ? '#0f2448' : '#999',
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                marginBottom: '-1px',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="blog-grid">
        {filtered.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} />
        ))}
      </div>
    </>
  );
}
