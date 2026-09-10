import React, { useState, useEffect, useRef } from 'react';
import { 
  PRODUCT_PLACEHOLDER, 
  CATEGORY_PLACEHOLDER, 
  isValidMediaUrl, 
  normalizeMediaUrl,
  logMediaError 
} from '../utils/mediaUtils';

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'type'> {
  src?: string | null;
  alt: string;
  type?: 'product' | 'category' | 'banner' | 'video' | 'gallery';
  entityId?: string;
  containerClassName?: string;
  fallbackSrc?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  type = 'product',
  entityId,
  className = '',
  containerClassName = '',
  fallbackSrc,
  ...props
}) => {
  const defaultFallback = type === 'category' 
    ? 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
  const targetFallback = fallbackSrc || defaultFallback;

  const normalized = isValidMediaUrl(src) ? normalizeMediaUrl(src) : targetFallback;
  const [currentSrc, setCurrentSrc] = useState<string>(normalized || targetFallback);
  const [hasError, setHasError] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const valid = isValidMediaUrl(src);
    if (valid) {
      const nextSrc = normalizeMediaUrl(src);
      setCurrentSrc(nextSrc);
      setHasError(false);
    } else {
      setCurrentSrc(targetFallback);
      setHasError(true);
    }
  }, [src, targetFallback]);

  const handleError = () => {
    if (!hasError && currentSrc !== targetFallback) {
      logMediaError({
        type: type as 'product' | 'category' | 'banner' | 'video' | 'gallery',
        id: entityId,
        url: src || 'undefined'
      });
      setHasError(true);
      setCurrentSrc(targetFallback);
    } else if (currentSrc === targetFallback) {
      // If even the unsplash fallback fails, use the lightweight SVG placeholder
      setCurrentSrc(type === 'category' ? CATEGORY_PLACEHOLDER : PRODUCT_PLACEHOLDER);
    }
  };

  const resolvedContainerClass = containerClassName !== undefined 
    ? containerClassName 
    : (className.includes('w-full') && className.includes('h-full') ? 'w-full h-full' : '');

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${resolvedContainerClass}`}>
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={handleError}
        className={className}
        {...props}
      />
    </div>
  );
};

