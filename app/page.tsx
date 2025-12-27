import HeroBanner from './components/HeroBanner';
import CategorySidebar from './components/CategorySidebar';
import CategorySection from './components/CategorySection';
import CategoryCardSection from './components/CategoryCardSection';
import { getFeaturedProducts, getTopSellingProducts, getHomeCategories } from './lib/api';
import { 
  featuredProducts as fallbackFeatured,
  smartphoneProducts as fallbackTopSelling,
} from './data/dummyData';
import { isProductInStock } from './utils/stockUtils';

// Server Component with SSR
export default async function Home() {
  // Fetch data on the server
  const [featuredData, topSellingData, homeCategoriesData] = await Promise.all([
    getFeaturedProducts(8),
    getTopSellingProducts(8),
    getHomeCategories(),
  ]);

  // Transform API data to component format, with fallback to dummy data
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
      }))
    : fallbackFeatured; // Fallback to dummy data if API fails

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
      }))
    : fallbackTopSelling; // Fallback to dummy data if API fails

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
                categories={categories.map(cat => ({
                  name: cat.name,
                  image: cat.image || '/products/placeholder.jpg',
                  description: cat.title || `${cat.icon || ''} Browse ${cat.name}`.trim(),
                  href: `/category/${cat.slug}`,
                }))}
              />
            ));
          })()}
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-8 space-y-10">
        {/* Featured Products - Hot Deals */}
        {featuredProducts.length > 0 && (
          <CategorySection
            title="🔥 Hot Deals with Best Prices"
            products={featuredProducts}
            viewAllLink="/hot-deals"
          />
        )}

        {/* Top Selling Products */}
        {topSellingProducts.length > 0 && (
          <CategorySection
            title="⭐ Best Sellers"
            products={topSellingProducts}
            viewAllLink="/best-sellers"
          />
        )}

        {/* Info Banner Section */}
        <section className="my-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Free Delivery</h3>
              <p className="text-sm text-gray-600">Free shipping on orders above ৳5,000</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">100% Authentic</h3>
              <p className="text-sm text-gray-600">All products are genuine and verified</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Secure Payment</h3>
              <p className="text-sm text-gray-600">100% secure payment methods</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour
