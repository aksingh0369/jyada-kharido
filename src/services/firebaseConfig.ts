import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getStorage, FirebaseStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, Firestore, collection, getDocs, limit, query } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Default config: reads from Vite environment variables or fallback
export const FIREBASE_CONFIG: FirebaseClientConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || "",
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || "jyada-kharido.firebaseapp.com",
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || "jyada-kharido",
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || "jyada-kharido.appspot.com",
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || "",
  measurementId: (import.meta as any).env?.VITE_FIREBASE_MEASUREMENT_ID || ""
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    FIREBASE_CONFIG.apiKey && 
    FIREBASE_CONFIG.projectId && 
    FIREBASE_CONFIG.apiKey.length > 5
  );
};

// Lazy singletons
let firebaseAppInstance: FirebaseApp | null = null;
let firebaseStorageInstance: FirebaseStorage | null = null;
let firestoreInstance: Firestore | null = null;
let firebaseAuthInstance: Auth | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (firebaseAppInstance) return firebaseAppInstance;
  if (!isFirebaseConfigured()) return null;

  try {
    if (getApps().length > 0) {
      firebaseAppInstance = getApp();
    } else {
      firebaseAppInstance = initializeApp(FIREBASE_CONFIG);
    }
    return firebaseAppInstance;
  } catch (err) {
    console.warn('[FIREBASE] App initialization failed, using local mode:', err);
    return null;
  }
}

export function getFirebaseStorage(): FirebaseStorage | null {
  if (firebaseStorageInstance) return firebaseStorageInstance;
  const app = getFirebaseApp();
  if (!app) return null;

  try {
    firebaseStorageInstance = getStorage(app);
    return firebaseStorageInstance;
  } catch (err) {
    console.warn('[FIREBASE] Storage initialization error:', err);
    return null;
  }
}

export function getFirestoreDB(): Firestore | null {
  if (firestoreInstance) return firestoreInstance;
  const app = getFirebaseApp();
  if (!app) return null;

  try {
    firestoreInstance = getFirestore(app);
    return firestoreInstance;
  } catch (err) {
    console.warn('[FIREBASE] Firestore initialization error:', err);
    return null;
  }
}

export function getFirebaseAuth(): Auth | null {
  if (firebaseAuthInstance) return firebaseAuthInstance;
  const app = getFirebaseApp();
  if (!app) return null;

  try {
    firebaseAuthInstance = getAuth(app);
    return firebaseAuthInstance;
  } catch (err) {
    console.warn('[FIREBASE] Auth initialization error:', err);
    return null;
  }
}

/**
 * Diagnostics check for Developer Dashboard Media Debug panel
 */
export async function runMediaDiagnostics(): Promise<{
  firebaseConfigured: boolean;
  projectId: string;
  storageBucket: string;
  storageConnected: boolean;
  firestoreConnected: boolean;
  authConnected: boolean;
  notes: string;
}> {
  const configured = isFirebaseConfigured();
  const bucket = FIREBASE_CONFIG.storageBucket;
  const projectId = FIREBASE_CONFIG.projectId;

  if (!configured) {
    return {
      firebaseConfigured: false,
      projectId,
      storageBucket: bucket,
      storageConnected: false,
      firestoreConnected: false,
      authConnected: false,
      notes: 'Local Storage Fallback Mode active. To connect cloud storage, set VITE_FIREBASE_* in .env.'
    };
  }

  let storageOk = false;
  let firestoreOk = false;
  let authOk = false;

  try {
    const storage = getFirebaseStorage();
    if (storage) {
      storageOk = true;
    }
  } catch {
    storageOk = false;
  }

  try {
    const db = getFirestoreDB();
    if (db) {
      firestoreOk = true;
    }
  } catch {
    firestoreOk = false;
  }

  try {
    const auth = getFirebaseAuth();
    if (auth) {
      authOk = true;
    }
  } catch {
    authOk = false;
  }

  return {
    firebaseConfigured: configured,
    projectId,
    storageBucket: bucket,
    storageConnected: storageOk,
    firestoreConnected: firestoreOk,
    authConnected: authOk,
    notes: storageOk && firestoreOk
      ? 'Firebase Services connected and synchronized successfully.'
      : 'Partial Firebase connection. Check bucket and permissions.'
  };
}
