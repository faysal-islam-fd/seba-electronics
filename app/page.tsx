import { Suspense } from 'react';
import HeroBanner from './components/HeroBanner';
import CategorySidebar from './components/CategorySidebar';
import CategorySection from './components/CategorySection';
import CategoryCardSection from './components/CategoryCardSection';
import ProductCardSkeleton from './components/ProductCardSkeleton';
import { getFeaturedProducts, getTopSellingProducts, getHomeCategories, getCategories } from './lib/api';
import { isProductInStock } from './utils/stockUtils';

// Separate async components for Suspense
async function FeaturedProductsSection() {
  const featuredData = await getFeaturedProducts(8);

  const featuredProducts = featuredData.success && featuredData.data.length > 0
    ? featuredData.data.map(product => ({
      id: product.id.toString(),
      name: product.title,
      price: product.final_price,
      originalPrice: product.price !== product.final_price ? product.price : undefined,
      image: (product as any).thumbnail_image || product.thumbnail || '/products/placeholder.jpg',
      discount: product.discount_percentage ? Math.round(product.discount_percentage) : undefined,
      badge: product.is_featured ? 'Featured' : undefined,
      rating: 4.5,
      inStock: isProductInStock(product.stock, product.is_out_of_stock),
      type: (product as any).attributes && (product as any).attributes.length > 0 ? 'variable' : 'simple',
    }))
    : []; // Empty array if API fails - will show skeletons

  return (
    <CategorySection
      title="Hot Deals"
      products={featuredProducts}
      viewAllLink="/hot-deals"
    />
  );
}

async function TopSellingProductsSection() {
  const topSellingData = await getTopSellingProducts(8);

  const topSellingProducts = topSellingData.success && topSellingData.data.length > 0
    ? topSellingData.data.map(product => ({
      id: product.id.toString(),
      name: product.title,
      price: product.final_price,
      originalPrice: product.price !== product.final_price ? product.price : undefined,
      image: (product as any).thumbnail_image || product.thumbnail || '/products/placeholder.jpg',
      discount: product.discount_percentage ? Math.round(product.discount_percentage) : undefined,
      badge: product.is_top_selling ? 'Top Selling' : undefined,
      rating: 4.5,
      inStock: isProductInStock(product.stock, product.is_out_of_stock),
      type: (product as any).attributes && (product as any).attributes.length > 0 ? 'variable' : 'simple',
    }))
    : []; // Empty array if API fails - will show skeletons

  return (
    <CategorySection
      title="Best Sellers"
      products={topSellingProducts}
      viewAllLink="/best-sellers"
    />
  );
}

// Skeleton component for Suspense fallback
function ProductsSectionSkeleton({ title }: { title: string }) {
  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-gray-200">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <ProductCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    </section>
  );
}

// Helper function to find category path in category tree
function findCategoryPath(categories: any[], targetSlug: string, path: string[] = []): string[] | null {
  for (const category of categories) {
    const currentPath = [...path, category.slug];

    // Check if this is the target
    if (category.slug === targetSlug) {
      return currentPath;
    }

    // Search in children
    if (category.children && category.children.length > 0) {
      const found = findCategoryPath(category.children, targetSlug, currentPath);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

// Server Component with SSR
export default async function Home() {
  // Fetch home categories and full category tree
  const [homeCategoriesData, categoriesData] = await Promise.all([
    getHomeCategories(),
    getCategories(true), // Get full category tree with children
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Sidebar */}
      <div className="container mx-auto px-3 sm:px-4 pt-4 sm:pt-6 pb-6 sm:pb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Categories */}
          <div className="hidden lg:block">
            <CategorySidebar />
          </div>

          {/* Main Hero Banner */}
          <div className="flex-1">
            <HeroBanner />
          </div>
        </div>
      </div>

      {/* Dynamic Category Card Sections from API */}
      {homeCategoriesData.success && homeCategoriesData.data.length > 0 && (
        <div className="container mx-auto px-3 sm:px-4 py-8">
          {/* Group categories by heading */}
          {(() => {
            // Group categories by heading
            const groupedCategories = homeCategoriesData.data.reduce((acc, category) => {
              const heading = category.heading || 'Featured Categories';
              if (!acc[heading]) {
                acc[heading] = [];
              }
              acc[heading].push(category);
              return acc;
            }, {} as Record<string, typeof homeCategoriesData.data>);

            return Object.entries(groupedCategories).map(([heading, categories]) => (
              <CategoryCardSection
                key={heading}
                title={heading}
                viewAllLink="/categories"
                categories={categories.map(cat => {
                  // Find the full path for this category/subcategory in the category tree
                  // This handles both categories and subcategories dynamically
                  const fullPath = categoriesData.success && categoriesData.data.length > 0
                    ? findCategoryPath(categoriesData.data, cat.slug)
                    : null;

                  // Use full path if found, otherwise fallback to just the slug
                  // The featured-product page can handle both cases
                  const href = fullPath
                    ? `/featured-product/${fullPath.join('/')}`
                    : `/featured-product/${cat.slug}`;

                  return {
                    name: cat.name,
                    image: cat.image || '/products/placeholder.jpg',
                    description: cat.title || `${cat.icon || ''} Browse ${cat.name}`.trim(),
                    href,
                  };
                })}
              />
            ));
          })()}
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-8 space-y-10">
        {/* Featured Products - Hot Deals */}
        <Suspense fallback={<ProductsSectionSkeleton title="Hot Deals" />}>
          <FeaturedProductsSection />
        </Suspense>

        {/* Top Selling Products */}
        <Suspense fallback={<ProductsSectionSkeleton title="Best Sellers" />}>
          <TopSellingProductsSection />
        </Suspense>

        {/* Info Banner Section */}
        <section className="my-8 sm:my-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🚚</div>
              <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-900">Free Delivery</h3>
              <p className="text-xs sm:text-sm text-gray-600">Free shipping on orders above ৳5,000</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">✅</div>
              <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-900">100% Authentic</h3>
              <p className="text-xs sm:text-sm text-gray-600">All products are genuine and verified</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🔒</div>
              <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-900">Secure Payment</h3>
              <p className="text-xs sm:text-sm text-gray-600">100% secure payment methods</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour
