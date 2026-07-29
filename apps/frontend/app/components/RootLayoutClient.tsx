'use client';

import { Aside } from './Aside';
import { CartAside } from './CartAside';
import { LoginAside } from './LoginAside';
import React, { Suspense, useState, useEffect } from 'react';
import { HeaderWrapper } from './HeaderWrapper';
import { FooterWrapper } from './FooterWrapper';
import { CompareProvider } from './CompareContext';
import { CompareBar } from './CompareBar';
import { NavigationProgress } from './NavigationProgress';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useAside } from './Aside';

function ResetParamHandler({ onReset }: { onReset: (token: string, email: string) => void }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { open } = useAside();

  useEffect(() => {
    const token = searchParams.get('reset_token');
    const email = searchParams.get('reset_email');
    if (token) {
      onReset(token, email || '');
      open('login');
      const url = new URL(window.location.href);
      url.searchParams.delete('reset_token');
      url.searchParams.delete('reset_email');
      router.replace(url.pathname + (url.search || ''));
    }
  }, [searchParams, onReset, open, router]);

  return null;
}

type View = 'login' | 'register' | 'reset' | 'reset-confirm';

const headingMap: Record<View, string> = {
  login: 'Logga in',
  register: 'Skapa konto',
  reset: 'Återställ lösenord',
  'reset-confirm': 'Nytt lösenord',
};

export function RootLayoutClient({ children, initialIsLoggedIn = false }: { children: React.ReactNode; initialIsLoggedIn?: boolean }) {
  const pathname = usePathname();
  const [loginHeading, setLoginHeading] = useState('Logga in');
  const [resetToken, setResetToken] = useState<string | undefined>();
  const [resetEmail, setResetEmail] = useState<string | undefined>();
  const hideHeader = pathname === '/inlogg' || pathname === '/aterstall-losenord' || pathname === '/kassa' || pathname === '/order-bekraftelse';

  const handleReset = (token: string, email: string) => {
    setResetToken(token);
    setResetEmail(email);
    setLoginHeading('Nytt lösenord');
  };

  return (
    <CompareProvider>
      <Aside.Provider>
        <Suspense fallback={null}><NavigationProgress /></Suspense>
        <Suspense fallback={null}>
          <ResetParamHandler onReset={handleReset} />
        </Suspense>
        {!hideHeader && <HeaderWrapper initialIsLoggedIn={initialIsLoggedIn} />}
        <main className={`${hideHeader ? '' : 'pt-[100px] sm:pt-[108px]'} pb-24 flex flex-col flex-1 min-h-screen overflow-x-hidden`}>
          {children}
        </main>
        <FooterWrapper />
        <CartAside />
        <Aside type="login" heading={loginHeading}>
          <LoginAside
            resetToken={resetToken}
            resetEmail={resetEmail}
            onViewChange={(v) => setLoginHeading(headingMap[v])}
          />
        </Aside>
        <CompareBar />
      </Aside.Provider>
    </CompareProvider>
  );
}
