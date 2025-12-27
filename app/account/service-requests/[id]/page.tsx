'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetServiceRequestQuery, useCancelServiceRequestMutation } from '@/app/store/api/serviceRequestsApi';
import { FiLoader, FiArrowLeft, FiShield, FiXCircle, FiClock, FiCheckCircle, FiAlertCircle, FiPackage, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import Image from 'next/image';
import { useState } from 'react';

export default function ServiceRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params?.id as string);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const { data, isLoading, error } = useGetServiceRequestQuery(id, {
    skip: !id || isNaN(id),
  });
  const [cancelRequest, { isLoading: isCancelling }] = useCancelServiceRequestMutation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
        badge: 'bg-green-100 text-green-700 border-green-200',
        card: 'from-green-50 to-emerald-50'
      };
    } else if (statusLower === 'approved' || statusLower === 'in_progress') {
      return {
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: 'bg-blue-500',
        badge: 'bg-blue-100 text-blue-700 border-blue-200',
        card: 'from-blue-50 to-indigo-50'
      };
    } else if (statusLower === 'cancelled' || statusLower === 'rejected') {
      return {
        bg: 'bg-gradient-to-br from-red-50 to-rose-50',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: 'bg-red-500',
        badge: 'bg-red-100 text-red-700 border-red-200',
        card: 'from-red-50 to-rose-50'
      };
    } else {
      return {
        bg: 'bg-gradient-to-br from-amber-50 to-yellow-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: 'bg-amber-500',
        badge: 'bg-amber-100 text-amber-700 border-amber-200',
        card: 'from-amber-50 to-yellow-50'
      };
    }
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'completed') {
      return <FiCheckCircle size={24} />;
    } else if (statusLower === 'approved' || statusLower === 'in_progress') {
      return <FiShield size={24} />;
    } else if (statusLower === 'cancelled' || statusLower === 'rejected') {
      return <FiXCircle size={24} />;
    } else {
      return <FiClock size={24} />;
    }
  };

  const getStatusDisplay = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getTypeDisplay = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleCancelRequest = async () => {
    try {
      await cancelRequest(id).unwrap();
      setShowCancelModal(false);
      router.refresh();
    } catch (error) {
      console.error('Failed to cancel request:', error);
      alert('Failed to cancel request. Please try again.');
    }
  };

  const canCancel = data?.data?.status === 'pending';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                <FiShield className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
              </div>
              <p className="text-gray-700 font-medium text-lg">Loading service request details...</p>
              <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-white rounded-2xl border-2 border-red-200 shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiXCircle className="text-red-600" size={32} />
            </div>
            <p className="text-red-600 font-semibold mb-6 text-lg">
              Failed to load service request details. Please try again later.
            </p>
            <Link
              href="/account/service-requests"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FiArrowLeft size={18} />
              Back to Service Requests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const request = data.data;
  const statusColors = getStatusColor(request.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/account/service-requests"
              className="w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-200 hover:border-blue-300 rounded-xl text-blue-600 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FiArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Service Request Details</h1>
              <p className="text-sm text-gray-600 mt-1">
                {request.request_number ? `Request ${request.request_number}` : `Request #${request.id}`}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-red-300 hover:border-red-400 text-red-600 hover:text-red-700 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FiXCircle size={16} />
                Cancel Request
              </button>
            )}
            {request.order?.order_number && (
              <Link
                href={`/account/orders/${request.order.order_number}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl"
              >
                View Order
              </Link>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status */}
            <div className={`bg-gradient-to-br ${statusColors.card} rounded-2xl border-2 ${statusColors.border} shadow-xl p-6 md:p-8`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 ${statusColors.icon} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    {getStatusIcon(request.status)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Request Status</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Created on {formatDate(request.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl border-2 ${statusColors.badge} shadow-md`}>
                    {getStatusDisplay(request.status)}
                  </span>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl bg-purple-100 text-purple-700 border-2 border-purple-200 shadow-md">
                    {getTypeDisplay(request.type)}
                  </span>
                </div>
              </div>
            </div>

            {/* Product Information */}
            {request.order_item && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <FiPackage className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Product Information</h2>
                </div>
                {(() => {
                  // Handle different item structures from API
                  const orderItem = request.order_item;
                  const productTitle = orderItem.product_name || orderItem.product?.title || request.product?.title || 'Product';
                  const productThumbnail = orderItem.product_image || orderItem.product?.thumbnail || request.product?.thumbnail_image || '';
                  const itemPrice = parseFloat(String(orderItem.price || (orderItem as any).unit_price || 0));
                  const itemQuantity = parseInt(String(orderItem.quantity || 1));
                  
                  return (
                    <div className="flex gap-5 p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200">
                      {productThumbnail && (
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0 relative border-2 border-gray-300 shadow-inner">
                          <Image
                            src={productThumbnail || '/products/placeholder.jpg'}
                            alt={productTitle}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/products/placeholder.jpg';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{productTitle}</h3>
                        <div className="flex items-center gap-4">
                          <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Quantity</p>
                            <p className="text-sm font-bold text-gray-900">{itemQuantity}</p>
                          </div>
                          <div className="px-3 py-1 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Price</p>
                            <p className="text-sm font-bold text-gray-900">৳ {itemPrice.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <FiAlertCircle className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Issue Description</h2>
              </div>
              <div className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{request.description}</p>
              </div>
            </div>

            {/* Images */}
            {request.images && request.images.length > 0 && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <FiMail className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Attached Images</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {request.images.map((image, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 relative group cursor-pointer">
                      <Image
                        src={image}
                        alt={`Attachment ${idx + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <FiMapPin className="text-white" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Name</p>
                  <p className="font-bold text-gray-900 text-base">{request.customer_name}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <p className="flex items-center gap-2">
                    <FiPhone className="text-blue-600" size={18} />
                    <span className="font-semibold text-gray-900">{request.customer_phone}</span>
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Address</p>
                  <p className="text-gray-700 leading-relaxed">{request.customer_address}</p>
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                  <FiShield className="text-white" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Request Details</h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Request ID</p>
                  <p className="text-lg font-bold text-gray-900">#{request.id}</p>
                </div>
                {request.order?.order_number && (
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Order Number</p>
                    <p className="text-sm font-bold text-gray-900">{request.order.order_number}</p>
                  </div>
                )}
                <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Created</p>
                  <p className="text-sm font-semibold text-gray-700">{formatDate(request.created_at)}</p>
                </div>
                {request.updated_at !== request.created_at && (
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Last Updated</p>
                    <p className="text-sm font-semibold text-gray-700">{formatDate(request.updated_at)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border-2 border-gray-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                  <FiXCircle className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Cancel Request</h3>
              </div>
              <button
                onClick={() => setShowCancelModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <FiXCircle size={24} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Are you sure you want to cancel this service request? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Keep Request
              </button>
              <button
                onClick={handleCancelRequest}
                disabled={isCancelling}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-bold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-sm"
              >
                {isCancelling ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" size={18} />
                    Cancelling...
                  </span>
                ) : (
                  'Cancel Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


