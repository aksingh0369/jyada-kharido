export interface PlatformAffiliateLink {
  id: string;
  platform: 'Amazon' | 'Flipkart' | 'Myntra' | 'Official Store' | 'Croma' | 'TataCliq' | 'Other';
  url: string;
  customLabel?: string;
  label?: string;
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  categoryName: string;
  subcategory?: string;
  shortDescription: string;
  description: string;
  discountPercent: number;
  affiliateLink: string;
  platformLinks?: PlatformAffiliateLink[];
  images: string[];
  primaryImage: string;
  image?: string; // backwards-compatible legacy field
  imageUrl?: string; // backwards-compatible legacy field
  thumbnail?: string; // backwards-compatible legacy field
  youtubeUrl?: string;
  videoUrl?: string;
  specifications: Record<string, string>;
  featured: boolean;
  active: boolean;
  isNew?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  shortLabel: string;
  description: string;
  image: string;
  imageUrl?: string; // normalized media field
  photo?: string; // legacy support
  thumbnail?: string; // legacy support
  coverImage?: string; // legacy support
  icon?: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  displayOrder: number;
  active: boolean;
  buttonText?: string;
}

export interface Festival {
  id: string;
  name: string;
  startMonthDay: string; // MM-DD format e.g. "03-20"
  endMonthDay: string;   // MM-DD format e.g. "03-28"
  startDate?: string;
  endDate?: string;
  theme: 'holi' | 'diwali' | 'karvachauth' | 'christmas' | 'valentine' | 'general';
  bannerHeadline: string;
  bannerSubtext: string;
  bannerBg: string;
  accentColor: string;
  particleType: 'sparkle' | 'colors' | 'snow' | 'hearts' | 'gold';
  enabled: boolean;
  bannerImage?: string;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'customer';
  trustedContactHash?: string;
  wishlist: string[];
  createdAt: string;
}

export interface FeatureBarItem {
  id: string;
  title: string;
  subtitle: string;
  icon: 'truck' | 'shield' | 'headphones' | 'credit-card';
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  amazonStoreUrl?: string;
  heroHeading: string;
  heroSubheading: string;
  heroDescription: string;
  heroImage: string;
  heroBadge: string;
  affiliateDisclosure: string;
  footerDescription: string;
  contactEmail: string;
  contactPhone: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
  };
  socialHandles?: {
    instagram?: string;
    x?: string;
    facebook?: string;
  };
  contactAddress?: string;
  featureBarItems: FeatureBarItem[];
  activeFestivalOverride?: string; // e.g. 'diwali', 'holi', or 'auto'
}
