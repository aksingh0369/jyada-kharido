import React from 'react';
import { ShieldCheck, Sparkles, HeartHandshake, Zap, Target } from 'lucide-react';
import { SiteSettings } from '../types';

interface AboutViewProps {
  settings: SiteSettings;
  onExplore: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ settings, onExplore }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#F52D56] bg-rose-50 px-3 py-1 rounded-full">
          About Jyada Kharido
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-950 tracking-tight uppercase">
          Empowering Smarter Shopping with Handpicked Amazon Finds
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {settings.tagline} — We filter through millions of catalog listings on Amazon so you discover only top-rated, quality-verified products with genuine value.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 jk-card-shadow space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#EB3B5A] flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Curated, Not Automated</h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Our editorial curators review real verified purchases, battery endurance benchmarks, and build quality before listing any item on Jyada Kharido.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 jk-card-shadow space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">100% Real-Time Pricing</h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            We respect truth in pricing. Instead of showing misleading or outdated price tags, we connect you straight to live Amazon deals for genuine discounts.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 jk-card-shadow space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Amazon Prime Trust</h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Every transaction, delivery, customer support query, and return is safely processed by Amazon's world-class logistics and buyer protection.
          </p>
        </div>
      </div>

      {/* Story & Transparency */}
      <div className="bg-[#ECEEF0] rounded-3xl p-8 sm:p-12 lg:p-16 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black text-gray-950 uppercase tracking-tight">
              Why "Jyada Kharido"?
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              "Jyada Kharido" translates to <em>"Shop More, Save More"</em>. We believe that savvy shopping isn't about spending less on cheap throwaways; it's about buying better quality items that last longer, backed by transparent Amazon deals.
            </p>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              From flagship noise-cancelling headphones and ultraportable OLED laptops to gaming consoles and smart home devices, we bring the best of the web into an intuitive catalog.
            </p>
            <div className="pt-2">
              <button
                onClick={onExplore}
                className="px-6 py-3 rounded-full bg-[#EB3B5A] text-white text-xs font-bold shadow-md hover:bg-[#D82C4A] transition-all cursor-pointer"
              >
                Browse Curated Products
              </button>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-white p-6 shadow-sm border border-gray-200 space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Transparency & Associate Commitment
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {settings.affiliateDisclosure}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-gray-900">
              <HeartHandshake className="w-4 h-4 text-[#EB3B5A]" />
              <span>Built with passion for Indian shoppers.</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
