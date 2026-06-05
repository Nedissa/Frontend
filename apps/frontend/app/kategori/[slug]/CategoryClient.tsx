'use client';

import { useState, useEffect } from 'react';
import { fetchProductsFromMedusa } from '@/app/lib/medusa-client';
import { ProductCard } from '@/app/components/ProductCard';
import { ProductFilter } from '@/app/components/ProductFilter';
import { SortDropdown } from '@/app/components/SortDropdown';
import { CategoryGrid } from '@/app/components/CategoryGrid';

interface FilterOptions {
  priceRange: [number, number];
  brands: string[];
  colors: string[];
  rating: number | null;
  inStock: boolean;
}

interface CategoryClientProps {
  slug: string;
  categoryTitle: string;
}

export default function CategoryClient({ slug, categoryTitle }: CategoryClientProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 20000],
    brands: [],
    colors: [],
    rating: null,
    inStock: false,
  });
  const [sortBy, setSortBy] = useState('relevant');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      const all = await fetchProductsFromMedusa();
      setProducts(all);
      setLoading(false);
    };
    load();
  }, [slug]);

  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 20000;

  const filtered = products.filter((p) => {
    if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;
    if (filters.brands.length > 0 && !filters.brands.includes(p.brand || '')) return false;
    if (filters.inStock && !p.inStock) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      case 'newest': return b.id.localeCompare(a.id);
      default: return 0;
    }
  });

  const productsPerPage = 16;
  const totalPages = Math.ceil(sorted.length / productsPerPage);
  const paginated = sorted.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-0.5 bg-black animate-[progress_1.5s_ease-in-out_infinite]" style={{ width: '100%', transformOrigin: 'left', animation: 'loading-bar 1.5s ease-in-out infinite' }} />
        <style>{`
          @keyframes loading-bar {
            0% { transform: scaleX(0); transform-origin: left; }
            50% { transform: scaleX(0.7); transform-origin: left; }
            100% { transform: scaleX(1); transform-origin: left; opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex gap-0 pb-12">
      {/* Sidebar Filter */}
      <div className="hidden md:block flex-shrink-0">
        <ProductFilter
          onFilterChange={(f) => { setFilters(f); setCurrentPage(1); }}
          maxPrice={maxPrice}
          products={products}
        />
      </div>

      {/* Products area */}
      <div className="flex-1 min-w-0 px-8">
        {/* Category subcategories */}
        <CategoryGrid slug={slug} />

        {/* Sort + count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-gray-500">{sorted.length} produkter</p>
          <SortDropdown
            value={sortBy}
            onChange={(v) => { setSortBy(v); setCurrentPage(1); }}
            options={[
              { value: 'relevant', label: 'Mest relevant' },
              { value: 'price-low', label: 'Pris: Lågt till högt' },
              { value: 'price-high', label: 'Pris: Högt till lågt' },
              { value: 'rating', label: 'Högsta betyg' },
              { value: 'newest', label: 'Nyaste' },
            ]}
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {paginated.map((product) => (
            <ProductCard key={product.id} product={product} variant="popular" />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
            >
              Föregående
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded transition-colors ${currentPage === i + 1 ? 'bg-black text-white font-semibold' : 'border border-gray-300 hover:bg-gray-100'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
            >
              Nästa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
