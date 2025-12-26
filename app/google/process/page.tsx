'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { setAuthToken, saveUser, getProfile } from '@/app/lib/authApi';
import { User } from '@/app/lib/authApi';

export default function GoogleProcessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing Google authentication...');

  useEffect(() => {
    const processGoogleAuth = async () => {
      try {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');
        const isNewUser = searchParams.get('is_new_user');
        const success = searchParams.get('success');
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        // If we have code and state but no token, redirect to API route to handle token exchange
        // This happens if the backend redirects directly to /google/process instead of /api/auth/google/callback
        if (code && state && !token) {
          // Redirect to the API route which will handle the token exchange server-side
          const apiUrl = `/api/auth/google/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}&final_redirect=${encodeURIComponent(window.location.origin + '/google/process')}`;
          window.location.href = apiUrl;
          return;
        }

        // Check if authentication was successful
        if (success !== 'true' || !token) {
          setStatus('error');
          setMessage('Google authentication failed. Please try again.');
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        // Step 1: Save the token as cookie
        setAuthToken(token);

        // Step 2: Get user data and authenticate
        let userData: User | null = null;

        // Try to parse user data from URL if provided
        if (userParam) {
          try {
            try {
              // Try to decode as base64 first (as per API docs)
              userData = JSON.parse(atob(userParam)) as User;
            } catch {
              // If base64 decode fails, try as URL-decoded JSON string
              userData = JSON.parse(decodeURIComponent(userParam)) as User;
            }
          } catch (e) {
            console.error('Failed to parse user data from URL:', e);
            // Will fetch profile below
          }
        }

        // If we don't have user data, fetch it using the token
        if (!userData) {
          try {
            const profileResult = await getProfile();
            if (profileResult.success && profileResult.data) {
              userData = profileResult.data;
            } else {
              throw new Error('Failed to fetch user profile');
            }
          } catch (profileError) {
            console.error('Failed to fetch user profile:', profileError);
            setStatus('error');
            setMessage('Failed to authenticate. Please try again.');
            setTimeout(() => router.push('/login'), 3000);
            return;
          }
        }

        // Step 3: Save user data and update auth context
        if (userData) {
          saveUser(userData);
          setUser(userData);
        }

        // Step 4: Redirect to home page immediately after saving token
        router.push('/');
      } catch (error) {
        console.error('Google auth processing error:', error);
        setStatus('error');
        setMessage('An error occurred during authentication. Please try again.');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    processGoogleAuth();
  }, [searchParams, router, setUser]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authenticating...</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}

