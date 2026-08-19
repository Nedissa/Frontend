'use client';
import { useEffect } from 'react';

export function CalPopupButton({ className, style, children, onMouseEnter, onMouseLeave }: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  useEffect(() => {
    (function (C: any, A: string, L: string) {
      let p = function (a: { q: any[] }, ar: any) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function (...args: any[]) {
        let cal = C.Cal;
        let ar = args;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement('script')).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api: { (...apiArgs: any[]): void; q: any[] } = Object.assign(
            function (...apiArgs: any[]) { p(api, apiArgs); },
            { q: [] as any[] }
          );
          const namespace = ar[1];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ['initNamespace', namespace]);
          } else {
            p(cal, ar);
          }
          return;
        }
        p(cal, ar);
      };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');

    (window as any).Cal('init', '30min', { origin: 'https://app.cal.com' });

    (window as any).Cal.ns['30min']('ui', {
      cssVarsPerTheme: { light: { 'cal-brand': '#000000' }, dark: { 'cal-brand': '#00d603' } },
      hideEventTypeDetails: false,
      layout: 'month_view',
    });
  }, []);

  return (
    <button
      type="button"
      className={className}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-cal-namespace="30min"
      data-cal-link="nedal-issa/30min"
      data-cal-config='{"layout":"month_view","theme":"light"}'
    >
      {children}
    </button>
  );
}
