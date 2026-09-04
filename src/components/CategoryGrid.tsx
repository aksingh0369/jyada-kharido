import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Category } from '../types';
import { SafeImage } from './SafeImage';
import { getCategoryImage } from '../utils/mediaUtils';

interface CategoryGridProps {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onSelectCategory
}) => {
  // We arrange the top 6 categories in the exact bento layout from the Behance design
  // [1 col] [1 col] [2 col wide]
  // [2 col wide] [1 col] [1 col]
  const displayCats = categories.filter(c => c.active);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" id="categories-section">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight uppercase">
            Top Categories
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Handpicked curated collections with direct Amazon verified deals
          </p>
        </div>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayCats.map((cat, index) => {
          // Cards 2 and 3 in a 4-col layout can span 2 cols to mirror the Behance design
          const isWide = index === 2 || index === 3;
          const categoryImage = getCategoryImage(cat);
          
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[260px] sm:min-h-[290px] cursor-pointer group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                isWide ? 'sm:col-span-2 lg:col-span-2' : 'col-span-1'
              }`}
              style={{ backgroundColor: cat.bgColor }}
            >
              {/* Background ambient pattern */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

              {/* Text Information */}
              <div className="relative z-10 space-y-1 max-w-[65%]">
                <p 
                  className="text-xs sm:text-sm font-semibold tracking-wider uppercase opacity-80"
                  style={{ color: cat.textColor }}
                >
                  {cat.shortLabel || 'Trending'}
                </p>
                <h3 
                  className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight leading-tight"
                  style={{ color: cat.textColor }}
                >
                  {cat.name}
                </h3>
              </div>

              {/* Browse Pill Button */}
              <div className="relative z-10 pt-4">
                <button
                  className="px-5 py-2.5 rounded-full text-xs font-bold transition-transform duration-200 group-hover:scale-105 shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                  style={{ 
                    backgroundColor: cat.accentColor || '#FFFFFF',
                    color: cat.accentColor === '#FFFFFF' ? '#18191B' : '#FFFFFF'
                  }}
                >
                  <span>{cat.buttonText || 'Browse'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              {/* 3D Product Image emerging from right */}
              <div className="absolute right-0 bottom-0 top-0 w-1/2 flex items-center justify-end p-2 pointer-events-none">
                <SafeImage
                  src={categoryImage}
                  alt={cat.name}
                  type="category"
                  entityId={cat.id}
                  className="max-h-[85%] max-w-[95%] object-contain drop-shadow-xl transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
