// Server-side API functions for SSR
const BASE_URL = 'https://seba.rangpurit.com/api/v1';

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
  type?: 'single' | 'variable'; // Product type - single or variable
  shipping_in_dhaka?: string | number;
  shipping_outside_dhaka?: string | number;
  brand?: {
    id: number;
    name: string;
    slug?: string;
  };
  category?: {
    id: number;
    name: string;
    slug?: string;
  };
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
  categories?: {
    id: number;
    name: string;
    slug: string;
  }[];
  attributes?: any[];
  vendor?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  unit?: {
    id: number;
    name: string;
    code: string;
  };
  club_point?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  parent_id: number | null;
  children?: Category[];
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string;
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

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface BrandsResponse {
  success: boolean;
  data: Brand[];
}

// Fetch products with filters (SSR)
export async function getProducts(params: {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: number;
  brand_id?: number;
  vendor_id?: number;
  min_price?: number;
  max_price?: number;
  is_new_arrival?: number;
  sort?: 'latest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
} = {}): Promise<ProductsResponse> {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  const url = `${BASE_URL}/products?${queryParams.toString()}`;



  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });



    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ API Error Response:`, errorText);
      throw new Error(`Failed to fetch products: ${res.status}`);
    }

    const jsonData = await res.json();


    return jsonData;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return {
      success: false,
      data: [],
      meta: {
        current_page: 1,
        per_page: 15,
        total: 0,
        last_page: 1,
      },
    };
  }
}

// Fetch new arrival products (SSR)
export async function getNewArrivalProducts(limit: number = 10): Promise<ProductsResponse> {
  return getProducts({ is_new_arrival: 1, per_page: limit, sort: 'latest' });
}

// Vendor type for API
export type VendorType = 'official' | 'seller';

// Fetch products by vendor type (SSR)
export async function getVendorProducts(params: {
  vendor_type: VendorType;
  vendor_id?: number; // Required when vendor_type is 'seller'
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: number;
  brand_id?: number;
  min_price?: number;
  max_price?: number;
  sort?: 'latest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
}): Promise<ProductsResponse> {
  const queryParams = new URLSearchParams();

  // Always add vendor_type
  queryParams.append('vendor_type', params.vendor_type);

  // Add vendor_id only for seller type (required for seller vendor type)
  if (params.vendor_type === 'seller' && params.vendor_id) {
    queryParams.append('vendor_id', String(params.vendor_id));
  }

  // Add other optional parameters
  Object.entries(params).forEach(([key, value]) => {
    if (key !== 'vendor_type' && key !== 'vendor_id' && value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  const url = `${BASE_URL}/products?${queryParams.toString()}`;



  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });



    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Vendor API Error Response:`, errorText);
      throw new Error(`Failed to fetch vendor products: ${res.status}`);
    }

    const jsonData = await res.json();


    return jsonData;
  } catch (error) {
    console.error('❌ Error fetching vendor products:', error);
    return {
      success: false,
      data: [],
      meta: {
        current_page: 1,
        per_page: 15,
        total: 0,
        last_page: 1,
      },
    };
  }
}

// Fetch product reviews (SSR)
export interface ProductReviewsResponse {
  success: boolean;
  data: Array<{
    id: number;
    rating: number;
    title?: string;
    comment?: string;
    user: {
      id: number;
      name: string;
    };
    created_at: string;
  }>;
  rating_summary?: {
    average: number;
    total_reviews: number;
    rating_breakdown: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
}

export async function getProductReviews(productId: string | number): Promise<ProductReviewsResponse> {
  try {
    const url = `${BASE_URL}/products/${productId}/reviews?per_page=1`;
    const res = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      return {
        success: false,
        data: [],
      };
    }

    const jsonData = await res.json();
    return jsonData;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return {
      success: false,
      data: [],
    };
  }
}

// Fetch featured products (SSR)
// Note: Using /products endpoint with filtering since /products/featured returns 500
export async function getFeaturedProducts(limit: number = 10): Promise<{ success: boolean; data: Product[] }> {
  try {


    // Fetch more products and filter for featured ones
    const res = await fetch(`${BASE_URL}/products?per_page=50`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      console.warn(`⚠️ API returned ${res.status} for products. Using fallback.`);
      return { success: false, data: [] };
    }

    const result = await res.json();

    if (!result.success || !result.data) {
      console.warn('⚠️ Invalid API response structure');
      return { success: false, data: [] };
    }

    // Filter for featured products
    const featuredProducts = result.data.filter((p: Product) => p.is_featured).slice(0, limit);



    return {
      success: true,
      data: featuredProducts,
    };
  } catch (error) {
    console.error('❌ Error fetching featured products:', error);
    return { success: false, data: [] };
  }
}

