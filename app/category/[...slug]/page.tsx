import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import CategoryPageClient from './CategoryPageClient';
import { getProducts, getCategories, getBrands } from '@/app/lib/api';

// Server Component with SSR
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug: slugArray } = await params;
  const searchParamsResolved = await searchParams;
  
  const slug = Array.isArray(slugArray) ? slugArray[0] : slugArray;
  const page = parseInt((searchParamsResolved.page as string) || '1');
  const sort = (searchParamsResolved.sort as any) || 'latest';
  const minPrice = searchParamsResolved.min_price ? parseInt(searchParamsResolved.min_price as string) : undefined;
  const maxPrice = searchParamsResolved.max_price ? parseInt(searchParamsResolved.max_price as string) : undefined;
  const brandId = searchParamsResolved.brand_id ? parseInt(searchParamsResolved.brand_id as string) : undefined;
  const subcategoryId = searchParamsResolved.subcategory_id ? parseInt(searchParamsResolved.subcategory_id as string) : undefined;

  // Fetch categories and brands
  const [categoriesData, brandsData] = await Promise.all([
    getCategories(true),
    getBrands(),
  ]);

  // Find current category by slug
  const currentCategory = categoriesData.data?.find(cat => cat.slug === slug);
  
  if (!currentCategory) {
    notFound();
  }

  // Fetch products for this category
  const productsData = await getProducts({
    page,
    per_page: 20,
    category_id: subcategoryId || currentCategory.id,
    min_price: minPrice,
    max_price: maxPrice,
    brand_id: brandId,
    sort,
  });

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    }>
      <CategoryPageClient
        currentCategory={currentCategory}
        initialProducts={productsData}
        initialBrands={brandsData}
        initialPage={page}
        initialSort={sort}
        initialMinPrice={minPrice}
        initialMaxPrice={maxPrice}
        initialBrandId={brandId}
        initialSubcategoryId={subcategoryId}
      />
    </Suspense>
  );
}

// Enable ISR
export const revalidate = 1800; // 30 minutes

// Generate static paths for main categories
export async function generateStaticParams() {
  try {
    const categoriesData = await getCategories(false);
    
    if (!categoriesData.success) {
      return [];
    }

    return categoriesData.data.map((category) => ({
      slug: [category.slug],
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
