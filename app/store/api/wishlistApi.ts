import { apiSlice } from './apiSlice';
import { Product } from './productsApi';

export interface WishlistItem {
  id: number;
  product_id: number;
  product: Product;
  created_at: string;
  updated_at: string;
}

export interface WishlistResponse {
  success: boolean;
  data: WishlistItem[];
}

export interface WishlistCheckResponse {
  success: boolean;
  in_wishlist: boolean;
}

export interface AddToWishlistRequest {
  product_id: number;
}

export interface AddToWishlistResponse {
  success: boolean;
  message?: string;
  data?: WishlistItem;
}

export interface RemoveFromWishlistResponse {
  success: boolean;
  message?: string;
}

export interface ClearWishlistResponse {
  success: boolean;
  message?: string;
}

export const wishlistApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<WishlistResponse, void>({
      query: () => '/wishlist',
      providesTags: ['Wishlist'],
    }),
    addToWishlist: builder.mutation<AddToWishlistResponse, AddToWishlistRequest>({
      query: (body) => ({
        url: '/wishlist',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Wishlist'],
    }),
    removeFromWishlist: builder.mutation<RemoveFromWishlistResponse, number>({
      query: (productId) => ({
        url: `/wishlist/products/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
    }),
    clearWishlist: builder.mutation<ClearWishlistResponse, void>({
      query: () => ({
        url: '/wishlist/clear',
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
    }),
    checkWishlist: builder.query<WishlistCheckResponse, number>({
      query: (productId) => `/wishlist/check/${productId}`,
      providesTags: (result, error, productId) => [{ type: 'Wishlist', id: productId }],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
  useCheckWishlistQuery,
} = wishlistApi;

