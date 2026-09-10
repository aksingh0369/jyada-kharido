import React, { useEffect } from 'react';
import { Product, Category, SiteSettings } from '../types';
import { getProductImage } from '../utils/mediaUtils';

interface SEOHeadProps {
  product?: Product | null;
  category?: Category | null;
  currentPage?: string;
  settings?: SiteSettings;
}

const BASE_URL = 'https://jyadakharido.com';

export const SEOHead: React.FC<SEOHeadProps> = ({
  product,
  category,
  currentPage = 'home',
  settings
}) => {
  useEffect(() => {
    // 1. Determine Title, Description, Image & Canonical URL
    let title = 'Jyada Kharido — Best Deals • Big Savings | Amazon Affiliate Store';
    let description = 'Discover best deals, big savings, and handpicked Amazon affiliate finds across fashion, electronics, gadgets, and lifestyle on Jyada Kharido.';
    let canonicalUrl = `${BASE_URL}/`;
    let ogImage = settings?.heroImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80';

    if (product) {
      title = `${product.name} — Best Price & Deals | Jyada Kharido`;
      description = product.shortDescription || product.description?.slice(0, 160) || description;
      canonicalUrl = `${BASE_URL}/?product=${encodeURIComponent(product.id)}`;
      ogImage = getProductImage(product);
    } else if (category) {
      title = `${category.name} Deals & Buying Guide — Jyada Kharido`;
      description = category.description || `Explore top handpicked ${category.name} verified deals with big savings on Jyada Kharido.`;
      canonicalUrl = `${BASE_URL}/?category=${encodeURIComponent(category.slug)}`;
      ogImage = category.image || ogImage;
    } else if (currentPage === 'shop') {
      title = 'Shop Handpicked Deals & Top Discounts — Jyada Kharido';
      description = 'Browse handpicked verified products, gadget bargains, and premium electronics curated from Amazon India.';
      canonicalUrl = `${BASE_URL}/?page=shop`;
    } else if (currentPage === 'categories') {
      title = 'All Product Categories — Jyada Kharido';
      description = 'Find top-rated electronics, gadgets, home, and fashion deals categorized for easy shopping.';
      canonicalUrl = `${BASE_URL}/?page=categories`;
    } else if (currentPage === 'about') {
      title = 'About Us — Jyada Kharido';
      description = 'Learn about Jyada Kharido, our deal curation philosophy, editorial standards, and Amazon affiliate disclosure.';
      canonicalUrl = `${BASE_URL}/?page=about`;
    } else if (currentPage === 'contact') {
      title = 'Contact Support & Help — Jyada Kharido';
      description = 'Get in touch with the Jyada Kharido curation team for feedback, partnership inquiries, or assistance.';
      canonicalUrl = `${BASE_URL}/?page=contact`;
    }

    // Update document title
    document.title = title;

    // Update or create Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Update meta tags helper
    const setMeta = (selector: string, attrName: string, attrVal: string, content: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    // 2. Manage Dynamic Schema.org JSON-LD for Products
    const scriptId = 'dynamic-product-jsonld';
    let productScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (product) {
      if (!productScript) {
        productScript = document.createElement('script');
        productScript.id = scriptId;
        productScript.type = 'application/ld+json';
        document.head.appendChild(productScript);
      }

      const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${canonicalUrl}#product`,
        name: product.name,
        image: product.images && product.images.length > 0 ? product.images : [getProductImage(product)],
        description: product.shortDescription || product.description,
        brand: {
          '@type': 'Brand',
          name: product.brand || 'Generic'
        },
        category: product.categoryName,
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: product.affiliateLink || `https://www.amazon.in/s?k=${encodeURIComponent(product.name)}&tag=jyadakharido-21`,
          priceValidUntil: '2027-12-31'
        }
      };

      productScript.textContent = JSON.stringify(productSchema, null, 2);
    } else {
      if (productScript) {
        productScript.remove();
      }
    }
  }, [product, category, currentPage, settings]);

  return null;
};
