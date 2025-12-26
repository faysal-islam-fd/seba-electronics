import type { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import { FiFileText, FiMail } from 'react-icons/fi';

export const metadata: Metadata = {
  title: "Terms & Conditions - Sheba Electronics | Legal Terms",
  description: "Read the Terms & Conditions for using Sheba Electronics website and services.",
  keywords: "terms and conditions, legal terms, Sheba Electronics, user agreement",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <Breadcrumb items={[{ label: "Terms & Conditions" }]} dark />
          <div className="max-w-4xl mx-auto mt-8 sm:mt-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-slate-700 w-14 h-14 rounded-xl flex items-center justify-center">
                <FiFileText className="text-white" size={28} />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Terms & Conditions</h1>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 mb-4">
              <span className="text-sm text-gray-300">Last Updated: <strong className="text-white">01 January 2026</strong></span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-3xl">
              Welcome to Sheba Electronics. By accessing or using our website, you agree to comply with and be bound by the following Terms & Conditions.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* General */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-600 text-white text-lg font-bold w-10 h-10 rounded-lg flex items-center justify-center">1</span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">General</h2>
            </div>
            <p className="text-gray-600">
              By using this website, you confirm that you are legally capable of entering into a binding agreement. If you do not agree with these terms, please do not use our website or services.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-slate-800 rounded-xl p-6 sm:p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiMail className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">Contact Us</h2>
            </div>
            <a href="mailto:support@shebaelectronics.co" className="text-lg font-semibold hover:underline">
              📧 support@shebaelectronics.co
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
