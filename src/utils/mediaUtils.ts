import { Product, Category } from '../types';

// Branded SVG Placeholders (Neutral, pristine, Behance-style)
export const PRODUCT_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#EDF2F7" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bgGrad)" rx="24"/>
  <g transform="translate(150, 140)" stroke="#CBD5E1" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <rect x="0" y="18" width="100" height="90" rx="14" fill="#FFFFFF" stroke="#CBD5E1"/>
    <path d="M 28 18 C 28 -4, 72 -4, 72 18" />
    <circle cx="50" cy="62" r="16" fill="#F1F5F9" stroke="#E2E8F0"/>
    <path d="M 42 62 L 58 62" stroke="#F52D56" stroke-width="3"/>
  </g>
  <text x="200" y="275" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#94A3B8" text-anchor="middle" letter-spacing="1">
    JYADA KHARIDO
  </text>
  <text x="200" y="295" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="#CBD5E1" text-anchor="middle">
    Verified Product Media
  </text>
</svg>
`)}`;

export const CATEGORY_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#1E293B" rx="24"/>
  <g transform="translate(145, 135)" stroke="#64748B" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <rect x="0" y="10" width="110" height="95" rx="16" fill="#334155" stroke="#475569"/>
    <path d="M 20 50 L 50 25 L 75 45 L 95 30" stroke="#F52D56" stroke-width="3.5"/>
    <circle cx="80" cy="70" r="10" fill="#F52D56"/>
  </g>
  <text x="200" y="275" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800" fill="#94A3B8" text-anchor="middle" letter-spacing="2">
    CATEGORY
  </text>
</svg>
`)}`;

/**
 * Normalizes any media URL (adds https:// if missing, handles //, trims whitespace)
 */
export function normalizeMediaUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return '';
  let trimmed = url.trim();
  if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') return '';
  if (trimmed.startsWith('//')) return 'https:' + trimmed;
  if (
    !trimmed.startsWith('http://') && 
    !trimmed.startsWith('https://') && 
    !trimmed.startsWith('data:') && 
    !trimmed.startsWith('blob:') && 
    !trimmed.startsWith('/')
  ) {
    if (trimmed.includes('.') && !trimmed.startsWith('.')) {
      return 'https://' + trimmed;
    }
  }
  return trimmed;
}

/**
 * Validates whether a URL is a usable media URL.
 */
export function isValidMediaUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') return false;
  if (
    trimmed.startsWith('blob:') || 
    trimmed.startsWith('data:') || 
    trimmed.startsWith('/') || 
    trimmed.startsWith('http://') || 
    trimmed.startsWith('https://') || 
    trimmed.startsWith('//')
  ) {
    return true;
  }
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(trimmed)) {
    return true;
  }
  return false;
}

/**
 * Priority Image Resolver for Products:
 * 1. primaryImage
 * 2. first item of images[]
 * 3. legacy image / imageUrl / thumbnail fields
 * 4. branded fallback placeholder
 */
export function getProductImage(product?: Partial<Product> | null): string {
  if (!product) return PRODUCT_PLACEHOLDER;

  // 1. primaryImage
  if (isValidMediaUrl(product.primaryImage)) {
    return normalizeMediaUrl(product.primaryImage);
  }

  // 2. First valid item of images array
  if (Array.isArray(product.images) && product.images.length > 0) {
    for (const img of product.images) {
      if (isValidMediaUrl(img)) {
        return normalizeMediaUrl(img);
      }
    }
  }

  // 3. Legacy backward-compatible fields
  const legacyProduct = product as any;
  if (isValidMediaUrl(legacyProduct.imageUrl)) return normalizeMediaUrl(legacyProduct.imageUrl);
  if (isValidMediaUrl(legacyProduct.image)) return normalizeMediaUrl(legacyProduct.image);
  if (isValidMediaUrl(legacyProduct.thumbnail)) return normalizeMediaUrl(legacyProduct.thumbnail);

  return PRODUCT_PLACEHOLDER;
}

/**
 * Returns all valid images for a product's gallery.
 * Always ensures at least one valid image is returned.
 */
export function getProductGalleryImages(product?: Partial<Product> | null): string[] {
  if (!product) return [PRODUCT_PLACEHOLDER];

  const validImages: string[] = [];
  
  if (isValidMediaUrl(product.primaryImage)) {
    validImages.push(normalizeMediaUrl(product.primaryImage));
  }

  if (Array.isArray(product.images)) {
    for (const img of product.images) {
      if (isValidMediaUrl(img)) {
        const normalized = normalizeMediaUrl(img);
        if (!validImages.includes(normalized)) {
          validImages.push(normalized);
        }
      }
    }
  }

  const legacyProduct = product as any;
  if (validImages.length === 0) {
    if (isValidMediaUrl(legacyProduct.imageUrl)) validImages.push(normalizeMediaUrl(legacyProduct.imageUrl));
    else if (isValidMediaUrl(legacyProduct.image)) validImages.push(normalizeMediaUrl(legacyProduct.image));
    else if (isValidMediaUrl(legacyProduct.thumbnail)) validImages.push(normalizeMediaUrl(legacyProduct.thumbnail));
  }

  return validImages.length > 0 ? validImages : [PRODUCT_PLACEHOLDER];
}

/**
 * Priority Image Resolver for Categories:
 * 1. imageUrl (normalized field)
 * 2. image
 * 3. photo / thumbnail / coverImage / icon
 * 4. branded category placeholder
 */
