'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiHome } from 'react-icons/fi';

type MockStatusStep = 'placed' | 'processing' | 'shipped' | 'delivered';

const mockTimeline: { key: MockStatusStep; label: string; description: string }[] = [
  {
    key: 'placed',
    label: 'Order Placed',
    description: 'We have received your order and it is being verified.',
  },
  {
    key: 'processing',
    label: 'Processing',
    description: 'Your items are being prepared for shipment.',
  },
  {
    key: 'shipped',
    label: 'Shipped',
    description: 'Your package has left our warehouse and is on the way.',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    description: 'Your order has been delivered.',
  },
];

const mockOrders = [
  {
    id: '#PO-103984',
    items: 'Philips Mixer Grinder + JBL Wave Flex',
    total: '৳ 14,980',
    status: 'Delivered',
  },
  {
    id: '#PO-103712',
    items: 'Casio G-Shock Watch',
    total: '৳ 9,990',
    status: 'Shipped',
  },
  {
    id: '#PO-103388',
    items: 'Samsung 43" UHD TV',
    total: '৳ 52,990',
    status: 'Processing',
  },
];

export default function OrderTrackPage() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  const [orderId, setOrderId] = useState(initialOrderId);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(initialOrderId || null);
  const [isLoading, setIsLoading] = useState(false);

  const currentOrder = useMemo(
    () => (submittedId ? mockOrders.find((o) => o.id === submittedId) || null : null),
    [submittedId]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !phoneOrEmail.trim()) return;

    setIsLoading(true);
    // In a real app, call your API here.
    setTimeout(() => {
      setSubmittedId(orderId.trim());
      setIsLoading(false);
    }, 600);
  };

  const hasResult = !!submittedId;

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Breadcrumb / Heading */}
        <div className="mb-6 sm:mb-8">
          <nav className="text-xs sm:text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 font-medium">Track Order</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Track Your Order</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Enter your order ID and phone number / email address to check the latest status of
            your order.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* Left: Form + Status */}
          <div className="space-y-6">
            {/* Track Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiSearch className="text-blue-600" size={18} />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                    Order Tracking
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    You can find your order ID in the order confirmation SMS or email.
                  </p>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Order ID
                  </label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. SHEBA-123456"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Phone number or email
                  </label>
                  <input
                    type="text"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    placeholder="e.g. 01XXXXXXXXX or you@example.com"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !orderId.trim() || !phoneOrEmail.trim()}
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                >
                  <FiSearch size={16} />
                  {isLoading ? 'Checking status...' : 'Track Order'}
                </button>
              </form>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              {hasResult ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Order ID</p>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">
                        {submittedId}
                      </p>
                      {currentOrder && (
                        <>
                          <p className="mt-1 text-xs sm:text-sm text-gray-600">
                            {currentOrder.items}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Total: <span className="font-semibold">{currentOrder.total}</span>
                          </p>
                        </>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                      {currentOrder?.status || 'In progress'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiPackage className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Your order is on the way</p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Expected delivery: 3–5 business days.
                      </p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <ol className="relative border-l border-gray-200 ml-3 pl-4 space-y-4">
                    {mockTimeline.map((step, index) => (
                      <li key={step.key} className="relative">
                        <span className="absolute -left-[29px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-600 bg-white">
                          {index < 2 ? (
                            <FiCheckCircle className="text-blue-600" size={14} />
                          ) : index === 2 ? (
                            <FiTruck className="text-blue-600" size={14} />
                          ) : (
                            <FiPackage className="text-blue-600" size={14} />
                          )}
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">
                          {step.label}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">{step.description}</p>
                      </li>
                    ))}
                  </ol>
                </>
              ) : (
                <div className="flex flex-col items-center text-center py-4 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 sm:mb-4">
                    <FiPackage className="text-gray-400" size={26} />
                  </div>
                  <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                    No order selected
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-xs">
                    Enter your order ID and phone number / email in the form to see detailed
                    tracking information here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Help / Info */}
          <aside className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">
                Need help with your order?
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                <li>• Make sure you enter the correct order ID from SMS / email.</li>
                <li>• Use the same phone number or email that you used during checkout.</li>
                <li>• If you still cannot find your order, please contact our support team.</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 sm:p-5 flex items-start gap-3">
              <div className="mt-1">
                <FiHome className="text-blue-600" size={18} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">
                  Continue Shopping
                </p>
                <p className="text-xs sm:text-sm text-blue-800 mb-3">
                  Browse our latest deals and products while your order is on the way.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <span>Go to Home</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}


