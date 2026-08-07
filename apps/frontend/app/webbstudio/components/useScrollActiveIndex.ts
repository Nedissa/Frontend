'use client';
import { useEffect, useRef, useState } from 'react';

const MOBILE_BREAKPOINT = 900;

type ScrollActiveIndex = {
  activeIndex: number | null;
  setItemRef: (index: number) => (el: HTMLDivElement | null) => void;
};

/**
 * Touch screens have no hover, so on mobile we mark the element closest to the
 * viewport centre as "active" instead. Above the mobile breakpoint the active
 * index stays null and real CSS/mouse hover takes over.
 */
export function useScrollActiveIndex(): ScrollActiveIndex {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        setActiveIndex(null);
        return;
      }

      const viewportCenter = window.innerHeight / 2;
      let closestIndex: number | null = null;
      let closestDistance = Infinity;

      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;

        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - viewportCenter);
        if (distance < closestDistance && distance < rect.height / 2) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      setActiveIndex(closestIndex);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const setItemRef = (index: number) => (el: HTMLDivElement | null) => {
    itemRefs.current[index] = el;
  };

  return { activeIndex, setItemRef };
}
