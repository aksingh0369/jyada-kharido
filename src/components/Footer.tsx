import React, { useState } from 'react';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { Logo } from './Logo';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200/80 pt-16 pb-12 mt-16 text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14">
          
          {/* Col 1: Brand Info & Mission (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div onClick={() => onNavigate('home')} className="cursor-pointer inline-block">
              <Logo variant="light" height={44} />
            </div>
            
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-sm">
              {settings.footerDescription || 
                'Jyada Kharido is India’s premier destination for discovering curated Amazon deals, trending electronics, wearable technology, and lifestyle finds. More Choices, Better Finds.'
              }
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a 
                href={settings.socialLinks.instagram} 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 rounded-full bg-gray-100 hover:bg-rose-50 hover:text-[#F52D56] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href={settings.socialLinks.facebook} 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 rounded-full bg-gray-100 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href={settings.socialLinks.twitter} 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 rounded-full bg-gray-100 hover:bg-sky-50 hover:text-sky-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href={settings.socialLinks.youtube} 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-600 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-500">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-black cursor-pointer">Home</button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-black cursor-pointer">Shop All</button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-black cursor-pointer">Categories</button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-black cursor-pointer">About Us</button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-black cursor-pointer">Blog</button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-black cursor-pointer">Contact Us</button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Categories (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900">
              Customer & Support
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-500">
              <li>
                <button onClick={() => onNavigate('wishlist')} className="hover:text-black cursor-pointer">My Wishlist</button>
              </li>
              <li>
                <a 
                  href="https://www.amazon.in/gp/help/customer/display.html" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-black inline-flex items-center gap-1"
                >
                  <span>Amazon Customer Service</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.amazon.in/gp/help/customer/display.html?nodeId=201819200" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-black inline-flex items-center gap-1"
                >
                  <span>Amazon Return & Refund Policy</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <span className="text-gray-400 block pt-1">Contact Email:</span>
                <span className="text-gray-800 font-bold">{settings.contactEmail}</span>
              </li>
              <li>
                <span className="text-gray-400 block">Support Line:</span>
                <span className="text-gray-800 font-bold">{settings.contactPhone}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter Box (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F52D56]">
              Subscribe To Our Email
            </span>
            <h4 className="text-sm sm:text-base font-black text-gray-900 tracking-tight leading-tight">
              For Latest News & Exclusive Updates
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Get weekly roundups of lightning deals, festive sales, and new gadget releases.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you! You are now subscribed.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative mt-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email Address"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-4 pr-12 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F52D56] focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#F52D56] text-white hover:bg-[#D82C4A] transition-colors cursor-pointer shadow-xs"
                  aria-label="Submit newsletter subscription"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Affiliate Disclosure Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-100 text-gray-500 text-xs leading-relaxed space-y-1.5 mb-8">
          <div className="flex items-center gap-1.5 font-bold text-gray-800">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Amazon Associate Disclaimer</span>
          </div>
          <p className="text-[11px] text-gray-500">
            {settings.affiliateDisclosure || 
              'As an Amazon Associate, Jyada Kharido earns from qualifying purchases. Certain content that appears on this site comes from Amazon Services LLC. This content is provided "as is" and is subject to change or removal at any time. Prices and product availability are subject to change.'
            }
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Jyada Kharido. All Rights Reserved.</p>
          <div className="flex items-center space-x-6 font-semibold">
            <span className="hover:text-gray-600 cursor-pointer" onClick={() => onNavigate('about')}>Privacy Policy</span>
            <span className="hover:text-gray-600 cursor-pointer" onClick={() => onNavigate('contact')}>Terms & Conditions</span>
            <span className="hover:text-gray-600 cursor-pointer" onClick={() => onNavigate('contact')}>Support</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
