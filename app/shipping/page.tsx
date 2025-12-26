import type { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import {
  FiTruck,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiPackage,
  FiCheckCircle,
  FiMail
} from 'react-icons/fi';

export const metadata: Metadata = {
  title: "Shipping & Courier - Sheba Electronics | Delivery Information",
  description: "Learn about shipping and delivery services at Sheba Electronics.",
  keywords: "shipping, delivery, courier, Sheba Electronics",
};

export default function ShippingPage() {
  const deliveryInfo = [
    { icon: FiTruck, title: "Shipping Partner", desc: "Steadfast Courier Service for nationwide delivery.", color: "bg-blue-600" },
    { icon: FiMapPin, title: "Delivery Coverage", desc: "All major cities and districts across Bangladesh.", color: "bg-green-600" },
    { icon: FiClock, title: "Delivery Time", desc: "Inside Dhaka: 1-3 days | Outside Dhaka: 2-5 days.", color: "bg-purple-600" },
    { icon: FiDollarSign, title: "Delivery Charges", desc: "Based on product size, weight, and location.", color: "bg-amber-500" },
    { icon: FiPackage, title: "Order Processing", desc: "Within 24-48 hours after confirmation.", color: "bg-rose-500" },
    { icon: FiCheckCircle, title: "Cash on Delivery", desc: "Available for selected locations.", color: "bg-teal-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <Breadcrumb items={[{ label: "Shipping & Courier" }]} dark />
          <div className="max-w-4xl mx-auto mt-8 sm:mt-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center">
                <FiTruck className="text-white" size={28} />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Shipping & Courier</h1>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-3xl mt-4">
              We partner with Steadfast Courier to deliver your products safely and quickly across Bangladesh.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Delivery Info Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {deliveryInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className={`${info.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-gray-600 text-sm">{info.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Order Tracking */}
          <section className="bg-blue-50 rounded-xl border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiPackage className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">📍 Order Tracking</h2>
            </div>
            <p className="text-gray-700">
              Once your order is dispatched, you'll receive tracking information via SMS or email to monitor your shipment in real time.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-blue-600 rounded-xl p-6 sm:p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiMail className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">Need Help?</h2>
            </div>
            <div className="space-y-2">
              <p className="text-blue-100">📧 Email: <a href="mailto:support@shebaelectronics.co" className="font-semibold hover:underline">support@shebaelectronics.co</a></p>
              <p className="text-blue-100">📞 Phone: <a href="tel:+8801898805555" className="font-semibold hover:underline">+880 1898-805555</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
