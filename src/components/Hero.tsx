import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SiteSettings, Product } from '../types';

interface HeroProps {
  settings: SiteSettings;
  featuredProduct?: Product;
  onShopByCategory: () => void;
  onExploreProducts: () => void;
  onSelectProduct: (product: Product) => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  featuredProduct,
  onShopByCategory,
  onExploreProducts,
  onSelectProduct
}) => {
  const heroImage = featuredProduct?.primaryImage || settings.heroImage;
  const heroSub = featuredProduct?.brand || settings.heroSubheading || 'Beats Solo';
  const heroTitle = settings.heroHeading || 'Wireless';
  const heroBadge = settings.heroBadge || 'HEADPHONE';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
      <div 
        className="relative overflow-hidden rounded-3xl md:rounded-[36px] bg-[#ECEEF0] text-[#18191B] p-6 sm:p-10 lg:p-14 min-h-[480px] lg:min-h-[520px] flex flex-col justify-between"
        id="hero-banner-card"
      >
        {/* Giant Background Watermark Text inspired by Behance reference */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span className="text-[18vw] lg:text-[14vw] font-black tracking-tight text-white uppercase opacity-70 transform -translate-y-2 leading-none">
            {heroBadge}
          </span>
        </div>

        {/* Ambient background soft glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

        {/* Content Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Typography and CTAs */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm text-xs font-bold text-gray-700 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F52D56]" />
              <span>{heroSub}</span>
            </div>

            <div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#18191B] leading-none uppercase">
                {heroTitle}
              </h1>
              <p className="mt-2 text-xs sm:text-sm font-bold tracking-widest text-[#F52D56] uppercase">
                {settings.tagline || 'Best Finds • Better Deals • More Choices'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onShopByCategory}
                className="px-7 py-3.5 rounded-full bg-[#EB3B5A] hover:bg-[#D82C4A] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                id="btn-hero-shop-category"
              >
                <span>Shop By Category</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreProducts}
                className="px-6 py-3.5 rounded-full bg-white hover:bg-gray-100 text-[#18191B] font-bold text-sm shadow-xs border border-gray-200/60 transition-all cursor-pointer"
                id="btn-hero-explore"
              >
                Explore Products
              </button>
            </div>
          </div>

          {/* Center Column: Large Floating 3D Product Image with Realistic Shadow */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
            <div 
              onClick={() => featuredProduct && onSelectProduct(featuredProduct)}
              className="group cursor-pointer relative"
              title="Click to view details"
            >
              <img
                src={heroImage}
                alt={heroTitle}
                className="w-64 sm:w-80 lg:w-96 h-auto object-contain drop-shadow-2xl animate-float-slow transition-transform duration-500 group-hover:scale-105"
                loading="eager"
              />
              {/* Soft floor shadow */}
              <div className="w-48 sm:w-64 h-6 bg-black/15 blur-xl rounded-full mx-auto -mt-3 transform scale-90 transition-transform duration-500 group-hover:scale-100 group-hover:bg-black/20" />
            </div>
          </div>

          {/* Right Column: Refined Description Box */}
          <div className="lg:col-span-3 text-center lg:text-left space-y-2 lg:pl-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Description
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md mx-auto lg:max-w-none">
              {settings.heroDescription || 
                'Discover handpicked products across fashion, electronics, gadgets, and lifestyle. Direct Amazon affiliate verified deals with prime dispatch.'
              }
            </p>
            {featuredProduct && (
              <div className="pt-2">
                <button
                  onClick={() => onSelectProduct(featuredProduct)}
                  className="text-xs font-bold text-[#EB3B5A] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View Specifications</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
