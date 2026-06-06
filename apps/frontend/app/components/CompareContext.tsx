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

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<ProductData[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const product = (e as CustomEvent).detail as ProductData;
      setCompareList(prev => {
        if (prev.some(p => p.id === product.id)) return prev.filter(p => p.id !== product.id);
        if (prev.length >= 4) return prev;
        return [...prev, product];
      });
    };
    window.addEventListener('toggleCompare', handler);
    return () => window.removeEventListener('toggleCompare', handler);
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
