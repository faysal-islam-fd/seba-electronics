import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import CategoryPageClient from './CategoryPageClient';
import { getProducts, getCategories, getBrands, ProductsResponse, Category } from '@/app/lib/api';

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

  // Find current category by slug (recursively search in all categories)
  const findCategoryBySlug = (categories: Category[], targetSlug: string): Category | null => {
    for (const category of categories) {
      if (category.slug === targetSlug) {
        return category;
      }
      if (category.children && category.children.length > 0) {
        const found = findCategoryBySlug(category.children, targetSlug);
        if (found) return found;
      }
    }
    return null;
  };

  const currentCategory = findCategoryBySlug(categoriesData.data || [], slug);
  
  if (!currentCategory) {
    notFound();
  }

  // Use subcategory ID if selected, otherwise use current category ID
  const categoryIdToFetch = subcategoryId || currentCategory.id;

  console.log(`📦 Fetching products for category "${currentCategory.name}" (slug: ${slug})`);
  console.log(`📋 Category ID: ${categoryIdToFetch}`);
  console.log(`📋 API Call: GET /products?category_id=${categoryIdToFetch}&page=${page}&per_page=20&sort=${sort}`);

  // Fetch products directly from API with category_id
  const productsData = await getProducts({
    page,
    per_page: 20,
    category_id: categoryIdToFetch,
    min_price: minPrice,
    max_price: maxPrice,
    brand_id: brandId,
    sort,
  });

  console.log(`✅ API Response - success: ${productsData.success}`);
  console.log(`✅ API Response - products count: ${productsData.data?.length || 0}`);
  console.log(`✅ API Response - meta:`, JSON.stringify(productsData.meta, null, 2));
  
  if (!productsData.success) {
    console.error('❌ API returned success: false');
  }
  
  if (!productsData.data || productsData.data.length === 0) {
    console.warn(`⚠️ No products found for category ID ${categoryIdToFetch}`);
  } else {
    console.log(`✅ Successfully loaded ${productsData.data.length} products`);
    console.log(`✅ First product:`, productsData.data[0]?.title || 'N/A');
  }

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
