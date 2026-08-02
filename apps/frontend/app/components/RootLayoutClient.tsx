'use client';

import { Aside } from './Aside';
import { CartAside } from './CartAside';
import { LoginAside } from './LoginAside';
import { Logo } from './Logo';
import React, { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { HeaderWrapper } from './HeaderWrapper';
import { FooterWrapper } from './FooterWrapper';
import { CompareProvider } from './CompareContext';
import { CompareBar } from './CompareBar';
import { NavigationProgress } from './NavigationProgress';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useAside } from './Aside';

function ParamHandler({
  onReset,
  onOpenLogin,
}: {
  onReset: (token: string, email: string) => void;
  onOpenLogin: (view?: string) => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { open } = useAside();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;

    const token = searchParams.get('reset_token');
    const email = searchParams.get('reset_email');
    const openLogin = searchParams.get('open_login');
    const loginView = searchParams.get('login_view');

    if (!token && !openLogin) return;

    handled.current = true;
    const url = new URL(window.location.href);

    if (token) {
      onReset(token, email || '');
      open('login');
      url.searchParams.delete('reset_token');
      url.searchParams.delete('reset_email');
    } else if (openLogin) {
      onOpenLogin(loginView || undefined);
      open('login');
      url.searchParams.delete('open_login');
      url.searchParams.delete('login_view');
    }

    router.replace(url.pathname + (url.search || ''));
  }, [searchParams, onReset, onOpenLogin, open, router]);

  return null;
}

type View = 'login' | 'register' | 'reset' | 'reset-confirm';

const headingMap: Record<View, string> = {
  login: '',
  register: 'Skapa konto',
  reset: 'Återställ lösenord',
  'reset-confirm': 'Nytt lösenord',
};

function LoginHeadingLink() {
  const { close } = useAside();
  return (
    <a href="/" onClick={close} className="flex items-center gap-1" style={{ textDecoration: 'none' }}>
      <Logo size={28} />
      <span className="font-bold text-black text-base normal-case tracking-normal">Techpilots</span>
    </a>
  );
}

export function RootLayoutClient({ children, initialIsLoggedIn = false }: { children: React.ReactNode; initialIsLoggedIn?: boolean }) {
  const pathname = usePathname();
  const [loginHeading, setLoginHeading] = useState<React.ReactNode>(<LoginHeadingLink />);
  const [loginDesktopHeading, setLoginDesktopHeading] = useState<string>('Logga in');
  const [resetToken, setResetToken] = useState<string | undefined>();
  const [resetEmail, setResetEmail] = useState<string | undefined>();
  const [loginInitialView, setLoginInitialView] = useState<View | undefined>();
  const hideHeader = pathname === '/kassa' || pathname === '/order-bekraftelse';

  const handleReset = (token: string, email: string) => {
    setResetToken(token);
    setResetEmail(email);
    setLoginHeading('Nytt lösenord');
    setLoginDesktopHeading('Nytt lösenord');
  };

  const handleOpenLogin = useCallback((view?: string) => {
    const v = (view as View) || 'login';
    setLoginInitialView(v);
    setLoginHeading(v === 'login' ? <LoginHeadingLink /> : (headingMap[v] || 'Logga in'));
    setLoginDesktopHeading(headingMap[v] || 'Logga in');
  }, []);

  return (
    <CompareProvider>
      <Aside.Provider>
        <Suspense fallback={null}><NavigationProgress /></Suspense>
        <Suspense fallback={null}>
          <ParamHandler onReset={handleReset} onOpenLogin={handleOpenLogin} />
        </Suspense>
        {!hideHeader && <HeaderWrapper initialIsLoggedIn={initialIsLoggedIn} />}
        <main className={`${hideHeader ? '' : 'pt-[100px] sm:pt-[108px]'} pb-24 flex flex-col flex-1 min-h-screen overflow-x-hidden`}>
          {children}
        </main>
        <FooterWrapper />
        <CartAside />
        <Aside type="login" heading={loginHeading} desktopHeading={loginDesktopHeading}>
          <LoginAside
            key={resetToken || loginInitialView || 'default'}
            resetToken={resetToken}
            resetEmail={resetEmail}
            initialView={loginInitialView}
            onViewChange={(v) => {
              setLoginHeading(v === 'login' ? <LoginHeadingLink /> : headingMap[v]);
              setLoginDesktopHeading(headingMap[v] || 'Logga in');
            }}
          />
        </Aside>
        <CompareBar />
      </Aside.Provider>
    </CompareProvider>
  );
}
