import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuthToken } from '@/app/lib/authApi';
import { getGuestToken } from '@/app/utils/guestToken';

// Helper to get cookie directly (for debugging)
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

const BASE_URL = 'https://seba.rangpurit.com/api/v1';
const CUSTOMER_API_BASE = 'https://seba.rangpurit.com/api/customer'; // For endpoints without /v1

// Custom baseQuery that handles different base URLs
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  // Check if this is a profile endpoint by checking the URL path
  // Profile endpoints use /profile paths, logout also uses /api/customer
  const url = typeof args === 'string' ? args : (args?.url || '');
  const isProfileEndpoint = url.includes('/profile') || url === '/logout';

  // Use different base URL for profile endpoints
  const baseUrl = isProfileEndpoint ? CUSTOMER_API_BASE : BASE_URL;

  // Debug logging


  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState, endpoint }) => {
      // Get token - try multiple methods to ensure we get it
      let token = getAuthToken();

      // If token is null, try to get from localStorage as fallback
      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('auth_token');
      }

      // Trim token in case there are any whitespace issues
      if (token) {
        token = token.trim();
      }

      // Always add Authorization header if token exists
      if (token && token.length > 0) {
        // Ensure no extra spaces or newlines in token
        const cleanToken = token.trim().replace(/\s+/g, '');
        headers.set('Authorization', `Bearer ${cleanToken}`);

        // Always log to debug 403 errors


        // Verify header is actually set
        const authHeader = headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          console.error('❌ [API] CRITICAL: Authorization header not set correctly!', {
            headerValue: authHeader,
            expected: `Bearer ${cleanToken.substring(0, 30)}...`,
          });
        } else {
        }
      } else {
        // Always warn if no token - this is critical
        /* console.error('❌ [API] No auth token found!', {
          endpoint: endpoint || 'unknown',
          cookies: typeof document !== 'undefined' ? document.cookie : 'N/A',
          localStorage: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : 'N/A',
        }); */

        // Add Guest Token if no auth token
        const guestToken = getGuestToken();
        if (guestToken) {
          headers.set('X-Guest-Token', guestToken);
        }
      }

      // Don't set Content-Type for FormData requests (needs browser to set boundary)
      // Check endpoint name for FormData endpoints
      const formDataEndpoints = ['updateProfilePicture', 'createServiceRequest', 'createReturnRequest', 'createReview'];

      if (!formDataEndpoints.includes(endpoint || '')) {
        headers.set('Content-Type', 'application/json');
      }
      headers.set('Accept', 'application/json');

      return headers;
    },
  });

  return baseQuery(args, api, extraOptions);
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Products', 'Categories', 'Brands', 'FeaturedProducts', 'TopSellingProducts', 'Profile', 'Orders', 'ServiceRequests', 'ReturnRequests', 'Wishlist', 'Reviews', 'Sliders', 'Compare', 'Campaigns'],
  endpoints: () => ({}),
});

