import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Heart, 
  User, 
  Menu, 
  X, 
  ShoppingBag, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Logo } from './Logo';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Festival, SiteSettings } from '../types';
import { AuthService } from '../services/authService';
import { normalizeAffiliateUrl } from '../utils/mediaUtils';

interface NavbarProps {
  currentUser: UserProfile | null;
  wishlistCount: number;
  activeFestival: Festival | null;
  settings?: SiteSettings;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onOpenAiAssistant?: () => void;
  onNavigate: (page: string, params?: Record<string, string>) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  wishlistCount,
  activeFestival,
  settings,
  onOpenSearch,
  onOpenAuth,
  onOpenAiAssistant,
  onNavigate,
  currentPage
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const rawAmazonUrl = settings?.amazonStoreUrl || 'https://www.amazon.in/?tag=jyadakharido-21';
  const amazonUrl = normalizeAffiliateUrl(rawAmazonUrl);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    window.location.reload();
  };

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'shop' },
    { label: 'Categories', page: 'categories' },
    { label: 'About Us', page: 'about' },
    { label: 'Contact Us', page: 'contact' },
  ];

  return (
    <>
      {/* Active Festival Top Notification Bar if enabled */}
      {activeFestival && (
        <div 
          className="w-full text-xs font-semibold py-1.5 px-4 text-center text-white flex items-center justify-center gap-2 transition-colors relative z-50 overflow-hidden shadow-sm"
          style={{ background: activeFestival.bannerBg }}
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-200 shrink-0" />
          <span>
            <strong>{activeFestival.name} Special:</strong> {activeFestival.bannerSubtext}
          </span>
          <button 
            onClick={() => onNavigate('shop', { filter: 'festival' })}
            className="underline underline-offset-2 ml-1 text-white hover:text-amber-100 font-bold cursor-pointer"
          >
            Explore Deals
          </button>
        </div>
      )}

      {/* Main Header */}
      <header 
        className={`w-full sticky top-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-2.5 border-b border-gray-100' 
            : 'bg-white py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Brand Logo */}
            <motion.div 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('home')} 
              className="cursor-pointer flex items-center shrink-0"
              id="navbar-brand-logo"
            >
              <Logo variant="light" height={44} />
            </motion.div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => {
                const isActive = currentPage === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => onNavigate(link.page)}
                    className={`text-sm font-semibold transition-colors relative py-1 cursor-pointer ${
                      isActive 
                        ? 'text-[#F52D56]' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span 
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F52D56] rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                  </button>
                );
              })}

              {/* Developer / Admin Dashboard Link */}
              {currentUser?.role === 'admin' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate('dashboard')}
                  className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                    currentPage === 'dashboard'
                      ? 'bg-[#18191B] text-white'
                      : 'bg-rose-50 text-[#F52D56] hover:bg-rose-100'
                  }`}
                  title="Open Admin & Developer CMS Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                  <span>Admin CMS</span>
                </motion.button>
              )}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* AI Deals Guide Button */}
              {onOpenAiAssistant && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onOpenAiAssistant}
                  className="px-2.5 py-1.5 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200/90 text-purple-700 hover:text-purple-900 flex items-center gap-1.5 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  title="Ask Jyada Kharido AI Shopping Guide"
                  id="btn-nav-ai-guide"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                  <span className="hidden sm:inline">AI Guide</span>
                </motion.button>
              )}

              {/* Global Search Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onOpenSearch}
                className="p-2 text-gray-600 hover:text-[#F52D56] hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
                title="Search products, brands, categories"
                aria-label="Search"
                id="btn-nav-search"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Wishlist Heart Icon */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onNavigate('wishlist')}
                className="p-2 text-gray-600 hover:text-[#F52D56] hover:bg-gray-50 rounded-full transition-colors relative cursor-pointer"
                title="Your Wishlist"
                aria-label="Wishlist"
                id="btn-nav-wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-[#F52D56] fill-[#F52D56]' : ''}`} />
                {wishlistCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-[#F52D56] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </motion.button>

              {/* User Account / Login */}
              <div className="relative">
                {currentUser ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                      id="btn-user-menu"
                    >
                      <span className="text-xs font-semibold text-gray-700 max-w-[100px] truncate hidden md:inline-block">
                        {currentUser.email.split('@')[0]}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#F52D56] to-[#FF9900] text-white font-bold text-xs flex items-center justify-center">
                        {currentUser.email[0].toUpperCase()}
                      </div>
                    </button>

                    <AnimatePresence>
                      {userDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50"
                        >
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-xs text-gray-400">Signed in as</p>
                            <p className="text-sm font-semibold text-gray-800 truncate">{currentUser.email}</p>
                            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-[#F52D56]">
                              {currentUser.role}
                            </span>
                          </div>

                          {currentUser.role === 'admin' && (
                            <button
                              onClick={() => {
                                setUserDropdownOpen(false);
                                onNavigate('dashboard');
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium cursor-pointer"
                            >
                              <ShieldCheck className="w-4 h-4 text-[#F52D56]" />
                              Developer Dashboard
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onNavigate('wishlist');
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <Heart className="w-4 h-4 text-gray-400" />
                            My Wishlist ({wishlistCount})
                          </button>

                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium cursor-pointer border-t border-gray-100 mt-1"
                          >
                            <LogOut className="w-4 h-4 text-red-500" />
                            Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onOpenAuth}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-300 text-xs font-bold text-gray-700 hover:text-black hover:border-black hover:bg-gray-50 transition-all cursor-pointer"
                    id="btn-login"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F52D56]" />
                    <span>Admin</span>
                  </motion.button>
                )}
              </div>

              {/* Amazon Shopping Direct Button */}
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#FF9900]/15 text-[#B25900] hover:bg-[#FF9900]/25 transition-colors cursor-pointer"
                title="Open Amazon Official Store"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Amazon</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </motion.a>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg focus:outline-none cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-2 shadow-lg overflow-hidden"
            >
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.page}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate(link.page);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                      currentPage === link.page
                        ? 'bg-rose-50 text-[#F52D56]'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </button>
                ))}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (currentUser?.role === 'admin') {
                      onNavigate('dashboard');
                    } else {
                      onOpenAuth();
                    }
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold bg-gray-900 text-white flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#F52D56]" />
                    {currentUser?.role === 'admin' ? 'Developer CMS Dashboard' : 'Admin Login & CMS'}
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>
              </div>

              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                <a
                  href={amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center bg-[#FF9900] text-gray-950 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Directly on Amazon.in</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
