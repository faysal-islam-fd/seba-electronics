import type { Metadata } from "next";
import Breadcrumb from "../components/Breadcrumb";
import {
  FiCreditCard,
  FiLock,
  FiCheckCircle,
  FiMail,
  FiDollarSign,
  FiAlertCircle,
  FiSmartphone,
  FiRefreshCw
} from 'react-icons/fi';

export const metadata: Metadata = {
  title: "Payment Policy - Sheba Electronics | Secure Payment Methods",
  description: "Learn about secure payment options at Sheba Electronics.",
  keywords: "payment policy, payment methods, Sheba Electronics, COD, EMI",
};

export default function PaymentsPage() {
  const paymentMethods = [
    { icon: FiDollarSign, title: "Cash on Delivery (COD)", features: ["Available for selected locations", "Pay in cash at delivery"], color: "bg-green-600" },
    { icon: FiCreditCard, title: "Online Payment", features: ["Credit/Debit Cards", "bKash, Nagad, Rocket", "Internet Banking"], color: "bg-blue-600" },
    { icon: FiSmartphone, title: "EMI Available", features: ["0% or low-interest EMI", "3 to 36 months tenure"], color: "bg-purple-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <Breadcrumb items={[{ label: "Payment Policy" }]} dark />
          <div className="max-w-4xl mx-auto mt-8 sm:mt-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-600 w-14 h-14 rounded-xl flex items-center justify-center">
                <FiCreditCard className="text-white" size={28} />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Payment Policy</h1>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-3xl mt-4">
              We offer secure, convenient payment options for all our customers.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Payment Methods */}
          <div className="grid md:grid-cols-3 gap-5">
            {paymentMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className={`${method.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3">{method.title}</h3>
                  <ul className="space-y-2">
                    {method.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                        <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={14} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Payment Security */}
          <section className="bg-blue-50 rounded-xl border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiLock className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Payment Security</h2>
            </div>
            <p className="text-gray-700">
              Your payment information is protected using industry-standard encryption. <strong>We do not store any card or banking details.</strong>
            </p>
          </section>

          {/* Order Confirmation */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Order Confirmation</h2>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-gray-700">
                <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                You will receive confirmation via SMS/email
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                Your order will be processed for dispatch
              </li>
            </ul>
          </section>

          {/* Refunds */}
          <section className="bg-amber-50 rounded-xl border border-amber-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiRefreshCw className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Refunds</h2>
            </div>
            <p className="text-gray-700">
              Refunds are processed within <strong>7-10 working days</strong> depending on the payment method and bank.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-green-600 rounded-xl p-6 sm:p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center">
                <FiMail className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">Need Help?</h2>
            </div>
            <p className="text-green-100 mb-2">For payment assistance:</p>
            <a href="mailto:support@shebaelectronics.co" className="text-lg font-semibold hover:underline">
              📧 support@shebaelectronics.co
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
