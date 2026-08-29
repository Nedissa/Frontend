'use client';

import { useState } from 'react';
import { ProductFilter } from '@/app/components/product/ProductFilter';
import { ProductGridWithSorting } from '@/app/components/product/ProductGridWithSorting';
import { Breadcrumb } from '@/app/components/layout/Breadcrumb';
import { ProductData } from '@/app/components/product/ProductCard';

type SortOption = 'recommended' | 'latest' | 'rating' | 'popularity' | 'price-asc' | 'price-desc';

type Product = ProductData;

interface FilterOptions {
  priceRange: [number, number];
  brands: string[];
  colors: string[];
  rating: number[];
  inStock: boolean;
}

interface BreadcrumbTrail {
  mainCategorySlug: string;
  mainCategoryTitle: string;
  subcategorySlug: string;
  subcategoryTitle: string;
}

export function ProductSeriesContent({
  categoryTitle,
  categorySlug,
  breadcrumbTrail,
  products
}: {
  categoryTitle: string;
  categorySlug: string;
  breadcrumbTrail: BreadcrumbTrail | null;
  products: Product[];
}) {
  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price || 0)) : 20000;

  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, maxPrice],
    brands: [],
    colors: [],
    rating: [],
    inStock: false,
  });

  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortOptions = [
    { value: 'recommended', label: 'Rekommenderat' },
    { value: 'latest', label: 'Senaste' },
    { value: 'rating', label: 'Betyg' },
    { value: 'popularity', label: 'Popularitet' },
    { value: 'price-asc', label: 'Pris stigande' },
    { value: 'price-desc', label: 'Pris fallande' },
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Rekommenderat';

  const filteredProducts = products.filter((product) => {
    const priceMatch = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
    const brandMatch = filters.brands.length === 0 || !product.brand || filters.brands.includes(product.brand);
    const colorMatch = !filters.colors || filters.colors.length === 0 || (product.colors && product.colors.some(color => filters.colors.includes(color)));
    const ratingMatch = filters.rating.length === 0 || filters.rating.includes(Math.round(product.rating || 0));
    const stockMatch = !filters.inStock || product.stock?.includes('I lager');
    return priceMatch && brandMatch && colorMatch && ratingMatch && stockMatch;
  });

  const breadcrumbItems = breadcrumbTrail
    ? [
        { label: breadcrumbTrail.mainCategoryTitle, href: '#' },
        { label: breadcrumbTrail.subcategoryTitle, href: `/produktserier/${breadcrumbTrail.subcategorySlug}` },
      ]
    : [];

  return (
    <div style={{ scrollbarGutter: 'stable' }}>
      <Breadcrumb items={breadcrumbItems} />
      <div className="flex">
        <ProductFilter onFilterChange={setFilters} maxPrice={maxPrice} products={products} />
        <div className="flex-1 px-6 pt-6 pb-8">
          <div className="flex items-center justify-between mb-8 gap-6">
            <h1 className="text-3xl font-bold text-gray-900">{categoryTitle}</h1>
            <div className="relative w-44">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="w-full bg-white shadow-sm text-sm font-medium text-gray-900 flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors rounded"
              >
                <span>{currentSortLabel}</span>
                <svg className={`w-4 h-4 transition-transform flex-shrink-0 ${showSortMenu ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                </svg>
              </button>
              {showSortMenu && (
                <div className="absolute top-full left-0 right-0 mt-0 bg-white z-20 shadow-lg rounded-b">
                  {sortOptions.filter(opt => opt.value !== sortBy).map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => {
                        setSortBy(value as SortOption);
                        setShowSortMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm whitespace-nowrap transition-colors text-gray-700 hover:bg-gray-50"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <ProductGridWithSorting products={filteredProducts} categorySlug={categorySlug} breadcrumbTrail={breadcrumbTrail} sortBy={sortBy} variant="recommended" />
        </div>
      </div>
    </div>
  );
}
