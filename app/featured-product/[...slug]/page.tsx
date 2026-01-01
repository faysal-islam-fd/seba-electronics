import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import FeaturedProductPageClient from './FeaturedProductPageClient';
import { getProducts, getCategories, getBrands, ProductsResponse, Category } from '@/app/lib/api';

const BASE_URL = 'https://seba.rangpurit.com/api/v1';

// Fetch products filtered by category or subcategory with pagination
// This function works for both categories and subcategories since subcategories are categories with parent_id
async function getFeaturedProductsByCategory(params: {
  category_id: number;
  page?: number;
  per_page?: number;
  min_price?: number;
  max_price?: number;
  brand_id?: number;
  sort?: string;
}): Promise<ProductsResponse> {
  const queryParams = new URLSearchParams();

  // Fetch products from the specified category/subcategory
  queryParams.append('per_page', '100');
  queryParams.append('category_id', String(params.category_id));

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && key !== 'page' && key !== 'per_page' && key !== 'category_id') {
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

    // Filter for featured products (products marked as featured)
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
    console.error('Error fetching featured products by category:', error);
    return {
      success: false,
      data: [],
      meta: { current_page: 1, per_page: 20, total: 0, last_page: 1 },
    };
  }
}

// Server Component with SSR
export default async function FeaturedProductPage({
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

  // Helper function to find category anywhere in the tree (not just from root)
  const findCategoryInTree = (categories: Category[], targetSlug: string): Category | null => {
    for (const cat of categories) {
      if (cat.slug === targetSlug || cat.slug.toLowerCase() === targetSlug.toLowerCase()) {
        return cat;
      }
      if (cat.children && cat.children.length > 0) {
        const found = findCategoryInTree(cat.children, targetSlug);
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



  // Helper to find category with its full path from root
  const findCategoryWithPath = (categories: Category[], targetSlug: string, currentPath: Category[] = []): { category: Category; path: Category[] } | null => {
    for (const cat of categories) {
      const newPath = [...currentPath, cat];

      if (cat.slug === targetSlug || cat.slug.toLowerCase() === targetSlug.toLowerCase()) {
        return { category: cat, path: newPath };
      }

      if (cat.children && cat.children.length > 0) {
        const found = findCategoryWithPath(cat.children, targetSlug, newPath);
        if (found) return found;
      }
    }
    return null;
  };

  // If only one slug, search entire tree (could be category or subcategory)
  if (slugs.length === 1) {
    const result = findCategoryWithPath(categoriesData.data || [], slugs[0]);
    if (result) {
      currentCategory = result.category;
      categoryPath.push(...result.path);

      // Set parent if path has more than one item (meaning it's a subcategory)
      if (result.path.length > 1) {
        parentCategory = result.path[result.path.length - 2];
      }
    } else {
      console.error(`❌ Category with slug "${slugs[0]}" not found in category tree`);
      notFound();
    }
  } else {
    // Multiple slugs - traverse path as before
    for (let i = 0; i < slugs.length; i++) {
      const slug = slugs[i];

      // Find category in current search scope (case-insensitive matching)
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
        notFound();
      }

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
    }
  }

  if (!currentCategory) {
    console.error('❌ No category found after navigation');
    notFound();
  }

  // Determine if currentCategory is a category or subcategory
  // If it has a parent_id, it's a subcategory; otherwise it's a category
  const isSubcategory = currentCategory.parent_id !== null && currentCategory.parent_id !== undefined;

  // Use subcategory ID from query params if provided (for filter selection), 
  // otherwise use the current category/subcategory ID from URL path
  // This handles both: /featured-product/category and /featured-product/category/subcategory
  // When navigating, always use the deepest category/subcategory in the path
  const categoryIdToFetch = subcategoryId || currentCategory.id;



  // Fetch products filtered by category (can be category or subcategory)
  // If it's a subcategory, it will show products under that subcategory
  // If it's a category, it will show products under that category
  const productsData = await getFeaturedProductsByCategory({
    category_id: categoryIdToFetch,
    page,
    per_page: 20,
    min_price: minPrice,
    max_price: maxPrice,
    brand_id: brandId,
    sort,
  });



  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category products...</p>
        </div>
      </div>
    }>
      <FeaturedProductPageClient
        currentCategory={currentCategory}
        parentCategory={parentCategory || undefined}
        categoryPath={categoryPath}
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


    return paths;
  } catch (error) {
    console.error('Error generating static params for featured categories:', error);
    return [];
  }
}

