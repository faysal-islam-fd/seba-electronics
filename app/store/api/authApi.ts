import { apiSlice } from './apiSlice';
import { User, AuthResponse, ProfileResponse, StatisticsResponse, OTPResponse } from '@/app/lib/authApi';

export interface LoginRequest {
  login: string; // email or phone
  password: string;
}

export interface RegisterSendOTPRequest {
  phone_number: string;
}

export interface RegisterVerifyOTPRequest {
  phone_number: string;
  otp: string;
}

export interface RegisterCompleteRequest {
  phone_number: string;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface PasswordResetSendOTPRequest {
  phone_number: string;
}

export interface PasswordResetVerifyRequest {
  phone_number: string;
  otp: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface DeleteAccountRequest {
  password: string;
  confirmation: string;
}

export interface GoogleLoginRequest {
  id_token: string;
}

export interface LinkGoogleRequest {
  id_token: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Registration
    sendRegistrationOTP: builder.mutation<OTPResponse, RegisterSendOTPRequest>({
      query: (data) => ({
        url: '/customer/register/send-otp',
        method: 'POST',
        body: data,
      }),
    }),
    verifyRegistrationOTP: builder.mutation<OTPResponse, RegisterVerifyOTPRequest>({
      query: (data) => ({
        url: '/customer/register/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),
    completeRegistration: builder.mutation<AuthResponse, RegisterCompleteRequest>({
      query: (data) => ({
        url: '/customer/register/complete',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    
    // Login
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (data) => ({
        url: '/customer/login',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    
    // Google OAuth
    loginWithGoogle: builder.mutation<AuthResponse, GoogleLoginRequest>({
      query: (data) => ({
        url: '/customer/auth/google/login',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    linkGoogleAccount: builder.mutation<{ success: boolean; message: string; data?: any }, LinkGoogleRequest>({
      query: (data) => ({
        url: '/customer/auth/google/link',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    unlinkGoogleAccount: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/customer/auth/google/unlink',
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),
    
    // Password Reset
    sendPasswordResetOTP: builder.mutation<{ success: boolean; message: string }, PasswordResetSendOTPRequest>({
      query: (data) => ({
        url: '/customer/password/reset/send-otp',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<AuthResponse, PasswordResetVerifyRequest>({
      query: (data) => ({
        url: '/customer/password/reset/verify',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    
    // Profile - Note: Profile endpoints use /api/customer (without /v1)
    // The baseQuery will use CUSTOMER_API_BASE, so we just need /profile
    getProfile: builder.query<ProfileResponse, void>({
      query: () => '/profile',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<{ success: boolean; message: string; data?: { user: User } }, UpdateProfileRequest>({
      query: (data) => ({
        url: '/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    updateProfilePicture: builder.mutation<{ success: boolean; message: string; data?: { profile_picture: string } }, FormData>({
      query: (formData) => ({
        url: '/profile/picture',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Profile'],
    }),
    deleteProfilePicture: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/profile/picture',
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),
    changePassword: builder.mutation<{ success: boolean; message: string }, ChangePasswordRequest>({
      query: (data) => ({
        url: '/profile/password',
        method: 'PUT',
        body: data,
      }),
    }),
    getProfileStatistics: builder.query<StatisticsResponse, void>({
      query: () => '/profile/statistics',
      providesTags: ['Profile'],
    }),
    deleteAccount: builder.mutation<{ success: boolean; message: string }, DeleteAccountRequest>({
      query: (data) => ({
        url: '/profile',
        method: 'DELETE',
        body: data,
      }),
    }),
    
    // Logout
    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/customer/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useSendRegistrationOTPMutation,
  useVerifyRegistrationOTPMutation,
  useCompleteRegistrationMutation,
  useLoginMutation,
  useLoginWithGoogleMutation,
  useLinkGoogleAccountMutation,
  useUnlinkGoogleAccountMutation,
  useSendPasswordResetOTPMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateProfilePictureMutation,
  useDeleteProfilePictureMutation,
  useChangePasswordMutation,
  useGetProfileStatisticsQuery,
  useDeleteAccountMutation,
  useLogoutMutation,
} = authApi;



