'use client';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const links = [
  { label: 'Hem', num: '01', href: '/digital' },
  { label: 'Om', num: '02', href: '/digital#om' },
  { label: 'Projekt', num: '03', href: '/digital#projekt' },
  { label: 'Priser', num: '04', href: '/digital#priser' },
  { label: 'Kontakt', num: '05', href: '/digital/kontakt' },
];

const BURGER_BAR_STYLE_BASE: React.CSSProperties = {
  position: 'absolute',
  right: '8px',
  transition: 'transform 0.3s cubic-bezier(0.76, 0, 0.24, 1), top 0.3s cubic-bezier(0.76, 0, 0.24, 1), width 0.3s cubic-bezier(0.76, 0, 0.24, 1), height 0.3s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.2s ease, background 0.3s ease',
};

const LOGO_CIRCLE_STYLE: React.CSSProperties = {
  width: '44px',
  height: '44px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  borderRadius: '50%',
};

const LOGO_IMG_STYLE: React.CSSProperties = {
  width: '40px',
  height: '40px',
  filter: 'none',
  transition: 'opacity 0.3s ease',
};

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [hash, setHash] = useState('');
  const [navHidden, setNavHidden] = useState(false);
  const suppressHideRef = useRef(false);
  const suppressHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Portalen till document.body får bara renderas efter mount, annars skiljer sig
  // server-renderad HTML (ingen portal) från första client-render (portal finns direkt).
  useEffect(() => { setMounted(true); }, []);

  // Håll navbar-raden mörk under overlayns stängnings-animation (0.5s clip-path-transition),
  // annars hinner den byta till vit innan overlayn hunnit gå bort — en vit blink.
  const closeMenu = () => {
    setOpen(false);
    setClosing(true);
    setTimeout(() => setClosing(false), 500);
  };

  // Lås bakgrundsscroll medan mobilmenyn är öppen. overflow:hidden på body räcker
  // inte på iOS Safari — touch-swipe kan ändå scrolla bakgrunden. Att låsa body till
  // position:fixed på sitt nuvarande scrollY är den enda pålitliga tekniken där, och vi
  // återställer scrollY manuellt vid stängning eftersom fixed positionering annars hoppar
  // sidan till toppen.
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const body = document.body.style;
    const original = { position: body.position, top: body.top, left: body.left, right: body.right, width: body.width };
    body.position = 'fixed';
    body.top = `-${scrollY}px`;
    body.left = '0';
    body.right = '0';
    body.width = '100%';
    return () => {
      body.position = original.position;
      body.top = original.top;
      body.left = original.left;
      body.right = original.right;
      body.width = original.width;
      window.scrollTo(0, scrollY);
    };
  }, [open]);
  // Endast /digital har en hero-sektion. Initialt state baseras på pathname (känt redan
  // under SSR) istället för document.querySelector, annars blir server-renderad HTML alltid
  // "vit" (document finns inte på servern) vilket ger en vit flash innan hydrering på startsidan.
  const [pastHero, setPastHero] = useState(() => pathname !== '/digital');

  // Vid pathname-byte (t.ex. via client-side navigation, komponenten remountas inte) måste
  // pastHero sättas synkront INNAN webbläsaren målar nästa frame — annars hinner navbaren
  // rendera med förra sidans färg ett ögonblick (synlig "flash"/hopp vid fram- och bakåtnavigering).
  useLayoutEffect(() => {
    setPastHero(pathname !== '/digital');
  }, [pathname]);

  // Vit navbar efter hero-sektionen (transparent/mörk medan hero syns).
  // Sidor utan .hero-section behåller default pastHero=true (vit navbar).
  useEffect(() => {
    const darkEl = document.querySelector('.hero-section');
    if (!darkEl) { setPastHero(true); return; }

    const checkScroll = () => {
      const bottom = darkEl.getBoundingClientRect().bottom;
      setPastHero(bottom <= 72);
    };
    checkScroll();
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, [pathname]);

  const isDark = !pastHero && !open;
  // Burger-strecken är vita när menyn är öppen eller navbaren är mörk, annars svarta.
  const burgerBarColor = open || isDark ? '#fff' : '#030303';

  // Re-read the hash on navigation, when the menu toggles, and on hashchange.
  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, [pathname, open]);

  // scrollIntoView({behavior:'smooth'}) saknar ett "klar"-event och tar olika lång tid
  // beroende på avstånd, så vi håller navbaren synlig tills scrollpositionen slutar
  // röra sig (istället för en fast timer som är för kort för långa scrollar).
  const smoothScrollTo = (top: number) => {
    suppressHideRef.current = true;
    setNavHidden(false);
    if (suppressHideTimerRef.current) clearTimeout(suppressHideTimerRef.current);

    let lastCheckedY = window.scrollY;
    const checkStopped = () => {
      const y = window.scrollY;
      if (y === lastCheckedY) {
        suppressHideRef.current = false;
        return;
      }
      lastCheckedY = y;
      suppressHideTimerRef.current = setTimeout(checkStopped, 150);
    };
    suppressHideTimerRef.current = setTimeout(checkStopped, 150);

    window.scrollTo({ top, behavior: 'smooth' });
  };

  const scrollToAnchorId = (id: string) => {
    // id sitter numera på sektionens inre content-wrapper (inte på <section> självt), så
    // getBoundingClientRect() ger redan innehållets faktiska start utan sektionens egen
    // padding-top inräknad. Vi behöver bara kompensera för den fixerade navbaren plus lite
    // luft, ingen gissad paddingkompensation längre.
    const el = document.getElementById(id);
    if (!el) return;
    const NAVBAR_HEIGHT = 72;
    const EXTRA_BREATHING_ROOM = 24;
    const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT - EXTRA_BREATHING_ROOM;
    smoothScrollTo(top);
  };

  // Om ProjectNav sparade ett mål-ankare innan navigering hit (annan route), scrolla dit nu.
  useEffect(() => {
    if (pathname !== '/digital') return;
    const target = sessionStorage.getItem('webbstudio-scroll-to');
    if (!target) return;
    sessionStorage.removeItem('webbstudio-scroll-to');
    setTimeout(() => scrollToAnchorId(target), 0);
  }, [pathname]);

  // Navbaren ska alltid synas direkt efter en sidnavigering (länkklick) — den ska bara
  // döljas av att användaren faktiskt scrollar vidare, inte av navigeringen i sig.
  useEffect(() => {
    setNavHidden(false);
  }, [pathname]);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      // Programmatiskt scroll-till-ankare (menyklick) ska aldrig gömma navbaren, bara
      // användarens egen scroll efteråt ska kunna göra det.
      if (suppressHideRef.current) {
        lastY = y;
        return;
      }
      if (y < 80) {
        setNavHidden(false);
      } else if (delta > 4) {
        setNavHidden(true);
      } else if (delta < -4) {
        setNavHidden(false);
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  const isLinkActive = (href: string): boolean => {
    const [linkPath, linkAnchor] = href.split('#');
    return pathname === linkPath && (linkAnchor ? hash === `#${linkAnchor}` : hash === '');
  };

  // Ankarlänkar på samma sida (/digital) hanteras med native <a> + scrollIntoView istället
  // för next/link, eftersom Next.js Link inte tillförlitligt scrollar till hash-ankare vid
  // klick på samma route. Från andra sidor (t.ex. /digital/kontakt) finns elementet inte
  // i DOM än, så vi navigerar dit på riktigt och sparar målankaret i sessionStorage — samma
  // mönster som ProjectNav använder.
  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname !== '/digital') return;
    e.preventDefault();
    window.history.pushState({ scrollY: window.scrollY }, '', '/digital');
    setHash('');
    smoothScrollTo(0);
  };

  const handleAnchorClick = (anchor: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname !== '/digital') {
      sessionStorage.setItem('webbstudio-scroll-to', anchor);
      router.push('/digital');
      return;
    }
    window.history.pushState({ scrollY: window.scrollY }, '', `/digital#${anchor}`);
    setHash(`#${anchor}`);
    // setTimeout skjuter scrollen till nästa tick, efter att webbläsarens egen
    // native hash-navigering (som annars återställer scrollY till 0) hunnit köra klart.
    setTimeout(() => scrollToAnchorId(anchor), 0);
  };

  return (
    <nav
      className="site-nav"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, width: '100%', height: '72px', zIndex: 150,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px',
        background: open || closing ? 'transparent' : isDark ? 'rgba(0,0,0,0.2)' : '#fff',
        borderBottom: open || closing || isDark ? '1px solid transparent' : '1px solid rgba(10,10,10,0.1)',
        boxSizing: 'border-box',
        transform: navHidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.3s ease, background 0.3s ease, border-color 0.3s ease',
      }}
    >
      <Link href="/digital" className="site-nav-logo nav-logo-mobile" style={{ ...LOGO_CIRCLE_STYLE, position: 'relative', zIndex: 110 }}>
        <img src="/techpilots-logo-new.svg" alt="Techpilots" style={LOGO_IMG_STYLE} />
      </Link>

      <Link href="/digital" className="site-nav-logo hide-mobile" style={LOGO_CIRCLE_STYLE}>
        <img src="/techpilots-logo-new.svg" alt="Techpilots" style={LOGO_IMG_STYLE} />
      </Link>

      <div className="nav-links-desktop" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '96px', zIndex: 60 }}>
        {links.map((l) => {
          const isActive = isLinkActive(l.href);
          const [linkPath, linkAnchor] = l.href.split('#');
          const activeColor = isDark ? '#e8c547' : '#a67c1e';
          const linkStyle: React.CSSProperties = { fontSize: '13px', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.03em', color: isActive ? activeColor : (isDark ? '#fff' : '#0a0a0a'), transition: 'color 0.3s ease' };
          const supColor = isActive ? (isDark ? 'rgba(232,197,71,0.6)' : 'rgba(166,124,30,0.6)') : (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(10,10,10,0.4)');
          return linkAnchor ? (
            <a key={l.href} href={l.href} onClick={handleAnchorClick(linkAnchor)} className="nav-link" style={linkStyle}>
              {l.label}
              <sup style={{ fontSize: '9px', color: supColor, marginLeft: '3px', verticalAlign: 'super' }}>{l.num}</sup>
            </a>
          ) : (
            <Link key={l.href} href={linkPath} onClick={linkPath === '/digital' ? handleHomeClick : undefined} className="nav-link" style={linkStyle}>
              {l.label}
              <sup style={{ fontSize: '9px', color: supColor, marginLeft: '3px', verticalAlign: 'super' }}>{l.num}</sup>
            </Link>
          );
        })}
      </div>

      <button
        onClick={() => (open ? closeMenu() : setOpen(true))}
        aria-label={open ? 'Stäng meny' : 'Öppna meny'}
        className="nav-burger"
        style={{
          display: 'none',
          width: '34px', height: '34px', alignItems: 'center', justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          borderRadius: '10px', cursor: 'pointer', flexShrink: 0,
          position: 'relative', zIndex: 110,
          transition: 'background 0.3s ease, border-color 0.3s ease',
        }}
      >
        {/* Tre olika långa linjer i vila (kort/lång/kort), som jämnas ut och morphar till ett X när menyn är öppen. */}
        <span style={{ ...BURGER_BAR_STYLE_BASE, top: open ? '50%' : 'calc(50% - 8px)', width: open ? '18px' : '22px', height: open ? '3.5px' : '5px', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', background: burgerBarColor }} />
        <span style={{ ...BURGER_BAR_STYLE_BASE, top: '50%', width: '15px', height: '5px', transform: 'rotate(0deg)', background: burgerBarColor, opacity: open ? 0 : 1 }} />
        <span style={{ ...BURGER_BAR_STYLE_BASE, top: open ? '50%' : 'calc(50% + 8px)', width: open ? '18px' : '22px', height: open ? '3.5px' : '5px', transform: open ? 'rotate(-45deg)' : 'rotate(0deg)', background: burgerBarColor }} />
      </button>

      {mounted && createPortal(
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgb(12,13,18)',
            display: 'flex', flexDirection: 'column',
            clipPath: open ? 'circle(150% at calc(100% - 52px) 48px)' : 'circle(0% at calc(100% - 52px) 48px)',
            pointerEvents: open ? 'auto' : 'none',
            transition: 'clip-path 0.5s cubic-bezier(0.76, 0, 0.24, 1)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '104px', padding: '0 32px' }}>
            {links.map((l) => {
              const isActive = isLinkActive(l.href);
              const [linkPath, linkAnchor] = l.href.split('#');
              const mobileLinkStyle: React.CSSProperties = {
                fontSize: '32px', fontWeight: 700, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '-0.01em',
                color: isActive ? '#e8c547' : '#fff',
                padding: '20px 0',
                borderTop: '1px solid rgba(255,255,255,0.12)',
                opacity: open ? 1 : 0,
                transition: `opacity 0.3s ease ${open ? '0.25s' : '0s'}`,
              };
              return linkAnchor ? (
                <a key={l.href} href={l.href} onClick={(e) => { closeMenu(); handleAnchorClick(linkAnchor)(e); }} className="nav-link" style={mobileLinkStyle}>
                  {l.label}
                  <sup style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginLeft: '8px', verticalAlign: 'super' }}>{l.num}</sup>
                </a>
              ) : (
                <Link key={l.href} href={linkPath} onClick={closeMenu} className="nav-link" style={mobileLinkStyle}>
                  {l.label}
                  <sup style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginLeft: '8px', verticalAlign: 'super' }}>{l.num}</sup>
                </Link>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </nav>
  );
}
