// Client-side API functions for authentication
const BASE_URL = 'https://seba.rangpurit.com/api/v1/customer';
const CUSTOMER_API_BASE = 'https://seba.rangpurit.com/api/customer'; // For endpoints without /v1
const PROFILE_API_BASE = 'https://seba.rangpurit.com/api/customer'; // For profile endpoints (without /v1)

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  profile_picture: string | null;
  is_google_user: boolean;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
  club_points?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    is_new_user?: boolean;
  };
}

export interface OTPResponse {
  success: boolean;
  message: string;
  data?: {
    otp_expires_in?: number;
    verified?: boolean;
    phone_number?: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: User;
}

export interface StatisticsResponse {
  success: boolean;
  data: {
    total_orders: number;
    completed_orders: number;
    pending_orders: number;
    cancelled_orders: number;
    total_spent: number;
    member_since: string;
    last_order_date?: string;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  error?: string;
}

// Cookie helper functions
function setCookie(name: string, value: string, days: number = 30): void {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const value = c.substring(nameEQ.length, c.length);
      return value ? value.trim() : null;
    }
  }
  return null;
}

function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

// Get token from cookie
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  // Try cookie first
  let token = getCookie('auth_token');

  // If not in cookie, try localStorage as fallback
  if (!token) {
    token = localStorage.getItem('auth_token');
  }

  // Trim and return
  return token ? token.trim() : null;
}

// Save token to cookie
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  setCookie('auth_token', token, 30); // 30 days expiry
}

// Remove token from cookie
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  deleteCookie('auth_token');
  deleteCookie('user');
  // Also clear localStorage for backward compatibility
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
}

// Save user to localStorage
export function saveUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
}

// Get user from localStorage
export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// Make authenticated request
async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  return fetch(url, {
    ...options,
    headers,
  });
}

// Registration Flow
// Note: Registration endpoints are at /api/customer (without /v1)
export async function sendRegistrationOTP(phoneNumber: string): Promise<OTPResponse> {
  const response = await fetch(`${CUSTOMER_API_BASE}/register/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ phone_number: phoneNumber }),
  });

  const result = await response.json();

  // Handle non-200 status codes
  if (!response.ok && !result.success) {
    const error: any = new Error(result.message || 'Failed to send OTP');
    error.errors = result.errors;
    throw error;
  }

  return result;
}

export async function verifyRegistrationOTP(phoneNumber: string, otp: string): Promise<OTPResponse> {
  const response = await fetch(`${CUSTOMER_API_BASE}/register/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ phone_number: phoneNumber, otp }),
  });

  const result = await response.json();

  // Handle non-200 status codes or failed verification
  if (!response.ok && !result.success) {
    const error: any = new Error(result.message || 'OTP verification failed');
    error.errors = result.errors;
    throw error;
  }

  return result;
}

export async function completeRegistration(data: {
  phone_number: string;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${CUSTOMER_API_BASE}/register/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  // Handle failed registration
  if (!result.success) {
    const error: any = new Error(result.message || 'Registration failed');
    error.errors = result.errors;
    throw error;
  }

  // Handle HTTP errors (non-200 status)
  if (!response.ok) {
    const error: any = new Error(result.message || 'Registration failed');
    error.errors = result.errors;
    throw error;
  }

  // Save token and user on successful registration
  if (result.success && result.data && result.data.token) {
    setAuthToken(result.data.token);
    saveUser(result.data.user);
  }

  return result;
}

// Login
// Note: Login endpoint is at /api/customer (without /v1)
export async function login(loginCredential: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${CUSTOMER_API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ login: loginCredential, password }),
  });

  const result = await response.json();

  // Handle failed login (API returns success: false for invalid credentials)
  if (!result.success) {
    const error: any = new Error(result.message || 'Invalid credentials');
    error.errors = result.errors;
    throw error;
  }

  // Handle HTTP errors (non-200 status)
  if (!response.ok) {
    const error: any = new Error(result.message || 'Login failed');
    error.errors = result.errors;
    throw error;
  }

  // Save token and user on successful login
  if (result.success && result.data && result.data.token) {
    setAuthToken(result.data.token);
    saveUser(result.data.user);
  }

  return result;
}

// Google OAuth
// Note: Google OAuth endpoint is at /api/customer/auth/google (without /v1)
export function getGoogleOAuthUrl(redirectUrl?: string): string {
  const oauthBaseUrl = 'https://seba.rangpurit.com/api/customer/auth/google';

  if (typeof window === 'undefined') {
    // SSR fallback - return base URL without redirect
    return oauthBaseUrl;
  }

  // Set redirect URL directly to /google/process
  // The backend will handle the OAuth callback and redirect here with the token
  const defaultRedirect = `${window.location.origin}/google/process`;
  const finalRedirect = redirectUrl || defaultRedirect;

  // Make sure the redirect URL is a full URL (not just a path)
  const fullRedirectUrl = finalRedirect.startsWith('http')
    ? finalRedirect
    : `${window.location.origin}${finalRedirect.startsWith('/') ? finalRedirect : '/' + finalRedirect}`;

  // Pass the redirect URL to the backend
  // The backend will handle OAuth and redirect to this URL with the token
  return `${oauthBaseUrl}?redirect_url=${encodeURIComponent(fullRedirectUrl)}`;
}

