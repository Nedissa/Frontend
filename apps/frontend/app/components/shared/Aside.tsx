'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type AsideType = 'search' | 'cart' | 'login' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

export function Aside({
  children,
  heading,
  desktopHeading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
  desktopHeading?: React.ReactNode;
}) {
  const { type: activeType, close } = useAside();
  const expanded = type === activeType;
  const [isVisible, setIsVisible] = useState(expanded);

  useEffect(() => {
    if (expanded) {
      setIsVisible(true);
      document.documentElement.style.overflowY = 'hidden';
      document.documentElement.style.scrollbarGutter = 'stable';
      const tidio = document.getElementById('tidio-chat');
      if (tidio) tidio.style.display = 'none';
    } else {
      document.documentElement.style.overflowY = '';
      document.documentElement.style.scrollbarGutter = '';
      const tidio = document.getElementById('tidio-chat');
      if (tidio) tidio.style.display = '';
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [expanded]);

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        { signal: abortController.signal }
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  return (
    <div
      className={`fixed inset-0 z-40 ${expanded ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <button
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${expanded ? 'opacity-100' : 'opacity-0'}`}
        onClick={close}
        aria-label="Close"
      />

      {/* Desktop cart + login: dropdown. Allt annat (search, mobile): full panel från höger */}
      {(type === 'cart' || type === 'login') ? (
        <aside
          className={`hidden md:flex absolute top-[56px] bg-white shadow-2xl border border-gray-200 z-50 flex-col rounded-none ${
            expanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
          style={{
            maxHeight: 'calc(100vh - 56px)',
            transition: 'opacity 200ms ease, transform 200ms ease',
            left: type === 'cart' ? 'calc(var(--search-left, 209px) - 60px)' : 'var(--search-left, 209px)',
            right: 'max(0px, calc((100vw - var(--content-max-width, 1080px)) / 2))',
            ...(type === 'login' ? { height: '420px' } : {}),
          }}
        >
          <header className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-black uppercase tracking-wide">{desktopHeading ?? heading}</h2>
            <button onClick={close} className="text-xl text-gray-500 hover:text-black transition-colors" aria-label="Close">×</button>
          </header>
          <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', minHeight: 0 }}>
            {children}
            <style>{`main::-webkit-scrollbar { display: none; }`}</style>
          </main>
        </aside>
      ) : null}

      {/* Mobil cart + login + alla övriga asides: full panel från höger */}
      <aside className={`${(type === 'cart' || type === 'login') ? 'flex md:hidden' : 'flex'} fixed right-0 top-0 w-full max-w-md bg-white shadow-lg z-50 flex-col ${
        expanded ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)', height: '100dvh' }}>
        <header className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-black">{heading}</h2>
          <button onClick={close} className="w-11 h-11 flex items-center justify-center text-gray-600 hover:text-black transition-colors text-2xl" aria-label="Stäng">×</button>
        </header>
        <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {children}
          <style>{`main::-webkit-scrollbar { display: none; }`}</style>
        </main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
