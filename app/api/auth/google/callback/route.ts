import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = 'https://seba.rangpurit.com/api/customer';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    // Log for debugging
    console.log('OAuth callback received:', {
      code: code ? 'present' : 'missing',
      state: state ? 'present' : 'missing',
      allParams: Object.fromEntries(searchParams.entries())
    });

    if (!code || !state) {
      // If we don't have code/state, check if we have token (backend might redirect directly with token)
      const token = searchParams.get('token');
      const success = searchParams.get('success');
      
      if (token && success === 'true') {
        // Backend redirected directly with token, redirect to /google/process
        const params = new URLSearchParams();
        searchParams.forEach((value, key) => {
          params.append(key, value);
        });
        return NextResponse.redirect(
          new URL(`/google/process?${params.toString()}`, request.url)
        );
      }
      
      // No code/state and no token - error
      console.error('Missing required OAuth parameters:', { code, state, token, success });
      return NextResponse.redirect(
        new URL('/login?error=missing_params', request.url)
      );
    }

    // Check if final_redirect is in query params (passed from frontend)
    let frontendRedirectUrl = '/google/process';
    const finalRedirectParam = searchParams.get('final_redirect');
    if (finalRedirectParam) {
      try {
        const url = new URL(finalRedirectParam);
        frontendRedirectUrl = url.pathname;
      } catch {
        frontendRedirectUrl = finalRedirectParam.startsWith('/') 
          ? finalRedirectParam 
          : `/${finalRedirectParam}`;
      }
    } else {
      // Decode the state to get the redirect_url as fallback
      try {
        const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
        if (decodedState.redirect_url) {
          // Extract just the path from the redirect_url
          try {
            const url = new URL(decodedState.redirect_url);
            frontendRedirectUrl = url.pathname;
          } catch {
            // If it's not a full URL, use it as is
            frontendRedirectUrl = decodedState.redirect_url.startsWith('/') 
              ? decodedState.redirect_url 
              : `/${decodedState.redirect_url}`;
          }
        }
      } catch (e) {
        console.error('Failed to decode state:', e);
        // Use default redirect
      }
    }

    // Call the backend callback endpoint to exchange code for token
    const backendCallbackUrl = `${BACKEND_BASE_URL}/auth/google/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;
    
    try {
      const response = await fetch(backendCallbackUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        redirect: 'follow',
      });

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        if (data.success && data.data?.token) {
          // Redirect to frontend with token
          const params = new URLSearchParams({
            success: 'true',
            token: data.data.token,
          });
          
          if (data.data.user) {
            params.append('user', Buffer.from(JSON.stringify(data.data.user)).toString('base64'));
          }
          
          if (data.data.is_new_user) {
            params.append('is_new_user', 'true');
          }

          return NextResponse.redirect(
            new URL(`${frontendRedirectUrl}?${params.toString()}`, request.url)
          );
        }
      }

      // If backend redirects, try to extract token from redirect URL
      if (response.redirected || response.status === 302 || response.status === 301) {
        const redirectLocation = response.headers.get('location');
        if (redirectLocation) {
          try {
            const redirectUrl = new URL(redirectLocation);
            const token = redirectUrl.searchParams.get('token');
            if (token) {
              const params = new URLSearchParams({
                success: 'true',
                token: token,
              });
              
              const user = redirectUrl.searchParams.get('user');
              if (user) {
                params.append('user', user);
              }
              
              const isNewUser = redirectUrl.searchParams.get('is_new_user');
              if (isNewUser) {
                params.append('is_new_user', isNewUser);
              }

              return NextResponse.redirect(
                new URL(`${frontendRedirectUrl}?${params.toString()}`, request.url)
              );
            }
          } catch (e) {
            console.error('Failed to parse redirect URL:', e);
          }
        }
      }

      // If we can't get the token, redirect with code and state for frontend to handle
      const params = new URLSearchParams({
        code,
        state,
      });

      return NextResponse.redirect(
        new URL(`${frontendRedirectUrl}?${params.toString()}`, request.url)
      );
    } catch (error) {
      console.error('Error calling backend callback:', error);
      // Redirect to frontend with code and state for frontend to handle
      const params = new URLSearchParams({
        code,
        state,
      });

      return NextResponse.redirect(
        new URL(`${frontendRedirectUrl}?${params.toString()}`, request.url)
      );
    }
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/login?error=oauth_failed', request.url)
    );
  }
}

