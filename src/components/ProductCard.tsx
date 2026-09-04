import React from 'react';
import { Heart, ExternalLink, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { SafeImage } from './SafeImage';
import { getProductImage } from '../utils/mediaUtils';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onViewDetails
}) => {
  const displayImage = getProductImage(product);
  const primaryAffiliateUrl = 
    product.affiliateLink || 
    product.affiliateUrl || 
    product.platformLinks?.find(p => p.isPrimary)?.url ||
    product.platformLinks?.[0]?.url ||
    'https://www.amazon.in/?tag=jyadakharido-21';

  return (
    <div 
      className="group relative bg-white rounded-3xl p-5 flex flex-col justify-between border border-gray-100 jk-card-shadow jk-card-hover"
      id={`product-card-${product.id}`}
    >
      {/* Top badges and Wishlist Button */}
      <div className="flex items-center justify-between w-full relative z-10">
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.discountPercent > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-[#EB3B5A] text-white text-[10px] font-extrabold uppercase tracking-wide shadow-xs">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wide">
              New
            </span>
          )}
          {product.featured && (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wide">
              Featured
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
            isWishlisted 
              ? 'bg-rose-50 text-[#F52D56]' 
              : 'bg-gray-100 text-gray-500 hover:text-[#F52D56] hover:bg-rose-50'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#F52D56]' : ''}`} />
        </button>
      </div>

      {/* Image Container inspired by Behance clean card layout */}
      <div 
        onClick={() => onViewDetails(product)}
        className="relative my-4 aspect-square rounded-2xl bg-[#ECEEF0]/60 flex items-center justify-center p-6 overflow-hidden cursor-pointer"
      >
        <SafeImage
          src={displayImage}
          alt={product.name}
          type="product"
          entityId={product.id}
          className="max-h-full max-w-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110"
        />

        {/* Quick View overlay on hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-gray-900 text-xs font-bold shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-[#EB3B5A]" />
            Quick View
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-1.5 pt-1">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider truncate">
          {product.brand} • {product.categoryName}
        </p>
        <h3 
          onClick={() => onViewDetails(product)}
          className="text-sm sm:text-base font-bold text-gray-900 leading-snug line-clamp-2 hover:text-[#EB3B5A] transition-colors cursor-pointer"
          title={product.name}
        >
          {product.name}
        </h3>
      </div>

      {/* Action Buttons - NO PRICES DISPLAYED PER MANDATORY REQUIREMENT */}
      <div className="pt-4 space-y-2">
        {/* Primary Affiliate Button */}
        <a
          href={primaryAffiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="w-full py-2.5 px-4 rounded-xl amazon-cta-btn flex items-center justify-center gap-1.5 text-xs tracking-tight text-center cursor-pointer"
          title="Opens Amazon in a new tab"
        >
          <ShoppingBag className="w-4 h-4 shrink-0" />
          <span className="truncate">Check Current Price on Amazon</span>
          <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
        </a>

        {/* Secondary View Details Button */}
        <button
          onClick={() => onViewDetails(product)}
          className="w-full py-2 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>View Product Specifications</span>
        </button>
      </div>

    </div>
  );
};
