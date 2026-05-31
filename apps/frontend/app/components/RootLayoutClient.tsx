'use client';

import { Aside } from './Aside';
import { CartAside } from './CartAside';
import React from 'react';
import { FooterWrapper } from './FooterWrapper';

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <Aside.Provider>
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
