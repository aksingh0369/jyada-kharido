import { Product, Category, Festival, Blog, SiteSettings } from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_FESTIVALS, 
  INITIAL_BLOGS, 
  INITIAL_SITE_SETTINGS 
} from '../data/initialData';
import { 
  getProductImage, 
  getProductGalleryImages, 
  getCategoryImage, 
  isValidMediaUrl,
  validateVideoFile,
  PRODUCT_PLACEHOLDER,
  CATEGORY_PLACEHOLDER 
} from '../utils/mediaUtils';

const PRODUCTS_KEY = 'jyada_kharido_products';
const CATEGORIES_KEY = 'jyada_kharido_categories';
const FESTIVALS_KEY = 'jyada_kharido_festivals';
const BLOGS_KEY = 'jyada_kharido_blogs';
const SETTINGS_KEY = 'jyada_kharido_settings';

export class StorageService {
  // -------------------------------------------------------------
  // PRODUCTS
  // -------------------------------------------------------------
  public static getProducts(includeInactive: boolean = false): Product[] {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    let list: Product[] = [];
    if (!raw) {
      list = INITIAL_PRODUCTS;
      try {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
      } catch (e) {
        console.warn('Storage write error on initial products:', e);
      }
    } else {
      try {
        list = JSON.parse(raw);
        if (!Array.isArray(list) || list.length === 0) {
          list = INITIAL_PRODUCTS;
        } else {
          // If stored products list is missing any of the baseline initial products, merge them so categories are populated
          const existingIds = new Set(list.map(p => p.id));
          const missingBaselines = INITIAL_PRODUCTS.filter(p => !existingIds.has(p.id));
          if (missingBaselines.length > 0) {
            list = [...list, ...missingBaselines];
            try {
              localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
            } catch (e) {
              console.warn('Storage write error on merging baseline products:', e);
            }
          }
        }
      } catch {
        list = INITIAL_PRODUCTS;
      }
    }

    // Ensure every single product has a valid unique ID and normalized media
    let hadBaselineUpdate = false;
    list = list.map((p, i) => {
      let affiliateLink = p.affiliateLink;
      if (p.id === 'prod-beats-solo-4' && p.affiliateLink !== 'https://link.amazon/B06cXgVyp') {
        affiliateLink = 'https://link.amazon/B06cXgVyp';
        hadBaselineUpdate = true;
      }

      return {
        ...p,
        affiliateLink,
        id: p.id && p.id.trim() !== '' ? p.id : ('prod-auto-' + Date.now() + '-' + i),
        primaryImage: getProductImage(p),
        images: getProductGalleryImages(p)
      };
    });

    if (hadBaselineUpdate) {
      try {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
      } catch (e) {
        console.warn('Storage write error on updating baseline affiliate link:', e);
      }
    }

    if (!includeInactive) {
      return list.filter(c => c.active);
    }
    return list;
  }

  public static getProductById(id: string): Product | undefined {
    const all = this.getProducts(true);
    return all.find(p => p.id === id);
  }

