'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGetOrdersQuery } from '@/app/store/api/ordersApi';
import { FiPackage, FiLoader, FiArrowRight, FiTruck, FiCheckCircle, FiClock, FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetOrdersQuery({ page, per_page: 10 });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return `৳ ${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'delivered') {
      return {
        bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: 'bg-green-500',
        badge: 'bg-green-100 text-green-700 border-green-200'
      };
    } else if (statusLower === 'shipped' || statusLower === 'out_for_delivery') {
      return {
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: 'bg-blue-500',
        badge: 'bg-blue-100 text-blue-700 border-blue-200'
      };
    } else if (statusLower === 'cancelled' || statusLower === 'failed') {
      return {
        bg: 'bg-gradient-to-br from-red-50 to-rose-50',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: 'bg-red-500',
        badge: 'bg-red-100 text-red-700 border-red-200'
      };
    } else {
      return {
        bg: 'bg-gradient-to-br from-amber-50 to-yellow-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: 'bg-amber-500',
        badge: 'bg-amber-100 text-amber-700 border-amber-200'
      };
    }
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'delivered') {
      return <FiCheckCircle size={18} />;
    } else if (statusLower === 'shipped' || statusLower === 'out_for_delivery') {
      return <FiTruck size={18} />;
    } else if (statusLower === 'cancelled' || statusLower === 'failed') {
      return <FiPackage size={18} />;
    } else {
      return <FiClock size={18} />;
    }
  };

  const getStatusDisplay = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                <FiPackage className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
              </div>
              <p className="text-gray-700 font-medium text-lg">Loading your orders...</p>
              <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl border border-red-200 p-6 text-center">
            <p className="text-red-600 mb-4">Failed to load orders. Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 font-semibold"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  const orders = data?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <FiPackage className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">My Orders</h1>
                <p className="text-sm text-gray-600 mt-1">Track and manage your recent purchases</p>
              </div>
            </div>
          </div>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FiArrowRight className="rotate-180" size={16} />
            Back to Account
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-12 md:p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiPackage className="text-gray-400" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Start shopping to see your orders here. We'll keep track of everything for you.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
            >
              Start Shopping
              <FiArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-5">
              {orders.map((order) => {
                // Use items_count from API response
                const itemsCount = order.items_count || 0;
                
                // Handle items - check if items exists and is an array (for thumbnail display)
                const items = Array.isArray(order.items) ? order.items : [];
                const firstItem = items.length > 0 ? items[0] : null;
                
                // Generate items text using items_count
                const itemsText = itemsCount === 1 
                  ? (firstItem?.product?.title || '1 item')
                  : `${itemsCount} items`;
                
                const statusColors = getStatusColor(order.status);

                return (
                  <div 
                    key={order.id} 
                    className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className={`${statusColors.bg} px-6 py-4 border-b-2 ${statusColors.border}`}>
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${statusColors.icon} rounded-xl flex items-center justify-center text-white shadow-md`}>
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Order Number</p>
                            <p className="text-lg font-bold text-gray-900">{order.order_number}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border-2 ${statusColors.badge} shadow-sm`}>
                          {getStatusDisplay(order.status)}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {firstItem && (
                          <div className="w-full lg:w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative border-2 border-gray-200 shadow-inner">
                            <Image
                              src={firstItem.product.thumbnail || '/products/placeholder.jpg'}
                              alt={firstItem.product.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 space-y-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Items</p>
                            <p className="text-lg font-bold text-gray-900">{itemsText}</p>
                          </div>
                          
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Order Date</p>
                              <p className="text-sm font-semibold text-gray-700">{formatDate(order.created_at)}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Payment Status</p>
                              <p className="text-sm font-semibold text-gray-700">
                                {order.payment_status
                                  .split('_')
                                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                  .join(' ')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Amount</p>
                              <p className="text-2xl font-bold text-gray-900">{formatPrice(order.total)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t-2 border-gray-100">
                        <Link
                          href={`/order-track?orderId=${encodeURIComponent(order.order_number)}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 font-semibold rounded-xl transition-all duration-200 border-2 border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md text-sm"
                        >
                          <FiTruck size={16} />
                          Track Order
                        </Link>
                        <Link
                          href={`/account/orders/${encodeURIComponent(order.order_number)}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all duration-200 border-2 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md text-sm"
                        >
                          View Details
                          <FiChevronRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {data?.meta && data.meta.last_page > 1 && (
              <div className="flex items-center justify-center gap-3 pt-6">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-6 py-3 bg-white border-2 border-gray-300 hover:border-blue-400 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 font-semibold text-gray-700 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:hover:shadow-sm"
                >
                  Previous
                </button>
                <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg">
                  Page {data.meta.current_page} of {data.meta.last_page}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(data.meta!.last_page, p + 1))}
                  disabled={page === data.meta.last_page}
                  className="px-6 py-3 bg-white border-2 border-gray-300 hover:border-blue-400 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 font-semibold text-gray-700 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:hover:shadow-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
