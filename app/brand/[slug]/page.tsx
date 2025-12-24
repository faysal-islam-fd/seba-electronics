import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import BrandPageClient from './BrandPageClient';
import { getProducts, getBrands, getCategories } from '@/app/lib/api';

// Server Component with SSR
export default async function BrandPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;
  
  const page = parseInt((searchParamsResolved.page as string) || '1');
  const sort = (searchParamsResolved.sort as any) || 'latest';
  const minPrice = searchParamsResolved.min_price ? parseInt(searchParamsResolved.min_price as string) : undefined;
  const maxPrice = searchParamsResolved.max_price ? parseInt(searchParamsResolved.max_price as string) : undefined;
  const categoryId = searchParamsResolved.category_id ? parseInt(searchParamsResolved.category_id as string) : undefined;

  // Fetch brands to find the current brand
  const brandsData = await getBrands();
  
  // Find current brand by slug
  const currentBrand = brandsData.data?.find(brand => brand.slug === slug);
  
  if (!currentBrand) {
    notFound();
  }

  // Fetch products for this brand
  const [productsData, categoriesData] = await Promise.all([
    getProducts({
      page,
      per_page: 20,
      brand_id: currentBrand.id,
      category_id: categoryId,
      min_price: minPrice,
      max_price: maxPrice,
      sort,
    }),
    getCategories(false),
  ]);

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading brand...</p>
        </div>
      </div>
    }>
      <BrandPageClient
        currentBrand={currentBrand}
        initialProducts={productsData}
        initialCategories={categoriesData}
        initialPage={page}
        initialSort={sort}
        initialMinPrice={minPrice}
        initialMaxPrice={maxPrice}
        initialCategoryId={categoryId}
      />
    </Suspense>
  );
}

// Enable ISR
export const revalidate = 1800; // 30 minutes

// Generate static paths for popular brands
export async function generateStaticParams() {
  try {
    const brandsData = await getBrands();
    
    if (!brandsData.success) {
      return [];
    }

    return brandsData.data.map((brand) => ({
      slug: brand.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

