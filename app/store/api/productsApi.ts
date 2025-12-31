import { apiSlice } from './apiSlice';

export interface Brand {
  id: number;
  name: string;
  logo?: string;
}

export interface Category {
  id: number;
  name: string;
  slug?: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  thumbnail?: string; // Legacy field
  thumbnail_image?: string; // Actual API field - full URL from Cloudinary
  price: number | string; // API returns as string "100.00"
  final_price?: number; // Calculated field (not in API response)
  discount?: number | string; // API returns as string "0.00"
  discount_type?: string; // "flat" or "percent"
  discount_percentage?: number; // Calculated from discount
  stock: number;
  is_featured: boolean;
  is_top_selling: boolean;
  is_low_stock?: boolean;
  is_out_of_stock?: boolean;
  brand?: Brand;
  category?: Category;
  categories?: Category[];
  // Additional fields from API
  type?: string;
  description?: string;
  sku?: string | null;
  purchase_price?: string;
  low_stock_alert?: number;
  is_support_emi?: boolean;
  has_warranty?: boolean;
  warranty_months?: number | null;
  warranty_details?: string | null;
  status?: string;
  is_active?: boolean;
  vendor_id?: number | null;
  vendor?: any;
}

export interface ProductDetail extends Product {
  description: string;
  sku: string;
  type: 'single' | 'variable';
  is_support_emi: boolean;
  galleries?: {
    id: number;
    type: 'image' | 'youtube';
    file_path?: string;
    youtube_url?: string;
    position: number;
  }[];
  specifications?: {
    group_name: string;
    items: {
      key?: string;
      value: string;
    }[];
  }[];
  warranties?: {
    group_name: string;
    items?: {
      type: string;
      duration: number;
    }[];
  }[];
  attributes?: any[];
  vendor?: any;
  unit?: {
    id: number;
    name: string;
    code: string;
  };
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface ProductDetailResponse {
  success: boolean;
  data: ProductDetail;
}

// Vendor type for API
export type VendorType = 'official' | 'seller';

export interface ProductsQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: number;
  brand_id?: number;
  vendor_id?: number;
  vendor_type?: VendorType; // 'official' or 'seller'
  min_price?: number;
  max_price?: number;
  sort?: 'latest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
}

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductsQueryParams>({
      query: (params) => ({
        url: '/products',
        params,
      }),
      providesTags: ['Products'],
    }),
    getFeaturedProducts: builder.query<{ success: boolean; data: Product[] }, { limit?: number }>({
      query: ({ limit = 10 }) => ({
        url: '/products/featured',
        params: { limit },
      }),
      providesTags: ['FeaturedProducts'],
    }),
    getTopSellingProducts: builder.query<{ success: boolean; data: Product[] }, { limit?: number }>({
      query: ({ limit = 10 }) => ({
        url: '/products/top-selling',
        params: { limit },
      }),
      providesTags: ['TopSellingProducts'],
    }),
    getProductDetails: builder.query<ProductDetailResponse, string | number>({
      query: (identifier) => `/products/${identifier}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),
    // Vendor products endpoint - supports both official and seller vendor types
    getVendorProducts: builder.query<ProductsResponse, ProductsQueryParams & { vendor_type: VendorType; vendor_id?: number }>({
      query: (params) => ({
        url: '/products',
        params,
      }),
      providesTags: ['Products'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetFeaturedProductsQuery,
  useGetTopSellingProductsQuery,
  useGetProductDetailsQuery,
  useGetVendorProductsQuery,
} = productsApi;

