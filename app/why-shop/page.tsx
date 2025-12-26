import type { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import {
  FiStar,
  FiDollarSign,
  FiShield,
  FiShoppingCart,
  FiHeadphones,
  FiCheckCircle,
  FiTruck,
  FiAward,
  FiHeart
} from 'react-icons/fi';

export const metadata: Metadata = {
  title: "Why Shop with Sheba Electronics | Trusted Online Shopping in Bangladesh",
  description: "Discover why Sheba Electronics is Bangladesh's trusted destination for genuine home appliances.",
  keywords: "why shop, Sheba Electronics, trusted shopping, genuine products",
};

export default function WhyShopPage() {
  const whyChoose = [
    { icon: FiAward, title: "Best Quality Products", desc: "100% genuine and brand-authorized products backed by official warranties.", color: "bg-blue-600" },
    { icon: FiDollarSign, title: "Best Prices", desc: "Competitive pricing across all categories. Best value for your money.", color: "bg-green-600" },
    { icon: FiShield, title: "Authentic Brands", desc: "We partner only with verified manufacturers and authorized distributors.", color: "bg-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <Breadcrumb items={[{ label: "Why Shop with Us" }]} dark />
          <div className="max-w-4xl mx-auto mt-8 sm:mt-10 text-center">
            <div className="bg-rose-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
              <FiHeart className="text-white" size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Why Shop with Sheba Electronics?
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              More than just an online store — we are a trusted destination for quality home appliances in Bangladesh
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Why Choose Section */}
          <div className="grid md:grid-cols-3 gap-5">
            {whyChoose.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">✅ {item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Convenient Shopping */}
          <section className="bg-green-50 rounded-xl border border-green-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <FiShoppingCart className="text-white" size={24} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">🛒 Convenient Shopping</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {["24/7 online shopping access", "Easy and secure checkout", "Multiple payment options including COD", "Fast delivery across Bangladesh"].map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 flex items-center gap-3">
                  <FiCheckCircle className="text-green-600 flex-shrink-0" size={20} />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Customer Service */}
          <section className="bg-purple-50 rounded-xl border border-purple-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <FiHeadphones className="text-white" size={24} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">🛠️ Excellent Customer Service</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {["Dedicated support team", "Hassle-free returns", "Quick assistance"].map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 text-center">
                  <FiCheckCircle className="text-purple-600 mx-auto mb-2" size={24} />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Quality Trust */}
          <section className="bg-blue-50 rounded-xl border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <FiShield className="text-white" size={24} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">🔒 Quality You Can Trust</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {["Brand-new & authentic products", "Quality inspection before delivery", "Warranty-backed items"].map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 text-center">
                  <FiCheckCircle className="text-blue-600 mx-auto mb-2" size={24} />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-blue-600 rounded-xl p-8 sm:p-10 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Shop smarter. Shop safer. Shop with confidence.
            </h2>
            <p className="text-blue-100 text-lg">
              Choose Sheba Electronics – Your Trusted Online Shopping Partner in Bangladesh.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
