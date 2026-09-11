'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ProductData } from './ProductCard';

interface CompareContextType {
  compareList: ProductData[];
  removeFromCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType>({
  compareList: [],
  removeFromCompare: () => {},
  isInCompare: () => false,
  clearCompare: () => {},
});

const STORAGE_KEY = 'techpilots_compare';

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<ProductData[]>([]);

  // Ladda från localStorage vid start
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: ProductData[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- läser localStorage vid mount, kan inte beräknas server-side
          setCompareList(parsed);
        }
      }
    } catch {}
  }, []);

  // Spara till localStorage när listan ändras
  useEffect(() => {
    try {
      if (compareList.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(compareList));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }, [compareList]);

  useEffect(() => {
    const handler = (e: Event) => {
      const product = (e as CustomEvent).detail as ProductData;
      setCompareList(prev => {
        if (prev.some(p => p.id === product.id)) return prev.filter(p => p.id !== product.id);
        if (prev.length >= 4) return prev;
        return [...prev, product];
      });
    };
    const clearHandler = () => setCompareList([]);
    window.addEventListener('toggleCompare', handler);
    window.addEventListener('clearCompare', clearHandler);
    return () => {
      window.removeEventListener('toggleCompare', handler);
      window.removeEventListener('clearCompare', clearHandler);
    };
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    setCompareList(prev => prev.filter(p => p.id !== id));
  }, []);

  const isInCompare = useCallback((id: string) => {
    return compareList.some(p => p.id === id);
  }, [compareList]);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  return (
    <CompareContext.Provider value={{ compareList, removeFromCompare, isInCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
