import React, { useState, useEffect } from 'react';
import { 
  PRODUCT_PLACEHOLDER, 
  CATEGORY_PLACEHOLDER, 
  isValidMediaUrl, 
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
  const defaultFallback = type === 'category' ? CATEGORY_PLACEHOLDER : PRODUCT_PLACEHOLDER;
  const targetFallback = fallbackSrc || defaultFallback;

  const initialSrc = isValidMediaUrl(src) ? src!.trim() : targetFallback;
  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(!isValidMediaUrl(src));

  useEffect(() => {
    if (isValidMediaUrl(src)) {
      setCurrentSrc(src!.trim());
      setHasError(false);
      setIsLoaded(false);
    } else {
      setCurrentSrc(targetFallback);
      setHasError(true);
      setIsLoaded(true);
    }
  }, [src, targetFallback]);

  const handleError = () => {
    if (!hasError) {
      logMediaError({
        type: type as 'product' | 'category' | 'banner' | 'video' | 'gallery',
        id: entityId,
        url: src || 'undefined'
      });
      setHasError(true);
      setCurrentSrc(targetFallback);
      setIsLoaded(true);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${containerClassName}`}>
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200/70 animate-pulse rounded-inherit" />
      )}

      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={handleError}
        onLoad={handleLoad}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />
    </div>
  );
};
