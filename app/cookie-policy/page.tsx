import type { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import {
  FiShield,
  FiSettings,
  FiBarChart2,
  FiTarget,
  FiMail,
  FiCheckCircle,
  FiFileText
} from 'react-icons/fi';

export const metadata: Metadata = {
  title: "Cookie Policy - Sheba Electronics | How We Use Cookies",
  description: "Learn how Sheba Electronics uses cookies and similar technologies to enhance your browsing experience.",
  keywords: "cookie policy, cookies, tracking, Sheba Electronics, privacy",
};

export default function CookiePolicyPage() {
  const cookieTypes = [
    { icon: FiShield, title: "Essential Cookies", desc: "Necessary for the website to function properly. Enable core features like account login and secure checkout.", color: "bg-green-600" },
    { icon: FiBarChart2, title: "Performance Cookies", desc: "Help us understand how visitors interact with our website by collecting anonymous usage data.", color: "bg-blue-600" },
    { icon: FiSettings, title: "Functional Cookies", desc: "Remember your preferences, such as language or location, to provide a personalized experience.", color: "bg-purple-600" },
    { icon: FiTarget, title: "Advertising Cookies", desc: "Used by third-party platforms to display relevant advertisements based on your browsing behavior.", color: "bg-amber-500" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <Breadcrumb items={[{ label: "Cookie Policy" }]} dark />
          <div className="max-w-4xl mx-auto mt-8 sm:mt-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-600 w-14 h-14 rounded-xl flex items-center justify-center">
                <FiFileText className="text-white" size={28} />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Cookie Policy</h1>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 mb-4">
              <span className="text-sm text-gray-300">Last Updated: <strong className="text-white">01 January 2026</strong></span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-3xl">
              This Cookie Policy explains how Sheba Electronics uses cookies and similar technologies when you visit our website. By continuing to browse, you agree to the use of cookies as described here.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* What Are Cookies */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
            <p className="text-gray-600 mb-4">
              Cookies are small text files stored on your device when you visit a website. They help websites function efficiently and improve user experience by remembering your preferences and activity.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
              <p className="text-gray-700">
                <strong>Note:</strong> Cookies do not contain viruses and cannot access personal files on your device.
              </p>
            </div>
          </section>

          {/* Types of Cookies */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Types of Cookies We Use</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {cookieTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                    <div className={`${type.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                      <Icon className="text-white" size={20} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{type.title}</h3>
                    <p className="text-gray-600 text-sm">{type.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Managing Cookies */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Managing Cookies</h2>
            <p className="text-gray-600 mb-4">
              You can control or disable cookies through your browser settings. Note that disabling cookies may affect website functionality.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="font-semibold text-gray-900">Google Chrome</p>
                <p className="text-gray-600 text-sm">Settings → Privacy & Security → Cookies</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="font-semibold text-gray-900">Mozilla Firefox</p>
                <p className="text-gray-600 text-sm">Options → Privacy & Security</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="font-semibold text-gray-900">Safari</p>
                <p className="text-gray-600 text-sm">Preferences → Privacy</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="font-semibold text-gray-900">Microsoft Edge</p>
                <p className="text-gray-600 text-sm">Settings → Cookies and site permissions</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-purple-600 rounded-xl p-6 sm:p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiMail className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">Contact Us</h2>
            </div>
            <p className="text-purple-100 mb-2">Questions about our Cookie Policy?</p>
            <a href="mailto:support@shebaelectronics.co" className="text-lg font-semibold hover:underline">
              📧 support@shebaelectronics.co
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
