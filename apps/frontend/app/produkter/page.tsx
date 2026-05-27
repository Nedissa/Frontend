'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/app/components/MainLayout';
import { ProductCard } from '@/app/components/ProductCard';
import { ProductFilter } from '@/app/components/ProductFilter';
import { fetchProductsFromMedusa, type Product } from '@/app/lib/medusa-client';

interface FilterOptions {
  priceRange: [number, number];
  brands: string[];
  colors: string[];
  rating: number | null;
  inStock: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
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
    const loadProducts = async () => {
      setLoading(true);
      const fetchedProducts = await fetchProductsFromMedusa();
      setProducts(fetchedProducts);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 20000;

  const filtered = products.filter((product) => {
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand || '')) return false;
    if (filters.colors.length > 0) {
      const productColors: string[] = (product as any).colors || [];
      if (!filters.colors.some(c => productColors.includes(c))) return false;
    }
    if (filters.rating !== null && (product.rating || 0) < filters.rating) return false;
    if (filters.inStock && !(product as any).inStock) return false;
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

  const alsoLikeProducts = products.filter((product) => product.sectionCategory === 'also-like');

  const productsPerPage = 12;
  const totalPages = Math.ceil(sorted.length / productsPerPage);
  const startIdx = (currentPage - 1) * productsPerPage;
  const paginatedProducts = sorted.slice(startIdx, startIdx + productsPerPage);

  if (loading) {
    return <MainLayout><div className="text-center py-10">Laddar produkter...</div></MainLayout>;
  }

  if (products.length === 0) {
    return <MainLayout><div className="text-center py-10">Ingen produkter tillgänglig</div></MainLayout>;
  }

  return (
    <MainLayout title="Alla produkter">
      <div className="flex gap-0">
        {/* Sidebar Filter */}
        <div className="hidden md:block flex-shrink-0">
          <ProductFilter
            onFilterChange={(f) => { setFilters(f); setCurrentPage(1); }}
            maxPrice={maxPrice}
            products={products}
          />
        </div>

        {/* Products Area */}
        <div className="flex-1 min-w-0 px-8">
          {/* Sort Options */}
          <div className="mb-8 flex justify-between items-center">
            <p className="text-gray-600">Visar {paginatedProducts.length} av {sorted.length} produkter</p>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 font-semibold"
            >
              <option value="relevant">Mest relevant</option>
              <option value="price-low">Pris: Lågt till högt</option>
              <option value="price-high">Pris: Högt till lågt</option>
              <option value="rating">Högsta betyg</option>
              <option value="newest">Nyaste</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="popular" />
            ))}
          </div>

          {/* Du kanske också gillar */}
          {alsoLikeProducts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Du kanske också gillar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {alsoLikeProducts.map((product) => (
                  <ProductCard key={product.id} product={product} variant="also-like" />
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 py-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Föregående
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded transition-colors ${
                    currentPage === i + 1
                      ? 'bg-black text-white font-semibold'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Nästa
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