  public static saveProduct(product: Partial<Product> & { name: string; categoryId: string }): Product {
    const all = this.getProducts(true);
    
    // Strict ID check: Only update existing if product.id is an explicit, non-empty string!
    // Never allow undefined or blank id to match or overwrite an existing item.
    const hasValidId = Boolean(product.id && typeof product.id === 'string' && product.id.trim() !== '');
    const existingIndex = hasValidId ? all.findIndex(p => p.id === product.id) : -1;

    const now = new Date().toISOString();

    // Clean and validate images
    const rawImages = Array.isArray(product.images) && product.images.length > 0
      ? product.images.filter(isValidMediaUrl)
      : [];

    const resolvedPrimary = isValidMediaUrl(product.primaryImage)
      ? product.primaryImage!.trim()
      : (rawImages[0] || PRODUCT_PLACEHOLDER);

    const safeImages = rawImages.length > 0 ? rawImages : [resolvedPrimary];

    let saved: Product;

    if (existingIndex >= 0) {
      saved = {
        ...all[existingIndex],
        ...product,
        primaryImage: resolvedPrimary,
        images: safeImages,
        platformLinks: product.platformLinks || all[existingIndex].platformLinks || [],
        updatedAt: now
      } as Product;
      all[existingIndex] = saved;
    } else {
      const generatedId = hasValidId ? product.id! : ('prod-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7));
      saved = {
        id: generatedId,
        name: product.name,
        brand: product.brand || 'Generic',
        categoryId: product.categoryId,
        categoryName: product.categoryName || 'General',
        subcategory: product.subcategory || '',
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        discountPercent: Number(product.discountPercent) || 0,
        affiliateLink: product.affiliateLink || 'https://www.amazon.in/?tag=jyadakharido-21',
        platformLinks: product.platformLinks || [],
        images: safeImages,
        primaryImage: resolvedPrimary,
        youtubeUrl: product.youtubeUrl || '',
        videoUrl: product.videoUrl || '',
        specifications: product.specifications || {},
        featured: Boolean(product.featured),
        active: product.active !== false,
        isNew: Boolean(product.isNew),
        createdAt: now,
        updatedAt: now
      };
      all.unshift(saved);
    }

    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(all));
    } catch (err) {
      console.error('Failed to write products to localStorage:', err);
    }
    return saved;
  }

  public static deleteProduct(id: string): boolean {
    const all = this.getProducts(true);
    const filtered = all.filter(p => p.id !== id);
    if (filtered.length !== all.length) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  }

  public static toggleProductActive(id: string): boolean {
    const all = this.getProducts(true);
    const item = all.find(p => p.id === id);
    if (item) {
      item.active = !item.active;
      item.updatedAt = new Date().toISOString();
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(all));
      return item.active;
    }
    return false;
  }

  public static duplicateProduct(id: string): Product | null {
    const orig = this.getProductById(id);
    if (!orig) return null;
    const copy: Product = {
      ...orig,
      id: 'prod-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      name: `${orig.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const all = this.getProducts(true);
    all.unshift(copy);
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(all));
    } catch (err) {
      console.error('Failed to duplicate product in storage:', err);
    }
    return copy;
  }

  // -------------------------------------------------------------
  // CATEGORIES
  // -------------------------------------------------------------
  public static getCategories(includeInactive: boolean = false): Category[] {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    let list: Category[] = [];
    if (!raw) {
      list = INITIAL_CATEGORIES;
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(list));
    } else {
      try {
        list = JSON.parse(raw);
      } catch {
        list = INITIAL_CATEGORIES;
      }
    }

    // Normalizing media representation for every category record
    list = list.map(cat => {
      const normalizedImg = getCategoryImage(cat);
      const initialMatch = INITIAL_CATEGORIES.find(ic => ic.id === cat.id || ic.slug === cat.slug);
      return {
        ...cat,
        image: normalizedImg,
        imageUrl: normalizedImg,
        videoUrl: cat.videoUrl || '',
        affiliateLink: cat.affiliateLink || initialMatch?.affiliateLink || ''
      };
    });

    list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    if (!includeInactive) {
      return list.filter(c => c.active);
    }
    return list;
  }

  public static saveCategory(cat: Partial<Category> & { name: string }): Category {
    const all = this.getCategories(true);
    const idx = all.findIndex(c => c.id === cat.id);
    
    // Normalize image/imageUrl safely
    const resolvedImg = getCategoryImage(cat);

    let saved: Category;

    if (idx >= 0) {
      saved = { 
        ...all[idx], 
        ...cat,
        image: resolvedImg,
        imageUrl: resolvedImg,
        videoUrl: cat.videoUrl !== undefined ? cat.videoUrl : all[idx].videoUrl,
        affiliateLink: cat.affiliateLink !== undefined ? cat.affiliateLink : all[idx].affiliateLink
      };
      all[idx] = saved;
    } else {
      saved = {
        id: cat.id || 'cat-' + Date.now(),
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        shortLabel: cat.shortLabel || 'Explore',
        description: cat.description || '',
        image: resolvedImg,
        imageUrl: resolvedImg,
        videoUrl: cat.videoUrl || '',
        affiliateLink: cat.affiliateLink || '',
        bgColor: cat.bgColor || '#18191B',
        textColor: cat.textColor || '#FFFFFF',
        accentColor: cat.accentColor || '#F52D56',
        displayOrder: cat.displayOrder || all.length + 1,
        active: cat.active !== false,
        buttonText: cat.buttonText || 'Browse'
      };
      all.push(saved);
    }

    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(all));
    } catch (err) {
      console.error('Failed to save category to localStorage:', err);
    }
    return saved;
  }

  public static deleteCategory(idOrSlugOrName: string, deleteAssociatedProducts: boolean = false): boolean {
    if (!idOrSlugOrName || !idOrSlugOrName.trim()) return false;
    const all = this.getCategories(true);
    const target = idOrSlugOrName.trim().toLowerCase();
    
    // Locate the exact category entry to remove
    const targetCat = all.find(c => 
      c.id === idOrSlugOrName || 
      c.id.toLowerCase() === target ||
      (c.slug && c.slug.toLowerCase() === target) ||
      (c.name && c.name.toLowerCase() === target)
    );

    if (!targetCat) {
      console.warn(`Category "${idOrSlugOrName}" not found in storage.`);
      return false;
    }

    // Filter out the category by its exact unique ID
    const filtered = all.filter(c => c.id !== targetCat.id);
    
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.error('Failed to write updated categories to localStorage:', err);
      return false;
    }

    // Handle products assigned to this category
    const prods = this.getProducts(true);
    const targetIds = new Set([
      targetCat.id.toLowerCase(),
      targetCat.slug?.toLowerCase(),
      targetCat.name.toLowerCase()
    ].filter(Boolean));

    if (deleteAssociatedProducts) {
      // Completely remove all products belonging to this deleted category from storage
      const remainingProds = prods.filter(p => {
        const catIdMatch = p.categoryId && targetIds.has(p.categoryId.toLowerCase());
        const catNameMatch = p.categoryName && targetIds.has(p.categoryName.toLowerCase());
        return !catIdMatch && !catNameMatch;
      });
      try {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(remainingProds));
      } catch (err) {
        console.error('Failed to remove products for deleted category:', err);
      }
    } else {
      // Reassign products to a clean "General" category rather than stealthily disguising them as another category
      let productsModified = false;
      const updatedProds = prods.map(p => {
        const catIdMatch = p.categoryId && targetIds.has(p.categoryId.toLowerCase());
        const catNameMatch = p.categoryName && targetIds.has(p.categoryName.toLowerCase());
        if (catIdMatch || catNameMatch) {
          productsModified = true;
          return {
            ...p,
            categoryId: 'cat-general',
            categoryName: 'General'
          };
        }
        return p;
      });
      if (productsModified) {
        try {
          localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProds));
        } catch (err) {
          console.error('Failed to reassign products for deleted category:', err);
        }
      }
    }

    return true;
  }

  // -------------------------------------------------------------
  // FESTIVALS
  // -------------------------------------------------------------
  public static getFestivals(): Festival[] {
    const raw = localStorage.getItem(FESTIVALS_KEY);
    if (!raw) {
      localStorage.setItem(FESTIVALS_KEY, JSON.stringify(INITIAL_FESTIVALS));
      return INITIAL_FESTIVALS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_FESTIVALS;
    }
  }

  public static saveFestival(fest: Festival): Festival {
    const all = this.getFestivals();
    const idx = all.findIndex(f => f.id === fest.id);
    if (idx >= 0) {
      all[idx] = fest;
    } else {
      all.push(fest);
    }
    localStorage.setItem(FESTIVALS_KEY, JSON.stringify(all));
    return fest;
  }

  public static getActiveFestival(): Festival | null {
    const fests = this.getFestivals();
    const now = new Date();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentDay = String(now.getDate()).padStart(2, '0');
    const currentMMDD = `${currentMonth}-${currentDay}`;

    const active = fests.find(f => {
      if (!f.enabled) return false;
      return currentMMDD >= f.startMonthDay && currentMMDD <= f.endMonthDay;
    });

    return active || fests.find(f => f.enabled) || null;
  }

  public static validateVideoFile(file: File) {
    return validateVideoFile(file);
  }

  public static resetToSeedData() {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(FESTIVALS_KEY, JSON.stringify(INITIAL_FESTIVALS));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_SITE_SETTINGS));
    localStorage.setItem(BLOGS_KEY, JSON.stringify(INITIAL_BLOGS));
  }

  // -------------------------------------------------------------
  // SITE SETTINGS
  // -------------------------------------------------------------
  public static getSettings(): SiteSettings {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_SITE_SETTINGS));
      return INITIAL_SITE_SETTINGS;
    }
    try {
      const parsed = JSON.parse(raw);
      // Migrate or apply user's affiliate link if missing or old demo URL
      if (!parsed.amazonStoreUrl || parsed.amazonStoreUrl.includes('jyadakharido-21') || parsed.amazonStoreUrl.includes('B0eiXrBNR')) {
        parsed.amazonStoreUrl = 'https://link.amazon/B012S1jyj';
        localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...INITIAL_SITE_SETTINGS, ...parsed }));
      }
      return { 
        ...INITIAL_SITE_SETTINGS, 
        ...parsed,
        socialHandles: {
          ...INITIAL_SITE_SETTINGS.socialHandles,
          ...(parsed.socialHandles || {})
        }
      };
    } catch {
      return INITIAL_SITE_SETTINGS;
    }
  }

  public static saveSettings(settings: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  }

  // -------------------------------------------------------------
  // BLOGS
  // -------------------------------------------------------------
  public static getBlogs(): Blog[] {
    const raw = localStorage.getItem(BLOGS_KEY);
    if (!raw) {
      localStorage.setItem(BLOGS_KEY, JSON.stringify(INITIAL_BLOGS));
      return INITIAL_BLOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_BLOGS;
    }
  }

  public static saveBlog(blog: Partial<Blog> & { title: string }): Blog {
    const all = this.getBlogs();
    const idx = all.findIndex(b => b.id === blog.id);
    let saved: Blog;
    if (idx >= 0) {
      saved = { ...all[idx], ...blog };
      all[idx] = saved;
    } else {
      saved = {
        id: blog.id || 'blog-' + Date.now(),
        title: blog.title,
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        image: blog.image || 'https://images.unsplash.com/photo-1510519138161-58474ebf8996?w=800&auto=format&fit=crop&q=80',
        date: blog.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        author: blog.author || 'Editorial Team',
        category: blog.category || 'Tech',
        readTime: blog.readTime || '4 min read'
      };
      all.unshift(saved);
    }
    localStorage.setItem(BLOGS_KEY, JSON.stringify(all));
    return saved;
  }

  public static deleteBlog(id: string): boolean {
    const all = this.getBlogs();
    const filtered = all.filter(b => b.id !== id);
    if (filtered.length !== all.length) {
      localStorage.setItem(BLOGS_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  }

  // -------------------------------------------------------------
  // MEDIA AUDIT & HEALTH CHECK TOOL
  // -------------------------------------------------------------
  public static checkMediaHealth() {
    const products = this.getProducts(true);
    const categories = this.getCategories(true);

    const productReports = products.map(p => {
      const allImgs = [p.primaryImage, ...(p.images || [])].filter(Boolean);
      const validUrls = allImgs.filter(isValidMediaUrl);
      const isHealthy = validUrls.length > 0 && isValidMediaUrl(p.primaryImage);
      const hasVideo = Boolean(p.videoUrl && isValidMediaUrl(p.videoUrl));
      const hasYoutube = Boolean(p.youtubeUrl && p.youtubeUrl.length > 5);

      return {
        id: p.id,
        name: p.name,
        primaryImage: p.primaryImage,
        totalImages: allImgs.length,
        validImages: validUrls.length,
        hasBrokenImages: !isHealthy,
        hasVideo,
        hasYoutube,
        status: isHealthy ? 'Healthy ✓' : 'Needs Image Repair ⚠'
      };
    });

    const categoryReports = categories.map(c => {
      const resolved = getCategoryImage(c);
      const isHealthy = isValidMediaUrl(resolved) && resolved !== CATEGORY_PLACEHOLDER;

      return {
        id: c.id,
        name: c.name,
        imageUrl: resolved,
        isHealthy,
        status: isHealthy ? 'Healthy ✓' : 'Needs Image Repair ⚠'
      };
    });

    const healthyProductsCount = productReports.filter(p => !p.hasBrokenImages).length;
    const healthyCategoriesCount = categoryReports.filter(c => c.isHealthy).length;

    return {
      products: {
        total: products.length,
        healthy: healthyProductsCount,
        needsRepair: products.length - healthyProductsCount,
        reports: productReports
      },
      categories: {
        total: categories.length,
        healthy: healthyCategoriesCount,
        needsRepair: categories.length - healthyCategoriesCount,
        reports: categoryReports
      }
    };
  }

  /**
   * Safe non-destructive media repair for a Product
   */
  public static repairProductImage(productId: string, newPrimaryUrl: string): boolean {
    const all = this.getProducts(true);
    const prod = all.find(p => p.id === productId);
    if (!prod) return false;

    prod.primaryImage = newPrimaryUrl;
    if (!prod.images || prod.images.length === 0) {
      prod.images = [newPrimaryUrl];
    } else {
      prod.images[0] = newPrimaryUrl;
    }
    prod.updatedAt = new Date().toISOString();
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(all));
    return true;
  }

  /**
   * Safe non-destructive media repair for a Category
   */
  public static repairCategoryImage(categoryId: string, newImageUrl: string): boolean {
    const all = this.getCategories(true);
    const cat = all.find(c => c.id === categoryId);
    if (!cat) return false;

    cat.image = newImageUrl;
    cat.imageUrl = newImageUrl;
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(all));
    return true;
  }
}
