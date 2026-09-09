import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Festival } from '../types';

interface PromoBannerProps {
  variant?: 'red' | 'green' | 'festival';
  discountText?: string;
  headline?: string;
  dateRange?: string;
  productSubtitle?: string;
  title?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  festival?: Festival | null;
  onCtaClick: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  variant = 'red',
  discountText = '20% OFF',
  headline = 'FINE SMILE',
  dateRange = '15 Nov To 7 Dec',
  productSubtitle = 'Beats Solo Air',
  title = 'Festive Sale',
  description = 'Handpicked Amazon deals curated daily with exclusive discounts and Prime delivery benefits.',
  image = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80',
  buttonText = 'Shop Now',
  festival,
  onCtaClick
}) => {
  // Determine styles based on variant or active festival
  let bgGradient = 'linear-gradient(135deg, #EB3B5A 0%, #D82C4A 100%)';
  let badgeColor = 'text-white/80';
  let displayImage = image;
  let finalHeadline = headline;
  let finalTitle = title;
  let finalDesc = description;

  if (variant === 'festival' && festival) {
    bgGradient = festival.bannerBg;
    finalHeadline = festival.bannerHeadline;
    finalTitle = `${festival.name} Curated Finds`;
    finalDesc = festival.bannerSubtext;
    if (festival.bannerImage) displayImage = festival.bannerImage;
  } else if (variant === 'green') {
    bgGradient = 'linear-gradient(135deg, #2ED573 0%, #10AC84 100%)';
    finalHeadline = 'HAPPY HOURS';
    displayImage = 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&auto=format&fit=crop&q=80';
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-3xl sm:rounded-[36px] p-6 sm:p-10 lg:p-14 text-white overflow-visible min-h-[340px] flex flex-col justify-center shadow-xl"
        style={{ background: bgGradient }}
      >
        {/* Background ambient sparkles with rotation */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-4 right-8 opacity-20 pointer-events-none"
        >
          <Sparkles className="w-16 h-16" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Column: Big typography */}
          <div className="lg:col-span-4 space-y-2 text-center lg:text-left order-2 lg:order-1">
            <span className={`inline-block text-xs sm:text-sm font-black tracking-wider uppercase px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm ${badgeColor}`}>
              {discountText}
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none">
              {finalHeadline}
            </h2>
            <p className="text-xs sm:text-sm font-medium opacity-85 pt-1">
              {dateRange}
            </p>
          </div>

          {/* Center Column: 3D Floating Product overlapping the container */}
          <div className="lg:col-span-4 flex justify-center order-1 lg:order-2 my-4 lg:my-0">
            <motion.div 
              className="relative group cursor-pointer" 
              onClick={onCtaClick}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                animate={{ y: [-6, 6, -6], rotate: [-0.5, 0.5, -0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                src={displayImage}
                alt={finalHeadline}
                className="w-56 sm:w-72 lg:w-80 h-auto object-contain drop-shadow-2xl"
                loading="lazy"
              />
              <motion.div 
                animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.3, 0.18, 0.3] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="w-40 sm:w-52 h-4 bg-black blur-lg rounded-full mx-auto -mt-2" 
              />
            </motion.div>
          </div>

          {/* Right Column: Details & Shop Button */}
          <div className="lg:col-span-4 space-y-3 text-center lg:text-left order-3">
            <p className="text-xs sm:text-sm font-bold tracking-wider opacity-80 uppercase">
              {productSubtitle}
            </p>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {finalTitle}
            </h3>
            <p className="text-xs sm:text-sm opacity-85 leading-relaxed line-clamp-3">
              {finalDesc}
            </p>
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={onCtaClick}
                className="px-8 py-3 rounded-full bg-white text-[#18191B] hover:bg-gray-100 font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2 group"
              >
                <span>{buttonText}</span>
                <ArrowRight className="w-4 h-4 text-[#EB3B5A] transition-transform group-hover:translate-x-1" />
              </motion.button>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
};
