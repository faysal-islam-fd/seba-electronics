import Banner from './components/Banner';
import CategorySection from './components/CategorySection';
import {
  bannerSlides,
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
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="container mx-auto px-4 pt-6 pb-8">
        <Banner slides={bannerSlides} />
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
