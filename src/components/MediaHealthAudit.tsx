import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  Wrench, 
  RefreshCw, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  Image as ImageIcon,
  Film
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { MediaService } from '../services/mediaService';
import { runMediaDiagnostics } from '../services/firebaseConfig';
import { SafeImage } from './SafeImage';
import { isValidMediaUrl } from '../utils/mediaUtils';

interface MediaHealthAuditProps {
  onRefreshData: () => void;
  showNotification: (text: string, type?: 'success' | 'error') => void;
}

export const MediaHealthAudit: React.FC<MediaHealthAuditProps> = ({
  onRefreshData,
  showNotification
}) => {
  const [loading, setLoading] = useState(false);
  const [diagnostics, setDiagnostics] = useState<{
    firebaseConfigured: boolean;
    projectId: string;
    storageBucket: string;
    storageConnected: boolean;
    firestoreConnected: boolean;
    notes: string;
  } | null>(null);

  const [auditReport, setAuditReport] = useState<any>(null);

  // Repair Modal State
  const [repairModal, setRepairModal] = useState<{
    open: boolean;
    type: 'product' | 'category';
    id: string;
    name: string;
    currentUrl: string;
  } | null>(null);

  const [replacementUrl, setReplacementUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const runAudit = async () => {
    setLoading(true);
    try {
      const diag = await runMediaDiagnostics();
      setDiagnostics(diag);
      const report = StorageService.checkMediaHealth();
      setAuditReport(report);
    } catch (err: any) {
      showNotification('Failed to run audit: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAudit();
  }, []);

  const openRepairModal = (type: 'product' | 'category', id: string, name: string, currentUrl: string) => {
    setReplacementUrl(currentUrl || '');
    setUploadProgress(null);
    setRepairModal({
      open: true,
      type,
      id,
      name,
      currentUrl
    });
  };

  const handleFileUploadRepair = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !repairModal) return;

    setUploadProgress(10);
    try {
      if (repairModal.type === 'product') {
        const res = await MediaService.uploadProductImage(
          repairModal.id, 
          file, 
          (pct) => setUploadProgress(pct)
        );
        setReplacementUrl(res.url);
      } else {
        const res = await MediaService.uploadCategoryImage(
          repairModal.id, 
          file, 
          (pct) => setUploadProgress(pct)
        );
        setReplacementUrl(res.url);
      }
      showNotification('Image uploaded successfully.');
    } catch (err: any) {
      showNotification(err.message || 'Upload failed', 'error');
    } finally {
      setUploadProgress(null);
    }
  };

  const handleSaveRepair = () => {
    if (!repairModal || !isValidMediaUrl(replacementUrl)) {
      showNotification('Please provide a valid permanent image URL or upload a file.', 'error');
      return;
    }

    if (repairModal.type === 'product') {
      StorageService.repairProductImage(repairModal.id, replacementUrl.trim());
      showNotification(`Product image repaired for "${repairModal.name}"`);
    } else {
      StorageService.repairCategoryImage(repairModal.id, replacementUrl.trim());
      showNotification(`Category image repaired for "${repairModal.name}"`);
    }

    setRepairModal(null);
    onRefreshData();
    runAudit();
  };

  return (
    <div className="space-y-8" id="media-health-audit-container">
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 jk-card-shadow">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#F52D56]" />
            <h2 className="text-xl font-black text-gray-950 uppercase tracking-tight">
              Media Health & Cloud Diagnostics
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Audit product and category media assets, detect broken URLs, and repair images safely.
          </p>
        </div>

        <button
          onClick={runAudit}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-gray-950 hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-60 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Auditing Media...' : 'Re-run Diagnostics'}</span>
        </button>
      </div>

      {/* Cloud & Firebase Diagnostics Card */}
      {diagnostics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cloud Storage</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                diagnostics.storageConnected 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'bg-amber-50 text-amber-700'
              }`}>
                {diagnostics.storageConnected ? 'Connected' : 'Local Fallback'}
              </span>
            </div>
            <p className="text-sm font-black text-gray-900 truncate">
              {diagnostics.storageBucket || 'Local Storage Active'}
            </p>
            <p className="text-[11px] text-gray-500 leading-snug">
              {diagnostics.storageConnected 
                ? 'Firebase Storage bucket active. Files upload directly to permanent cloud paths.' 
                : 'Local fallback mode is storing permanent compressed images. To switch to live cloud, configure VITE_FIREBASE_* in .env.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Products Health</span>
              {auditReport && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  auditReport.products.needsRepair === 0
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-[#F52D56]'
                }`}>
                  {auditReport.products.needsRepair === 0 ? 'All Healthy' : `${auditReport.products.needsRepair} Needs Attention`}
                </span>
              )}
            </div>
            <p className="text-2xl font-black text-gray-900">
              {auditReport ? `${auditReport.products.healthy} / ${auditReport.products.total}` : '...'}
            </p>
            <p className="text-[11px] text-gray-500 leading-snug">
              Catalog items with fully verified, renderable primary images and gallery assets.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categories Health</span>
              {auditReport && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  auditReport.categories.needsRepair === 0
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-[#F52D56]'
                }`}>
                  {auditReport.categories.needsRepair === 0 ? 'All Healthy' : `${auditReport.categories.needsRepair} Needs Attention`}
                </span>
              )}
            </div>
            <p className="text-2xl font-black text-gray-900">
              {auditReport ? `${auditReport.categories.healthy} / ${auditReport.categories.total}` : '...'}
            </p>
            <p className="text-[11px] text-gray-500 leading-snug">
              Bento collections with high-res PNG or 3D transparent product illustrations.
            </p>
          </div>
        </div>
      )}

      {/* Products Audit Table */}
      {auditReport && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-gray-900 uppercase">
              Product Images Status ({auditReport.products.total} Total)
            </h3>
            <span className="text-xs text-gray-500 font-medium">
              Click 'Repair Image' to update broken or blank product photos
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-400 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Thumbnail</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Gallery Images</th>
                    <th className="p-4">Video Asset</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {auditReport.products.reports.map((item: any) => (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-3 w-16">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 p-1 flex items-center justify-center overflow-hidden border border-gray-200">
                          <SafeImage
                            src={item.primaryImage}
                            alt={item.name}
                            type="product"
                            entityId={item.id}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </td>

                      <td className="p-4 font-bold text-gray-900 max-w-xs truncate">
                        {item.name}
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          !item.hasBrokenImages
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-[#F52D56]'
                        }`}>
                          {!item.hasBrokenImages ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          <span>{item.status}</span>
                        </span>
                      </td>

                      <td className="p-4 text-gray-600 font-semibold">
                        {item.validImages} / {item.totalImages} valid
                      </td>

                      <td className="p-4">
                        {item.hasVideo ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                            <Film className="w-3 h-3" />
                            Uploaded MP4
                          </span>
                        ) : item.hasYoutube ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                            <Film className="w-3 h-3" />
                            YouTube
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[11px]">None</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => openRepairModal('product', item.id, item.name, item.primaryImage)}
                          className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Wrench className="w-3.5 h-3.5 text-gray-600" />
                          <span>Repair Image</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Categories Audit Table */}
      {auditReport && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-gray-900 uppercase">
              Category Images Status ({auditReport.categories.total} Total)
            </h3>
            <span className="text-xs text-gray-500 font-medium">
              Verify bento presentation images
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-400 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Thumbnail</th>
                    <th className="p-4">Category Name</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Image Source URL</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {auditReport.categories.reports.map((cat: any) => (
                    <tr key={cat.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-3 w-16">
                        <div className="w-12 h-12 rounded-xl bg-gray-900 p-1 flex items-center justify-center overflow-hidden border border-gray-200">
                          <SafeImage
                            src={cat.imageUrl}
                            alt={cat.name}
                            type="category"
                            entityId={cat.id}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </td>

                      <td className="p-4 font-bold text-gray-900">
                        {cat.name}
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          cat.isHealthy
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-[#F52D56]'
                        }`}>
                          {cat.isHealthy ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          <span>{cat.status}</span>
                        </span>
                      </td>

                      <td className="p-4 text-gray-500 font-mono text-[10px] max-w-xs truncate">
                        {cat.imageUrl}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => openRepairModal('category', cat.id, cat.name, cat.imageUrl)}
                          className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Wrench className="w-3.5 h-3.5 text-gray-600" />
                          <span>Repair Image</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPAIR IMAGE MODAL */}
      {repairModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gray-200 shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900 uppercase">
                  Repair {repairModal.type === 'product' ? 'Product' : 'Category'} Image
                </h3>
                <p className="text-xs text-gray-500 font-medium truncate max-w-xs">
                  {repairModal.name}
                </p>
              </div>
              <button
                onClick={() => setRepairModal(null)}
                className="p-1 text-gray-400 hover:text-gray-900 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Image Preview */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-white p-1 border flex items-center justify-center shrink-0">
                <SafeImage
                  src={replacementUrl || repairModal.currentUrl}
                  alt={repairModal.name}
                  type={repairModal.type}
                  entityId={repairModal.id}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Live Preview</p>
                <p className="text-xs text-gray-700 font-medium mt-1 truncate">
                  {replacementUrl ? 'New image selected' : 'Current active image'}
                </p>
              </div>
            </div>

            {/* Upload or URL input */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Upload Replacement Image (JPEG, PNG, WEBP)
                </label>
                <label className="w-full py-3 px-4 rounded-xl border border-dashed border-gray-300 hover:border-[#F52D56] bg-gray-50/50 hover:bg-rose-50/30 flex items-center justify-center gap-2 text-xs font-bold text-gray-700 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-[#F52D56]" />
                  <span>{uploadProgress !== null ? `Uploading (${uploadProgress}%)...` : 'Choose New Image File'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploadProgress !== null}
                    onChange={handleFileUploadRepair}
                    className="hidden"
                  />
                </label>
                {uploadProgress !== null && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div 
                      className="bg-[#F52D56] h-1.5 rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Or Paste Permanent Direct Image URL
                </label>
                <input
                  type="url"
                  value={replacementUrl}
                  onChange={(e) => setReplacementUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F52D56]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setRepairModal(null)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRepair}
                className="px-5 py-2 bg-[#F52D56] hover:bg-[#D82C4A] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Save Fixed Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
