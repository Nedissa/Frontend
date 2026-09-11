import { useState, useEffect, useCallback } from 'react';

interface FavoritesState {
  ids: Set<string>;
}

interface CompareState {
  ids: Set<string>;
}

const favoritesCache: FavoritesState = { ids: new Set() };
const compareCache: CompareState = { ids: new Set() };
let initialized = false;

const initializeCache = () => {
  if (initialized) return;
  initialized = true;
  try {
    const favList = JSON.parse(localStorage.getItem('favoritesList') || '[]');
    favoritesCache.ids = new Set(Array.isArray(favList) ? favList.map((f: any) => f.id) : []);
  } catch {}
  try {
    const compList = JSON.parse(localStorage.getItem('techpilots_compare') || '[]');
    compareCache.ids = new Set(Array.isArray(compList) ? compList.map((c: any) => c.id) : []);
  } catch {}
};

export function useFavoritesAndCompare(productId: string) {
  const [isFav, setIsFav] = useState(false);
  const [inCompare, setInCompare] = useState(false);

  useEffect(() => {
    initializeCache();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- läser localStorage-baserad cache vid mount, kan inte beräknas server-side
    setIsFav(favoritesCache.ids.has(productId));
    setInCompare(compareCache.ids.has(productId));

    const handleFavoritesUpdated = () => {
      try {
        const favList = JSON.parse(localStorage.getItem('favoritesList') || '[]');
        favoritesCache.ids = new Set(Array.isArray(favList) ? favList.map((f: any) => f.id) : []);
        setIsFav(favoritesCache.ids.has(productId));
      } catch {}
    };

    const handleCompareToggle = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.id === productId) {
        setInCompare((prev) => !prev);
        compareCache.ids = compareCache.ids.has(productId)
          ? new Set([...compareCache.ids].filter((id) => id !== productId))
          : new Set([...compareCache.ids, productId]);
      }
    };

    const handleCompareClear = () => {
      compareCache.ids.clear();
      setInCompare(false);
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdated);
    window.addEventListener('toggleCompare', handleCompareToggle);
    window.addEventListener('clearCompare', handleCompareClear);

    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
      window.removeEventListener('toggleCompare', handleCompareToggle);
      window.removeEventListener('clearCompare', handleCompareClear);
    };
  }, [productId]);

  const toggleFavorite = useCallback(() => {
    try {
      const favList = JSON.parse(localStorage.getItem('favoritesList') || '[]');
      const exists = favList.some((item: any) => item.id === productId);
      const updated = exists
        ? favList.filter((item: any) => item.id !== productId)
        : [...favList, { id: productId }];
      localStorage.setItem('favoritesList', JSON.stringify(updated));
      favoritesCache.ids = new Set(updated.map((f: any) => f.id));
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch {}
  }, [productId]);

  return { isFav, inCompare, toggleFavorite };
}
