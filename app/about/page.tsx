import type { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import {
  FiShield,
  FiTruck,
  FiCreditCard,
  FiAward,
  FiCheckCircle,
  FiStar,
  FiPackage,
  FiHome,
  FiHeart,
  FiLock,
  FiTrendingUp
} from 'react-icons/fi';

export const metadata: Metadata = {
  title: "About Us - Sheba Electronics | Trusted Home & Kitchen Appliance Store in Bangladesh",
  description: "Sheba Electronics is your reliable destination for premium home and kitchen appliances in Bangladesh, offering 100% genuine products from globally recognized brands.",
  keywords: "about us, Sheba Electronics, home appliances, kitchen appliances, Bangladesh, genuine products, warranty",
};

export default function AboutPage() {
  const features = [
    { icon: FiShield, title: "100% Authentic", desc: "Original & Genuine Products" },
    { icon: FiAward, title: "Official Warranty", desc: "12–36 Months Coverage" },
    { icon: FiStar, title: "Latest Models", desc: "From Global Brands" },
    { icon: FiCreditCard, title: "Best Prices", desc: "Competitive & Transparent" },
    { icon: FiTruck, title: "Fast Delivery", desc: "Same-Day / Next-Day" },
    { icon: FiCheckCircle, title: "Easy Returns", desc: "Transparent Refund Policy" },
  ];

  const whyChoose = [
    { icon: FiTrendingUp, title: "0% EMI Facility", desc: "Easy monthly installments up to 36 months" },
    { icon: FiShield, title: "Official Brand Warranty", desc: "Guaranteed authenticity" },
    { icon: FiTruck, title: "Fast Nationwide Delivery", desc: "Anywhere in Bangladesh" },
    { icon: FiLock, title: "Secure Online Payments", desc: "SSLCommerz protected checkout" },
    { icon: FiStar, title: "Exclusive Offers & Discounts", desc: "Best value guaranteed" },
  ];

  const brands = [
    "Philips", "Panasonic", "Samsung", "LG", "Sharp", "Kenwood",
    "Braun", "De'Longhi", "Westinghouse", "Midea", "Pigeon",
    "Sencor", "JBL", "McCoy", "Sahara", "Warmac"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <Breadcrumb items={[{ label: "About Us" }]} dark />
          <div className="max-w-4xl mx-auto mt-8 sm:mt-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/30 mb-6">
              <FiAward className="text-blue-400" size={16} />
              <span className="text-sm font-medium text-blue-300">Trusted Since 2020</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Sheba <span className="text-blue-400">Electronics</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium mb-4 text-gray-200">
              Your Trusted Online Home & Kitchen Appliance Store
            </p>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto">
              Your reliable destination for premium home and kitchen appliances in Bangladesh, offering 100% genuine products from globally recognized brands.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20">
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-3">Our Promise</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Why Choose Us?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 sm:p-7 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300"
                >
                  <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="text-blue-600" size={26} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Product Range Section */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <FiPackage className="text-white" size={24} />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Complete Range of Modern Appliances
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Home & Kitchen Appliances
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  From air fryers, mixer grinders, blenders, washing machines, electric kettles, induction cookers, hand mixers, sandwich makers, toasters, infrared cookers, coffee makers, juicers, garment steamers, vacuum cleaners, geysers, and home showers — we provide a complete range of modern appliances designed for today's Bangladeshi households.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Personal Care Products
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We also offer a wide collection of personal care appliances including hair straighteners, hair dryers, trimmers, shavers, bikini trimmers, epilators, and Philips Avent baby care products — all under one roof.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20">
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-3">Benefits</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Why Choose Sheba Electronics?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {whyChoose.map((item, index) => {
              const Icon = item.icon;
              const colors = ['bg-blue-600', 'bg-purple-600', 'bg-amber-500', 'bg-green-600', 'bg-rose-500'];
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 sm:p-7 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                >
                  <div className={`${colors[index % colors.length]} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="text-white" size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trusted Brands Section */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20">
          <div className="bg-slate-900 rounded-2xl p-6 sm:p-10 md:p-12 text-white">
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm font-semibold mb-3">Our Partners</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                Trusted International Brands
              </h2>
              <p className="text-gray-400">
                We proudly bring you authentic products from leading global brands
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {brands.map((brand, index) => (
                <div
                  key={index}
                  className="bg-white/10 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-medium text-white">{brand}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shop with Confidence */}
        <div className="max-w-4xl mx-auto mb-16 sm:mb-20">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 md:p-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-rose-500 w-12 h-12 rounded-xl flex items-center justify-center">
                <FiHeart className="text-white" size={24} />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Shop Online with Confidence
              </h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              Sheba Electronics is committed to delivering quality, convenience, and value. Whether you're upgrading your kitchen, home, or personal care essentials, we make online shopping simple, secure, and reliable.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-600 rounded-2xl p-8 sm:p-10 md:p-12 text-center text-white">
            <div className="bg-white/20 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
              <FiHome className="text-white" size={32} />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Shop Now at Sheba Electronics
            </h2>
            <p className="text-lg sm:text-xl text-blue-100">
              Bangladesh's Trusted Home Appliance Store
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
