import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  Share2, 
  ExternalLink, 
  CheckCircle2, 
  ShieldAlert, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  ShoppingBag,
  Play,
  ArrowLeft,
  Check,
  Copy,
  AlertCircle,
  Video
} from 'lucide-react';
import { Product } from '../types';
import { SafeImage } from './SafeImage';
import { getProductGalleryImages, isValidMediaUrl, normalizeAffiliateUrl } from '../utils/mediaUtils';

interface ProductDetailViewProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onBack: () => void;
  onSelectCategory: (categoryId: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onBack,
  onSelectCategory
}) => {
  const images = useMemo(() => getProductGalleryImages(product), [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [videoTab, setVideoTab] = useState<'video' | 'youtube'>(product.videoUrl ? 'video' : 'youtube');
  const [videoError, setVideoError] = useState(false);

  const primaryAffiliateUrl = useMemo(() => {
    const raw = product.affiliateLink || 
      product.affiliateUrl || 
      product.platformLinks?.find(p => p.isPrimary)?.url ||
      product.platformLinks?.[0]?.url;
    return normalizeAffiliateUrl(raw, product.name);
  }, [product]);

  const safeIndex = activeImageIndex < images.length ? activeImageIndex : 0;

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = async () => {
    // Generate clean canonical deep link for this product
    const url = new URL(window.location.href);
    url.searchParams.delete('category');
    url.searchParams.delete('page');
    url.searchParams.set('product', product.id);
    const deepLink = url.toString();

    let success = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(deepLink);
        success = true;
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = deepLink;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (err) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = deepLink;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (fallbackErr) {
        console.error('Failed to copy', fallbackErr);
      }
    }

    if (success !== false) {
      setCopied(true);
      setShowToast(true);
      setTimeout(() => setCopied(false), 2500);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // Check if youtube URL is embeddable
  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 
      ? `https://www.youtube-nocookie.com/embed/${match[2]}` 
      : null;
  };

  const ytEmbed = getYouTubeEmbedUrl(product.youtubeUrl);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Back button, Breadcrumb & Header Share */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-4 py-2 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        <div className="flex items-center gap-3">
          <nav className="hidden sm:flex items-center space-x-2 text-xs font-medium text-gray-500 mr-1">
            <span className="hover:text-gray-900 cursor-pointer" onClick={onBack}>Home</span>
            <span>/</span>
            <span 
              className="hover:text-gray-900 cursor-pointer"
              onClick={() => onSelectCategory(product.categoryId)}
            >
              {product.categoryName}
            </span>
            <span>/</span>
            <span className="text-gray-900 font-bold truncate max-w-[180px]">{product.name}</span>
          </nav>

          <button
            onClick={handleShare}
            id="btn-header-share"
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full border transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm'
                : 'bg-white text-gray-700 hover:text-gray-900 border-gray-200 hover:border-gray-300'
            }`}
            title="Share this product"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-gray-600" />}
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery on Left, Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 jk-card-shadow">
        
        {/* LEFT COLUMN: Gallery with 10-20 images support */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Display Image */}
          <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl bg-[#ECEEF0]/70 flex items-center justify-center p-8 overflow-hidden group">
            <SafeImage
              src={images[safeIndex]}
              alt={`${product.name} - View ${safeIndex + 1}`}
              type="product"
              entityId={product.id}
              className="max-h-full max-w-full object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
            />

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 text-gray-800 shadow-md hover:bg-white hover:scale-110 transition-all cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 text-gray-800 shadow-md hover:bg-white hover:scale-110 transition-all cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Fullscreen zoom trigger */}
            <button
              onClick={() => setFullscreenOpen(true)}
              className="absolute right-4 bottom-4 p-2.5 rounded-full bg-white/90 text-gray-700 shadow-md hover:bg-white hover:text-black transition-all cursor-pointer"
              title="View fullscreen image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Discount Badge */}
            {product.discountPercent > 0 && (
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#EB3B5A] text-white text-xs font-black uppercase tracking-wider shadow-sm">
                {product.discountPercent}% OFF
              </div>
            )}
          </div>

          {/* Thumbnail Navigation supporting 10-20 images */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold px-1">
              <span>Product Gallery ({images.length} Photos)</span>
              <span>{safeIndex + 1} of {images.length}</span>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 p-1.5 shrink-0 border-2 transition-all cursor-pointer ${
                    safeIndex === idx
                      ? 'border-[#EB3B5A] shadow-md scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <SafeImage
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    type="product"
                    entityId={product.id}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Product Information and Amazon Affiliate CTA */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-4">
            {/* Brand & Category info */}
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Available on Amazon
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Short description */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Highlight Badges */}
            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Verified Deal</p>
                <p className="text-xs font-bold text-gray-800 mt-0.5">Direct Amazon Fulfillment</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Return Policy</p>
                <p className="text-xs font-bold text-gray-800 mt-0.5">Amazon A-to-z Protected</p>
              </div>
            </div>

            {/* PRIMARY AFFILIATE CTA - NO PRICE DISPLAYED EVER */}
            <div className="pt-2 space-y-3">
              <a
                href={primaryAffiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl amazon-cta-btn flex items-center justify-center gap-2 text-base font-black shadow-lg cursor-pointer"
                title="Opens Store"
                id="btn-product-amazon-cta"
              >
                <ShoppingBag className="w-5 h-5 shrink-0" />
                <span>Check Current Price on Amazon</span>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </a>

              {/* Developer Configured Multi-Platform Alternate Affiliate Links */}
              {product.platformLinks && product.platformLinks.length > 0 && (
                <div className="pt-2 space-y-2">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">
                    Also available on other verified stores:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {product.platformLinks.map((link) => (
                      <a
                        key={link.id}
                        href={normalizeAffiliateUrl(link.url, `${product.name} ${link.platform}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <span>{link.customLabel || link.platform}</span>
                        <ExternalLink className="w-3 h-3 text-gray-500" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[11px] text-gray-400 text-center leading-snug">
                Prices and discounts change dynamically. Click above to view live pricing, lightning deals, and fast delivery time on the official store.
              </p>
            </div>

            {/* Action Bar (Wishlist + Share) */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onToggleWishlist(product.id)}
                id="btn-wishlist-product"
                className={`flex-1 py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'border-rose-200 bg-rose-50 text-[#F52D56]'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#F52D56]' : ''}`} />
                <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <button
                onClick={handleShare}
                id="btn-share-product"
                className={`py-3 px-5 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  copied
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`}
                title="Copy product deep link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Amazon Affiliate Mandatory Disclosure */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-amber-900 space-y-1 mt-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Affiliate Disclosure</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800/90">
              As an Affiliate, Jyada Kharido earns from qualifying purchases. We never display manual or fabricated prices. The official price is shown directly on the partner platform.
            </p>
          </div>

        </div>
      </div>

      {/* DYNAMIC SPECIFICATIONS TABLE */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 jk-card-shadow">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight uppercase mb-6">
            Technical Specifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {Object.entries(product.specifications).map(([key, val], i) => (
              <div 
                key={i} 
                className="flex items-start justify-between py-2.5 border-b border-gray-100 text-sm"
              >
                <span className="font-semibold text-gray-500 w-1/2">{key}</span>
                <span className="font-bold text-gray-900 w-1/2 text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCT VIDEO SECTION (Both Uploaded Video and YouTube Supported with Tabs) */}
      {(ytEmbed || product.videoUrl) && (
        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 jk-card-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-[#EB3B5A]" />
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight uppercase">
                Product Demonstration & Video Review
              </h2>
            </div>

            {/* Video Switching Tabs if both video formats are present */}
            {ytEmbed && product.videoUrl && (
              <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setVideoTab('video')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    videoTab === 'video'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-[#EB3B5A]" />
                  <span>Showcase Video</span>
                </button>
                <button
                  onClick={() => setVideoTab('youtube')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    videoTab === 'youtube'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 text-rose-600" />
                  <span>YouTube Review</span>
                </button>
              </div>
            )}
          </div>

          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg relative">
            {videoTab === 'video' && product.videoUrl ? (
              videoError ? (
                <div className="flex flex-col items-center justify-center h-full text-white/70 p-6 text-center">
                  <AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
                  <p className="text-sm font-semibold">Video unavailable or format not supported by browser.</p>
                  <p className="text-xs text-gray-400 mt-1">Please check storage connection or try opening the official link.</p>
                </div>
              ) : (
                <video
                  src={product.videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  onError={() => setVideoError(true)}
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              )
            ) : ytEmbed ? (
              <iframe
                src={ytEmbed}
                title={`${product.name} Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : null}
          </div>
        </div>
      )}

      {/* Fullscreen Image Lightbox Modal */}
      {fullscreenOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setFullscreenOpen(false)}
            className="absolute top-5 right-5 p-3 text-white/80 hover:text-white rounded-full bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <SafeImage
            src={images[safeIndex]}
            alt={product.name}
            type="product"
            entityId={product.id}
            className="max-h-[90vh] max-w-[90vw] object-contain drop-shadow-2xl"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white rounded-full bg-white/20 hover:bg-white/40 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white rounded-full bg-white/20 hover:bg-white/40 transition-all cursor-pointer"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Toast Notification: Copied! */}
      {showToast && (
        <div
          id="toast-share-copied"
          role="status"
          aria-live="polite"
          className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-gray-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-gray-800 transition-all duration-300"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <div className="flex flex-col text-left pr-2">
            <span className="text-xs sm:text-sm font-bold text-white leading-tight">
              Copied!
            </span>
            <span className="text-[11px] text-gray-300">
              Product deep link copied to clipboard.
            </span>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
