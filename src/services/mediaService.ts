import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFirebaseStorage, isFirebaseConfigured } from './firebaseConfig';
import { 
  validateImageFile, 
  validateVideoFile, 
  generateUniqueStoragePath, 
  compressImageIfNeeded 
} from '../utils/mediaUtils';

export interface UploadResult {
  url: string;
  storagePath: string;
  fileName: string;
  size: number;
}

export class MediaService {
  /**
   * Uploads a Product image to Firebase Storage (or compressed fallback).
   * Validates size (<=10MB) and format (JPEG, PNG, WEBP).
   * Generates path: products/{productId}/images/{uniqueFileName}
   */
  public static async uploadProductImage(
    productId: string,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<UploadResult> {
    // 1. Validation
    const val = validateImageFile(file);
    if (!val.valid) {
      throw new Error(val.error || 'Invalid image file.');
    }

    // 2. Client-side optimization (preserves PNG transparency)
    const { blob } = await compressImageIfNeeded(file);

    // 3. Generate unique path
    const storagePath = generateUniqueStoragePath('products', productId || 'temp', file.name, 'images');

    // 4. Firebase Storage check
    const storage = getFirebaseStorage();
    if (storage && isFirebaseConfigured()) {
      try {
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, blob, {
          contentType: file.type || 'image/jpeg',
          customMetadata: {
            productId,
            originalName: file.name
          }
        });

        return new Promise<UploadResult>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              if (onProgress) onProgress(progress);
            },
            (error) => {
              console.error('[MEDIA] Firebase upload error:', error);
              reject(new Error(`Upload failed: ${error.message}`));
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                if (onProgress) onProgress(100);
                resolve({
                  url: downloadURL,
                  storagePath,
                  fileName: file.name,
                  size: blob.size
                });
              } catch (urlErr) {
                reject(urlErr);
              }
            }
          );
        });
      } catch (err: any) {
        console.warn('[MEDIA] Falling back to local image compression:', err);
      }
    }

    // Fallback when Firebase is not connected
    return this.fallbackDataUrlUpload(file, blob, storagePath, onProgress);
  }

  /**
   * Uploads a Product video to Firebase Storage.
   * Strictly enforces 50 MB limit BEFORE upload.
   * Path: products/{productId}/video/{uniqueFileName}
   */
  public static async uploadProductVideo(
    productId: string,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<UploadResult> {
    // 1. Validation (Strict 50MB check)
    const val = validateVideoFile(file);
    if (!val.valid) {
      throw new Error(val.error || 'Video must be 50 MB or smaller.');
    }

    const storagePath = generateUniqueStoragePath('products', productId || 'temp', file.name, 'video');
    const storage = getFirebaseStorage();

    if (storage && isFirebaseConfigured()) {
      try {
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, file, {
          contentType: file.type || 'video/mp4',
          customMetadata: {
            productId,
            originalName: file.name
          }
        });

        return new Promise<UploadResult>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              if (onProgress) onProgress(progress);
            },
            (error) => {
              console.error('[MEDIA] Firebase video upload error:', error);
              reject(new Error(`Video upload failed: ${error.message}`));
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                if (onProgress) onProgress(100);
                resolve({
                  url: downloadURL,
                  storagePath,
                  fileName: file.name,
                  size: file.size
                });
              } catch (urlErr) {
                reject(urlErr);
              }
            }
          );
        });
      } catch (err: any) {
        console.warn('[MEDIA] Falling back to local video processing:', err);
      }
    }

    // Fallback for local testing
    return this.fallbackDataUrlUpload(file, file, storagePath, onProgress);
  }

  /**
   * Uploads a Category image to Firebase Storage.
   * Path: categories/{categoryId}/image/{uniqueFileName}
   */
  public static async uploadCategoryImage(
    categoryId: string,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<UploadResult> {
    const val = validateImageFile(file);
    if (!val.valid) {
      throw new Error(val.error || 'Invalid category image.');
    }

    const { blob } = await compressImageIfNeeded(file, 1200, 1200, 0.9);
    const storagePath = generateUniqueStoragePath('categories', categoryId || 'temp', file.name, 'image');

    const storage = getFirebaseStorage();
    if (storage && isFirebaseConfigured()) {
      try {
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, blob, {
          contentType: file.type || 'image/jpeg',
          customMetadata: {
            categoryId,
            originalName: file.name
          }
        });

        return new Promise<UploadResult>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              if (onProgress) onProgress(progress);
            },
            (error) => {
              reject(new Error(`Category image upload failed: ${error.message}`));
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              if (onProgress) onProgress(100);
              resolve({
                url: downloadURL,
                storagePath,
                fileName: file.name,
                size: blob.size
              });
            }
          );
        });
      } catch (err) {
        console.warn('[MEDIA] Category upload fallback:', err);
      }
    }

    return this.fallbackDataUrlUpload(file, blob, storagePath, onProgress);
  }

  /**
   * Uploads a Category video to Firebase Storage (or local fallback).
   * Path: categories/{categoryId}/video/{uniqueFileName}
   */
  public static async uploadCategoryVideo(
    categoryId: string,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<UploadResult> {
    const val = validateVideoFile(file);
    if (!val.valid) {
      throw new Error(val.error || 'Video must be 50 MB or smaller.');
    }

    const storagePath = generateUniqueStoragePath('categories', categoryId || 'temp', file.name, 'video');
    const storage = getFirebaseStorage();

    if (storage && isFirebaseConfigured()) {
      try {
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, file, {
          contentType: file.type || 'video/mp4',
          customMetadata: {
            categoryId,
            originalName: file.name
          }
        });

        return new Promise<UploadResult>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              if (onProgress) onProgress(progress);
            },
            (error) => {
              console.error('[MEDIA] Firebase category video upload error:', error);
              reject(new Error(`Category video upload failed: ${error.message}`));
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                if (onProgress) onProgress(100);
                resolve({
                  url: downloadURL,
                  storagePath,
                  fileName: file.name,
                  size: file.size
                });
              } catch (urlErr) {
                reject(urlErr);
              }
            }
          );
        });
      } catch (err: any) {
        console.warn('[MEDIA] Falling back to local category video processing:', err);
      }
    }

    return this.fallbackDataUrlUpload(file, file, storagePath, onProgress);
  }

  /**
   * Safely deletes a file from Firebase Storage.
   */
  public static async deleteStorageFile(storagePathOrUrl: string): Promise<boolean> {
    if (!storagePathOrUrl) return false;
    const storage = getFirebaseStorage();
    if (!storage || !isFirebaseConfigured()) return true;

    try {
      if (storagePathOrUrl.startsWith('https://firebasestorage.googleapis.com')) {
        const fileRef = ref(storage, storagePathOrUrl);
        await deleteObject(fileRef);
        return true;
      }
      return true;
    } catch (err) {
      console.warn('[MEDIA] Storage deletion skipped or failed:', err);
      return false;
    }
  }

  /**
   * Local mode simulator for when Firebase Storage credentials are not active yet.
   * Simulates progress and provides permanent readable data.
   */
  private static async fallbackDataUrlUpload(
    file: File,
    dataBlob: Blob,
    storagePath: string,
    onProgress?: (percent: number) => void
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      let progress = 10;
      if (onProgress) onProgress(progress);

      const interval = setInterval(() => {
        progress += 30;
        if (onProgress) onProgress(Math.min(progress, 90));
      }, 100);

      const reader = new FileReader();
      reader.onload = () => {
        clearInterval(interval);
        if (onProgress) onProgress(100);
        resolve({
          url: reader.result as string,
          storagePath,
          fileName: file.name,
          size: dataBlob.size
        });
      };
      reader.onerror = () => {
        clearInterval(interval);
        reject(new Error('Failed to read file locally.'));
      };
      reader.readAsDataURL(dataBlob);
    });
  }
}
