import React, { useState } from 'react';
import { ArrowRight, Edit3, Grid2X2, Plus, RectangleVertical, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Category } from '../types';
import { SafeImage } from './SafeImage';
import { getCategoryImage } from '../utils/mediaUtils';

interface CategoryGridProps {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
  isAdmin?: boolean;
  onAddCategory?: () => void;
  onEditCategory?: (category: Category) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onSelectCategory,
  isAdmin,
  onAddCategory,
  onEditCategory
}) => {
  // Filter only active categories
  const displayCats = categories.filter(c => c.active);

  // Mobile layout state: 2 columns by default (Compact 9:16 vertical cards) or 1 column
  const [mobileColumns, setMobileColumns] = useState<1 | 2>(2);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" id="categories-section">
      {/* Header with Title and Mobile Layout Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight uppercase">
              Top Categories
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
              <Sparkles className="w-3 h-3 text-[#F52D56]" />
              16:9 Desktop View
            </span>
            {isAdmin && onAddCategory && (
              <button
                type="button"
                onClick={onAddCategory}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F52D56] hover:bg-[#D82C4A] text-white text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                title="Add New Category (Admin)"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add New Category</span>
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Handpicked curated collections with direct Amazon verified deals
          </p>
        </div>

        {/* Mobile View Toggle (9:16 Aspect Ratio in 2-col or 1-col) */}
        <div className="sm:hidden flex items-center justify-between pt-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Mobile (9:16)
          </span>
          <div className="inline-flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => setMobileColumns(2)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                mobileColumns === 2
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              title="2 Columns (Recommended)"
            >
              <Grid2X2 className="w-3.5 h-3.5" />
              <span>2-Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileColumns(1)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                mobileColumns === 1
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              title="1 Column Full"
            >
              <RectangleVertical className="w-3.5 h-3.5" />
              <span>Full</span>
            </button>
          </div>
        </div>
      </div>

      {/* 
        Responsive Category Cards:
        - Mobile (<640px): aspect-[9/16] (9:16 vertical ratio)
        - Desktop / Tablet (>=640px): sm:aspect-[16/9] (16:9 widescreen ratio)
        - Image fills entire card area 100% edge-to-edge
      */}
      <div 
        className={`grid ${
          mobileColumns === 1 ? 'grid-cols-1' : 'grid-cols-2'
        } sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6`}
      >
        {displayCats.map((cat, idx) => {
          const categoryImage = getCategoryImage(cat);
          
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: (idx % 6) * 0.07 }}
              whileHover={{ y: -6 }}
              onClick={() => onSelectCategory(cat)}
              className={`relative overflow-hidden rounded-3xl flex flex-col justify-between cursor-pointer group transition-shadow duration-300 hover:shadow-2xl aspect-[9/16] sm:aspect-[16/9] bg-gray-950 border border-gray-800/60 ${
                mobileColumns === 2 ? 'p-3.5 sm:p-7' : 'p-5 sm:p-7'
              }`}
            >
              {/* 
                Full Background Image:
                Fills 100% of card with object-cover - NO black cutoffs or blank areas
              */}
              <div className="absolute inset-0 z-0 overflow-hidden w-full h-full">
                <SafeImage
                  src={categoryImage}
                  alt={cat.name}
                  type="category"
                  entityId={cat.id}
                  containerClassName="w-full h-full absolute inset-0"
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* 
                  Subtle gradient overlay:
                  Keeps the photo bright and visible across the entire card,
                  while ensuring text and button at the bottom are 100% readable
                */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
                <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-black/75 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Top Tag / Subtitle & Admin Edit Button */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full font-extrabold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md border border-white/20 shadow-sm ${
                  mobileColumns === 2 ? 'text-[10px] px-2.5 py-0.5 sm:text-[11px] sm:px-3 sm:py-1' : 'text-[11px] px-3 py-1'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F52D56] animate-pulse" />
                  <span>{cat.shortLabel || 'Trending'}</span>
                </span>

                {isAdmin && onEditCategory && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditCategory(cat);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-gray-950 text-[11px] font-black shadow-md transition-colors cursor-pointer z-20"
                    title={`Edit ${cat.name} Category Settings`}
                  >
                    <Edit3 className="w-3 h-3 text-gray-900" />
                    <span>Edit</span>
                  </motion.button>
                )}
              </div>

              {/* Bottom Content: Category Title & Browse Pill */}
              <div className="relative z-10 space-y-2 sm:space-y-3">
                <div className="space-y-0.5 sm:space-y-1">
                  <h3 className={`font-black uppercase tracking-tight text-white leading-tight drop-shadow-md group-hover:text-rose-200 transition-colors ${
                    mobileColumns === 2 
                      ? 'text-base sm:text-2xl lg:text-3xl' 
                      : 'text-xl sm:text-2xl lg:text-3xl'
                  }`}>
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-xs text-gray-300 font-medium line-clamp-2 max-w-sm drop-shadow-sm opacity-90 hidden sm:block">
                      {cat.description}
                    </p>
                  )}
                </div>

                {/* Browse Pill Button */}
                <div className="pt-0.5 sm:pt-1">
                  <span
                    className={`rounded-full font-extrabold transition-all duration-200 group-hover:scale-105 shadow-md inline-flex items-center gap-1.5 cursor-pointer bg-white text-gray-900 group-hover:bg-[#F52D56] group-hover:text-white ${
                      mobileColumns === 2
                        ? 'px-3 py-1.5 sm:px-5 sm:py-2.5 text-[11px] sm:text-xs'
                        : 'px-4 sm:px-5 py-2 sm:py-2.5 text-xs'
                    }`}
                  >
                    <span>{cat.buttonText || 'Browse'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Admin Quick Action: + Add New Category card */}
        {isAdmin && onAddCategory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            onClick={onAddCategory}
            className={`relative overflow-hidden rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer group transition-all duration-300 hover:shadow-2xl aspect-[9/16] sm:aspect-[16/9] border-2 border-dashed border-rose-300/80 hover:border-[#F52D56] bg-rose-50/20 hover:bg-rose-50/50 p-6`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-[#F52D56] group-hover:text-white text-gray-700 shadow-sm border border-gray-200 flex items-center justify-center transition-all group-hover:scale-110 mb-2">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="text-sm sm:text-base font-black text-gray-900 group-hover:text-[#F52D56] uppercase tracking-wide">
              + Add New Category
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-1 max-w-[200px]">
              Admin Quick Action: Add a new Bento card collection
            </p>
            <span className="mt-3 px-3 py-1 rounded-full bg-white text-[#F52D56] border border-rose-200 text-[11px] font-bold shadow-2xs group-hover:bg-[#F52D56] group-hover:text-white transition-colors">
              Create Category →
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
};

