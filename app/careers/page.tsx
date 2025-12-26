import type { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import {
  FiBriefcase,
  FiTrendingUp,
  FiUsers,
  FiTarget,
  FiAward,
  FiMail,
  FiCheckCircle,
  FiHelpCircle
} from 'react-icons/fi';

export const metadata: Metadata = {
  title: "Careers - Sheba Electronics | Join Our Team",
  description: "Join Sheba Electronics and build the future of eCommerce in Bangladesh.",
  keywords: "careers, jobs, Sheba Electronics, employment",
};

export default function CareersPage() {
  const careerAreas = [
    { icon: FiTrendingUp, title: "Business Development", desc: "Drive partnerships and strategic growth.", color: "bg-blue-600" },
    { icon: FiTarget, title: "Marketing", desc: "Plan and execute digital campaigns.", color: "bg-green-600" },
    { icon: FiUsers, title: "MIS & Data", desc: "Analyze business data and reporting.", color: "bg-purple-600" },
    { icon: FiAward, title: "Customer Experience", desc: "Deliver exceptional customer service.", color: "bg-amber-500" }
  ];

  const benefits = [
    "Competitive salary", "Health benefits", "Festival bonuses",
    "Growth opportunities", "Modern tools", "Teamwork culture"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <Breadcrumb items={[{ label: "Careers" }]} dark />
          <div className="max-w-4xl mx-auto mt-8 sm:mt-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-600 w-14 h-14 rounded-xl flex items-center justify-center">
                <FiBriefcase className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Join Our Team</h1>
                <p className="text-gray-400">Build the Future with Sheba Electronics</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-3xl mt-4">
              Sheba Electronics is one of Bangladesh's fast-growing eCommerce platforms, committed to delivering authentic products and exceptional service.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Why Work With Us */}
          <section className="bg-blue-50 rounded-xl border border-blue-100 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">🌟 Why Work With Us?</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {["Dynamic growth environment", "Opportunities to learn & lead", "Collaborative culture", "Real-world eCommerce challenges"].map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 flex items-center gap-3">
                  <FiCheckCircle className="text-blue-600 flex-shrink-0" size={20} />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Career Areas */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">Career Opportunities</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {careerAreas.map((area, index) => {
                const Icon = area.icon;
                return (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className={`${area.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">🔹 {area.title}</h3>
                    <p className="text-gray-600">{area.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Benefits */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">Why Join Us?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="bg-green-50 rounded-lg p-4 flex items-center gap-3 border border-green-100">
                  <FiCheckCircle className="text-green-600 flex-shrink-0" size={18} />
                  <span className="text-gray-700 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiHelpCircle className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">FAQs</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="font-bold text-gray-900 mb-1">How can I apply?</p>
                <p className="text-gray-600 text-sm">Visit our Careers page and submit your application online.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="font-bold text-gray-900 mb-1">What candidates do you look for?</p>
                <p className="text-gray-600 text-sm">Motivated, responsible, and passionate individuals eager to grow.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="font-bold text-gray-900 mb-1">Is there room for growth?</p>
                <p className="text-gray-600 text-sm">Absolutely! We promote internal growth and provide training opportunities.</p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-purple-600 rounded-xl p-8 sm:p-10 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">✨ Join Sheba Electronics</h2>
            <p className="text-purple-100 text-lg">Where Innovation Meets Opportunity</p>
          </section>
        </div>
      </div>
    </div>
  );
}


