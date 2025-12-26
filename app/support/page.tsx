import type { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import {
  FiHeadphones,
  FiCheckCircle,
  FiMail,
  FiPhone,
  FiClock,
  FiMessageCircle,
  FiFileText,
  FiShield,
  FiSend
} from 'react-icons/fi';

export const metadata: Metadata = {
  title: "Customer Support - Sheba Electronics | Contact Us",
  description: "Get help from Sheba Electronics customer support team.",
  keywords: "customer support, contact, Sheba Electronics",
};

export default function SupportPage() {
  const supportServices = [
    "Order tracking & delivery updates",
    "Product information & availability",
    "Warranty & service claims",
    "Returns, replacements & refunds",
    "Payment and billing support",
    "Account-related assistance"
  ];

  const contactMethods = [
    { icon: FiPhone, title: "Phone", value: "+880 1898 805555", link: "tel:+8801898805555", color: "bg-blue-600" },
    { icon: FiMail, title: "Email", value: "support@shebaelectronics.co", link: "mailto:support@shebaelectronics.co", color: "bg-green-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <Breadcrumb items={[{ label: "Customer Support" }]} dark />
          <div className="max-w-4xl mx-auto mt-8 sm:mt-10 text-center">
            <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
              <FiHeadphones className="text-white" size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Customer Support</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our dedicated team is always ready to assist you with any inquiries or service-related needs.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* How We Can Help */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiFileText className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">How Can We Help You?</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {supportServices.map((service, idx) => (
                <div key={idx} className="bg-blue-50 rounded-lg p-4 flex items-center gap-3 border border-blue-100">
                  <FiCheckCircle className="text-blue-600 flex-shrink-0" size={18} />
                  <span className="text-gray-700 text-sm">{service}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Methods */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">Contact Us</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                    <div className={`${method.color} w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="text-white" size={28} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{method.title}</h3>
                    <a href={method.link} className="text-blue-600 font-medium hover:underline break-all">
                      {method.value}
                    </a>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 bg-gray-50 rounded-xl p-5 border border-gray-200 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FiClock className="text-gray-600" size={20} />
                <span className="font-bold text-gray-900">Support Hours</span>
              </div>
              <p className="text-gray-600">Saturday – Thursday | 09:00 AM – 06:00 PM</p>
            </div>
          </section>

          {/* Live Support Options */}
          <section className="bg-blue-50 rounded-xl border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiMessageCircle className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Live Support Options</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-5 border border-blue-100">
                <FiMessageCircle className="text-blue-600 mb-3" size={24} />
                <h3 className="font-bold text-gray-900 mb-1">💬 Chat With Us</h3>
                <p className="text-gray-600 text-sm">Available during business hours</p>
              </div>
              <div className="bg-white rounded-lg p-5 border border-blue-100">
                <FiFileText className="text-amber-500 mb-3" size={24} />
                <h3 className="font-bold text-gray-900 mb-1">🎫 Support Ticket</h3>
                <p className="text-gray-600 text-sm">Submit through your account</p>
              </div>
              <div className="bg-white rounded-lg p-5 border border-blue-100">
                <FiMail className="text-rose-500 mb-3" size={24} />
                <h3 className="font-bold text-gray-900 mb-1">📩 Email Support</h3>
                <p className="text-gray-600 text-sm">Response within 24 hours</p>
              </div>
              <div className="bg-white rounded-lg p-5 border border-blue-100">
                <FiSend className="text-green-600 mb-3" size={24} />
                <h3 className="font-bold text-gray-900 mb-1">📱 WhatsApp</h3>
                <p className="text-gray-600 text-sm">Quick and convenient</p>
              </div>
            </div>
          </section>

          {/* Warranty Support */}
          <section className="bg-green-50 rounded-xl border border-green-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiShield className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Warranty Support</h2>
            </div>
            <ul className="space-y-2">
              {["Keep your warranty card and invoice", "Contact support to initiate claim", "We'll arrange pickup and servicing"].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-700">
                  <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}


