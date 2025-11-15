import HeroBanner from './components/HeroBanner';
import CategorySidebar from './components/CategorySidebar';
import PromoCarousel from './components/PromoCarousel';
import CategorySection from './components/CategorySection';
import CategoryCardSection from './components/CategoryCardSection';
import {
  featuredProducts,
  desktopProducts,
  monitorProducts,
  accessoriesProducts,
  smartphoneProducts,
  cameraProducts,
  gadgetProducts,
} from './data/dummyData';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Sidebar */}
      <div className="container mx-auto px-4 pt-6 pb-8">
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

      {/* Promo Carousel */}
      <div className="container mx-auto px-4 pb-8">
        <PromoCarousel />
      </div>

      {/* Mobile Category Menu */}
      <div className="lg:hidden container mx-auto px-4 pb-6">
        <CategorySidebar />
      </div>

      {/* Category Card Sections */}
      <div className="container mx-auto px-4 py-8">
        {/* Destination for Authentic Products with Warranty */}
        <CategoryCardSection
          title="Destination for Authentic Products with Warranty"
          viewAllLink="/categories"
          categories={[
            {
              name: 'Home Appliances',
              image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop',
              description: 'Official Warranty | Easy EMI',
              href: '/category/home-appliances',
            },
            {
              name: '5G Smartphones',
              image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
              description: 'Official Phones | Best Prices',
              href: '/category/smartphones',
            },
            {
              name: 'Gadgets',
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
              description: 'Fast Delivery | Official Warranty',
              href: '/category/gadgets',
            },
            {
              name: 'Networking & Accessories',
              image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=300&fit=crop',
              description: 'Official Warranty | Fast Delivery',
              href: '/category/networking',
            },
            {
              name: 'Kitchen Appliances',
              image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&h=300&fit=crop',
              description: 'Easy EMI | Same-day Delivery',
              href: '/category/kitchen-appliances',
            },
          ]}
        />

        {/* Home Makeover Deals */}
        <CategoryCardSection
          title="Home Makeover Deals"
          viewAllLink="/category/home-makeover"
          categories={[
            {
              name: 'Washing Machines',
              image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=300&fit=crop',
              description: 'Top Brands | Official Warranty',
              href: '/category/washing-machines',
            },
            {
              name: 'Refrigerators',
              image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop',
              description: 'Easy EMI | Fast Delivery',
              href: '/category/refrigerators',
            },
            {
              name: 'Air Fryer',
              image: 'https://images.unsplash.com/photo-1608039829570-587539b5532e?w=400&h=300&fit=crop',
              description: 'Official Warranty | Best Brands',
              href: '/category/air-fryer',
            },
            {
              name: 'Kitchen Appliances',
              image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&h=300&fit=crop',
              description: 'Best Picks | Same-Day Delivery',
              href: '/category/kitchen-appliances',
            },
            {
              name: 'Television',
              image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
              description: 'Official Warranty | Top Brands',
              href: '/category/television',
            },
          ]}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Featured Products - Hot Deals */}
        <CategorySection
          title="🔥 Hot Deals with Best Prices"
          products={featuredProducts}
          viewAllLink="/category/hot-deals"
        />

        {/* Desktop Section */}
        <CategorySection
          title="💻 Best Deals on Desktops"
          products={desktopProducts}
          viewAllLink="/category/desktops"
        />

        {/* Monitor Section */}
        <CategorySection
          title="🖥️ Premium Monitors"
          products={monitorProducts}
          viewAllLink="/category/monitors"
        />

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

        {/* Accessories Section */}
        <CategorySection
          title="🎧 Tech Accessories"
          products={accessoriesProducts}
          viewAllLink="/category/accessories"
        />

        {/* Smartphone Section */}
        <CategorySection
          title="📱 Latest Smartphones"
          products={smartphoneProducts}
          viewAllLink="/category/smartphones"
        />

        {/* Camera Section */}
        <CategorySection
          title="📷 Camera & Photography"
          products={cameraProducts}
          viewAllLink="/category/cameras"
        />

        {/* Gadgets Section */}
        <CategorySection
          title="⌚ Smart Gadgets & Wearables"
          products={gadgetProducts}
          viewAllLink="/category/gadgets"
        />
      </div>
    </div>
  );
}
