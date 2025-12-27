import { Suspense } from 'react';
import HotDealsPageClient from './HotDealsPageClient';
import { getBrands, BrandsResponse, ProductsResponse } from '@/app/lib/api';

const BASE_URL = 'https://seba.rangpurit.com/api/v1';

// Fetch featured products with pagination
async function getFeaturedProductsPaginated(params: {
  page?: number;
  per_page?: number;
  min_price?: number;
  max_price?: number;
  brand_id?: number;
  sort?: string;
}): Promise<ProductsResponse> {
  const queryParams = new URLSearchParams();
  
  // Fetch more products to filter featured ones
  queryParams.append('per_page', '100');
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && key !== 'page' && key !== 'per_page') {
      queryParams.append(key, String(value));
    }
  });

  const url = `${BASE_URL}/products?${queryParams.toString()}`;
  
  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 },
    });
    
    if (!res.ok) {
      return {
        success: false,
        data: [],
        meta: { current_page: 1, per_page: 20, total: 0, last_page: 1 },
      };
    }
    
    const jsonData = await res.json();
    
    // Filter for featured products
    const featuredProducts = jsonData.data?.filter((p: any) => p.is_featured) || [];
    
    // Apply pagination
    const page = params.page || 1;
    const perPage = params.per_page || 20;
    const startIndex = (page - 1) * perPage;
    const paginatedProducts = featuredProducts.slice(startIndex, startIndex + perPage);
    
    return {
      success: true,
      data: paginatedProducts,
      meta: {
        current_page: page,
        per_page: perPage,
        total: featuredProducts.length,
        last_page: Math.ceil(featuredProducts.length / perPage) || 1,
      },
    };
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return {
      success: false,
      data: [],
      meta: { current_page: 1, per_page: 20, total: 0, last_page: 1 },
    };
  }
}

// Server Component with SSR
export default async function HotDealsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParamsResolved = await searchParams;
  
  const page = parseInt((searchParamsResolved.page as string) || '1');
  const sort = (searchParamsResolved.sort as any) || 'latest';
  const minPrice = searchParamsResolved.min_price ? parseInt(searchParamsResolved.min_price as string) : undefined;
  const maxPrice = searchParamsResolved.max_price ? parseInt(searchParamsResolved.max_price as string) : undefined;
  const brandId = searchParamsResolved.brand_id ? parseInt(searchParamsResolved.brand_id as string) : undefined;

  // Fetch products and brands
  const [productsData, brandsData] = await Promise.all([
    getFeaturedProductsPaginated({
      page,
      per_page: 20,
      min_price: minPrice,
      max_price: maxPrice,
      brand_id: brandId,
      sort,
    }),
    getBrands(),
  ]);

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hot deals...</p>
        </div>
      </div>
    }>
      <HotDealsPageClient
        initialProducts={productsData}
        initialBrands={brandsData}
        initialPage={page}
        initialSort={sort}
        initialMinPrice={minPrice}
        initialMaxPrice={maxPrice}
        initialBrandId={brandId}
      />
    </Suspense>
  );
}

// Enable ISR
export const revalidate = 1800; // 30 minutes

