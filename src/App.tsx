import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  Filter, 
  Flame, 
  TrendingUp,
  Tag,
  Lock
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryGrid } from './components/CategoryGrid';
import { ServiceBar } from './components/ServiceBar';
import { PromoBanner } from './components/PromoBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailView } from './components/ProductDetailView';
import { CategoryView } from './components/CategoryView';
import { WishlistView } from './components/WishlistView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { BlogView } from './components/BlogView';
import { BlogSection } from './components/BlogSection';
import { BrandStrip } from './components/BrandStrip';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { DeveloperDashboard } from './components/DeveloperDashboard';

import { Product, Category, Festival, Blog, SiteSettings, UserProfile } from './types';
import { StorageService } from './services/storageService';
import { AuthService } from './services/authService';

export default function App() {
  // Global Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [activeFestival, setActiveFestival] = useState<Festival | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());
  const [blogs, setBlogs] = useState<Blog[]>([]);

  // User & Wishlist
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Navigation / Page Routing
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  // Home Products Filter Tab
  const [homeProductFilter, setHomeProductFilter] = useState<string>('all');

  // Modals
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  // Load / Refresh Data
  const refreshData = () => {
    const prods = StorageService.getProducts(true);
    const cats = StorageService.getCategories(true);
    const fests = StorageService.getFestivals();
    const actFest = StorageService.getActiveFestival();
    const sett = StorageService.getSettings();
    const blgs = StorageService.getBlogs();

    setProducts(prods);
    setCategories(cats);
    setFestivals(fests);
    setActiveFestival(actFest);
    setSettings(sett);
    setBlogs(blgs);

    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    setWishlist(AuthService.getWishlist());
  };

  useEffect(() => {
    refreshData();

    // Check URL parameters for direct linking (e.g. ?product=id or ?category=cat or ?page=shop)
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get('product') || params.get('id');
    const catSlug = params.get('category');
    const pageParam = params.get('page');

    if (prodId) {
      const found = StorageService.getProductById(prodId);
      if (found) {
        setSelectedProduct(found);
        setCurrentPage('product-detail');
      }
    } else if (catSlug) {
      const cats = StorageService.getCategories();
      const found = cats.find(c => c.slug === catSlug || c.id === catSlug);
      if (found) {
        setSelectedCategory(found);
        setCurrentPage('category-detail');
      }
    } else if (pageParam) {
      setCurrentPage(pageParam);
    }
  }, []);

  // Update browser URL query without reload
  const navigate = (page: string, params?: Record<string, string>) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const url = new URL(window.location.href);
    url.searchParams.delete('product');
    url.searchParams.delete('id');
    url.searchParams.delete('category');
    url.searchParams.delete('page');

    if (page !== 'home') {
      url.searchParams.set('page', page);
    }

    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }

    window.history.pushState({}, '', url.toString());
  };

  // Wishlist handler
  const handleToggleWishlist = (productId: string) => {
    const updated = AuthService.toggleWishlist(productId);
    setWishlist(updated);
  };

  // Select Product
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    navigate('product-detail', { id: product.id });
  };

  // Select Category
  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    navigate('category-detail', { category: category.slug });
  };

  // Home filter tabs
  const homeFilteredProducts = useMemo(() => {
    const activeProducts = products.filter(p => p.active);
    if (homeProductFilter === 'all') {
      return activeProducts.slice(0, 8);
    }
    if (homeProductFilter === 'featured') {
      return activeProducts.filter(p => p.featured);
    }
    if (homeProductFilter === 'new') {
      return activeProducts.filter(p => p.isNew);
    }
    return activeProducts.filter(p => p.categoryId === homeProductFilter || p.categoryName.toLowerCase() === homeProductFilter.toLowerCase());
  }, [products, homeProductFilter]);

  // Active festival theme class
  const festivalThemeClass = activeFestival ? `theme-${activeFestival.theme}` : '';

  return (
    <div className={`min-h-screen flex flex-col bg-[#FAFBFD] text-gray-900 font-sans selection:bg-[#F52D56] selection:text-white ${festivalThemeClass}`}>
      
      {/* Universal Top Navigation */}
      <Navbar
        currentUser={currentUser}
        wishlistCount={wishlist.length}
        activeFestival={activeFestival}
        settings={settings}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        onNavigate={navigate}
        currentPage={currentPage}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">

        {/* 1. DEVELOPER / ADMIN CMS DASHBOARD */}
        {currentPage === 'dashboard' && (
          currentUser?.role === 'admin' ? (
            <DeveloperDashboard
              products={products}
              categories={categories}
              festivals={festivals}
              blogs={blogs}
              settings={settings}
              onRefreshData={refreshData}
              onClose={() => navigate('home')}
            />
          ) : (
            <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-gray-200 text-center shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-gray-900 uppercase">Admin Access Restricted</h2>
              <p className="text-xs text-gray-500">
                Visitor accounts are disabled. You must be logged in with an authorized Administrator account to view the Developer CMS.
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => navigate('home')}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  Return Home
                </button>
                <button
                  onClick={() => setAuthOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#F52D56] hover:bg-[#D82C4A] text-white text-xs font-bold cursor-pointer"
                >
                  Admin Login
                </button>
              </div>
            </div>
          )
        )}

        {/* 2. PRODUCT DETAIL VIEW */}
        {currentPage === 'product-detail' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            isWishlisted={wishlist.includes(selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            onBack={() => navigate('home')}
            onSelectCategory={(catId) => {
              const cat = categories.find(c => c.id === catId);
              if (cat) handleSelectCategory(cat);
            }}
          />
        )}

        {/* 3. CATEGORY SPECIFIC VIEW */}
        {currentPage === 'category-detail' && selectedCategory && (
          <CategoryView
            category={selectedCategory}
            products={products.filter(p => p.categoryId === selectedCategory.id && p.active)}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onViewProduct={handleSelectProduct}
            onBack={() => navigate('categories')}
          />
        )}

        {/* 4. ALL CATEGORIES DIRECTORY */}
        {currentPage === 'categories' && (
          <div className="py-8">
            <CategoryGrid
              categories={categories}
              onSelectCategory={handleSelectCategory}
            />
          </div>
        )}

        {/* 5. SHOP ALL / PRODUCT CATALOG */}
        {currentPage === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
                  Shop Verified Deals
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Browse {products.filter(p => p.active).length} handpicked Amazon products across electronics, fashion, and gadgets
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                <button
                  onClick={() => setHomeProductFilter('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                    homeProductFilter === 'all' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  All Items
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setHomeProductFilter(cat.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                      homeProductFilter === cat.id 
                        ? 'bg-[#EB3B5A] text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products
                .filter(p => p.active && (homeProductFilter === 'all' || p.categoryId === homeProductFilter))
                .map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    isWishlisted={wishlist.includes(prod.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onViewDetails={handleSelectProduct}
                  />
                ))}
            </div>
          </div>
        )}

        {/* 6. WISHLIST VIEW */}
        {currentPage === 'wishlist' && (
          <WishlistView
            wishlistIds={wishlist}
            products={products}
            onRemoveFromWishlist={handleToggleWishlist}
            onViewProduct={handleSelectProduct}
            onContinueShopping={() => navigate('shop')}
          />
        )}

        {/* 7. ABOUT US VIEW */}
        {currentPage === 'about' && (
          <AboutView
            settings={settings}
            onExplore={() => navigate('shop')}
          />
        )}

        {/* 8. CONTACT US VIEW */}
        {currentPage === 'contact' && (
          <ContactView settings={settings} />
        )}

        {/* 9. BLOG / JOURNAL VIEW */}
        {currentPage === 'blog' && (
          <BlogView
            blogs={blogs}
            initialBlog={selectedBlog}
            onBack={() => navigate('home')}
          />
        )}

        {/* 10. HOMEPAGE (Faithfully executing the Behance Layout) */}
        {currentPage === 'home' && (
          <div className="space-y-4 sm:space-y-6">
            
            {/* HERO SECTION (Beats Solo Wireless Headphone) */}
            <Hero
              settings={settings}
              featuredProduct={products.find(p => p.id === 'prod-beats-solo-4') || products[0]}
              onShopByCategory={() => {
                const element = document.getElementById('categories-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreProducts={() => navigate('shop')}
              onSelectProduct={handleSelectProduct}
            />

            {/* TOP BENTO CATEGORIES (6 Categories from Behance 1 & 2) */}
            <CategoryGrid
              categories={categories}
              onSelectCategory={handleSelectCategory}
            />

            {/* SERVICE FEATURE BAR (Free Shipping, Money Guarantee, etc.) */}
            <ServiceBar items={settings.featureBarItems} />

            {/* PROMOTIONAL BANNER 1 (Red / Fine Smile - 20% OFF) */}
            <PromoBanner
              variant="red"
              discountText="20% OFF"
              headline="FINE SMILE"
              dateRange="15 Nov To 7 Dec"
              productSubtitle="Beats Solo Air"
              title="Winter Deal Rush"
              description="Explore premium audio deals with crystal clarity and 50-hour spatial audio endurance on Amazon India."
              image="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80"
              buttonText="Shop Now"
              onCtaClick={() => navigate('shop')}
            />

            {/* BEST SELLER PRODUCTS SECTION (Behance Screenshot 2) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="best-seller-section">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-[#EB3B5A]" />
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-950 uppercase tracking-tight">
                      Best Seller Products
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                    Customer favorites and top-rated Amazon Prime verified electronics
                  </p>
                </div>

                {/* Quick filter pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {[
                    { id: 'all', label: 'All Products' },
                    { id: 'featured', label: 'Featured' },
                    { id: 'new', label: 'New Arrivals' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setHomeProductFilter(filter.id)}
                      className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                        homeProductFilter === filter.id
                          ? 'bg-[#EB3B5A] text-white shadow-sm'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {homeFilteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    isWishlisted={wishlist.includes(prod.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onViewDetails={handleSelectProduct}
                  />
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center pt-10">
                <button
                  onClick={() => navigate('shop')}
                  className="px-8 py-3.5 rounded-full bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>View All Amazon Deals</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* PROMOTIONAL BANNER 2 (Emerald / Happy Hours OR Active Festival) */}
            <PromoBanner
              variant={activeFestival ? 'festival' : 'green'}
              festival={activeFestival}
              discountText={activeFestival ? 'FESTIVE SPECIAL' : '20% OFF'}
              headline={activeFestival ? activeFestival.bannerHeadline : 'HAPPY HOURS'}
              dateRange="Special Limited Time Offer"
              productSubtitle="Smart Lifestyle Gadgets"
              title={activeFestival ? `${activeFestival.name} Mega Deals` : 'Fitness & Audio'}
              description={activeFestival ? activeFestival.bannerSubtext : 'High precision sensors, AMOLED displays, and extended battery backup with fast dispatch.'}
              image="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&auto=format&fit=crop&q=80"
              buttonText="Check Deals"
              onCtaClick={() => navigate('shop')}
            />

            {/* RECENT NEWS / BLOG SECTION (Behance Screenshot 3) */}
            <BlogSection
              blogs={blogs}
              onSelectBlog={(blog) => {
                setSelectedBlog(blog);
                navigate('blog');
              }}
            />

            {/* BRAND PARTNER LOGO STRIP (Behance Screenshot 3) */}
            <BrandStrip />

          </div>
        )}

      </main>

      {/* Universal Footer */}
      <Footer
        settings={settings}
        onNavigate={navigate}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={products.filter(p => p.active)}
        onSelectProduct={handleSelectProduct}
      />

      {/* Authentication Modal with Trusted Contact Name Recovery */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          refreshData();
        }}
      />

    </div>
  );
}
