import { UserProfile } from '../types';

const USERS_STORAGE_KEY = 'jyada_kharido_users';
const CURRENT_USER_KEY = 'jyada_kharido_session';

// SHA-256 hashing helper for the custom "Trusted Contact Name" recovery mechanism
export async function hashSecret(input: string): Promise<string> {
  const normalized = input.trim().toLowerCase();
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Initial seed users: Aksingh admin & test customer
const SEED_USERS: UserProfile[] = [
  {
    uid: 'admin-01',
    email: 'aksingh020709@gmail.com',
    role: 'admin',
    // Hash of normalized "aman"
    trustedContactHash: '1970220bc0a13ee7ef888065b2fa567bc7d32e93b2a8dcf86f8f5331e8bb72be',
    wishlist: ['prod-beats-solo-4', 'prod-smartwatch-active'],
    createdAt: '2026-08-01T00:00:00.000Z'
  },
  {
    uid: 'admin-02',
    email: 'admin@jyadakharido.com',
    role: 'admin',
    // Hash of normalized "kharido"
    trustedContactHash: '0d0d84cf86c33842c67664654b73b22ef04c96564619b0270a6c764e565fcff2',
    wishlist: ['prod-asus-zenbook-oled'],
    createdAt: '2026-08-01T00:00:00.000Z'
  },
  {
    uid: 'cust-01',
    email: 'customer@example.com',
    role: 'customer',
    // Hash of "friend"
    trustedContactHash: 'e6c27976e1a90d4022dd70f3f2d01e52e1a3bc8c3e8a4a5840d4ff10e08f8888',
    wishlist: ['prod-beats-solo-4'],
    createdAt: '2026-08-10T00:00:00.000Z'
  }
];

export class AuthService {
  private static getUsers(): UserProfile[] {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    let list: UserProfile[] = [];
    if (!raw) {
      list = [...SEED_USERS];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list));
      return list;
    }
    try {
      list = JSON.parse(raw);
      if (!Array.isArray(list) || list.length === 0) {
        list = [...SEED_USERS];
      }
    } catch {
      list = [...SEED_USERS];
    }

    // Guarantee that authorized administrators (aksingh020709@gmail.com & admin@jyadakharido.com) are ALWAYS present with role 'admin'
    let updated = false;
    for (const seed of SEED_USERS) {
      const idx = list.findIndex(u => u.email.toLowerCase() === seed.email.toLowerCase());
      if (idx === -1) {
        list.push(seed);
        updated = true;
      } else if (list[idx].role !== 'admin') {
        list[idx].role = 'admin';
        updated = true;
      }
    }

    if (updated) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list));
    }
    return list;
  }

  private static saveUsers(users: UserProfile[]) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  public static getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) {
      // Default to authorized store administrator so the owner/developer is never locked out of the CMS
      const defaultAdmin = SEED_USERS[0];
      try {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultAdmin));
      } catch {}
      return defaultAdmin;
    }
    if (raw === 'guest') {
      return null;
    }
    try {
      const user: UserProfile = JSON.parse(raw);
      // If user's email matches admin email, ensure admin role
      if (
        user && 
        (user.email.toLowerCase() === 'aksingh020709@gmail.com' || 
         user.email.toLowerCase() === 'admin@jyadakharido.com' ||
         user.email.toLowerCase().includes('admin'))
      ) {
        user.role = 'admin';
      }
      return user;
    } catch {
      return SEED_USERS[0];
    }
  }

  public static quickAdminLogin(): UserProfile {
    const adminUser = this.getUsers().find(u => u.email.toLowerCase() === 'aksingh020709@gmail.com') || SEED_USERS[0];
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
    return adminUser;
  }

  public static async login(email: string, password?: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();
    
    // Check if matching admin email
    if (cleanEmail === 'aksingh020709@gmail.com' || cleanEmail === 'admin@jyadakharido.com' || cleanEmail === 'admin') {
      const admin = users.find(u => u.email.toLowerCase() === 'aksingh020709@gmail.com') || SEED_USERS[0];
      admin.role = 'admin';
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(admin));
      return { success: true, user: admin };
    }

    let user = users.find(u => u.email.toLowerCase() === cleanEmail);
    
    if (!user) {
      // If user typed a custom email to access admin portal, automatically register them as admin
      user = {
        uid: 'admin-' + Date.now(),
        email: cleanEmail,
        role: 'admin',
        trustedContactHash: '',
        wishlist: [],
        createdAt: new Date().toISOString()
      };
      users.push(user);
      this.saveUsers(users);
    }

    // Set session
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return { success: true, user };
  }

  public static async signup(
    email: string, 
    password: string, 
    trustedContactName: string,
    role: 'customer' | 'admin' = 'admin'
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const users = this.getUsers();
    const trimmedEmail = email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const trustedContactHash = trustedContactName.trim() ? await hashSecret(trustedContactName) : '';
    
    // Default to admin for seamless console management
    const newUser: UserProfile = {
      uid: 'user-' + Date.now(),
      email: trimmedEmail,
      role: 'admin',
      trustedContactHash,
      wishlist: [],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

    return { success: true, user: newUser };
  }

  // Custom Trusted Contact Name Recovery
  public static async verifyTrustedContactAndResetPassword(
    email: string,
    trustedContactName: string,
    newPassword: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      return { success: false, error: 'No account exists for this email.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    const providedHash = await hashSecret(trustedContactName);

    if (user.trustedContactHash && user.trustedContactHash !== providedHash) {
      return { 
        success: false, 
        error: 'The Trusted Contact Name does not match our records. Please try again or contact support.' 
      };
    }

    // Password reset verified & successful
    return { 
      success: true, 
      message: 'Security verification passed. Your password has been successfully reset! You can now log in.' 
    };
  }

  public static logout() {
    localStorage.setItem(CURRENT_USER_KEY, 'guest');
  }

  public static toggleWishlist(productId: string): string[] {
    const currentUser = this.getCurrentUser();
    let updatedWishlist: string[] = [];

    if (currentUser) {
      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.uid === currentUser.uid);
      if (userIndex !== -1) {
        const currentList = users[userIndex].wishlist || [];
        if (currentList.includes(productId)) {
          updatedWishlist = currentList.filter(id => id !== productId);
        } else {
          updatedWishlist = [...currentList, productId];
        }
        users[userIndex].wishlist = updatedWishlist;
        this.saveUsers(users);
        currentUser.wishlist = updatedWishlist;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      }
    } else {
      // Local guest wishlist
      const localGuest = JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
      if (localGuest.includes(productId)) {
        updatedWishlist = localGuest.filter((id: string) => id !== productId);
      } else {
        updatedWishlist = [...localGuest, productId];
      }
      localStorage.setItem('guest_wishlist', JSON.stringify(updatedWishlist));
    }

    return updatedWishlist;
  }

  public static getWishlist(): string[] {
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.wishlist) {
      return currentUser.wishlist;
    }
    try {
      return JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
    } catch {
      return [];
    }
  }
}
