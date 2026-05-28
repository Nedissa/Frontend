'use client';

import { Aside } from './Aside';
import { CartAside } from './CartAside';
import React from 'react';
import { HeaderWrapper } from './HeaderWrapper';
import { FooterWrapper } from './FooterWrapper';
import { usePathname } from 'next/navigation';

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader = pathname === '/inlogg';

  return (
    <Aside.Provider>
      {!hideHeader && <HeaderWrapper />}
      <main className="py-4 pb-24 flex justify-center flex-1 min-h-screen">
        <div className="w-full max-w-[1280px]">
          {children}
        </div>
      </main>
      <FooterWrapper />
      <CartAside />
    </Aside.Provider>
  );
}
