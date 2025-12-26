import type { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import {
  FiShield,
  FiLock,
  FiCreditCard,
  FiEye,
  FiShare2,
  FiMail,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';

export const metadata: Metadata = {
  title: "Privacy Policy - Sheba Electronics | Your Data Protection & Privacy",
  description: "Learn how Sheba Electronics collects, uses, and protects your personal information. Your privacy and data security are our top priorities.",
  keywords: "privacy policy, data protection, Sheba Electronics, privacy, security, personal information",
};

export default function PrivacyPage() {
  const infoTypes = [
    { icon: FiFileText, title: "Personal Details", items: ["Name", "Email address", "Phone number", "Delivery address"] },
    { icon: FiCreditCard, title: "Order Information", items: ["Order history", "Purchase history"] },
    { icon: FiEye, title: "Device & Usage", items: ["IP address", "Browser type", "Pages visited"] },
    { icon: FiLock, title: "Payment Information", items: ["Securely processed via trusted third-party payment gateways"] },
  ];

  const usagePurposes = [
    { icon: FiCheckCircle, title: "Process Orders", desc: "Process and deliver your orders efficiently" },
    { icon: FiMail, title: "Customer Support", desc: "Provide customer support and order updates" },
    { icon: FiEye, title: "Improve Experience", desc: "Improve our website, products, and user experience" },
    { icon: FiShare2, title: "Promotional Updates", desc: "Send promotional offers, updates, and notifications (you may opt out anytime)" },
    { icon: FiShield, title: "Security", desc: "Prevent fraud and ensure platform security" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <Breadcrumb items={[{ label: "Privacy Policy" }]} dark />
          <div className="max-w-4xl mx-auto mt-8 sm:mt-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-teal-600 w-14 h-14 rounded-xl flex items-center justify-center">
                <FiShield className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                  Privacy Policy
                </h1>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 mb-4">
              <span className="text-sm text-gray-300">Last Updated: <strong className="text-white">01 January 2026</strong></span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-3xl">
              At Sheba Electronics, we value your trust and are committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and safeguard your personal information.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Information We Collect */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-teal-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiFileText className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            <p className="text-gray-600 mb-6">We may collect the following types of information:</p>
            <div className="grid md:grid-cols-2 gap-4">
              {infoTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
                        <Icon className="text-blue-600" size={20} />
                      </div>
                      <h3 className="font-bold text-gray-900">{type.title}</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {type.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">How We Use Your Information</h2>
            </div>
            <div className="space-y-4">
              {usagePurposes.map((purpose, index) => {
                const Icon = purpose.icon;
                return (
                  <div key={index} className="flex items-start gap-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{purpose.title}</h3>
                      <p className="text-gray-600 text-sm">{purpose.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Data Protection */}
          <section className="bg-teal-50 rounded-xl border border-teal-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-teal-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiLock className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Data Protection & Security</h2>
            </div>
            <p className="text-gray-700">
              We take data security seriously. Your personal information is protected using industry-standard security measures. All payments are processed through <strong>PCI-DSS–compliant</strong> secure payment gateways, and we do not store your card or financial details.
            </p>
          </section>

          {/* Sharing of Information */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiShare2 className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Sharing of Information</h2>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg mb-4">
              <p className="font-bold text-gray-900">We do not sell or rent your personal data.</p>
            </div>
            <p className="text-gray-600 mb-4">Your information may only be shared with:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-gray-700">
                <FiCheckCircle className="text-purple-600 mt-1 flex-shrink-0" size={18} />
                Trusted logistics and delivery partners
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <FiCheckCircle className="text-purple-600 mt-1 flex-shrink-0" size={18} />
                Secure payment gateway providers
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <FiCheckCircle className="text-purple-600 mt-1 flex-shrink-0" size={18} />
                Legal or regulatory authorities when required by law
              </li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="bg-amber-50 rounded-xl border border-amber-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiEye className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Cookies & Tracking</h2>
            </div>
            <p className="text-gray-700">
              Our website uses cookies to enhance your browsing experience, analyze traffic, and improve performance. You may disable cookies through your browser settings if you prefer.
            </p>
          </section>

          {/* Your Rights */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Rights</h2>
            </div>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-gray-700">
                <FiCheckCircle className="text-indigo-600 mt-1 flex-shrink-0" size={18} />
                Access or update your personal information
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <FiCheckCircle className="text-indigo-600 mt-1 flex-shrink-0" size={18} />
                Request deletion of your data
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <FiCheckCircle className="text-indigo-600 mt-1 flex-shrink-0" size={18} />
                Withdraw consent for marketing communications at any time
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="bg-teal-600 rounded-xl p-6 sm:p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiMail className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">Contact Us</h2>
            </div>
            <p className="text-teal-100 mb-2">If you have any questions, please contact us:</p>
            <a href="mailto:support@shebaelectronics.co" className="text-lg font-semibold hover:underline">
              📧 support@shebaelectronics.co
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
