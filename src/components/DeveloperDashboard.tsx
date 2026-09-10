import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Layers, 
  Sparkles, 
  Settings, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle, 
  Upload, 
  ArrowUp, 
  ArrowDown,
  RotateCcw,
  Film,
  Video,
  Activity,
  ShieldCheck,
  Link2,
  ExternalLink,
  Key,
  Lock,
  ShoppingBag,
  Wand2,
  Loader2,
  Bot,
  Instagram,
  Facebook,
  Share2
} from 'lucide-react';
import { Product, Category, Festival, Blog, SiteSettings, PlatformAffiliateLink } from '../types';
import { StorageService } from '../services/storageService';
import { AuthService } from '../services/authService';
import { MediaService } from '../services/mediaService';
import { AiService } from '../services/aiService';
import { MediaHealthAudit } from './MediaHealthAudit';
import { SafeImage } from './SafeImage';

// Authentic X.com (Twitter) Vector Icon
const XIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface DeveloperDashboardProps {
  products: Product[];
  categories: Category[];
  festivals: Festival[];
  blogs: Blog[];
  settings: SiteSettings;
  onRefreshData: () => void;
  onClose: () => void;
  initialTab?: 'products' | 'categories' | 'festivals' | 'settings' | 'blogs' | 'media-health';
  autoOpenNewCategory?: boolean;
  categoryToEdit?: Category | null;
}