// Fetch top selling products (SSR)
// Note: Using /products endpoint with filtering since /products/top-selling returns 500
export async function getTopSellingProducts(limit: number = 10): Promise<{ success: boolean; data: Product[] }> {
  try {


    // Fetch more products and filter for top-selling ones
    const res = await fetch(`${BASE_URL}/products?per_page=50`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      console.warn(`⚠️ API returned ${res.status} for products. Using fallback.`);
      return { success: false, data: [] };
    }

    const result = await res.json();

    if (!result.success || !result.data) {
      console.warn('⚠️ Invalid API response structure');
      return { success: false, data: [] };
    }

    // Filter for top-selling products, or just return latest if none marked
    let topSellingProducts = result.data.filter((p: Product) => p.is_top_selling);

    // If no products are marked as top-selling, use the latest products
    if (topSellingProducts.length === 0) {

      topSellingProducts = result.data;
    }



    return {
      success: true,
      data: topSellingProducts.slice(0, limit),
    };
  } catch (error) {
    console.error('❌ Error fetching top selling products:', error);
    return { success: false, data: [] };
  }
}

// Fetch new arrival products (SSR)
export async function getNewArrivals(limit: number = 10): Promise<{ success: boolean; data: Product[] }> {
  try {
    const res = await getProducts({
      is_new_arrival: 1,
      per_page: limit,
      sort: 'latest'
    });

    if (!res.success) {
      return { success: false, data: [] };
    }

    return {
      success: true,
      data: res.data
    };
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return { success: false, data: [] };
  }
}

// Fetch product details (SSR)
export async function getProductDetails(identifier: string | number): Promise<ProductDetailResponse | null> {
  try {
    const res = await fetch(`${BASE_URL}/products/${identifier}`, {
      next: { revalidate: 7200 }, // Cache for 2 hours
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
}

// Fetch categories (SSR)
export async function getCategories(withChildren: boolean = false): Promise<CategoriesResponse> {
  const url = `${BASE_URL}/categories${withChildren ? '?with_children=true' : ''}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour to allow static generation
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.status}`);
    }

    const data = await res.json();

    if (withChildren) {
      if (data.success && data.data) {
        // Log removed
      }
    }

    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { success: false, data: [] };
  }
}

// Fetch brands (SSR)
export async function getBrands(active: boolean = true): Promise<BrandsResponse> {
  const url = `${BASE_URL}/brands${active ? '?active=true' : ''}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch brands: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching brands:', error);
    return { success: false, data: [] };
  }
}

// Sliders interfaces
export interface SliderTarget {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
}

export interface Slider {
  id: number;
  image_url: string;
  type: string;
  target: SliderTarget | null;
  created_at: string;
  updated_at: string;
}

export interface SlidersResponse {
  success: boolean;
  message: string;
  data: Slider[];
}

// Fetch sliders (SSR)
export async function getSliders(): Promise<SlidersResponse> {
  const url = `${BASE_URL}/cms/sliders`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch sliders: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching sliders:', error);
    return {
      success: false,
      message: 'Failed to fetch sliders',
      data: []
    };
  }
}

// Home Categories types
export interface HomeCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
  icon: string | null;
  title: string | null;
  heading: string | null;
}

export interface HomeCategoriesResponse {
  success: boolean;
  data: HomeCategory[];
}

// Fetch home categories for homepage sections
export async function getHomeCategories(): Promise<HomeCategoriesResponse> {
  try {
    const res = await fetch(`${BASE_URL}/home-categories`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch home categories: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching home categories:', error);
    return {
      success: false,
      data: []
    };
  }
}

// Campaigns API
// -----------------------------------------------------------------------------

export interface Campaign {
  id: number;
  name: string;
  slug: string;
  image: string;
  is_lifetime: boolean;
  start_date: string;
  end_date: string;
  products_count?: number;
}

export interface CampaignsResponse {
  success: boolean;
  data: Campaign[];
}

export interface CampaignDetailsResponse {
  success: boolean;
  data: {
    campaign: Campaign;
    products: Product[];
  };
}

// Fetch all campaigns
export async function getCampaigns(homePageOnly: boolean = false): Promise<CampaignsResponse> {
  try {
    const url = `${BASE_URL}/campaigns${homePageOnly ? '?home_page=1' : ''}`;
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch campaigns: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return {
      success: false,
      data: []
    };
  }
}

// Fetch campaign details
export async function getCampaignDetails(slug: string): Promise<CampaignDetailsResponse | null> {
  try {
    const res = await fetch(`${BASE_URL}/campaigns/${slug}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching campaign details:', error);
    return null;
  }
}


