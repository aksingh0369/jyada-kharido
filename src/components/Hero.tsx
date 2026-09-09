import React from 'react';
import { ArrowRight, Sparkles, Zap, ShieldCheck, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl md:rounded-[36px] bg-[#ECEEF0] text-[#18191B] p-6 sm:p-10 lg:p-14 min-h-[480px] lg:min-h-[520px] flex flex-col justify-between"
        id="hero-banner-card"
      >
        {/* Giant Background Watermark Text with subtle floating animation */}
        <motion.div 
          animate={{ x: [-10, 10, -10] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span className="text-[18vw] lg:text-[14vw] font-black tracking-tight text-white uppercase opacity-70 transform -translate-y-2 leading-none">
            {heroBadge}
          </span>
        </motion.div>

        {/* Ambient background soft animated glows */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" 
        />

        {/* Content Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Typography and CTAs */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-xs font-bold text-gray-800 shadow-xs border border-white/60"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F52D56] animate-pulse" />
              <span>{heroSub}</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#18191B] leading-none uppercase">
                {heroTitle}
              </h1>
              <motion.p 
                animate={{ opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mt-2 text-xs sm:text-sm font-extrabold tracking-widest text-[#F52D56] uppercase flex items-center justify-center lg:justify-start gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-[#F52D56]" />
                <span>{settings.tagline || 'Best Finds • Better Deals • More Choices'}</span>
              </motion.p>
            </motion.div>

            {/* Micro Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-[11px] font-semibold text-gray-600"
            >
              <span className="flex items-center gap-1 bg-white/60 px-2.5 py-1 rounded-full border border-gray-200/50">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified Deals
              </span>
              <span className="flex items-center gap-1 bg-white/60 px-2.5 py-1 rounded-full border border-gray-200/50">
                <TrendingUp className="w-3 h-3 text-[#F52D56]" />
                Direct Amazon Links
              </span>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={onShopByCategory}
                className="px-7 py-3.5 rounded-full bg-[#EB3B5A] hover:bg-[#D82C4A] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 group"
                id="btn-hero-shop-category"
              >
                <span>Shop By Category</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={onExploreProducts}
                className="px-6 py-3.5 rounded-full bg-white hover:bg-gray-50 text-[#18191B] font-bold text-sm shadow-xs border border-gray-200/80 transition-all cursor-pointer"
                id="btn-hero-explore"
              >
                Explore Products
              </motion.button>
            </motion.div>
          </div>

          {/* Center Column: Large Floating 3D Product Image with Realistic Animated Shadow */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              onClick={() => featuredProduct && onSelectProduct(featuredProduct)}
              className="group cursor-pointer relative"
              title="Click to view details"
            >
              {/* Floating 3D image with smooth motion bobbing */}
              <motion.div
                animate={{
                  y: [-8, 8, -8],
                  rotate: [-1, 1, -1]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <img
                  src={heroImage}
                  alt={heroTitle}
                  className="w-64 sm:w-80 lg:w-96 h-auto object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />

                {/* Floating Discount Tag if featuredProduct has discount */}
                {featuredProduct?.discountPercent && (
                  <motion.div 
                    animate={{ scale: [1, 1.08, 1], rotate: [-3, 3, -3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-2 right-4 bg-[#F52D56] text-white px-3 py-1 rounded-full text-xs font-black shadow-lg border-2 border-white"
                  >
                    {featuredProduct.discountPercent}% OFF
                  </motion.div>
                )}
              </motion.div>

              {/* Dynamic floor shadow scaling synchronously with the float */}
              <motion.div 
                animate={{
                  scale: [0.92, 1.05, 0.92],
                  opacity: [0.18, 0.1, 0.18]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-48 sm:w-64 h-6 bg-black blur-xl rounded-full mx-auto -mt-2"
              />
            </motion.div>
          </div>

          {/* Right Column: Refined Description Box */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-3 text-center lg:text-left space-y-2 lg:pl-4"
          >
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-center lg:justify-start gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F52D56]" />
              <span>Description</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md mx-auto lg:max-w-none">
              {settings.heroDescription || 
                'Discover handpicked products across fashion, electronics, gadgets, and lifestyle. Direct Amazon affiliate verified deals with prime dispatch.'
              }
            </p>
            {featuredProduct && (
              <div className="pt-2">
                <motion.button
                  whileHover={{ x: 3 }}
                  onClick={() => onSelectProduct(featuredProduct)}
                  className="text-xs font-bold text-[#EB3B5A] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View Specifications</span>
                  <ArrowRight className="w-3 h-3" />
                </motion.button>
              </div>
            )}
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};
