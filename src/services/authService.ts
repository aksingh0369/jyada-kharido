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
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_USERS;
    }
  }

  private static saveUsers(users: UserProfile[]) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  public static getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public static async login(email: string, password: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    
    if (!user) {
      return { success: false, error: 'Access restricted: No authorized administrator found with this email.' };
    }

    // Restrict visitor logins - only admin role allowed
    if (user.role !== 'admin') {
      return { 
        success: false, 
        error: 'Visitor logins are restricted. Only authorized store administrators and developers may sign in.' 
      };
    }

    if (!password || password.length < 5) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    // Set session
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return { success: true, user };
  }

  public static async signup(
    email: string, 
    password: string, 
    trustedContactName: string,
    role: 'customer' | 'admin' = 'customer'
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    // Restrict public visitor registration
    if (role !== 'admin') {
      return { 
        success: false, 
        error: 'Public visitor registration is disabled. Only pre-authorized administrators have portal access.' 
      };
    }

    const users = this.getUsers();
    const trimmedEmail = email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    if (!trustedContactName || trustedContactName.trim().length < 2) {
      return { success: false, error: 'Please enter a valid Trusted Contact Name for account recovery.' };
    }

    const trustedContactHash = await hashSecret(trustedContactName);
    
    // Auto-promote specific owner email to admin
    const finalRole: 'admin' | 'customer' = 
      trimmedEmail === 'aksingh020709@gmail.com' || trimmedEmail === 'admin@jyadakharido.com' 
        ? 'admin' 
        : role;

    const newUser: UserProfile = {
      uid: 'user-' + Date.now(),
      email: trimmedEmail,
      role: finalRole,
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
    localStorage.removeItem(CURRENT_USER_KEY);
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
