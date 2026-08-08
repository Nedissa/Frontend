'use client';

import { useState, useCallback, useMemo } from 'react';
import { ProductCard, type ProductData } from './ProductCard';

type SortOption = 'recommended' | 'latest' | 'rating' | 'popularity' | 'price-asc' | 'price-desc';

interface BreadcrumbTrail {
  mainCategorySlug: string;
  mainCategoryTitle: string;
  subcategorySlug: string;
  subcategoryTitle: string;
}

export function ProductGridWithSorting({
  products,
  categorySlug,
  breadcrumbTrail,
  sortBy: externalSortBy,
  variant = 'popular',
}: {
  products: ProductData[];
  categorySlug?: string;
  breadcrumbTrail?: BreadcrumbTrail | null;
  sortBy?: SortOption;
  variant?: 'popular' | 'recommended' | 'new' | 'related' | 'also-like';
}) {
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>(externalSortBy || 'recommended');


  const sortedProducts = useMemo(() => {
    const sorted = [...products];

    switch (sortBy) {
      case 'latest':
        return sorted.reverse();
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'popularity':
        return sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  }, [products, sortBy]);

  const handleAddToCart = useCallback((product: ProductData) => {
    setAddedIds(prev => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  }, []);

  return (
    <div className="space-y-6">
      <div className={`grid ${breadcrumbTrail ? 'grid-cols-3' : 'grid-cols-4'} gap-6 py-6`}>
        {sortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            variant={variant}
            categorySlug={categorySlug}
            onAddToCart={handleAddToCart}
            isAdded={addedIds.has(product.id)}
          />
        ))}
      </div>
    </div>
  );
}