export const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({
  products,
  categories,
  festivals,
  blogs,
  settings,
  onRefreshData,
  onClose,
  initialTab,
  autoOpenNewCategory,
  categoryToEdit
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'festivals' | 'settings' | 'blogs' | 'media-health'>(
    initialTab || (autoOpenNewCategory ? 'categories' : 'products')
  );

  // CATEGORY FILTER STATE FOR PRODUCT INVENTORY
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Notification status
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3500);
  };

  // PRODUCT STATE
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [specKey, setSpecKey] = useState('');
  const [specVal, setSpecVal] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number | null>(null);

  // MULTI-PLATFORM AFFILIATE LINKS STATE
  const [newPlatform, setNewPlatform] = useState<PlatformAffiliateLink['platform']>('Flipkart');
  const [newPlatformUrl, setNewPlatformUrl] = useState('');
  const [newPlatformLabel, setNewPlatformLabel] = useState('');

  // CATEGORY STATE
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(
    autoOpenNewCategory
      ? {
          name: '',
          slug: '',
          shortLabel: 'Trending',
          description: '',
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
          bgColor: '#18191B',
          textColor: '#FFFFFF',
          accentColor: '#EB3B5A',
          buttonText: 'Browse'
        }
      : null
  );
  const [categoryImageProgress, setCategoryImageProgress] = useState<number | null>(null);
  const [categoryVideoProgress, setCategoryVideoProgress] = useState<number | null>(null);

  // FESTIVAL STATE
  const [editingFestival, setEditingFestival] = useState<Festival | null>(null);

  // BLOG STATE
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);

  // SETTINGS STATE
  const [siteSettingsForm, setSiteSettingsForm] = useState<SiteSettings>(settings);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [showAdminPassword, setShowAdminPassword] = useState<boolean>(false);

  // IN-APP CONFIRMATION MODAL STATE (Eliminates iframe-blocked window.confirm)
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    confirmText?: string;
    danger?: boolean;
    onConfirm: () => void;
  } | null>(null);

  // DEDICATED CATEGORY DELETION MODAL STATE
  const [categoryDeleteTarget, setCategoryDeleteTarget] = useState<{
    id: string;
    name: string;
    productCount: number;
    deleteProducts: boolean;
  } | null>(null);

  useEffect(() => {
    setSiteSettingsForm(settings);
  }, [settings]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (autoOpenNewCategory) {
      setActiveTab('categories');
      setEditingCategory({
        name: '',
        slug: '',
        shortLabel: 'Trending',
        description: '',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
        bgColor: '#18191B',
        textColor: '#FFFFFF',
        accentColor: '#EB3B5A',
        buttonText: 'Browse'
      });
      setTimeout(() => {
        const el = document.getElementById('category-edit-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [autoOpenNewCategory]);

  useEffect(() => {
    if (categoryToEdit) {
      setActiveTab('categories');
      setEditingCategory(categoryToEdit);
      setTimeout(() => {
        const el = document.getElementById('category-edit-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [categoryToEdit]);

  // AI & Form Validation State
  const [isAiGeneratingProduct, setIsAiGeneratingProduct] = useState(false);
  const [productFormError, setProductFormError] = useState<string | null>(null);

  // -------------------------------------------------------------
  // AI PRODUCT ASSISTANT
  // -------------------------------------------------------------
  const handleAiAutoFill = async () => {
    if (!editingProduct) return;
    const cleanTitle = (editingProduct.name || '').trim();
    if (!cleanTitle) {
      setProductFormError('Please enter a Product Title first so AI knows what to write (e.g. boAt Airdopes 141).');
      showNotification('Please enter a Product Title first.', 'error');
      return;
    }

    setIsAiGeneratingProduct(true);
    setProductFormError(null);
    showNotification(`✨ AI is generating descriptions and specs for "${cleanTitle}"...`, 'info');

    try {
      const cat = categories.find(c => c.id === editingProduct.categoryId);
      const res = await AiService.generateProductDetails(
        cleanTitle,
        editingProduct.brand,
        cat?.name || editingProduct.categoryName,
        editingProduct.description
      );

      setEditingProduct(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          shortDescription: res.shortDescription || prev.shortDescription,
          description: res.description || prev.description,
          specifications: {
            ...(prev.specifications || {}),
            ...(res.specifications || {})
          },
          discountPercent: prev.discountPercent || res.suggestedDiscount || 20
        };
      });

      showNotification('✨ AI generated product details successfully!', 'success');
    } catch (err: any) {
      console.error('AI Auto-fill error:', err);
      showNotification('Failed to generate with AI. You can still enter details manually.', 'error');
    } finally {
      setIsAiGeneratingProduct(false);
    }
  };

  // -------------------------------------------------------------
  // PRODUCT HANDLERS
  // -------------------------------------------------------------
  const handleSaveProduct = (e?: React.FormEvent, forceNew: boolean = false) => {
    if (e && e.preventDefault) e.preventDefault();
    setProductFormError(null);

    if (!editingProduct) return;

    const cleanTitle = (editingProduct.name || '').trim();
    if (!cleanTitle) {
      setProductFormError('Product Title cannot be empty. Please type a product title.');
      showNotification('Product Title is required.', 'error');
      return;
    }

    // Category check with auto-recovery to first category
    let categoryId = editingProduct.categoryId;
    if (!categoryId && categories.length > 0) {
      categoryId = categories[0].id;
    }
    if (!categoryId) {
      setProductFormError('Please add at least one category before adding products.');
      showNotification('No category found. Please add a category first.', 'error');
      return;
    }

    const cat = categories.find(c => c.id === categoryId);
    const catName = cat ? cat.name : (editingProduct.categoryName || 'General');

    // Affiliate Link sanitize (ensure https:// is added if user typed e.g. link.amazon/...)
    let affiliateLink = (editingProduct.affiliateLink || '').trim();
    if (!affiliateLink) {
      affiliateLink = 'https://www.amazon.in/?tag=jyadakharido-21';
    } else if (!/^https?:\/\//i.test(affiliateLink)) {
      affiliateLink = 'https://' + affiliateLink;
    }

    // Youtube link sanitize
    let youtubeUrl = (editingProduct.youtubeUrl || '').trim();
    if (youtubeUrl && !/^https?:\/\//i.test(youtubeUrl)) {
      youtubeUrl = 'https://' + youtubeUrl;
    }

    const safeImages = Array.isArray(editingProduct.images) ? [...editingProduct.images] : [];
    const primaryImage = editingProduct.primaryImage || safeImages[0] || '';

    const productPayload = {
      ...editingProduct,
      name: cleanTitle,
      brand: (editingProduct.brand || '').trim() || 'Generic',
      categoryId,
      categoryName: catName,
      affiliateLink,
      youtubeUrl,
      images: safeImages,
      primaryImage,
      ...(forceNew ? { id: undefined } : {})
    };

    StorageService.saveProduct(productPayload as any);

    setEditingProduct(null);
    setProductFormError(null);
    onRefreshData();
    showNotification(
      forceNew || !editingProduct.id
        ? 'New product successfully added to category!'
        : 'Product successfully updated!',
      'success'
    );
  };

  const handleDuplicate = (id: string) => {
    const copy = StorageService.duplicateProduct(id);
    if (copy) {
      onRefreshData();
      showNotification(`Duplicated: ${copy.name}`);
    }
  };

  const handleDeleteProduct = (id: string, name: string) => {
    setConfirmModal({
      title: 'Delete Product',
      message: `Are you sure you want to permanently delete "${name}"? This action cannot be undone.`,
      confirmText: 'Delete Product',
      danger: true,
      onConfirm: () => {
        StorageService.deleteProduct(id);
        onRefreshData();
        showNotification('Product deleted.', 'success');
      }
    });
  };

  const handleToggleActive = (id: string) => {
    const newState = StorageService.toggleProductActive(id);
    onRefreshData();
    showNotification(`Product is now ${newState ? 'Active & Visible' : 'Hidden'}.`);
  };

  const handleAddSpecification = () => {
    if (specKey.trim() && specVal.trim() && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        specifications: {
          ...(editingProduct.specifications || {}),
          [specKey.trim()]: specVal.trim()
        }
      });
      setSpecKey('');
      setSpecVal('');
    }
  };

  const handleRemoveSpecification = (key: string) => {
    if (editingProduct && editingProduct.specifications) {
      const updated = { ...editingProduct.specifications };
      delete updated[key];
      setEditingProduct({ ...editingProduct, specifications: updated });
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim() && editingProduct) {
      const currentList = editingProduct.images || [];
      const updated = [...currentList, newImageUrl.trim()];
      setEditingProduct({
        ...editingProduct,
        images: updated,
        primaryImage: editingProduct.primaryImage || newImageUrl.trim()
      });
      setNewImageUrl('');
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProduct) return;

    const productId = editingProduct.id || 'temp-' + Date.now();
    const currentList = [...(editingProduct.images || [])];

    if (currentList.length + files.length > 20) {
      showNotification('Maximum 20 images allowed per product gallery.', 'error');
      return;
    }

    setImageUploadProgress(5);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await MediaService.uploadProductImage(
          productId, 
          file, 
          (pct) => {
            const overall = Math.round(((i + pct / 100) / files.length) * 100);
            setImageUploadProgress(overall);
          }
        );
        uploadedUrls.push(res.url);
      }

      const updated = [...currentList, ...uploadedUrls];
      setEditingProduct({
        ...editingProduct,
        images: updated,
        primaryImage: editingProduct.primaryImage || updated[0]
      });
      showNotification(`Successfully uploaded and validated ${uploadedUrls.length} image(s).`);
    } catch (err: any) {
      showNotification(err.message || 'Image upload failed', 'error');
    } finally {
      setImageUploadProgress(null);
      e.target.value = '';
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    // Check 50MB restriction
    const validation = StorageService.validateVideoFile(file);
    if (!validation.valid) {
      showNotification(validation.error || 'Video file validation failed (Max 50MB)', 'error');
      e.target.value = '';
      return;
    }

    const productId = editingProduct.id || 'temp-' + Date.now();
    setVideoUploadProgress(10);

    try {
      const res = await MediaService.uploadProductVideo(
        productId,
        file,
        (pct) => setVideoUploadProgress(pct)
      );
      setEditingProduct({
        ...editingProduct,
        videoUrl: res.url
      });
      showNotification('Video uploaded successfully (within 50 MB limit).');
    } catch (err: any) {
      showNotification(err.message || 'Video upload failed', 'error');
    } finally {
      setVideoUploadProgress(null);
      e.target.value = '';
    }
  };

  const handleCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCategory) return;

    const catId = editingCategory.id || 'temp-' + Date.now();
    setCategoryImageProgress(15);

    try {
      const res = await MediaService.uploadCategoryImage(
        catId,
        file,
        (pct) => setCategoryImageProgress(pct)
      );
      setEditingCategory({
        ...editingCategory,
        image: res.url,
        imageUrl: res.url
      });
      showNotification('Category presentation image uploaded successfully.');
    } catch (err: any) {
      showNotification(err.message || 'Category image upload failed', 'error');
    } finally {
      setCategoryImageProgress(null);
      e.target.value = '';
    }
  };

  const handleCategoryVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCategory) return;

    const catId = editingCategory.id || 'temp-' + Date.now();
    setCategoryVideoProgress(15);

    try {
      const res = await MediaService.uploadCategoryVideo(
        catId,
        file,
        (pct) => setCategoryVideoProgress(pct)
      );
      setEditingCategory({
        ...editingCategory,
        videoUrl: res.url
      });
      showNotification('Category background video uploaded successfully.');
    } catch (err: any) {
      showNotification(err.message || 'Category video upload failed', 'error');
    } finally {
      setCategoryVideoProgress(null);
      e.target.value = '';
    }
  };

  const handleAddPlatformLink = () => {
    if (!newPlatformUrl.trim() || !editingProduct) {
      showNotification('Please enter an affiliate URL.', 'error');
      return;
    }

    const currentLinks = editingProduct.platformLinks || [];
    const newEntry: PlatformAffiliateLink = {
      id: 'plat-' + Date.now(),
      platform: newPlatform,
      url: newPlatformUrl.trim(),
      label: newPlatformLabel.trim() || undefined,
      isPrimary: currentLinks.length === 0
    };

    setEditingProduct({
      ...editingProduct,
      platformLinks: [...currentLinks, newEntry]
    });
    setNewPlatformUrl('');
    setNewPlatformLabel('');
    showNotification(`Added ${newPlatform} affiliate link.`);
  };

  const handleRemovePlatformLink = (linkId: string) => {
    if (!editingProduct || !editingProduct.platformLinks) return;
    const updated = editingProduct.platformLinks.filter(l => l.id !== linkId);
    setEditingProduct({
      ...editingProduct,
      platformLinks: updated
    });
  };

  // -------------------------------------------------------------
  // CATEGORY HANDLERS
  // -------------------------------------------------------------
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name?.trim()) {
      showNotification('Please enter a category title.', 'error');
      return;
    }

    const cleanName = editingCategory.name.trim();
    const cleanSlug = (editingCategory.slug?.trim() || cleanName).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const cleanImg = (editingCategory.image?.trim() || editingCategory.imageUrl?.trim()) || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80';

    let cleanAffiliateLink = editingCategory.affiliateLink?.trim() || '';
    if (cleanAffiliateLink && !cleanAffiliateLink.startsWith('http://') && !cleanAffiliateLink.startsWith('https://')) {
      cleanAffiliateLink = 'https://' + cleanAffiliateLink;
    }

    const catToSave = {
      ...editingCategory,
      name: cleanName,
      slug: cleanSlug,
      image: cleanImg,
      imageUrl: cleanImg,
      videoUrl: editingCategory.videoUrl?.trim() || '',
      affiliateLink: cleanAffiliateLink,
      shortLabel: editingCategory.shortLabel?.trim() || 'Explore',
      buttonText: editingCategory.buttonText?.trim() || 'Browse',
      bgColor: editingCategory.bgColor || '#18191B',
      textColor: editingCategory.textColor || '#FFFFFF',
      accentColor: editingCategory.accentColor || '#EB3B5A'
    };

    StorageService.saveCategory(catToSave as any);
    setEditingCategory(null);
    onRefreshData();
    showNotification(`Category "${cleanName}" saved successfully!`);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    const target = id.trim().toLowerCase();
    const nameTarget = name.trim().toLowerCase();
    const count = products.filter(p => 
      p.categoryId === id || 
      p.categoryId?.toLowerCase() === target ||
      p.categoryName?.toLowerCase() === nameTarget
    ).length;

    setCategoryDeleteTarget({
      id,
      name,
      productCount: count,
      deleteProducts: false
    });
  };

  const handleExecuteDeleteCategory = () => {
    if (!categoryDeleteTarget) return;
    const { id, name, deleteProducts, productCount } = categoryDeleteTarget;

    const success = StorageService.deleteCategory(id, deleteProducts);

    // Close category edit form if it was editing this deleted category
    if (editingCategory?.id === id || editingCategory?.name?.toLowerCase() === name.toLowerCase()) {
      setEditingCategory(null);
    }

    // Reset product inventory filter if filtered by this deleted category
    if (categoryFilter === id) {
      setCategoryFilter('all');
    }

    // Close modal
    setCategoryDeleteTarget(null);

    // Refresh data in storage & App.tsx
    onRefreshData();

    if (success) {
      showNotification(
        deleteProducts && productCount > 0
          ? `Category "${name}" and its ${productCount} product(s) permanently deleted.`
          : `Category "${name}" permanently deleted. Products preserved in General.`,
        'success'
      );
    } else {
      showNotification(`Failed to delete category "${name}".`, 'error');
    }
  };

  const handleReorderCategory = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= categories.length) return;

    const updated = [...categories];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;

    updated.forEach((c, idx) => {
      c.displayOrder = idx + 1;
      StorageService.saveCategory(c);
    });

    onRefreshData();
    showNotification('Categories reordered.');
  };

  // -------------------------------------------------------------
  // FESTIVAL HANDLERS
  // -------------------------------------------------------------
  const handleSaveFestival = (fest: Festival) => {
    StorageService.saveFestival(fest);
    setEditingFestival(null);
    onRefreshData();
    showNotification(`${fest.name} theme updated!`);
  };

  // -------------------------------------------------------------
  // BLOG HANDLERS
  // -------------------------------------------------------------
  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog || !editingBlog.title) {
      showNotification('Please provide a blog title.', 'error');
      return;
    }
    StorageService.saveBlog(editingBlog as any);
    setEditingBlog(null);
    onRefreshData();
    showNotification('Article saved!');
  };

  const handleDeleteBlog = (id: string) => {
    setConfirmModal({
      title: 'Delete Article',
      message: 'Are you sure you want to delete this blog article?',
      confirmText: 'Delete Article',
      danger: true,
      onConfirm: () => {
        StorageService.deleteBlog(id);
        onRefreshData();
        showNotification('Article deleted.', 'success');
      }
    });
  };

  // -------------------------------------------------------------
  // SITE SETTINGS HANDLER
  // -------------------------------------------------------------
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSettings(siteSettingsForm);

    if (adminPasswordInput.trim()) {
      if (adminPasswordInput.trim().length < 6) {
        showNotification('Password must be at least 6 characters long.', 'error');
        return;
      }
      AuthService.setAdminPassword(adminPasswordInput.trim());
      setAdminPasswordInput('');
      showNotification('Site settings & Developer password updated successfully!');
    } else {
      showNotification('Site settings and branding updated!');
    }
    onRefreshData();
  };

  const handleResetData = () => {
    setConfirmModal({
      title: 'Reset Demo Catalog',
      message: 'Are you sure you want to reset the catalog, categories, and settings back to initial sample state? Any custom products will be overwritten.',
      confirmText: 'Reset Demo Data',
      danger: true,
      onConfirm: () => {
        StorageService.resetToSeedData();
        onRefreshData();
        showNotification('Catalog reset to initial sample data.', 'success');
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="developer-dashboard-root">
      
      {/* Dashboard Top Header */}
      <div className="bg-gray-900 text-white rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider">
              Admin & Developer CMS
            </span>
            <span className="text-xs text-gray-400">v2.4.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-1">
            Store Management Console
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage Amazon affiliate catalog, bento categories, festival promotions, and live site metadata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetData}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset to default seed data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white text-gray-900 hover:bg-gray-100 text-xs font-bold transition-colors cursor-pointer"
          >
            Exit Console
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {msg && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-md transition-all ${
          msg.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
            : msg.type === 'info'
            ? 'bg-purple-50 border border-purple-200 text-purple-900'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {msg.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : msg.type === 'info' ? (
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0 animate-spin" style={{ animationDuration: '3s' }} />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-gray-200 scrollbar-thin">
        {[
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
          { id: 'festivals', label: `Festivals (${festivals.length})`, icon: Sparkles },
          { id: 'media-health', label: 'Media Health & Diagnostics', icon: ShieldCheck },
          { id: 'settings', label: 'Site Settings & Branding', icon: Settings },
          { id: 'blogs', label: `Blog Articles (${blogs.length})`, icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-gray-950 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#F52D56]' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-8">
          
          {/* Top Actions */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 uppercase">Product Inventory</h2>
            <button
              onClick={() => setEditingProduct({
                name: '',
                brand: '',
                categoryId: categories[0]?.id || '',
                categoryName: categories[0]?.name || '',
                discountPercent: 20,
                affiliateLink: 'https://www.amazon.in/?tag=jyadakharido-21',
                shortDescription: '',
                description: '',
                images: [],
                primaryImage: '',
                specifications: { 'Connectivity': 'Bluetooth 5.3', 'Warranty': '1 Year Manufacturer' },
                featured: false,
                active: true,
                isNew: true
              })}
              className="px-4 py-2 rounded-xl bg-[#F52D56] hover:bg-[#D82C4A] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* EDIT / CREATE PRODUCT MODAL FORM */}
          {editingProduct && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 jk-card-shadow space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-gray-900 uppercase">
                    {editingProduct.id ? `Edit: ${editingProduct.name}` : 'Create New Product'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {editingProduct.id 
                      ? 'You are editing an existing item. You can update it or save it as a new separate product.'
                      : 'Add an unlimited number of products to any category.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="text-xs font-bold text-gray-500 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {/* Warning/Clarification Banner when editing existing product */}
              {editingProduct.id && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-amber-900">
                      Modifying existing product: <span className="underline">{editingProduct.name}</span>
                    </p>
                    <p className="text-amber-700 mt-0.5">
                      To add a 3rd or new product without replacing this one, choose <strong>"Save as New Product"</strong> below.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingProduct({
                      name: '',
                      brand: '',
                      categoryId: editingProduct.categoryId || categories[0]?.id || '',
                      categoryName: editingProduct.categoryName || categories[0]?.name || '',
                      discountPercent: 20,
                      affiliateLink: 'https://www.amazon.in/?tag=jyadakharido-21',
                      shortDescription: '',
                      description: '',
                      images: [],
                      primaryImage: '',
                      specifications: { 'Connectivity': 'Bluetooth 5.3', 'Warranty': '1 Year Manufacturer' },
                      featured: false,
                      active: true,
                      isNew: true
                    })}
                    className="shrink-0 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    + Start Blank Product
                  </button>
                </div>
              )}

              {/* QUICK ACTIONS TOP BAR */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-gray-50 to-indigo-50/40 rounded-2xl border border-gray-200">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase text-gray-500 tracking-wider">AI Assistant:</span>
                  <button
                    type="button"
                    onClick={handleAiAutoFill}
                    disabled={isAiGeneratingProduct || !editingProduct.name?.trim()}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-all"
                    title={!editingProduct.name?.trim() ? "Type a product title first" : "Generate descriptions and specs with Gemini AI"}
                  >
                    {isAiGeneratingProduct ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>AI Writing Specs...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                        <span>✨ AI Auto-Fill Details</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setEditingProduct(null); setProductFormError(null); }}
                    className="px-3.5 py-1.5 rounded-xl border border-gray-300 bg-white text-xs font-bold hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  {editingProduct.id ? (
                    <>
                      <button
                        type="button"
                        onClick={(e) => handleSaveProduct(e, true)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                        title="Save as a new separate item without modifying the original"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Save as New</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleSaveProduct(e, false)}
                        className="px-4 py-1.5 rounded-xl bg-[#F52D56] hover:bg-[#D82C4A] text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                      >
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleSaveProduct(e, false)}
                      className="px-4 py-1.5 rounded-xl bg-[#F52D56] hover:bg-[#D82C4A] text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save Product</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Validation Error Alert if any */}
              {productFormError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-800 font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{productFormError}</span>
                </div>
              )}

              <form onSubmit={(e) => handleSaveProduct(e, false)} noValidate className="space-y-6">
                
                {/* Row 1: Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-700">Product Title *</label>
                      <button
                        type="button"
                        onClick={handleAiAutoFill}
                        disabled={isAiGeneratingProduct || !editingProduct.name?.trim()}
                        className="text-[11px] font-bold text-purple-600 hover:text-purple-800 disabled:opacity-40 flex items-center gap-1 cursor-pointer transition-colors"
                        title="Auto-generate description & specs with Gemini AI"
                      >
                        {isAiGeneratingProduct ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-amber-500" />}
                        <span>{isAiGeneratingProduct ? 'Generating...' : '✨ AI Fill'}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={editingProduct.name || ''}
                      onChange={(e) => {
                        setEditingProduct({ ...editingProduct, name: e.target.value });
                        if (productFormError) setProductFormError(null);
                      }}
                      placeholder="e.g. Beats Solo 4 Wireless Headphones"
                      className={`w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F52D56] ${
                        !editingProduct.name?.trim() && productFormError ? 'border-rose-400 bg-rose-50/30' : 'border-gray-200'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Brand Name *</label>
                    <input
                      type="text"
                      value={editingProduct.brand || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                      placeholder="e.g. Beats / Apple / boAt / Sony"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F52D56]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-700">Category *</label>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('categories');
                          setEditingCategory({
                            name: '',
                            slug: '',
                            shortLabel: 'Trending',
                            description: '',
                            image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
                            bgColor: '#18191B',
                            textColor: '#FFFFFF',
                            accentColor: '#EB3B5A',
                            buttonText: 'Browse'
                          });
                        }}
                        className="text-[11px] font-bold text-[#F52D56] hover:underline flex items-center gap-0.5 cursor-pointer"
                        title="Create a new category in Categories tab"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ Add New Category</span>
                      </button>
                    </div>
                    <select
                      value={editingProduct.categoryId || ''}
                      onChange={(e) => {
                        const cat = categories.find(c => c.id === e.target.value);
                        setEditingProduct({
                          ...editingProduct,
                          categoryId: e.target.value,
                          categoryName: cat?.name || ''
                        });
                      }}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F52D56]"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Discount & Amazon Affiliate Link */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Discount Percentage (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={95}
                      value={editingProduct.discountPercent || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, discountPercent: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F52D56]"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Displayed as e.g. "25% OFF" badge (prices strictly hidden)</p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Amazon Affiliate Link (or product link)
                    </label>
                    <input
                      type="text"
                      value={editingProduct.affiliateLink || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, affiliateLink: e.target.value })}
                      onBlur={() => {
                        const link = (editingProduct.affiliateLink || '').trim();
                        if (link && !/^https?:\/\//i.test(link)) {
                          setEditingProduct({ ...editingProduct, affiliateLink: 'https://' + link });
                        }
                      }}
                      placeholder="e.g. link.amazon/B012S1jyj or https://www.amazon.in/dp/...tag=jyadakharido-21"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F52D56]"
                    />
                  </div>
                </div>

                {/* Descriptions */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Short Description</label>
                    <input
                      type="text"
                      value={editingProduct.shortDescription || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                      placeholder="Punchy one-liner summarizing key highlights"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F52D56]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Detailed Description</label>
                    <textarea
                      rows={3}
                      value={editingProduct.description || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      placeholder="In-depth features, sound profile, ergonomics, etc."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F52D56] resize-none"
                    />
                  </div>
                </div>

                {/* MULTIPLE IMAGE GALLERY (Up to 20 images) */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 uppercase">Product Image Gallery</h4>
                      <p className="text-[10px] text-gray-500">
                        Supports up to 20 images. Validates format & size. Click to choose primary image.
                      </p>
                    </div>

                    <label className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 cursor-pointer shadow-xs">
                      <Upload className="w-3.5 h-3.5 text-gray-500" />
                      <span>{imageUploadProgress !== null ? `Uploading (${imageUploadProgress}%)...` : 'Upload Images'}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        disabled={imageUploadProgress !== null}
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {imageUploadProgress !== null && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-[#F52D56] h-1.5 rounded-full transition-all duration-200"
                        style={{ width: `${imageUploadProgress}%` }}
                      />
                    </div>
                  )}

                  {/* Add by image URL */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Or paste external image URL (Unsplash, Amazon S3, CDN)..."
                      className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-4 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black cursor-pointer"
                    >
                      Add URL
                    </button>
                  </div>

                  {/* Thumbnails preview */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {(editingProduct.images || []).map((img, idx) => (
                      <div key={idx} className="relative group w-20 h-20 rounded-xl bg-white border p-1 shrink-0 overflow-hidden">
                        <SafeImage 
                          src={img} 
                          alt="preview" 
                          type="product"
                          entityId={editingProduct.id || 'new'}
                          className="w-full h-full object-contain" 
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => setEditingProduct({ ...editingProduct, primaryImage: img })}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer ${
                              editingProduct.primaryImage === img ? 'bg-emerald-500 text-white' : 'bg-white text-black'
                            }`}
                          >
                            {editingProduct.primaryImage === img ? 'Primary' : 'Set Primary'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const filtered = (editingProduct.images || []).filter((_, i) => i !== idx);
                              setEditingProduct({
                                ...editingProduct,
                                images: filtered,
                                primaryImage: editingProduct.primaryImage === img ? filtered[0] : editingProduct.primaryImage
                              });
                            }}
                            className="text-[9px] font-bold text-red-400 hover:text-red-200 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* VIDEO INTEGRATION & 50MB FILE VALIDATION */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-[#EB3B5A]" />
                    <h4 className="text-xs font-bold text-gray-900 uppercase">Product Video (YouTube / Local MP4)</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">YouTube Video Link</label>
                      <input
                        type="url"
                        value={editingProduct.youtubeUrl || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, youtubeUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Upload Video (Strict Max 50 MB)
                      </label>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        disabled={videoUploadProgress !== null}
                        onChange={handleVideoUpload}
                        className="w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gray-900 file:text-white hover:file:bg-black cursor-pointer"
                      />
                      {videoUploadProgress !== null && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                          <div 
                            className="bg-[#EB3B5A] h-1.5 rounded-full transition-all duration-200"
                            style={{ width: `${videoUploadProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* MULTI-PLATFORM AFFILIATE LINKS MANAGER */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-[#EB3B5A]" />
                    <h4 className="text-xs font-bold text-gray-900 uppercase">Multi-Platform Affiliate Links</h4>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    Add affiliate links for Amazon, Flipkart, Myntra, or Brand Official stores. The primary link is shown on cards and product banners.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <select
                      value={newPlatform}
                      onChange={(e) => setNewPlatform(e.target.value as any)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                    >
                      <option value="Amazon">Amazon</option>
                      <option value="Flipkart">Flipkart</option>
                      <option value="Myntra">Myntra</option>
                      <option value="Official Store">Official Store</option>
                      <option value="Croma">Croma</option>
                      <option value="TataCliq">TataCliq</option>
                      <option value="Other">Other Platform</option>
                    </select>

                    <input
                      type="url"
                      value={newPlatformUrl}
                      onChange={(e) => setNewPlatformUrl(e.target.value)}
                      placeholder="https://amzn.to/... or https://fkrt.it/..."
                      className="sm:col-span-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                    />

                    <button
                      type="button"
                      onClick={handleAddPlatformLink}
                      className="px-4 py-2 bg-[#F52D56] hover:bg-[#D82C4A] text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                    >
                      + Add Link
                    </button>
                  </div>

                  {/* Added Platform Links List */}
                  {(editingProduct.platformLinks && editingProduct.platformLinks.length > 0) && (
                    <div className="space-y-1.5 pt-2">
                      {editingProduct.platformLinks.map((platLink) => (
                        <div 
                          key={platLink.id}
                          className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-200 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-bold text-gray-900 px-2 py-0.5 rounded-md bg-gray-100 text-[10px] uppercase">
                              {platLink.platform}
                            </span>
                            <span className="text-gray-500 truncate text-[11px]">
                              {platLink.url}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (editingProduct.platformLinks || []).map(pl => ({
                                  ...pl,
                                  isPrimary: pl.id === platLink.id
                                }));
                                setEditingProduct({
                                  ...editingProduct,
                                  platformLinks: updated,
                                  affiliateUrl: platLink.url
                                });
                              }}
                              className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer ${
                                platLink.isPrimary 
                                  ? 'bg-emerald-500 text-white' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {platLink.isPrimary ? 'Primary' : 'Make Primary'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemovePlatformLink(platLink.id)}
                              className="text-red-500 hover:text-red-700 cursor-pointer p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* DYNAMIC SPECIFICATIONS */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 uppercase">Specifications Table</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={specKey}
                      onChange={(e) => setSpecKey(e.target.value)}
                      placeholder="Spec Key (e.g. Battery Life)"
                      className="w-1/2 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      value={specVal}
                      onChange={(e) => setSpecVal(e.target.value)}
                      placeholder="Spec Value (e.g. Up to 50 Hours)"
                      className="w-1/2 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddSpecification}
                      className="px-4 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black cursor-pointer"
                    >
                      Add Spec
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {Object.entries(editingProduct.specifications || {}).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between p-2 bg-white rounded-xl border border-gray-200 text-xs">
                        <span className="font-semibold text-gray-600">{k}:</span>
                        <span className="font-bold text-gray-900 truncate mx-2">{v}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecification(k)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.featured || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                      className="rounded text-[#F52D56] focus:ring-[#F52D56]"
                    />
                    <span>Featured in Top Carousel</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isNew || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                      className="rounded text-[#F52D56] focus:ring-[#F52D56]"
                    />
                    <span>New Arrival Badge</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.active !== false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, active: e.target.checked })}
                      className="rounded text-[#F52D56] focus:ring-[#F52D56]"
                    />
                    <span>Active (Visible on Website)</span>
                  </label>
                </div>

                {/* Error Banner at bottom if needed */}
                {productFormError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-800 font-semibold">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{productFormError}</span>
                  </div>
                )}

                {/* Submit button */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => { setEditingProduct(null); setProductFormError(null); }}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  {editingProduct.id ? (
                    <>
                      <button
                        type="button"
                        onClick={(e) => handleSaveProduct(e, true)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
                        title="Save as a new separate product without overwriting this one"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Save as New Product (Keep Both)</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleSaveProduct(e, false)}
                        className="px-6 py-2.5 rounded-xl bg-[#F52D56] hover:bg-[#D82C4A] text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                      >
                        Update This Product
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleSaveProduct(e, false)}
                      className="px-6 py-2.5 rounded-xl bg-[#F52D56] hover:bg-[#D82C4A] text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Product to Inventory</span>
                    </button>
                  )}
                </div>

              </form>
            </div>
          )}

          {/* PRODUCT INVENTORY TABLE */}
          <div className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden jk-card-shadow">
            {/* Category Filter & Quick Actions */}
            <div className="p-4 bg-gray-50/70 border-b border-gray-200/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-extrabold text-gray-500 uppercase mr-1">Category Filter:</span>
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    categoryFilter === 'all'
                      ? 'bg-gray-900 text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All ({products.length})
                </button>
                {categories.map((cat) => {
                  const count = products.filter(p => 
                    p.categoryId === cat.id || 
                    p.categoryId?.toLowerCase() === cat.id.toLowerCase() ||
                    p.categoryId?.toLowerCase() === cat.slug?.toLowerCase() ||
                    p.categoryName?.toLowerCase() === cat.name.toLowerCase()
                  ).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        categoryFilter === cat.id
                          ? 'bg-[#F52D56] text-white shadow-xs'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {cat.name} ({count})
                    </button>
                  );
                })}

                {/* Direct Add New Category shortcut */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('categories');
                    setEditingCategory({
                      name: '',
                      slug: '',
                      shortLabel: 'Trending',
                      description: '',
                      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
                      bgColor: '#18191B',
                      textColor: '#FFFFFF',
                      accentColor: '#EB3B5A',
                      buttonText: 'Browse'
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl border border-dashed border-rose-300 bg-rose-50/70 hover:bg-rose-100 text-[#F52D56] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  title="Create a new store category"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add New Category</span>
                </button>
              </div>

              {categoryFilter !== 'all' && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      const selCat = categories.find(c => c.id === categoryFilter);
                      if (selCat) {
                        setActiveTab('categories');
                        setEditingCategory(selCat);
                        setTimeout(() => {
                          const el = document.getElementById('category-edit-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 50);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 text-xs font-black flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    title={`Edit ${categories.find(c => c.id === categoryFilter)?.name} Category Settings`}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-gray-950" />
                    <span>Edit "{categories.find(c => c.id === categoryFilter)?.name}" Category</span>
                  </button>

                  <button
                    onClick={() => {
                      const selCat = categories.find(c => c.id === categoryFilter);
                      setEditingProduct({
                        name: '',
                        brand: '',
                        categoryId: categoryFilter,
                        categoryName: selCat?.name || '',
                        discountPercent: 20,
                        affiliateLink: 'https://www.amazon.in/?tag=jyadakharido-21',
                        shortDescription: '',
                        description: '',
                        images: [],
                        primaryImage: '',
                        specifications: { 'Connectivity': 'Bluetooth 5.3', 'Warranty': '1 Year Manufacturer' },
                        featured: false,
                        active: true,
                        isNew: true
                      });
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Product to {categories.find(c => c.id === categoryFilter)?.name}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-extrabold uppercase tracking-wider">
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Discount</th>
                    <th className="p-4">Affiliate Status</th>
                    <th className="p-4">Visibility</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {products
                    .filter(prod => {
                      if (categoryFilter === 'all') return true;
                      return (
                        prod.categoryId === categoryFilter ||
                        prod.categoryId?.toLowerCase() === categoryFilter.toLowerCase() ||
                        prod.categoryId?.toLowerCase() === categories.find(c => c.id === categoryFilter)?.slug?.toLowerCase() ||
                        prod.categoryName?.toLowerCase() === categories.find(c => c.id === categoryFilter)?.name.toLowerCase()
                      );
                    })
                    .map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 p-1.5 shrink-0 flex items-center justify-center">
                          <img
                            src={prod.primaryImage}
                            alt={prod.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-gray-900 truncate">{prod.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-bold">{prod.brand}</p>
                        </div>
                      </td>

                      <td className="p-4 text-gray-600 font-semibold">
                        {prod.categoryName}
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-[#F52D56] font-bold">
                          {prod.discountPercent}% OFF
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <Check className="w-3.5 h-3.5" />
                          Tag Active
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleActive(prod.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer ${
                            prod.active 
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          {prod.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{prod.active ? 'Visible' : 'Hidden'}</span>
                        </button>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingProduct(prod)}
                            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(prod.id)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Duplicate Product"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#F52D56]" />
                <h2 className="text-xl font-black text-gray-900 uppercase">Category Collections</h2>
              </div>
              <p className="text-xs text-gray-500 mt-1">Configure Bento card colors, headings, images, reordering, and edit or create categories.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* QUICK SELECT CATEGORY TO EDIT */}
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-2xl px-3 py-2 shadow-2xs">
                <Edit3 className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-xs font-black text-amber-900 shrink-0">Edit Category:</span>
                <select
                  value={editingCategory?.id || ''}
                  onChange={(e) => {
                    const catId = e.target.value;
                    if (!catId) {
                      setEditingCategory(null);
                      return;
                    }
                    const found = categories.find(c => c.id === catId);
                    if (found) {
                      setEditingCategory(found);
                      setTimeout(() => {
                        const el = document.getElementById('category-edit-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 50);
                    }
                  }}
                  className="bg-white border border-amber-300 rounded-xl px-2.5 py-1 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="">-- Choose Category to Edit --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      ✏️ {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingCategory({
                    name: '',
                    slug: '',
                    shortLabel: 'Trending',
                    description: '',
                    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
                    bgColor: '#18191B',
                    textColor: '#FFFFFF',
                    accentColor: '#EB3B5A',
                    buttonText: 'Browse'
                  });
                  setTimeout(() => {
                    const el = document.getElementById('category-edit-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 50);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#F52D56] hover:bg-[#D82C4A] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all hover:scale-105 active:scale-95 shrink-0"
                id="btn-add-new-category"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Category</span>
              </button>
            </div>
          </div>

          {/* ADD NEW CATEGORY QUICK-START BANNER (When form is not opened) */}
          {!editingCategory && (
            <div 
              onClick={() => {
                setEditingCategory({
                  name: '',
                  slug: '',
                  shortLabel: 'Trending',
                  description: '',
                  image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
                  bgColor: '#18191B',
                  textColor: '#FFFFFF',
                  accentColor: '#EB3B5A',
                  buttonText: 'Browse'
                });
                setTimeout(() => {
                  const el = document.getElementById('category-edit-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              className="p-6 rounded-3xl border-2 border-dashed border-rose-300 bg-rose-50/50 hover:bg-rose-50 hover:border-[#F52D56] transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 group shadow-2xs"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F52D56] text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 group-hover:text-[#F52D56] uppercase tracking-wide flex items-center gap-2">
                    <span>+ Add New Category</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F52D56]/10 text-[#F52D56] text-[10px] font-bold">New Bento Collection</span>
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Click here to create a new category collection, custom background colors, button labels, and curated product imagery.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-white text-[#F52D56] border border-rose-200 text-xs font-bold shadow-xs group-hover:bg-[#F52D56] group-hover:text-white transition-colors cursor-pointer shrink-0"
              >
                Open Category Form →
              </button>
            </div>
          )}

          {/* EDIT / CREATE CATEGORY FORM */}
          {editingCategory && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 ring-4 ring-amber-100 jk-card-shadow space-y-4 transition-all animate-in fade-in zoom-in-95" id="category-edit-section">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      editingCategory.id ? 'bg-amber-100 text-amber-950 border border-amber-300' : 'bg-rose-100 text-[#F52D56] border border-rose-300'
                    }`}>
                      {editingCategory.id ? '✏️ Editing Category' : '+ Creating New Category'}
                    </span>
                    {editingCategory.id && (
                      <span className="text-xs text-gray-500 font-mono">Slug: {editingCategory.slug || editingCategory.id}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase mt-1">
                    {editingCategory.id ? `Edit: ${editingCategory.name || 'Untitled Category'}` : 'Create New Category'}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  {editingCategory.id && (
                    <button
                      type="button"
                      onClick={() => {
                        const id = editingCategory.id!;
                        const name = editingCategory.name || 'Category';
                        handleDeleteCategory(id, name);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Category Title *</label>
                    <input
                      type="text"
                      value={editingCategory.name || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      required
                      placeholder="e.g. Smart Watch"
                      className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Short Eyebrow Label</label>
                    <input
                      type="text"
                      value={editingCategory.shortLabel || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, shortLabel: e.target.value })}
                      placeholder="e.g. New or Wearable"
                      className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={editingCategory.buttonText || 'Browse'}
                      onChange={(e) => setEditingCategory({ ...editingCategory, buttonText: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Background Color Hex</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={editingCategory.bgColor || '#18191B'}
                        onChange={(e) => setEditingCategory({ ...editingCategory, bgColor: e.target.value })}
                        className="w-9 h-9 rounded-xl border p-1 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={editingCategory.bgColor || '#18191B'}
                        onChange={(e) => setEditingCategory({ ...editingCategory, bgColor: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Text Color Hex</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={editingCategory.textColor || '#FFFFFF'}
                        onChange={(e) => setEditingCategory({ ...editingCategory, textColor: e.target.value })}
                        className="w-9 h-9 rounded-xl border p-1 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={editingCategory.textColor || '#FFFFFF'}
                        onChange={(e) => setEditingCategory({ ...editingCategory, textColor: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Button Accent Color Hex</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={editingCategory.accentColor || '#EB3B5A'}
                        onChange={(e) => setEditingCategory({ ...editingCategory, accentColor: e.target.value })}
                        className="w-9 h-9 rounded-xl border p-1 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={editingCategory.accentColor || '#EB3B5A'}
                        onChange={(e) => setEditingCategory({ ...editingCategory, accentColor: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* CATEGORY IMAGE WITH FILE UPLOAD & PREVIEW */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-bold text-gray-900 uppercase">Category Presentation Image</label>
                      <p className="text-[10px] text-gray-500">Transparent PNG or 3D product illustration recommended</p>
                    </div>

                    <label className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 cursor-pointer shadow-xs">
                      <Upload className="w-3.5 h-3.5 text-gray-500" />
                      <span>{categoryImageProgress !== null ? `Uploading (${categoryImageProgress}%)...` : 'Upload Image File'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={categoryImageProgress !== null}
                        onChange={handleCategoryImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {categoryImageProgress !== null && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-[#F52D56] h-1.5 rounded-full transition-all duration-200"
                        style={{ width: `${categoryImageProgress}%` }}
                      />
                    </div>
                  )}

                  <div className="flex gap-3 items-center">
                    <div className="w-16 h-16 rounded-xl bg-gray-900 p-2 flex items-center justify-center shrink-0 border border-gray-200">
                      <SafeImage
                        src={editingCategory.image || editingCategory.imageUrl}
                        alt="Category Preview"
                        type="category"
                        entityId={editingCategory.id || 'new'}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <input
                      type="url"
                      value={editingCategory.image || editingCategory.imageUrl || ''}
                      onChange={(e) => setEditingCategory({ 
                        ...editingCategory, 
                        image: e.target.value,
                        imageUrl: e.target.value
                      })}
                      placeholder="https://... (Direct image URL or transparent PNG, optional)"
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* CATEGORY BACKGROUND VIDEO WITH FILE UPLOAD & LIVE PLAYER */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-[#F52D56]" />
                        <label className="block text-xs font-bold text-gray-900 uppercase">Category Presentation Video (Optional)</label>
                      </div>
                      <p className="text-[10px] text-gray-500">Upload an MP4/WebM video or paste a direct video link. The video will autoplay looped and muted on the category card!</p>
                    </div>

                    <label className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 cursor-pointer shadow-xs">
                      <Upload className="w-3.5 h-3.5 text-gray-500" />
                      <span>{categoryVideoProgress !== null ? `Uploading (${categoryVideoProgress}%)...` : 'Upload Video File'}</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/ogg"
                        disabled={categoryVideoProgress !== null}
                        onChange={handleCategoryVideoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {categoryVideoProgress !== null && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-[#F52D56] h-1.5 rounded-full transition-all duration-200"
                        style={{ width: `${categoryVideoProgress}%` }}
                      />
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    {editingCategory.videoUrl ? (
                      <div className="relative group shrink-0">
                        <video
                          src={editingCategory.videoUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-32 h-20 rounded-xl object-cover border border-gray-300 bg-black shadow-inner"
                        />
                        <button
                          type="button"
                          onClick={() => setEditingCategory({ ...editingCategory, videoUrl: '' })}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-[10px] font-bold shadow-sm cursor-pointer"
                          title="Remove video"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-20 rounded-xl bg-gray-200 border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 shrink-0">
                        <Film className="w-5 h-5 mb-0.5" />
                        <span className="text-[9px] font-bold">No Video</span>
                      </div>
                    )}

                    <div className="flex-1 w-full space-y-1">
                      <input
                        type="url"
                        value={editingCategory.videoUrl || ''}
                        onChange={(e) => setEditingCategory({ 
                          ...editingCategory, 
                          videoUrl: e.target.value
                        })}
                        placeholder="https://... (Direct MP4/WebM video URL or uploaded video)"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                      />
                      <p className="text-[10px] text-gray-400">
                        Tip: Upload your own video file (up to 50MB) or provide any direct MP4 URL. If empty, the category image above will be used.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CATEGORY AMAZON AFFILIATE LINK */}
                <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#FF9900]" />
                      <label className="block text-xs font-bold text-gray-900 uppercase">
                        Amazon Category Affiliate Link (Manual Setting)
                      </label>
                    </div>
                    {editingCategory.affiliateLink && (
                      <a
                        href={editingCategory.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-amber-700 hover:text-amber-900 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Test Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-600">
                    When visitors browse this category or click its Amazon button, they will be routed through your custom Amazon affiliate link.
                  </p>
                  <div className="flex gap-2 items-center">
                    <input
                      type="url"
                      value={editingCategory.affiliateLink || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, affiliateLink: e.target.value })}
                      placeholder="e.g. https://link.amazon/B06cXgVyp or https://www.amazon.in/s?k=fashion&tag=jyadakharido-21"
                      className="flex-1 px-3 py-2 bg-white border border-amber-300 focus:border-amber-500 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-100 mt-2">
                  {editingCategory.id ? (
                    <button
                      type="button"
                      onClick={() => {
                        const id = editingCategory.id!;
                        const name = editingCategory.name || 'Category';
                        handleDeleteCategory(id, name);
                      }}
                      className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete This Category</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      className="px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black cursor-pointer transition-colors shadow-xs"
                    >
                      Save Category
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* CATEGORIES LIST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, idx) => {
              const catProductCount = products.filter(p => 
                p.categoryId === cat.id || 
                p.categoryId?.toLowerCase() === cat.id.toLowerCase() ||
                p.categoryId?.toLowerCase() === cat.slug?.toLowerCase() ||
                p.categoryName?.toLowerCase() === cat.name.toLowerCase()
              ).length;

              return (
              <div 
                key={cat.id} 
                className={`rounded-2xl p-5 border flex flex-col justify-between gap-4 shadow-xs transition-all relative ${
                  editingCategory?.id === cat.id ? 'ring-4 ring-amber-400 scale-[1.02] shadow-md' : ''
                }`}
                style={{ backgroundColor: cat.bgColor, color: cat.textColor }}
              >
                {editingCategory?.id === cat.id && (
                  <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-amber-400 text-gray-950 font-black text-[10px] shadow-sm flex items-center gap-1 z-10">
                    <Edit3 className="w-3 h-3" />
                    <span>Currently Editing</span>
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div className="space-y-1 max-w-[65%]">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{cat.shortLabel}</span>
                    <h4 className="text-lg font-black uppercase leading-tight">{cat.name}</h4>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
                        📦 {catProductCount} {catProductCount === 1 ? 'Product' : 'Products'}
                      </span>
                      <span className="text-[10px] opacity-70">Order #{idx + 1}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <img src={cat.image} alt={cat.name} className="w-14 h-14 object-contain" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCategory(cat);
                        setTimeout(() => {
                          const el = document.getElementById('category-edit-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 50);
                      }}
                      className="px-2 py-0.5 rounded-md bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Edit Category Settings"
                    >
                      <Edit3 className="w-3 h-3 text-amber-300" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCategory(cat);
                        setTimeout(() => {
                          const el = document.getElementById('category-edit-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 50);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-gray-950 text-[11px] font-black flex items-center gap-1.5 cursor-pointer transition-all shadow-xs hover:scale-105 active:scale-95"
                      title="Edit Category Details, Colors, and Image"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-gray-950" />
                      <span>Edit Category</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCategoryFilter(cat.id);
                        setEditingProduct({
                          name: '',
                          brand: '',
                          categoryId: cat.id,
                          categoryName: cat.name,
                          discountPercent: 20,
                          affiliateLink: 'https://www.amazon.in/?tag=jyadakharido-21',
                          shortDescription: '',
                          description: '',
                          images: [],
                          primaryImage: '',
                          specifications: { 'Connectivity': 'Bluetooth 5.3', 'Warranty': '1 Year Manufacturer' },
                          featured: false,
                          active: true,
                          isNew: true
                        });
                        setActiveTab('products');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      title="Add a new product directly into this category"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Product</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-0.5 bg-black/40 backdrop-blur-sm p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleReorderCategory(idx, 'up'); }}
                        disabled={idx === 0}
                        className="p-1 text-white hover:text-rose-300 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleReorderCategory(idx, 'down'); }}
                        disabled={idx === categories.length - 1}
                        className="p-1 text-white hover:text-rose-300 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id, cat.name); }}
                      className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-[11px] font-bold flex items-center cursor-pointer transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );})}

            {/* Direct Add New Category Card in the grid */}
            <div
              onClick={() => {
                setEditingCategory({
                  name: '',
                  slug: '',
                  shortLabel: 'Trending',
                  description: '',
                  image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
                  bgColor: '#18191B',
                  textColor: '#FFFFFF',
                  accentColor: '#EB3B5A',
                  buttonText: 'Browse'
                });
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              className="rounded-2xl p-6 border-2 border-dashed border-gray-300 hover:border-[#F52D56] bg-gray-50/70 hover:bg-rose-50/40 flex flex-col items-center justify-center text-center gap-3 transition-all cursor-pointer min-h-[190px] group shadow-2xs"
            >
              <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-[#F52D56] group-hover:text-white text-gray-700 shadow-xs border border-gray-200 flex items-center justify-center transition-all group-hover:scale-110">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-gray-900 group-hover:text-[#F52D56] uppercase tracking-wide">
                  + Add New Category
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Create a new Bento collection card for your store
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#F52D56] group-hover:underline">
                Create Category →
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FESTIVALS MANAGEMENT */}
      {activeTab === 'festivals' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-black text-gray-900 uppercase">Festival Themes & Automations</h2>
            <p className="text-xs text-gray-500">
              Configure automatic date ranges for Diwali, Holi, Eid, Christmas, and Mega Sales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {festivals.map((fest) => (
              <div 
                key={fest.id}
                className="bg-white rounded-3xl p-6 border border-gray-200 jk-card-shadow space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs"
                      style={{ background: fest.bannerBg }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-gray-900">{fest.name}</h3>
                      <p className="text-xs text-gray-500 font-semibold">Active window: {fest.startMonthDay} to {fest.endMonthDay}</p>
                    </div>
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fest.enabled}
                      onChange={(e) => handleSaveFestival({ ...fest, enabled: e.target.checked })}
                      className="rounded text-[#F52D56] focus:ring-[#F52D56]"
                    />
                    <span className="text-xs font-bold text-gray-700">Enabled</span>
                  </label>
                </div>

                <div 
                  className="rounded-2xl p-4 text-white text-xs space-y-1 shadow-inner"
                  style={{ background: fest.bannerBg }}
                >
                  <p className="font-bold text-[10px] uppercase tracking-wider opacity-80">Banner Preview</p>
                  <h4 className="text-lg font-black uppercase">{fest.bannerHeadline}</h4>
                  <p className="opacity-90">{fest.bannerSubtext}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Start (MM-DD)</label>
                    <input
                      type="text"
                      value={fest.startMonthDay}
                      onChange={(e) => handleSaveFestival({ ...fest, startMonthDay: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-gray-50 border rounded-lg font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">End (MM-DD)</label>
                    <input
                      type="text"
                      value={fest.endMonthDay}
                      onChange={(e) => handleSaveFestival({ ...fest, endMonthDay: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-gray-50 border rounded-lg font-mono text-xs"
                    />
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: MEDIA HEALTH & DIAGNOSTICS */}
      {activeTab === 'media-health' && (
        <MediaHealthAudit
          onRefreshData={onRefreshData}
          showNotification={showNotification}
        />
      )}

      {/* TAB 4: SITE SETTINGS & BRANDING */}
      {activeTab === 'settings' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-black text-gray-900 uppercase">Site Settings & Global Branding</h2>
            <p className="text-xs text-gray-500">Customize hero copy, contact details, social URLs, and affiliate disclaimers.</p>
          </div>

          <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 jk-card-shadow space-y-6">
            
            {/* Hero Configuration */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-900 uppercase border-b pb-2">Hero Banner Customization</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Hero Subheading</label>
                  <input
                    type="text"
                    value={siteSettingsForm.heroSubheading}
                    onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, heroSubheading: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Hero Big Title</label>
                  <input
                    type="text"
                    value={siteSettingsForm.heroHeading}
                    onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, heroHeading: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Watermark Badge</label>
                  <input
                    type="text"
                    value={siteSettingsForm.heroBadge}
                    onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, heroBadge: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Hero Floating Image URL</label>
                <input
                  type="url"
                  value={siteSettingsForm.heroImage}
                  onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, heroImage: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Festival Override */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-black text-gray-900 uppercase">Active Festival Override</h3>
              <select
                value={siteSettingsForm.activeFestivalOverride || 'auto'}
                onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, activeFestivalOverride: e.target.value })}
                className="w-full sm:w-80 px-3 py-2 bg-gray-50 border rounded-xl text-xs font-bold"
              >
                <option value="auto">Automatic (Based on current calendar dates)</option>
                <option value="none">None (Standard theme year-round)</option>
                {festivals.map(f => (
                  <option key={f.id} value={f.theme}>Force Active: {f.name}</option>
                ))}
              </select>
            </div>

            {/* Amazon Direct Affiliate Store URL */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#FF9900]" />
                <h3 className="text-sm font-black text-gray-900 uppercase">Top Navbar "Amazon ↗" Affiliate Link</h3>
              </div>
              <p className="text-xs text-gray-500">
                This link opens when visitors click the "Amazon ↗" button in the navigation header. Insert your official Amazon affiliate link or store URL here.
              </p>
              <input
                type="url"
                value={siteSettingsForm.amazonStoreUrl || ''}
                onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, amazonStoreUrl: e.target.value })}
                placeholder="https://www.amazon.in/?tag=jyadakharido-21 or https://amzn.to/..."
                className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs font-semibold text-gray-800"
              />
            </div>

            {/* Affiliate & Legal */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-black text-gray-900 uppercase">Amazon Affiliate Mandatory Disclosure</h3>
              <textarea
                rows={3}
                value={siteSettingsForm.affiliateDisclosure}
                onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, affiliateDisclosure: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs leading-relaxed resize-none"
              />
            </div>

            {/* Contact Details */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-black text-gray-900 uppercase">Support & Contact Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Support Email</label>
                  <input
                    type="email"
                    value={siteSettingsForm.contactEmail}
                    onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Direct Phone</label>
                  <input
                    type="text"
                    value={siteSettingsForm.contactPhone}
                    onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Office Location</label>
                  <input
                    type="text"
                    value={siteSettingsForm.contactAddress}
                    onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, contactAddress: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Official Social Media Profiles & Handles (Footer Display & Direct Links) */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#F52D56]" />
                  <h3 className="text-sm font-black text-gray-900 uppercase">
                    Official Social Profiles & Handles (Footer Badges)
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#F52D56] text-[10px] font-black uppercase tracking-wider">
                  Developer Exclusive
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Set your Instagram username, X.com handle, and Facebook page or search name. These will be prominently displayed alongside their official icons at the bottom of the website, allowing visitors to connect directly.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Instagram */}
                <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/90 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                    <Instagram className="w-4 h-4 text-[#F52D56]" />
                    <span>Instagram Username</span>
                  </div>
                  <input
                    type="text"
                    value={siteSettingsForm.socialHandles?.instagram ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const clean = val.replace(/^@/, '').trim();
                      setSiteSettingsForm({
                        ...siteSettingsForm,
                        socialHandles: {
                          ...siteSettingsForm.socialHandles,
                          instagram: val
                        },
                        socialLinks: {
                          ...siteSettingsForm.socialLinks,
                          instagram: val.startsWith('http') ? val : (clean ? `https://instagram.com/${clean}` : '')
                        }
                      });
                    }}
                    placeholder="e.g. jyadakharido or @username"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:border-[#F52D56] outline-none"
                  />
                  <p className="text-[10px] text-gray-500">
                    Footer shows: <strong className="text-gray-700">@{siteSettingsForm.socialHandles?.instagram?.replace(/^@/, '') || 'username'}</strong>
                  </p>
                </div>

                {/* X.com */}
                <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/90 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                    <XIcon className="w-3.5 h-3.5 text-black" />
                    <span>X.com (Twitter) Handle</span>
                  </div>
                  <input
                    type="text"
                    value={siteSettingsForm.socialHandles?.x ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const clean = val.replace(/^@/, '').trim();
                      setSiteSettingsForm({
                        ...siteSettingsForm,
                        socialHandles: {
                          ...siteSettingsForm.socialHandles,
                          x: val
                        },
                        socialLinks: {
                          ...siteSettingsForm.socialLinks,
                          twitter: val.startsWith('http') ? val : (clean ? `https://x.com/${clean}` : '')
                        }
                      });
                    }}
                    placeholder="e.g. jyadakharido or @username"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:border-[#F52D56] outline-none"
                  />
                  <p className="text-[10px] text-gray-500">
                    Footer shows: <strong className="text-gray-700">@{siteSettingsForm.socialHandles?.x?.replace(/^@/, '') || 'username'}</strong>
                  </p>
                </div>

                {/* Facebook */}
                <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/90 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <span>Facebook Search Name / Page</span>
                  </div>
                  <input
                    type="text"
                    value={siteSettingsForm.socialHandles?.facebook ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const clean = val.replace(/^@/, '').trim();
                      const fbUrl = val.startsWith('http')
                        ? val
                        : (val.includes(' ')
                          ? `https://www.facebook.com/search/top?q=${encodeURIComponent(val.trim())}`
                          : (clean ? `https://facebook.com/${clean}` : ''));
                      setSiteSettingsForm({
                        ...siteSettingsForm,
                        socialHandles: {
                          ...siteSettingsForm.socialHandles,
                          facebook: val
                        },
                        socialLinks: {
                          ...siteSettingsForm.socialLinks,
                          facebook: fbUrl
                        }
                      });
                    }}
                    placeholder="e.g. Jyada Kharido Official or username"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:border-[#F52D56] outline-none"
                  />
                  <p className="text-[10px] text-gray-500">
                    Footer shows: <strong className="text-gray-700">{siteSettingsForm.socialHandles?.facebook || 'Page / Search Name'}</strong>
                  </p>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-3.5 rounded-xl bg-white border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="font-bold text-gray-500 text-[11px] uppercase tracking-wide">Live Footer Preview:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-[#F52D56] font-bold text-[11px]">
                    <Instagram className="w-3.5 h-3.5" />
                    <span>@{siteSettingsForm.socialHandles?.instagram?.replace(/^@/, '') || 'jyadakharido'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-900 font-bold text-[11px]">
                    <XIcon className="w-3 h-3" />
                    <span>@{siteSettingsForm.socialHandles?.x?.replace(/^@/, '') || 'jyadakharido'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-[11px]">
                    <Facebook className="w-3.5 h-3.5" />
                    <span>{siteSettingsForm.socialHandles?.facebook || 'Jyada Kharido Official'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Developer Mode Security & Password */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#F52D56]" />
                    <span>Developer Mode Security & Access Password</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Configure the master security key required for Developer Mode / Admin CMS access.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  <span>Password Protected</span>
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                <div className="max-w-md">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Change Developer Password (leave blank to keep current)
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showAdminPassword ? "text" : "password"}
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      placeholder="Enter new master password (min 6 chars)"
                      className="w-full pl-10 pr-20 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F52D56]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
                    >
                      {showAdminPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1.5">
                    Current active password is set to <strong>Aman3636@</strong>. Only authorized administrators with this password can enter Developer Mode.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                className="px-8 py-3 rounded-full bg-[#F52D56] hover:bg-[#D82C4A] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Save All Site Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: BLOG ARTICLES */}
      {activeTab === 'blogs' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 uppercase">Blog Editorial Journal</h2>
            <button
              onClick={() => setEditingBlog({
                title: '',
                category: 'Gadgets',
                excerpt: '',
                content: '',
                image: 'https://images.unsplash.com/photo-1510519138161-58474ebf8996?w=800&auto=format&fit=crop&q=80',
                readTime: '4 min read'
              })}
              className="px-4 py-2 rounded-xl bg-[#F52D56] hover:bg-[#D82C4A] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Write Article</span>
            </button>
          </div>

          {editingBlog && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 jk-card-shadow space-y-4">
              <h3 className="text-lg font-black text-gray-900 uppercase">
                {editingBlog.id ? 'Edit Article' : 'Compose New Article'}
              </h3>

              <form onSubmit={handleSaveBlog} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Article Title *</label>
                    <input
                      type="text"
                      value={editingBlog.title || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={editingBlog.category || 'Tech'}
                      onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Summary Excerpt</label>
                  <input
                    type="text"
                    value={editingBlog.excerpt || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={editingBlog.image || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, image: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Article Body Content</label>
                  <textarea
                    rows={6}
                    value={editingBlog.content || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs leading-relaxed resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingBlog(null)}
                    className="px-4 py-2 border rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black cursor-pointer"
                  >
                    Publish Article
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <div key={b.id} className="bg-white rounded-3xl p-5 border border-gray-200 jk-card-shadow flex flex-col justify-between">
                <div>
                  <img src={b.image} alt={b.title} className="w-full h-36 object-cover rounded-2xl mb-3" />
                  <span className="text-[10px] font-bold text-[#F52D56] uppercase tracking-wider">{b.category}</span>
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-2 mt-1">{b.title}</h4>
                </div>

                <div className="flex items-center justify-between pt-4 border-t mt-4 text-xs">
                  <button
                    onClick={() => setEditingBlog(b)}
                    className="font-bold text-gray-700 hover:text-black cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(b.id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UNIVERSAL IN-APP CONFIRMATION MODAL */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-4 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
              confirmModal.danger ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-800'
            }`}>
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">
                {confirmModal.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {confirmModal.message}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const action = confirmModal.onConfirm;
                  setConfirmModal(null);
                  action();
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer shadow-sm ${
                  confirmModal.danger ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-black'
                }`}
              >
                {confirmModal.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED CATEGORY DELETION MODAL */}
      {categoryDeleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-5 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
                    Delete Category
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    {categoryDeleteTarget.id}
                  </span>
                </div>
                <h3 className="text-lg font-black text-gray-900 uppercase">
                  {categoryDeleteTarget.name}
                </h3>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to permanently delete this category entry from storage? This action cannot be undone.
            </p>

            {/* Product handling option if category has products */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-800">
                  Assigned Products
                </span>
                <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                  categoryDeleteTarget.productCount > 0 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  📦 {categoryDeleteTarget.productCount} Product{categoryDeleteTarget.productCount === 1 ? '' : 's'}
                </span>
              </div>

              {categoryDeleteTarget.productCount > 0 ? (
                <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={categoryDeleteTarget.deleteProducts}
                    onChange={(e) => setCategoryDeleteTarget({
                      ...categoryDeleteTarget,
                      deleteProducts: e.target.checked
                    })}
                    className="mt-0.5 w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-gray-900 block">
                      Also permanently delete all {categoryDeleteTarget.productCount} product(s) in this category
                    </span>
                    <span className="text-[11px] text-gray-500 block leading-tight pt-0.5">
                      {categoryDeleteTarget.deleteProducts
                        ? 'All associated products will be completely erased from storage.'
                        : 'If unchecked, products will be preserved and moved to "General" category.'}
                    </span>
                  </div>
                </label>
              ) : (
                <p className="text-[11px] text-gray-500">
                  No products are currently attached to this category.
                </p>
              )}
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setCategoryDeleteTarget(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDeleteCategory}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Category</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
