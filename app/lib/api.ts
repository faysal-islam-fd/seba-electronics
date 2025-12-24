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
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
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
      throw new Error(`Failed to fetch products: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
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

// Fetch featured products (SSR)
// Note: Using /products endpoint with filtering since /products/featured returns 500
export async function getFeaturedProducts(limit: number = 10): Promise<{ success: boolean; data: Product[] }> {
  try {
    console.log('🔄 Fetching featured products from /products endpoint...');
    
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
    
    console.log(`✅ Found ${featuredProducts.length} featured products`);
    
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
    console.log('🔄 Fetching top-selling products from /products endpoint...');
    
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
      console.log('ℹ️ No top-selling products marked, using latest products');
      topSellingProducts = result.data;
    }
    
    console.log(`✅ Found ${topSellingProducts.slice(0, limit).length} top-selling products`);
    
    return {
      success: true,
      data: topSellingProducts.slice(0, limit),
    };
  } catch (error) {
    console.error('❌ Error fetching top selling products:', error);
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
      next: { revalidate: 86400 }, // Cache for 24 hours
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.status}`);
    }
    
    return await res.json();
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

