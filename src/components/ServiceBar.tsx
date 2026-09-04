import React from 'react';
import { Truck, ShieldCheck, Headphones, CreditCard } from 'lucide-react';
import { FeatureBarItem } from '../types';

interface ServiceBarProps {
  items: FeatureBarItem[];
}

export const ServiceBar: React.FC<ServiceBarProps> = ({ items }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'truck':
        return <Truck className="w-8 h-8 text-[#EB3B5A]" />;
      case 'shield':
        return <ShieldCheck className="w-8 h-8 text-[#EB3B5A]" />;
      case 'headphones':
        return <Headphones className="w-8 h-8 text-[#EB3B5A]" />;
      case 'credit-card':
      default:
        return <CreditCard className="w-8 h-8 text-[#EB3B5A]" />;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="service-features-bar">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 jk-card-shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {items.map((item, index) => (
            <div 
              key={item.id || index} 
              className={`flex items-center gap-4 ${index !== 0 ? 'sm:pl-6 pt-4 sm:pt-0' : ''}`}
            >
              <div className="p-3 bg-rose-50 rounded-2xl shrink-0">
                {getIcon(item.icon)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 tracking-tight">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
