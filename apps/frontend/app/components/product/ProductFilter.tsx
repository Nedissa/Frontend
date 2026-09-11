'use client';

import { useState, useEffect } from 'react';

interface FilterOptions {
  priceRange: [number, number];
  brands: string[];
  colors: string[];
  rating: number[];
  inStock: boolean;
}

interface ProductFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  maxPrice?: number;
  products: any[];
}

const COLOR_MAP: { [key: string]: string } = {
  '#000000': 'Svart',
  '#FFFFFF': 'Vit',
  '#C0C0C0': 'Silver',
  '#808080': 'Grå',
};

export function ProductFilter({ onFilterChange, maxPrice = 20000, products = [] }: ProductFilterProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(() => [0, maxPrice]);
  const [prevMaxPrice, setPrevMaxPrice] = useState(maxPrice);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    price: true,
    brands: true,
    colors: true,
    rating: true,
    stock: true,
  });

  // Extract unique brands and colors from products
  const uniqueBrands = Array.from(new Set(products.map((p: any) => p.brand).filter(Boolean)));
  const uniqueColors = Array.from(new Set(
    products
      .flatMap((p: any) => p.colors || [])
      .filter(Boolean)
  ));

  // Klampa priceRange mot nytt maxPrice under render (inte i effect) om maxPrice ändrats sedan senaste render
  if (maxPrice !== prevMaxPrice) {
    setPrevMaxPrice(maxPrice);
    if (priceRange[1] > maxPrice) {
      setPriceRange([priceRange[0], maxPrice]);
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const snapToInterval = (value: number) => {
    const interval = 200;
    return Math.round(value / interval) * interval;
  };

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    const snappedValue = snapToInterval(value);
    const newRange: [number, number] = type === 'min'
      ? [snappedValue, priceRange[1]]
      : [priceRange[0], snappedValue];
    setPriceRange(newRange);
    updateFilters(newRange, selectedBrands, selectedColors, selectedRating, inStockOnly);
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(newBrands);
    updateFilters(priceRange, newBrands, selectedColors, selectedRating, inStockOnly);
  };

  const handleColorToggle = (color: string) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color];
    setSelectedColors(newColors);
    updateFilters(priceRange, selectedBrands, newColors, selectedRating, inStockOnly);
  };

  const handleRatingChange = (rating: number) => {
    const newRating = selectedRating.includes(rating)
      ? selectedRating.filter(r => r !== rating)
      : [...selectedRating, rating];
    setSelectedRating(newRating);
    updateFilters(priceRange, selectedBrands, selectedColors, newRating, inStockOnly);
  };

  const handleStockChange = () => {
    const newStock = !inStockOnly;
    setInStockOnly(newStock);
    updateFilters(priceRange, selectedBrands, selectedColors, selectedRating, newStock);
  };

  const updateFilters = (
    range: [number, number],
    brands: string[],
    colors: string[],
    rating: number[],
    stock: boolean
  ) => {
    onFilterChange({
      priceRange: range,
      brands,
      colors,
      rating,
      inStock: stock,
    });
  };

  const resetFilters = () => {
    setPriceRange([0, maxPrice]);
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedRating([]);
    setInStockOnly(false);
    updateFilters([0, maxPrice], [], [], [], false);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-300 flex flex-col h-full">
      <div className="p-6 border-b border-gray-300">
        <h3 className="text-lg font-bold text-black">Filter</h3>
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-300">
        <button
          onClick={() => toggleSection('price')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <h4 className="text-sm font-semibold text-black">Pris</h4>
          <svg className={`w-4 h-4 text-black transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </button>
        <div style={{ display: 'grid', gridTemplateRows: expandedSections.price ? '1fr' : '0fr', transition: 'grid-template-rows 0.25s ease' }}>
        <div style={{ overflow: 'hidden' }}>
        <div className="px-6 py-4 space-y-4 w-full overflow-hidden">
          <div className="price-slider-container w-full">
            <div className="price-slider-track bg-gray-300 rounded pointer-events-none">
              <div
                className="absolute h-1 bg-black rounded"
                style={{
                  top: 0,
                  left: `${(priceRange[0] / maxPrice) * 100}%`,
                  right: `${100 - (priceRange[1] / maxPrice) * 100}%`,
                }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={maxPrice}
              value={priceRange[0]}
              onChange={(e) => {
                const newMin = Number(e.target.value);
                if (newMin <= priceRange[1]) {
                  handlePriceChange('min', newMin);
                }
              }}
              className="price-input"
              aria-label="Lägsta pris"
            />
            <input
              type="range"
              min={0}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => {
                const newMax = Number(e.target.value);
                if (newMax >= priceRange[0]) {
                  handlePriceChange('max', newMax);
                }
              }}
              className="price-input"
              aria-label="Högsta pris"
            />
          </div>
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1">
              <input
                type="text"
                inputMode="numeric"
                value={priceRange[0].toLocaleString('sv-SE')}
                onChange={(e) => {
                  let input = e.target.value.replace(/\s/g, '');
                  if (input === '') input = '0';
                  const num = parseInt(input, 10) || 0;
                  setPriceRange([num, priceRange[1]]);
                  updateFilters([num, priceRange[1]], selectedBrands, selectedColors, selectedRating, inStockOnly);
                }}
                className="w-16 px-1 py-0.5 text-xs text-gray-700 text-center border-b border-gray-900 focus:outline-none focus:border-gray-900"
                aria-label="Lägsta pris i kronor"
              />
              <span className="text-gray-600">kr</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="text"
                inputMode="numeric"
                value={priceRange[1].toLocaleString('sv-SE')}
                onChange={(e) => {
                  let input = e.target.value.replace(/\s/g, '');
                  if (input === '') input = '0';
                  const num = parseInt(input, 10) || 0;
                  setPriceRange([priceRange[0], num]);
                  updateFilters([priceRange[0], num], selectedBrands, selectedColors, selectedRating, inStockOnly);
                }}
                className="w-16 px-1 py-0.5 text-xs text-gray-700 text-center border-b border-gray-900 focus:outline-none focus:border-gray-900"
                aria-label="Högsta pris i kronor"
              />
              <span className="text-gray-600">kr</span>
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>

      {/* Brands */}
      <div className="border-b border-gray-300">
        <button
          onClick={() => toggleSection('brands')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <h4 className="text-sm font-semibold text-black">Märke</h4>
          <svg className={`w-4 h-4 text-black transition-transform ${expandedSections.brands ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </button>
        <div style={{ display: 'grid', gridTemplateRows: expandedSections.brands ? '1fr' : '0fr', transition: 'grid-template-rows 0.25s ease' }}>
        <div style={{ overflow: 'hidden' }}>
        <div className="px-6 py-4 space-y-2">
          {uniqueBrands.length > 0 ? (
            uniqueBrands.map((brand, idx) => {
              const blackShades = ['bg-slate-200', 'bg-slate-300', 'bg-slate-400', 'bg-slate-500', 'bg-slate-600', 'bg-slate-700', 'bg-slate-800'];
              return (
                <button
                  key={brand}
                  onClick={() => handleBrandToggle(brand)}
                  className={`w-full text-left px-2.5 py-1 text-sm font-medium transition-colors ${
                    selectedBrands.includes(brand)
                      ? `${blackShades[idx % blackShades.length]} ${idx < 3 ? 'text-black' : 'text-white'}`
                      : 'text-gray-900'
                  }`}
                >
                  {brand}
                </button>
              );
            })
          ) : (
            <p className="text-xs text-gray-500">Inga märken tillgängliga</p>
          )}
        </div>
        </div>
        </div>
      </div>

      {/* Colors */}
      <div className="border-b border-gray-300">
        <button
          onClick={() => toggleSection('colors')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <h4 className="text-sm font-semibold text-black">Färg</h4>
          <svg className={`w-4 h-4 text-black transition-transform ${expandedSections.colors ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </button>
        <div style={{ display: 'grid', gridTemplateRows: expandedSections.colors ? '1fr' : '0fr', transition: 'grid-template-rows 0.25s ease' }}>
        <div style={{ overflow: 'hidden' }}>
        <div className="px-6 py-4 space-y-2">
          {uniqueColors.length > 0 ? (
            uniqueColors.map((color, idx) => {
              const blackShades = ['bg-slate-400', 'bg-slate-500', 'bg-slate-600', 'bg-slate-700'];
              const colorName = COLOR_MAP[color] || color;
              return (
                <button
                  key={color}
                  onClick={() => handleColorToggle(color)}
                  className={`w-full text-left px-2.5 py-1 text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedColors.includes(color)
                      ? `${blackShades[idx % blackShades.length]} ${idx < 2 ? 'text-white' : 'text-white'}`
                      : 'text-gray-900'
                  }`}
                >
                  {colorName}
                </button>
              );
            })
          ) : (
            <p className="text-xs text-gray-500">Inga färger tillgängliga</p>
          )}
        </div>
        </div>
        </div>
      </div>

      {/* Rating */}
      <div className="border-b border-gray-300">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <h4 className="text-sm font-semibold text-black">Betyg</h4>
          <svg className={`w-4 h-4 text-black transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </button>
        <div style={{ display: 'grid', gridTemplateRows: expandedSections.rating ? '1fr' : '0fr', transition: 'grid-template-rows 0.25s ease' }}>
        <div style={{ overflow: 'hidden' }}>
        <div className="px-6 py-4 space-y-2">
          {[5, 4, 3, 2, 1].map((rating, idx) => {
            const blackShades = ['bg-slate-400', 'bg-slate-500', 'bg-slate-600', 'bg-slate-700', 'bg-slate-800'];
            return (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`w-full text-left px-2.5 py-1 text-sm font-medium transition-colors flex items-center gap-1 ${
                  selectedRating.includes(rating)
                    ? `${blackShades[idx]} text-white`
                    : 'text-gray-900'
                }`}
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'} style={{ fontSize: '12px' }}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs">({rating})</span>
              </button>
            );
          })}
        </div>
        </div>
        </div>
      </div>

      {/* Stock Status */}
      <div className="border-b border-gray-300">
        <button
          onClick={() => toggleSection('stock')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <h4 className="text-sm font-semibold text-black">Lagerstatus</h4>
          <svg className={`w-4 h-4 text-black transition-transform ${expandedSections.stock ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </button>
        <div style={{ display: 'grid', gridTemplateRows: expandedSections.stock ? '1fr' : '0fr', transition: 'grid-template-rows 0.25s ease' }}>
        <div style={{ overflow: 'hidden' }}>
        <div className="px-6 py-4">
          <button
            onClick={handleStockChange}
            className={`w-full text-left px-2.5 py-1 text-sm font-medium transition-colors ${
              inStockOnly
                ? 'bg-slate-500 text-white'
                : 'text-gray-900'
            }`}
          >
            Endast i lager
          </button>
        </div>
        </div>
        </div>
      </div>

      {/* Reset Filters Button */}
      <div className="mt-auto p-6 border-t border-gray-300">
        <button
          onClick={resetFilters}
          className="w-full px-4 py-2 bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          Rensa filter
        </button>
      </div>
    </div>
  );
}
