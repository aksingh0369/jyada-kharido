import React, { useState, useMemo } from 'react';
import { Search, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { SafeImage } from './SafeImage';
import { getProductImage } from '../utils/mediaUtils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.subcategory?.toLowerCase().includes(q) ||
      p.shortDescription?.toLowerCase().includes(q)
    );
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search headphones, smartwatches, laptops, brands..."
            autoFocus
            className="w-full text-base font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-full bg-gray-100 text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer shrink-0"
          >
            Esc
          </button>
        </div>

        {/* Search Results / Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 divide-y divide-gray-100">
          {query.trim() === '' ? (
            <div className="space-y-4 py-4 text-center sm:text-left">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {['Beats Solo 4', 'Amazfit Watch', 'OLED Laptop', 'PlayStation 5', 'Echo Dot', 'Sony ANC'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-rose-50 hover:text-[#F52D56] text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Found {searchResults.length} Products
              </p>
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="flex items-center gap-4 p-2.5 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gray-100 p-2 shrink-0 flex items-center justify-center">
                    <SafeImage
                      src={getProductImage(product)}
                      alt={product.name}
                      type="product"
                      entityId={product.id}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.brand}</span>
                      {product.discountPercent > 0 && (
                        <span className="text-[10px] font-bold text-[#EB3B5A] bg-rose-50 px-1.5 py-0.2 rounded-md">
                          {product.discountPercent}% OFF
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-[#EB3B5A] transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">{product.categoryName}</p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-2">
              <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-base font-bold text-gray-800">No products found</p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                We couldn't find any results for "{query}". Try checking your spelling or searching for generic terms like "earphones" or "laptop".
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
