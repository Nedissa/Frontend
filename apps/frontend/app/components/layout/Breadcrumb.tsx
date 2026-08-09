'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="py-4">
      <div className="w-[1080px] qhd:w-[1440px] mx-auto flex items-center gap-2 text-sm text-black">
        <Link href="/" className="hover:text-gray-600 flex items-center">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </Link>
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-black">›</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-gray-600">
                {item.label}
              </Link>
            ) : (
              <span className="text-black font-medium">{item.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
