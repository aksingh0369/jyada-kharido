import React, { useState, useMemo } from 'react';
import { Filter, ArrowUpDown, ArrowLeft } from 'lucide-react';
import { Category, Product } from '../types';
import { ProductCard } from './ProductCard';
import { SafeImage } from './SafeImage';
import { getCategoryImage } from '../utils/mediaUtils';

interface CategoryViewProps {
  category: Category;
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onViewProduct: (product: Product) => void;
  onBack: () => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  category,
  products,
  wishlist,
  onToggleWishlist,
  onViewProduct,
  onBack
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedDiscount, setSelectedDiscount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'discount' | 'alpha'>('featured');

  // Extract unique brands for filter
  const brands = useMemo(() => {
    const list = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
    return ['all', ...list];
  }, [products]);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedBrand !== 'all') {
      list = list.filter(p => p.brand === selectedBrand);
    }

    if (selectedDiscount > 0) {
      list = list.filter(p => p.discountPercent >= selectedDiscount);
    }

    switch (sortBy) {
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'discount':
        list.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case 'alpha':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return list;
  }, [products, selectedBrand, selectedDiscount, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-4 py-2 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Categories</span>
        </button>

        <nav className="hidden sm:flex items-center space-x-2 text-xs font-medium text-gray-500">
          <span className="hover:text-gray-900 cursor-pointer" onClick={onBack}>Home</span>
          <span>/</span>
          <span className="hover:text-gray-900 cursor-pointer" onClick={onBack}>Categories</span>
          <span>/</span>
          <span className="text-gray-900 font-bold">{category.name}</span>
        </nav>
      </div>

      {/* Category Banner Card */}
      <div 
        className="rounded-3xl p-6 sm:p-10 mb-8 text-white relative overflow-hidden flex flex-col justify-center min-h-[200px]"
        style={{ backgroundColor: category.bgColor }}
      >
        <div className="relative z-10 max-w-xl space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest opacity-80" style={{ color: category.textColor }}>
            {category.shortLabel || 'Curated Category'}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight" style={{ color: category.textColor }}>
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm font-medium opacity-90 leading-relaxed" style={{ color: category.textColor }}>
            {category.description || 'Explore our handpicked collection with live Amazon deals, verified reviews, and prime delivery.'}
          </p>
          <p className="text-xs font-bold pt-1 opacity-80" style={{ color: category.textColor }}>
            {filteredProducts.length} Products Found
          </p>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-end p-4 pointer-events-none opacity-40 sm:opacity-90">
          <SafeImage
            src={getCategoryImage(category)}
            alt={category.name}
            type="category"
            entityId={category.id}
            className="max-h-full max-w-full object-contain drop-shadow-xl transform scale-110"
          />
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="bg-white rounded-2xl p-4 mb-8 border border-gray-100 jk-card-shadow flex flex-wrap items-center justify-between gap-4">
        
        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
            <Filter className="w-3.5 h-3.5 text-[#EB3B5A]" />
            <span>Filters:</span>
          </div>

          {/* Brand select */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#EB3B5A] cursor-pointer"
          >
            {brands.map(b => (
              <option key={b} value={b}>
                {b === 'all' ? 'All Brands' : b}
              </option>
            ))}
          </select>

          {/* Discount select */}
          <select
            value={selectedDiscount}
            onChange={(e) => setSelectedDiscount(Number(e.target.value))}
            className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#EB3B5A] cursor-pointer"
          >
            <option value={0}>All Discounts</option>
            <option value={15}>15% or More Off</option>
            <option value={20}>20% or More Off</option>
            <option value={30}>30% or More Off</option>
          </select>
        </div>

        {/* Sort controls */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-semibold text-gray-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#EB3B5A] cursor-pointer"
          >
            <option value="featured">Featured First</option>
            <option value="newest">Newest Arrivals</option>
            <option value="discount">Highest Discount</option>
            <option value="alpha">Name (A-Z)</option>
          </select>
        </div>

      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              isWishlisted={wishlist.includes(prod.id)}
              onToggleWishlist={onToggleWishlist}
              onViewDetails={onViewProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-3">
          <p className="text-lg font-bold text-gray-800">No products available in this category yet.</p>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Try resetting your filters or check back later as our editorial team adds new Amazon affiliate finds.
          </p>
          <button
            onClick={() => {
              setSelectedBrand('all');
              setSelectedDiscount(0);
            }}
            className="px-5 py-2 rounded-full bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
};
