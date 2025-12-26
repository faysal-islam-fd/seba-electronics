'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGetOrdersQuery } from '@/app/store/api/ordersApi';
import { FiPackage, FiArrowRight, FiTruck, FiCheckCircle, FiClock, FiChevronRight, FiXCircle, FiEye, FiShoppingBag } from 'react-icons/fi';
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

  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'delivered') {
      return {
        bg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        lightBg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: FiCheckCircle,
      };
    } else if (statusLower === 'shipped' || statusLower === 'out_for_delivery') {
      return {
        bg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
        lightBg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: FiTruck,
      };
    } else if (statusLower === 'cancelled' || statusLower === 'failed') {
      return {
        bg: 'bg-gradient-to-r from-red-500 to-rose-500',
        lightBg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: FiXCircle,
      };
    } else {
      return {
        bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
        lightBg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: FiClock,
      };
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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <FiPackage className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
          </div>
          <p className="text-gray-700 font-medium text-lg mt-6">Loading your orders...</p>
          <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-red-100 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <FiXCircle className="text-red-500" size={32} />
        </div>
        <p className="text-red-600 font-medium mb-2">Failed to load orders</p>
        <p className="text-gray-500 text-sm mb-4">Please try again later</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const orders = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <FiShoppingBag className="text-white" size={26} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">My Orders</h1>
            <p className="text-gray-500 text-sm mt-0.5">Track and manage your purchases</p>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-blue-900/5 border border-white/50 p-12 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center">
            <FiPackage className="text-gray-300" size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Start shopping to see your orders here. We'll keep track of everything for you.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl"
          >
            Start Shopping
            <FiArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => {
              const itemsCount = order.items_count || 0;
              const items = Array.isArray(order.items) ? order.items : [];
              const firstItem = items.length > 0 ? items[0] : null;
              const itemsText = itemsCount === 1
                ? (firstItem?.product?.title || '1 item')
                : `${itemsCount} items`;
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={order.id}
                  className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-blue-900/5 border border-white/50 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Status Header */}
                  <div className={`px-6 py-4 ${statusConfig.lightBg} border-b ${statusConfig.border}`}>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${statusConfig.bg} rounded-xl flex items-center justify-center text-white shadow-md`}>
                          <StatusIcon size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Order</p>
                          <p className="text-base font-bold text-gray-900">{order.order_number}</p>
                        </div>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${statusConfig.bg} text-white shadow-sm`}>
                        {getStatusDisplay(order.status)}
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      {firstItem && (
                        <div className="w-full sm:w-28 h-28 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative border border-gray-100">
                          <Image
                            src={firstItem.product.thumbnail || '/products/placeholder.jpg'}
                            alt={firstItem.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Order Details */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 line-clamp-1">{itemsText}</p>
                          <p className="text-xs text-gray-500 mt-1">Ordered on {formatDate(order.created_at)}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Total</p>
                            <p className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Payment</p>
                            <p className="text-sm font-medium text-gray-700 capitalize">
                              {order.payment_status.split('_').join(' ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-100">
                      <Link
                        href={`/order-track?orderId=${encodeURIComponent(order.order_number)}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl text-sm transition-all duration-200 shadow-md shadow-blue-500/25 hover:shadow-lg"
                      >
                        <FiTruck size={16} />
                        Track Order
                      </Link>
                      <Link
                        href={`/account/orders/${encodeURIComponent(order.order_number)}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl text-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                      >
                        <FiEye size={16} />
                        View Details
                        <FiChevronRight size={14} className="opacity-50" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {data?.meta && data.meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 font-medium text-gray-700 transition-all duration-200 text-sm"
              >
                Previous
              </button>
              <div className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25">
                {data.meta.current_page} / {data.meta.last_page}
              </div>
              <button
                onClick={() => setPage(p => Math.min(data.meta!.last_page, p + 1))}
                disabled={page === data.meta.last_page}
                className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 font-medium text-gray-700 transition-all duration-200 text-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
