import { Suspense } from 'react';
import { Metadata } from 'next';
import SearchPageClient from './SearchPageClient';
import { getProducts, getBrands } from '@/app/lib/api';

// Generate Metadata for SEO
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const params = await searchParams;
  const query = (params.q as string) || '';

  const title = query ? `Search results for "${query}" | Pickaboo` : 'Search Products | Pickaboo';

  return {
    title,
    description: `Search for ${query || 'products'} at Pickaboo.`,
    robots: {
      index: false, // Search results should typically not be indexed
      follow: true,
    },
  };
}

// Server Component with SSR
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = (params.q as string) || '';
  const page = parseInt((params.page as string) || '1');
  const sort = (params.sort as any) || 'latest';
  const minPrice = params.min_price ? parseInt(params.min_price as string) : undefined;
  const maxPrice = params.max_price ? parseInt(params.max_price as string) : undefined;
  const brandId = params.brand_id ? parseInt(params.brand_id as string) : undefined;

  // Fetch data on server
  const [productsData, brandsData] = await Promise.all([
    getProducts({
      page,
      per_page: 20,
      search: query,
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
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search results...</p>
        </div>
      </div>
    }>
      <SearchPageClient
        initialProducts={productsData}
        initialBrands={brandsData}
        initialQuery={query}
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
