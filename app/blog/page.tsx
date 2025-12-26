import type { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import { FiBookOpen, FiClock, FiEdit3 } from 'react-icons/fi';

export const metadata: Metadata = {
  title: "Blog - Sheba Electronics | Latest News & Updates",
  description: "Stay updated with the latest news, tips, and updates from Sheba Electronics.",
  keywords: "blog, Sheba Electronics, news, updates",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <Breadcrumb items={[{ label: "Blog" }]} dark />
          <div className="max-w-4xl mx-auto mt-8 sm:mt-10 text-center">
            <div className="bg-rose-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
              <FiBookOpen className="text-white" size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Sheba Electronics Blog
            </h1>
            <p className="text-gray-400 text-lg">
              Stay updated with the latest news, tips, and insights
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
            <div className="bg-rose-100 w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6">
              <FiEdit3 className="text-rose-500" size={36} />
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-sm font-medium mb-4">
              <FiClock size={14} />
              Stay Tuned
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600 text-lg">
              We're working on bringing you the latest news, tips, and insights about home appliances, shopping guides, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

