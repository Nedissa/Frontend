'use client';

import { Aside } from './Aside';
import { CartAside } from './CartAside';
import React, { Suspense } from 'react';
import { HeaderWrapper } from './HeaderWrapper';
import { FooterWrapper } from './FooterWrapper';
import { CompareProvider } from './CompareContext';
import { CompareBar } from './CompareBar';
import { NavigationProgress } from './NavigationProgress';
import { usePathname } from 'next/navigation';

export function RootLayoutClient({ children, initialIsLoggedIn = false }: { children: React.ReactNode; initialIsLoggedIn?: boolean }) {
  const pathname = usePathname();
  const hideHeader = pathname === '/inlogg' || pathname === '/aterstall-losenord' || pathname === '/kassan' || pathname === '/order-bekraftelse';

  return (
    <CompareProvider>
      <Aside.Provider>
        <Suspense fallback={null}><NavigationProgress /></Suspense>
        {!hideHeader && <HeaderWrapper initialIsLoggedIn={initialIsLoggedIn} />}
        <main className={`${hideHeader ? '' : 'pt-[100px] sm:pt-[108px]'} pb-24 flex flex-col flex-1 min-h-screen overflow-x-hidden`}>
          {children}
        </main>
        <FooterWrapper />
        <CartAside />
        <CompareBar />
      </Aside.Provider>
    </CompareProvider>
  );
}
