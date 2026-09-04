import React from 'react';
import { Heart, Trash2, ShoppingBag, ExternalLink, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { SafeImage } from './SafeImage';
import { getProductImage } from '../utils/mediaUtils';

interface WishlistViewProps {
  wishlistIds: string[];
  products: Product[];
  onRemoveFromWishlist: (id: string) => void;
  onViewProduct: (product: Product) => void;
  onContinueShopping: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  wishlistIds,
  products,
  onRemoveFromWishlist,
  onViewProduct,
  onContinueShopping
}) => {
  const wishlistedProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-[#F52D56] fill-[#F52D56]" />
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 uppercase tracking-tight">
              My Saved Wishlist
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            {wishlistedProducts.length} items saved for quick price checks and deals
          </p>
        </div>

        <button
          onClick={onContinueShopping}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-black bg-white border border-gray-200 px-4 py-2 rounded-full shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {/* Wishlist Items Grid */}
      {wishlistedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistedProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl p-5 border border-gray-100 jk-card-shadow flex flex-col justify-between group"
            >
              <div>
                {/* Top remove button */}
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{prod.brand}</span>
                  <button
                    onClick={() => onRemoveFromWishlist(prod.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Product image */}
                <div 
                  onClick={() => onViewProduct(prod)}
                  className="aspect-square rounded-2xl bg-gray-50 p-4 flex items-center justify-center cursor-pointer mb-4"
                >
                  <SafeImage
                    src={getProductImage(prod)}
                    alt={prod.name}
                    type="product"
                    entityId={prod.id}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <h3 
                  onClick={() => onViewProduct(prod)}
                  className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 hover:text-[#EB3B5A] transition-colors cursor-pointer"
                >
                  {prod.name}
                </h3>
              </div>

              {/* Actions - NO PRICES */}
              <div className="pt-4 space-y-2">
                <a
                  href={prod.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl amazon-cta-btn flex items-center justify-center gap-1.5 text-xs text-center cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="truncate">Check Current Price on Amazon</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>

                <button
                  onClick={() => onViewProduct(prod)}
                  className="w-full py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  View Details
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-[#F52D56] flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-gray-900">Your wishlist is empty</h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Browse our handpicked collections and click the heart icon on any product to save it here for fast access.
          </p>
          <button
            onClick={onContinueShopping}
            className="px-6 py-3 rounded-full bg-[#F52D56] text-white text-xs font-bold shadow-md hover:bg-[#D82C4A] transition-all cursor-pointer"
          >
            Explore Trending Finds
          </button>
        </div>
      )}

    </div>
  );
};
