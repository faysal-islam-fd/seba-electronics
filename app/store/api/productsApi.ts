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
  thumbnail: string;
  price: number;
  final_price: number;
  discount?: number;
  discount_type?: string;
  discount_percentage?: number;
  stock: number;
  is_featured: boolean;
  is_top_selling: boolean;
  is_low_stock: boolean;
  is_out_of_stock: boolean;
  brand?: Brand;
  category?: Category;
  categories?: Category[];
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
    group_id: number;
    group_name: string;
    items: {
      key: string;
      value: string;
    }[];
  }[];
  warranties?: {
    id: number;
    group_name: string;
    title: string;
    description: string;
    duration_months: number;
    duration_type: string;
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

export interface ProductsQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: number;
  brand_id?: number;
  vendor_id?: number;
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
  }),
});

export const {
  useGetProductsQuery,
  useGetFeaturedProductsQuery,
  useGetTopSellingProductsQuery,
  useGetProductDetailsQuery,
} = productsApi;