export async function loginWithGoogleIdToken(idToken: string): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/google/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ id_token: idToken }),
  });

  const result = await response.json();

  if (result.success && result.data.token) {
    setAuthToken(result.data.token);
    saveUser(result.data.user);
  }

  return result;
}

export async function linkGoogleAccount(idToken: string): Promise<{ success: boolean; message: string; data?: any }> {
  const response = await authenticatedFetch(`${BASE_URL}/auth/google/link`, {
    method: 'POST',
    body: JSON.stringify({ id_token: idToken }),
  });

  const result = await response.json();

  if (result.success && result.data?.user) {
    saveUser(result.data.user);
  }

  return result;
}

export async function unlinkGoogleAccount(): Promise<{ success: boolean; message: string }> {
  const response = await authenticatedFetch(`${BASE_URL}/auth/google/unlink`, {
    method: 'DELETE',
  });

  return response.json();
}

// Password Reset
// Note: Password reset endpoints are at /api/customer (without /v1)
export async function sendPasswordResetOTP(phoneNumber: string): Promise<{ success: boolean; message: string; errors?: Record<string, string[]> }> {
  const response = await fetch(`${CUSTOMER_API_BASE}/password/reset/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ phone_number: phoneNumber }),
  });

  const result = await response.json();

  // Handle non-200 status codes
  if (!response.ok && !result.success) {
    const error: any = new Error(result.message || 'Failed to send OTP');
    error.errors = result.errors;
    throw error;
  }

  return result;
}

export async function resetPassword(data: {
  phone_number: string;
  otp: string;
  password: string;
  password_confirmation: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${CUSTOMER_API_BASE}/password/reset/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  // Handle both HTTP errors and API-level failures
  if (!response.ok || !result.success) {
    const error: any = new Error(result.message || 'Password reset failed');
    error.errors = result.errors;
    throw error;
  }

  if (result.success && result.data && result.data.token) {
    setAuthToken(result.data.token);
    saveUser(result.data.user);
  }

  return result;
}

// Profile Management
export async function getProfile(): Promise<ProfileResponse> {
  const response = await authenticatedFetch(`${PROFILE_API_BASE}/profile`);

  if (!response.ok) {
    if (response.status === 401) {
      removeAuthToken();
    }
    throw new Error('Failed to fetch profile');
  }

  const result = await response.json();

  if (result.success && result.data) {
    saveUser(result.data);
  }

  return result;
}

export async function updateProfile(data: {
  name?: string;
  email?: string;
}): Promise<{ success: boolean; message: string; data?: { user: User }; errors?: Record<string, string[]> }> {
  const response = await authenticatedFetch(`${PROFILE_API_BASE}/profile`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok && !result.success) {
    const error: any = new Error(result.message || 'Profile update failed');
    error.errors = result.errors;
    throw error;
  }

  if (result.success && result.data?.user) {
    saveUser(result.data.user);
  }

  return result;
}

export async function updateProfilePicture(file: File): Promise<{ success: boolean; message: string; data?: { profile_picture: string } }> {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const formData = new FormData();
  formData.append('profile_picture', file);

  const response = await fetch(`${PROFILE_API_BASE}/profile/picture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      // Don't set Content-Type for FormData - browser will set it with boundary
    },
    body: formData,
  });

  const result = await response.json();

  // Refresh profile after picture update
  if (result.success) {
    const profileResult = await getProfile();
    if (profileResult.success) {
      saveUser(profileResult.data);
    }
  }

  return result;
}

export async function deleteProfilePicture(): Promise<{ success: boolean; message: string }> {
  const response = await authenticatedFetch(`${PROFILE_API_BASE}/profile/picture`, {
    method: 'DELETE',
  });

  const result = await response.json();

  // Refresh profile after picture deletion
  if (result.success) {
    const profileResult = await getProfile();
    if (profileResult.success) {
      saveUser(profileResult.data);
    }
  }

  return result;
}

export async function changePassword(data: {
  current_password: string;
  password: string;
  password_confirmation: string;
}): Promise<{ success: boolean; message: string; errors?: Record<string, string[]> }> {
  const response = await authenticatedFetch(`${PROFILE_API_BASE}/profile/password`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok && !result.success) {
    const error: any = new Error(result.message || 'Password change failed');
    error.errors = result.errors;
    throw error;
  }

  return result;
}

export async function getProfileStatistics(): Promise<StatisticsResponse> {
  const response = await authenticatedFetch(`${PROFILE_API_BASE}/profile/statistics`);

  if (!response.ok) {
    throw new Error('Failed to fetch statistics');
  }

  return response.json();
}

export async function deleteAccount(data: {
  password: string;
  confirmation: string;
}): Promise<{ success: boolean; message: string }> {
  const response = await authenticatedFetch(`${PROFILE_API_BASE}/profile`, {
    method: 'DELETE',
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (result.success) {
    removeAuthToken();
  }

  return result;
}

// Logout - uses /api/customer/logout (not /api/v1/customer/logout)
export async function logout(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await authenticatedFetch(`${CUSTOMER_API_BASE}/logout`, {
      method: 'POST',
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Logout failed');
    }
    return result;
  } catch (error) {
    console.error('Logout error:', error);
    // Still remove token even if API call fails
  } finally {
    removeAuthToken();
  }

  return { success: true, message: 'Logged out successfully' };
}

