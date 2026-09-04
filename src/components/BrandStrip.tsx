import React from 'react';

export const BrandStrip: React.FC = () => {
  const brands = [
    { name: 'GOLDEN', style: 'font-serif tracking-widest' },
    { name: 'SWEETY', style: 'tracking-[0.3em] font-light' },
    { name: 'FASTLANE', style: 'tracking-[0.2em] font-extrabold italic' },
    { name: 'MIGHTY', style: 'tracking-widest font-semibold' },
    { name: 'JACK ROLLER', style: 'tracking-[0.25em] font-bold' },
    { name: 'BEATS', style: 'tracking-widest font-black' }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-y border-gray-200/70 py-8">
        <p className="text-center text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-6">
          Featured Brand Partners & Ecosystems
        </p>
        <div className="flex flex-wrap items-center justify-around gap-8 sm:gap-12 opacity-40 hover:opacity-80 transition-opacity">
          {brands.map((b, i) => (
            <span 
              key={i} 
              className={`text-lg sm:text-2xl text-gray-800 select-none ${b.style}`}
            >
              {b.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
