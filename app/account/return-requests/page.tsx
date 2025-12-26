'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGetReturnRequestsQuery } from '@/app/store/api/returnRequestsApi';
import { FiRefreshCw, FiLoader, FiArrowRight, FiChevronRight, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Image from 'next/image';

export default function ReturnRequestsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const queryParams: any = { page, per_page: 10 };
  if (statusFilter !== 'all') {
    queryParams.status = statusFilter;
  }
  
  const { data, isLoading, error } = useGetReturnRequestsQuery(queryParams);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'completed') {
      return {
        bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: 'bg-green-500',
        badge: 'bg-green-100 text-green-700 border-green-200'
      };
    } else if (statusLower === 'approved' || statusLower === 'in_progress') {
      return {
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: 'bg-blue-500',
        badge: 'bg-blue-100 text-blue-700 border-blue-200'
      };
    } else if (statusLower === 'cancelled' || statusLower === 'rejected') {
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
    if (statusLower === 'completed') {
      return <FiCheckCircle size={18} />;
    } else if (statusLower === 'approved' || statusLower === 'in_progress') {
      return <FiRefreshCw size={18} />;
    } else if (statusLower === 'cancelled' || statusLower === 'rejected') {
      return <FiXCircle size={18} />;
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

  const getReasonDisplay = (reason: string) => {
    return reason
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
                <FiRefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
              </div>
              <p className="text-gray-700 font-medium text-lg">Loading return requests...</p>
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
            <p className="text-red-600 mb-4">Failed to load return requests. Please try again later.</p>
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

  const requests = Array.isArray(data?.data) ? data.data : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                <FiRefreshCw className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Return Requests</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your product returns and refunds</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FiArrowRight className="rotate-180" size={16} />
              Back to Account
            </Link>
            <Link
              href="/account/return-requests/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-rose-500/30 hover:shadow-xl"
            >
              New Request
              <FiArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
          <div className="max-w-xs">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-12 md:p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiRefreshCw className="text-gray-400" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No return requests yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">You haven't created any return requests. Create one to get started.</p>
            <Link
              href="/account/return-requests/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40"
            >
              Create Return Request
              <FiArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-5">
              {requests.map((request) => {
                const statusColors = getStatusColor(request.status);
                const productThumbnail = request.order_item?.product?.thumbnail;

                return (
                  <div 
                    key={request.id} 
                    className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-rose-300 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className={`${statusColors.bg} px-6 py-4 border-b-2 ${statusColors.border}`}>
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${statusColors.icon} rounded-xl flex items-center justify-center text-white shadow-md`}>
                            {getStatusIcon(request.status)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Request ID</p>
                            <p className="text-lg font-bold text-gray-900">#{request.id}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border-2 ${statusColors.badge} shadow-sm`}>
                            {getStatusDisplay(request.status)}
                          </span>
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-purple-100 text-purple-700 border-2 border-purple-200 shadow-sm">
                            {getReasonDisplay(request.reason)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {productThumbnail && (
                          <div className="w-full lg:w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative border-2 border-gray-200 shadow-inner">
                            <Image
                              src={productThumbnail || '/products/placeholder.jpg'}
                              alt={request.order_item?.product?.title || 'Product'}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 space-y-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Product</p>
                            <p className="text-lg font-bold text-gray-900">{request.order_item?.product?.title || 'N/A'}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</p>
                            <p className="text-sm text-gray-700 line-clamp-2">{request.description}</p>
                          </div>
                          
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Order Number</p>
                              <p className="text-sm font-semibold text-gray-700">{request.order?.order_number || `Order #${request.order_id}`}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Created Date</p>
                              <p className="text-sm font-semibold text-gray-700">{formatDate(request.created_at)}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Refund Method</p>
                            <p className="text-sm font-semibold text-gray-700 capitalize">
                              {request.refund_method.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </p>
                          </div>

                          {request.images && request.images.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Attached Images</p>
                              <div className="flex gap-2 flex-wrap">
                                {request.images.slice(0, 3).map((image, idx) => (
                                  <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 relative">
                                    <Image
                                      src={image}
                                      alt={`Attachment ${idx + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ))}
                                {request.images.length > 3 && (
                                  <div className="w-16 h-16 rounded-lg border-2 border-gray-200 flex items-center justify-center bg-gray-50">
                                    <span className="text-xs font-bold text-gray-600">+{request.images.length - 3}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t-2 border-gray-100">
                        <Link
                          href={`/account/return-requests/${request.id}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all duration-200 border-2 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md text-sm"
                        >
                          View Details
                          <FiChevronRight size={16} />
                        </Link>
                        {request.status === 'pending' && (
                          <Link
                            href={`/account/orders/${request.order?.order_number || request.order_id}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 text-rose-700 font-semibold rounded-xl transition-all duration-200 border-2 border-rose-200 hover:border-rose-300 shadow-sm hover:shadow-md text-sm"
                          >
                            View Order
                          </Link>
                        )}
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
                  className="px-6 py-3 bg-white border-2 border-gray-300 hover:border-rose-400 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rose-50 font-semibold text-gray-700 hover:text-rose-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:hover:shadow-sm"
                >
                  Previous
                </button>
                <div className="px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-bold shadow-lg">
                  Page {data.meta.current_page} of {data.meta.last_page}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(data.meta!.last_page, p + 1))}
                  disabled={page === data.meta.last_page}
                  className="px-6 py-3 bg-white border-2 border-gray-300 hover:border-rose-400 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rose-50 font-semibold text-gray-700 hover:text-rose-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:hover:shadow-sm"
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

