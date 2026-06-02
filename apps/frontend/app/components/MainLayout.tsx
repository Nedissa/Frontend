'use client';

import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  bordered?: boolean;
  noPadding?: boolean;
}

export function MainLayout({ children, title, bordered = false, noPadding = false }: MainLayoutProps) {
  return (
    <div className="w-full flex justify-center pt-[20px]">
      <div className={`ml-container flex flex-col ${bordered ? 'border border-gray-200' : ''}`} style={{ maxWidth: '1280px', width: '100%', ...( bordered ? { boxShadow: '0 2px 8px rgba(0,0,0,0.15)' } : {}), overflow: 'visible' }}>
        {/* Title if provided */}
        {title && (
          <div className="py-8 px-0">
            <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
          </div>
        )}

        {/* Content */}
        <div className="w-full" style={{ overflow: 'visible' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
