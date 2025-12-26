import type { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import {
  FiRefreshCw,
  FiXCircle,
  FiCheckCircle,
  FiAlertCircle,
  FiMail,
  FiVideo,
  FiPackage
} from 'react-icons/fi';

export const metadata: Metadata = {
  title: "Return & Replacement Policy - Sheba Electronics",
  description: "Learn about Sheba Electronics return and replacement policy.",
  keywords: "return policy, replacement policy, Sheba Electronics",
};

export default function ReturnPolicyPage() {
  const notCovered = [
    "Damage caused after delivery",
    "Mishandling or improper use",
    "Voltage fluctuation damage",
    "Products without original packaging"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <Breadcrumb items={[{ label: "Return & Replacement Policy" }]} dark />
          <div className="max-w-4xl mx-auto mt-8 sm:mt-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-rose-500 w-14 h-14 rounded-xl flex items-center justify-center">
                <FiRefreshCw className="text-white" size={28} />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Return & Replacement</h1>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-3xl mt-4">
              Please read our policy carefully before placing an order.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* No Return Policy */}
          <section className="bg-rose-50 rounded-xl border border-rose-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-rose-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiXCircle className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">No Return Policy</h2>
            </div>
            <p className="text-gray-700">
              Due to the nature of electronic products, <strong>we do not accept returns</strong> once the product has been delivered and received in good condition.
            </p>
          </section>

          {/* Replacement Policy */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiRefreshCw className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Replacement Policy</h2>
            </div>
            <p className="text-gray-600 mb-4">We offer replacement only if:</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3 text-gray-700">
                <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                The product is physically damaged
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                The product is not working at delivery
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                The product received is different from order
              </li>
            </ul>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
              <p className="text-gray-700 text-sm">
                <strong>⚠️ Important:</strong> Issue must be reported immediately at delivery with an unboxing video.
              </p>
            </div>
          </section>

          {/* Unboxing Video */}
          <section className="bg-purple-50 rounded-xl border border-purple-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiVideo className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Unboxing Video Required</h2>
            </div>
            <p className="text-gray-700 mb-4">Your unboxing video must show:</p>
            <ul className="space-y-2">
              {["Sealed package before opening", "Product condition", "The issue clearly visible", "Delivery rider present"].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-700">
                  <FiCheckCircle className="text-purple-500 mt-1 flex-shrink-0" size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Not Covered */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gray-700 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiXCircle className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Not Covered</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {notCovered.map((item, idx) => (
                <div key={idx} className="bg-rose-50 rounded-lg p-3 flex items-center gap-3 border border-rose-100">
                  <FiXCircle className="text-rose-500 flex-shrink-0" size={16} />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="bg-rose-500 rounded-xl p-6 sm:p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiMail className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">Need Help?</h2>
            </div>
            <div className="space-y-2">
              <p className="text-rose-100">📞 <a href="tel:+8801898805555" className="font-semibold hover:underline">+880 1898 805555</a></p>
              <p className="text-rose-100">📧 <a href="mailto:support@shebaelectronics.co" className="font-semibold hover:underline">support@shebaelectronics.co</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


