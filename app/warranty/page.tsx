import type { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import {
  FiShield,
  FiFileText,
  FiCheckCircle,
  FiXCircle,
  FiMail,
  FiPhone,
  FiTruck,
  FiRefreshCw
} from 'react-icons/fi';

export const metadata: Metadata = {
  title: "Warranty Claim Policy - Sheba Electronics",
  description: "Learn about Sheba Electronics warranty claim policy.",
  keywords: "warranty, warranty claim, Sheba Electronics",
};

export default function WarrantyPage() {
  const warrantySteps = [
    { step: "1", title: "Contact Support", desc: "Reach out via phone, email, or ticket.", color: "bg-blue-600" },
    { step: "2", title: "Provide Documents", desc: "Warranty card, invoice, and issue details.", color: "bg-green-600" },
    { step: "3", title: "Product Pickup", desc: "We'll arrange rider pickup.", color: "bg-purple-600" },
    { step: "4", title: "Service & Repair", desc: "Product inspected and serviced.", color: "bg-amber-500" },
    { step: "5", title: "Return Delivery", desc: "Delivered back free of charge.", color: "bg-rose-500" }
  ];

  const notCovered = [
    "Physical or accidental damage",
    "Misuse or voltage fluctuation",
    "Unauthorized repair",
    "Normal wear and tear"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <Breadcrumb items={[{ label: "Warranty Claim Policy" }]} dark />
          <div className="max-w-4xl mx-auto mt-8 sm:mt-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-600 w-14 h-14 rounded-xl flex items-center justify-center">
                <FiShield className="text-white" size={28} />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Warranty Claim Policy</h1>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-3xl mt-4">
              All eligible products come with official brand warranty for complete peace of mind.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Warranty Coverage */}
          <section className="bg-blue-50 rounded-xl border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiShield className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Warranty Coverage</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Warranty duration may vary by product (up to 2 years, depending on brand).
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
              <p className="text-gray-700 text-sm">
                <strong>⚠️ Required:</strong> Valid Warranty Card and Purchase Invoice (Memo). Claims will NOT be accepted without these.
              </p>
            </div>
          </section>

          {/* How to Claim */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">How to Claim Warranty</h2>
            </div>
            <div className="space-y-4">
              {warrantySteps.map((item, index) => (
                <div key={index} className="flex items-start gap-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className={`${item.color} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold`}>
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* What's Covered */}
          <section className="bg-green-50 rounded-xl border border-green-100 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">✅ What's Covered</h2>
            <ul className="space-y-2">
              {["Manufacturing defects only", "Warranty service free during warranty period", "Pickup and delivery included"].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-700">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Not Covered */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">❌ Not Covered</h2>
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
          <section className="bg-purple-600 rounded-xl p-6 sm:p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiMail className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">Need Help?</h2>
            </div>
            <p className="text-purple-100 mb-2">📧 <a href="mailto:support@shebaelectronics.co" className="font-semibold hover:underline">support@shebaelectronics.co</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}


