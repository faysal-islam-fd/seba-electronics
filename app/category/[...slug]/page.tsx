import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryPageClient from './CategoryPageClient';
import { getProducts, getCategories, getBrands, ProductsResponse, Category } from '@/app/lib/api';

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug: slugArray } = await params;
  const slugs = Array.isArray(slugArray) ? slugArray : [slugArray];
  const lastSlug = slugs[slugs.length - 1];

  // Fetch only categories to find the name
  const categoriesData = await getCategories(true);

  // Find category by slug (recursively)
  const findCategory = (categories: Category[], targetSlug: string): Category | null => {
    for (const category of categories) {
      if (category.slug === targetSlug) return category;
      if (category.slug.toLowerCase() === targetSlug.toLowerCase()) return category;
      if (category.children && category.children.length > 0) {
        const found = findCategory(category.children, targetSlug);
        if (found) return found;
      }
    }
    return null;
  };

  const category = categoriesData.data ? findCategory(categoriesData.data, lastSlug) : null;
  const categoryName = category?.name || lastSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return {
    title: `${categoryName} | Pickaboo`,
    description: `Shop for ${categoryName} at Pickaboo. Best prices and deals on ${categoryName} in Bangladesh.`,
    openGraph: {
      title: `${categoryName} | Pickaboo`,
      description: `Shop for ${categoryName} at Pickaboo.`,
      images: category?.image ? [category.image] : ['/images/logo.png'],
    },
  };
}

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

  // Handle both single slug (category) and multiple slugs (category/subcategory/...)
  const slugs = Array.isArray(slugArray) ? slugArray : [slugArray];

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

  // Find category by slug (recursively search in all categories)
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

  // Navigate through the category tree based on slug path
  let currentCategory: Category | null = null;
  let parentCategory: Category | null = null;
  const categoryPath: Category[] = [];

  // Start from root categories
  let searchIn = categoriesData.data || [];

  console.log(`🔍 Searching for category path: ${slugs.join(' > ')}`);
  console.log(`📂 Starting with ${searchIn.length} root categories`);
  console.log(`📋 Root categories:`, searchIn.map(c => `${c.name} (${c.slug})`).join(', '));

  // Debug: Log all categories and their children
  if (searchIn.length > 0 && searchIn[0].children) {
    console.log(`📋 First category children:`, searchIn[0].children.map((c: Category) => `${c.name} (${c.slug})`).join(', '));
  }

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    console.log(`🔎 Step ${i + 1}: Looking for slug "${slug}" in ${searchIn.length} categories`);

    // Find category in current search scope (case-insensitive matching)
    // First try exact match, then try case-insensitive
    let found = searchIn.find(cat => cat.slug === slug);

    if (!found) {
      // Try case-insensitive match
      found = searchIn.find(cat => cat.slug.toLowerCase() === slug.toLowerCase());
    }

    if (!found) {
      // Try matching by name (fallback)
      found = searchIn.find(cat =>
        cat.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase() ||
        cat.name.toLowerCase().replace(/\s+/g, '') === slug.toLowerCase().replace(/-/g, '')
      );
    }

    if (!found) {
      console.error(`❌ Category with slug "${slug}" not found in current scope`);
      console.error(`📋 Available slugs in scope:`, searchIn.map(c => `${c.slug} (${c.name})`).join(', '));
      console.error(`📋 Available names in scope:`, searchIn.map(c => c.name).join(', '));
      notFound();
    }

    console.log(`✅ Found: ${found.name} (ID: ${found.id})`);

    // Track the path
    categoryPath.push(found);

    // Set parent if this is not the last slug
    if (i < slugs.length - 1) {
      parentCategory = found;
    }

    // Set current category (the deepest one)
    currentCategory = found;

    // Next search in this category's direct children only
    searchIn = found.children || [];
    console.log(`📂 Next search will be in ${searchIn.length} children of ${found.name}`);
  }

  if (!currentCategory) {
    console.error('❌ No category found after navigation');
    notFound();
  }

  // Use subcategory ID from query params if provided (for filter selection), otherwise use the one from URL
  const categoryIdToFetch = subcategoryId || currentCategory.id;

  console.log(`📦 Fetching products for category "${currentCategory.name}"`);
  console.log(`📋 URL: /category/${slugs.join('/')}`);
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
        parentCategory={parentCategory || undefined}
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

// Allow dynamic params for categories not pre-generated at build time
export const dynamicParams = true;

// Generate static paths for main categories (optional optimization)
export async function generateStaticParams() {
  try {
    const categoriesData = await getCategories(true); // Get with children to generate subcategory paths

    if (!categoriesData.success) {
      return [];
    }

    const paths: { slug: string[] }[] = [];

    // Generate paths for all categories and subcategories recursively
    const generatePaths = (categories: Category[], parentSlugs: string[] = []) => {
      for (const category of categories) {
        const currentPath = [...parentSlugs, category.slug];
        paths.push({ slug: currentPath });

        if (category.children && category.children.length > 0) {
          generatePaths(category.children, currentPath);
        }
      }
    };

    generatePaths(categoriesData.data || []);

    console.log(`📦 Generated ${paths.length} static paths for categories`);
    return paths;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
