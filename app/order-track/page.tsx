'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  FiSearch,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiHome,
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
} from 'react-icons/fi';

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
    eta: 'Delivered on 16 Nov 2024',
    contact: {
      phone: '01XXXXXXXXX',
      email: 'support@sheba.com',
      address: 'Banani, Dhaka',
    },
  },
  {
    id: '#PO-103712',
    items: 'Casio G-Shock Watch',
    total: '৳ 9,990',
    status: 'Shipped',
    eta: 'Estimated delivery: 05 Nov 2024',
    contact: {
      phone: '01XXXXXXXXX',
      email: 'support@sheba.com',
      address: 'Uttara, Dhaka',
    },
  },
  {
    id: '#PO-103388',
    items: 'Samsung 43" UHD TV',
    total: '৳ 52,990',
    status: 'Processing',
    eta: 'We will notify you once shipped',
    contact: {
      phone: '01XXXXXXXXX',
      email: 'support@sheba.com',
      address: 'Mirpur, Dhaka',
    },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <nav className="text-xs sm:text-sm text-gray-500 mb-2">
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700 font-medium">Track Order</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Track your delivery
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Enter your order ID and phone/email to see real-time status, ETA, and delivery details.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
          >
            <FiHome size={16} />
            Continue shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1.8fr_1.1fr] gap-6 lg:gap-8">
          {/* Left column */}
          <div className="space-y-6">
            {/* Glass card with form */}
            <div className="rounded-2xl border border-slate-200/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-sm p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center shadow-inner shadow-blue-200">
                  <FiSearch className="text-blue-700" size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Find your order</h2>
                  <p className="text-sm text-slate-600">
                    You’ll find the order ID in your confirmation email or SMS.
                  </p>
                </div>
              </div>

              <form className="grid sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Order ID
                  </label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. #PO-103712"
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 shadow-inner shadow-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Phone or Email
                  </label>
                  <input
                    type="text"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    placeholder="01XXXXXXXXX or you@example.com"
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 shadow-inner shadow-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={isLoading || !orderId.trim() || !phoneOrEmail.trim()}
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/20"
                  >
                    <FiSearch size={16} />
                    {isLoading ? 'Checking status...' : 'Track order'}
                  </button>
                  <Link
                    href="/account/orders"
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-xl text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-100"
                  >
                    View my orders
                  </Link>
                </div>
              </form>
            </div>

            {/* Status */}
            <div className="rounded-2xl border border-slate-200/70 bg-white shadow-xl shadow-slate-900/5 p-5 sm:p-6">
              {hasResult ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Order ID
                      </p>
                      <p className="text-lg font-bold text-slate-900">{submittedId}</p>
                      {currentOrder && (
                        <div className="mt-1 space-y-0.5 text-sm text-slate-600">
                          <p>{currentOrder.items}</p>
                          <p className="text-slate-500">
                            Total: <span className="font-semibold text-slate-800">{currentOrder.total}</span>
                          </p>
                        </div>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      {currentOrder?.status || 'In progress'}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FiPackage className="text-blue-700" size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Current status</p>
                        <p className="text-xs text-slate-600">
                          {currentOrder?.eta || 'We will notify you once shipped'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <FiClock className="text-emerald-700" size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Est. delivery</p>
                        <p className="text-xs text-slate-600">
                          {currentOrder?.eta || '3–5 business days'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Delivery timeline
                    </p>
                    <ol className="relative border-l border-slate-200 ml-3 pl-4 space-y-4">
                      {mockTimeline.map((step, index) => (
                        <li key={step.key} className="relative">
                          <span className="absolute -left-[29px] top-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-blue-600 bg-white shadow-sm shadow-blue-100">
                            {index < 2 ? (
                              <FiCheckCircle className="text-blue-600" size={15} />
                            ) : index === 2 ? (
                              <FiTruck className="text-blue-600" size={15} />
                            ) : (
                              <FiPackage className="text-blue-600" size={15} />
                            )}
                          </span>
                          <p className="text-sm font-semibold text-slate-900">{step.label}</p>
                          <p className="text-xs text-slate-600">{step.description}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-center py-6 sm:py-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 shadow-inner shadow-slate-200">
                    <FiPackage className="text-slate-400" size={26} />
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-1">
                    Track your order to see live updates
                  </h2>
                  <p className="text-sm text-slate-600 max-w-sm">
                    Enter your order ID and phone/email to pull the latest status, ETA, and delivery details.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <aside className="space-y-4 lg:space-y-5">
            <div className="rounded-2xl border border-slate-200/70 bg-white shadow-xl shadow-slate-900/5 p-5 sm:p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-3">Delivery contact</h3>
              {currentOrder ? (
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-blue-600" size={16} />
                    <span>{currentOrder.contact.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-blue-600" size={16} />
                    <span>{currentOrder.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMail className="text-blue-600" size={16} />
                    <span>{currentOrder.contact.email}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-600">
                  Search for an order to see delivery contact details.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-100 shadow-xl shadow-blue-100/40 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
                  <FiHome className="text-white" size={18} />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">
                    Continue shopping while you wait
                  </p>
                  <p className="text-xs text-slate-700">
                    Explore new deals and products. We’ll keep your order moving.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors shadow-md shadow-blue-500/30"
                  >
                    Browse products
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}