export function getCategoryImage(category?: Partial<Category> | null): string {
  if (!category) return CATEGORY_PLACEHOLDER;

  const cat = category as any;
  if (isValidMediaUrl(cat.imageUrl)) return normalizeMediaUrl(cat.imageUrl);
  if (isValidMediaUrl(cat.image)) return normalizeMediaUrl(cat.image);
  if (isValidMediaUrl(cat.photo)) return normalizeMediaUrl(cat.photo);
  if (isValidMediaUrl(cat.thumbnail)) return normalizeMediaUrl(cat.thumbnail);
  if (isValidMediaUrl(cat.coverImage)) return normalizeMediaUrl(cat.coverImage);
  if (isValidMediaUrl(cat.icon)) return normalizeMediaUrl(cat.icon);

  return CATEGORY_PLACEHOLDER;
}

/**
 * Validates an image file before upload.
 * Allowed: JPEG, JPG, PNG, WEBP.
 * Maximum Size: 10 MB.
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const hasAllowedExt = /\.(jpe?g|png|webp)$/i.test(file.name);

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: 'Image is too large. Please choose an image under 10 MB.'
    };
  }

  if (!allowedMimeTypes.includes(file.type.toLowerCase()) && !hasAllowedExt) {
    return {
      valid: false,
      error: 'Unsupported image format. Allowed formats: JPEG, JPG, PNG, WEBP.'
    };
  }

  return { valid: true };
}

/**
 * Validates a video file before upload.
 * Allowed: MP4, WEBM, MOV, M4V.
 * Maximum Size: 50 MB strictly.
 */
export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 50 * 1024 * 1024; // 50 MB
  const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v'];
  const hasAllowedExt = /\.(mp4|webm|mov|m4v)$/i.test(file.name);

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: 'Video must be 50 MB or smaller.'
    };
  }

  if (!allowedMimeTypes.includes(file.type.toLowerCase()) && !hasAllowedExt) {
    return {
      valid: false,
      error: 'Allowed video formats are MP4, WebM, or MOV.'
    };
  }

  return { valid: true };
}

/**
 * Generates a clean, sanitized, unique Firebase Storage path.
 * timestamp + random ID + sanitized original filename to avoid collisions.
 */
export function generateUniqueStoragePath(
  scope: 'products' | 'categories' | 'hero' | 'festival' | 'blogs' | 'brand',
  entityId: string,
  originalFileName: string,
  mediaType: 'images' | 'video' | 'image' = 'images'
): string {
  const sanitized = originalFileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'file';
  
  const timestamp = Date.now();
  const rand = Math.random().toString(36).substring(2, 8);
  const uniqueName = `${timestamp}_${rand}_${sanitized}`;

  switch (scope) {
    case 'products':
      return `products/${entityId}/${mediaType}/${uniqueName}`;
    case 'categories':
      return `categories/${entityId}/image/${uniqueName}`;
    case 'hero':
      return `hero/${uniqueName}`;
    case 'festival':
      return `festival/${entityId}/${uniqueName}`;
    case 'blogs':
      return `blogs/${entityId}/${uniqueName}`;
    case 'brand':
    default:
      return `brand/${uniqueName}`;
  }
}

/**
 * Resizes very large client-side images before upload to preserve bandwidth and performance,
 * while maintaining high visual quality and PNG transparency.
 */
export async function compressImageIfNeeded(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.88
): Promise<{ blob: Blob; dataUrl?: string }> {
  // If file is already small (under 800KB), return as is
  if (file.size < 800 * 1024) {
    return { blob: file };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ blob: file });
          return;
        }

        const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
        if (!isPng) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        const targetFormat = isPng ? 'image/png' : 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              resolve({ blob });
            } else {
              resolve({ blob: file });
            }
          },
          targetFormat,
          isPng ? undefined : quality
        );
      };
      img.onerror = () => resolve({ blob: file });
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve({ blob: file });
    reader.readAsDataURL(file);
  });
}

/**
 * Diagnostic logger for failed images.
 * Does not expose technical internals to customers, but logs clear info for developers.
 */
export function logMediaError(context: {
  type: 'product' | 'category' | 'video' | 'banner' | 'gallery';
  id?: string;
  url?: string;
  name?: string;
  error?: any;
}) {
  if (typeof console !== 'undefined' && console.warn) {
    console.warn(
      `[MEDIA ERROR] [${context.type.toUpperCase()}] ID: ${context.id || 'N/A'} | URL: ${context.url || 'N/A'}`
    );
  }
}

/**
 * Normalizes an affiliate or outbound store link:
 * - Ensures valid protocol (https://) so relative domain navigation doesn't happen
 * - Handles shortened Amazon links or domain-less links
 * - Falls back to a clean Amazon India search for the product/category if link is empty or dead
 */
export function normalizeAffiliateUrl(url?: string | null, fallbackQuery?: string): string {
  const fallback = fallbackQuery 
    ? `https://www.amazon.in/s?k=${encodeURIComponent(fallbackQuery)}&tag=jyadakharido-21`
    : 'https://www.amazon.in/?tag=jyadakharido-21';

  if (!url || typeof url !== 'string') {
    return fallback;
  }
  let trimmed = url.trim();
  if (trimmed === '' || trimmed === '#' || trimmed === 'undefined' || trimmed === 'null') {
    return fallback;
  }

  // Prepend protocol if missing
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = 'https://' + trimmed;
  }

  return trimmed;
}
