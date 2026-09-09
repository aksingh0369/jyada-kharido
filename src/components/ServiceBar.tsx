import React from 'react';
import { Truck, ShieldCheck, Headphones, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';
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
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 jk-card-shadow"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {items.map((item, index) => (
            <motion.div 
              key={item.id || index} 
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center gap-4 group cursor-default ${index !== 0 ? 'sm:pl-6 pt-4 sm:pt-0' : ''}`}
            >
              <motion.div 
                whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="p-3.5 bg-rose-50 rounded-2xl shrink-0 transition-colors group-hover:bg-rose-100"
              >
                {getIcon(item.icon)}
              </motion.div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 tracking-tight group-hover:text-[#EB3B5A] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
