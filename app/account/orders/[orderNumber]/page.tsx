'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetOrderDetailsQuery, useCancelOrderMutation } from '@/app/store/api/ordersApi';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/app/context/ToastContext';
import {
  FiLoader,
  FiArrowLeft,
  FiPackage,
  FiMapPin,
  FiPhone,
  FiMail,
  FiXCircle,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiCreditCard
} from 'react-icons/fi';
import Image from 'next/image';
import { useState, useMemo } from 'react';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Get order number from params
  const rawOrderNumber = params?.orderNumber as string;
  const orderNumber = rawOrderNumber ? decodeURIComponent(rawOrderNumber) : '';

  // Fetch order details
  const { data, isLoading, error, refetch } = useGetOrderDetailsQuery(orderNumber || '', {
    skip: !orderNumber || orderNumber === '',
  });

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  // Process order data - extract shipping_address object to individual fields
  const order = useMemo(() => {
    if (!data?.data) return null;

    const rawOrder = JSON.parse(JSON.stringify(data.data)); // Deep clone to avoid mutations

    // Extract shipping_address object if it exists
    if (rawOrder.shipping_address && typeof rawOrder.shipping_address === 'object' && !Array.isArray(rawOrder.shipping_address)) {
      const shipping = rawOrder.shipping_address;
      // Create new order object without shipping_address property
      const { shipping_address, ...rest } = rawOrder;
      return {
        ...rest,
        shipping_name: String(shipping.name || ''),
        shipping_phone: String(shipping.phone || ''),
        shipping_email: String(shipping.email || ''),
        shipping_address: String(shipping.address || ''),
        shipping_city: String(shipping.city || ''),
        shipping_state: String(shipping.state || ''),
        shipping_zip: String(shipping.zip || ''),
        shipping_country: String(shipping.country || ''),
      };
    }

    // Return order as-is if shipping_address is already extracted or doesn't exist
    return rawOrder;
  }, [data?.data]);

  // FINAL SAFETY CHECK: Ensure shipping_address is never an object before rendering
  // This MUST be called before any conditional returns to follow Rules of Hooks
  const safeOrder = useMemo(() => {
    if (!order) return null;
    const orderAny = order as any;

    // Double-check: if shipping_address still exists as object, remove it completely
    if (orderAny.shipping_address && typeof orderAny.shipping_address === 'object' && !Array.isArray(orderAny.shipping_address)) {
      const { shipping_address, ...rest } = orderAny;
      return rest;
    }

    // Ensure all shipping fields are strings, not objects
    const cleaned: any = { ...orderAny };
    ['shipping_name', 'shipping_phone', 'shipping_email', 'shipping_address', 'shipping_city', 'shipping_state', 'shipping_zip', 'shipping_country'].forEach(key => {
      if (cleaned[key] && typeof cleaned[key] === 'object') {
        cleaned[key] = '';
      } else {
        cleaned[key] = String(cleaned[key] || '');
      }
    });

    return cleaned;
  }, [order]);

  // Helper functions
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
        badge: 'bg-green-100 text-green-700 border-green-200',
        card: 'from-green-50 to-emerald-50'
      };
    } else if (statusLower === 'shipped' || statusLower === 'out_for_delivery') {
      return {
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: 'bg-blue-500',
        badge: 'bg-blue-100 text-blue-700 border-blue-200',
        card: 'from-blue-50 to-indigo-50'
      };
    } else if (statusLower === 'cancelled' || statusLower === 'failed') {
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
    if (statusLower === 'delivered') {
      return <FiCheckCircle size={24} />;
    } else if (statusLower === 'shipped' || statusLower === 'out_for_delivery') {
      return <FiTruck size={24} />;
    } else if (statusLower === 'cancelled' || statusLower === 'failed') {
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

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      showError('Please provide a reason for cancellation');
      return;
    }

    try {
      const result = await cancelOrder({
        orderNumber: orderNumber,
        reason: cancelReason.trim()
      }).unwrap();

      showSuccess(result.message || 'Order cancelled successfully');
      setShowCancelModal(false);
      setCancelReason('');

      // Refetch order details to show updated status
      await refetch();
    } catch (error: any) {
      console.error('Failed to cancel order:', error);
      const errorMessage = error?.data?.message ||
        error?.message ||
        'Failed to cancel order. Please try again.';
      showError(errorMessage);
    }
  };

  // Loading state
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
              <p className="text-gray-700 font-medium text-lg">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order || !safeOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-white rounded-2xl border-2 border-red-200 shadow-xl p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiXCircle className="text-red-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Order</h2>
            <p className="text-red-600 font-semibold mb-6 text-lg">
              Failed to load order details. Please try again later.
            </p>
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FiArrowLeft size={18} />
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const canCancel = safeOrder?.status &&
    !['cancelled', 'delivered', 'shipped'].includes(safeOrder.status.toLowerCase());

  const statusColors = getStatusColor(safeOrder.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/account/orders"
              className="w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-200 hover:border-blue-300 rounded-xl text-blue-600 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FiArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Order Details</h1>
              <p className="text-sm text-gray-600 mt-1">Order #{safeOrder.order_number}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/order-track?orderId=${encodeURIComponent(safeOrder.order_number)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl"
            >
              <FiTruck size={16} />
              Track Order
            </Link>
            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-red-300 hover:border-red-400 text-red-600 hover:text-red-700 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FiXCircle size={16} />
                Cancel Order
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className={`bg-gradient-to-br ${statusColors.card} rounded-2xl border-2 ${statusColors.border} shadow-xl p-6 md:p-8`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 ${statusColors.icon} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    {getStatusIcon(safeOrder.status)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Order Status</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Placed on {formatDate(safeOrder.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl border-2 ${statusColors.badge} shadow-md`}>
                    {getStatusDisplay(safeOrder.status)}
                  </span>
                  {safeOrder.payment_status && (
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border ${safeOrder.payment_status === 'paid' ? 'bg-green-100 text-green-700 border-green-200' :
                        safeOrder.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                          'bg-red-100 text-red-700 border-red-200'
                      }`}>
                      Payment: {String(safeOrder.payment_status).split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Status History */}
            {safeOrder.status_history && safeOrder.status_history.length > 0 && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <FiClock className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Status History</h2>
                </div>
                <div className="space-y-4">
                  {safeOrder.status_history.map((history: any, index: number) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-bold text-gray-900">{getStatusDisplay(history.status)}</p>
                          <p className="text-xs text-gray-500">{formatDate(history.created_at)}</p>
                        </div>
                        {history.note && (
                          <p className="text-sm text-gray-600">{history.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <FiPackage className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Order Items</h2>
              </div>
              <div className="space-y-4">
                {safeOrder.items && safeOrder.items.length > 0 ? (
                  safeOrder.items.map((item: any, index: number) => {
                    const quantity = Number(item.quantity) || 0;
                    const price = Number(item.price) || 0;
                    const subtotal = Number(item.subtotal) || (price * quantity);

                    return (
                      <div
                        key={item.product_id || index}
                        className="flex gap-5 p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0 relative border-2 border-gray-300 shadow-inner">
                          <Image
                            src={item.product_image || '/products/placeholder.jpg'}
                            alt={item.product_name || 'Product'}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{item.product_name || 'Product'}</h3>
                          {item.variation_details && (
                            <p className="text-sm text-gray-600 mb-2">{item.variation_details}</p>
                          )}
                          {item.product_sku && (
                            <p className="text-xs text-gray-500 mb-2">SKU: {item.product_sku}</p>
                          )}
                          <div className="flex items-center gap-4 mb-3">
                            <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Quantity</p>
                              <p className="text-sm font-bold text-gray-900">{quantity}</p>
                            </div>
                            <div className="px-3 py-1 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Price</p>
                              <p className="text-sm font-bold text-gray-900">{formatPrice(price)}</p>
                            </div>
                            {item.discount > 0 && (
                              <div className="px-3 py-1 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Discount</p>
                                <p className="text-sm font-bold text-red-600">-{formatPrice(item.discount)}</p>
                              </div>
                            )}
                          </div>
                          <div className="pt-3 border-t-2 border-gray-200">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-gray-600">Subtotal</p>
                              <p className="text-xl font-bold text-gray-900">
                                {formatPrice(subtotal)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center bg-gray-50 rounded-xl border-2 border-gray-200">
                    <FiPackage className="text-gray-400 mx-auto mb-3" size={48} />
                    <p className="text-gray-600 font-semibold">No items found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <FiMapPin className="text-white" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Recipient Name</p>
                  <p className="font-bold text-gray-900 text-base">
                    {String(safeOrder.shipping_name || 'N/A')}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Address</p>
                  <p className="text-gray-700 leading-relaxed">
                    {String(safeOrder.shipping_address || 'N/A')}
                  </p>
                  <p className="text-gray-700 mt-1">
                    {String(safeOrder.shipping_city || '')}{safeOrder.shipping_state ? `, ${String(safeOrder.shipping_state)}` : ''}
                  </p>
                  {safeOrder.shipping_zip && (
                    <p className="text-gray-700 mt-1">Postal Code: {String(safeOrder.shipping_zip)}</p>
                  )}
                  {safeOrder.shipping_country && (
                    <p className="text-gray-700 mt-1">Country: {String(safeOrder.shipping_country)}</p>
                  )}
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <p className="flex items-center gap-2">
                    <FiPhone className="text-blue-600" size={18} />
                    <span className="font-semibold text-gray-900">
                      {String(safeOrder.shipping_phone || 'N/A')}
                    </span>
                  </p>
                </div>
                {safeOrder.shipping_email && (
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200">
                    <p className="flex items-center gap-2">
                      <FiMail className="text-blue-600" size={18} />
                      <span className="font-semibold text-gray-900">
                        {String(safeOrder.shipping_email)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                  <FiDollarSign className="text-white" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-600">Subtotal</span>
                    <span className="text-lg font-bold text-gray-900">{formatPrice(safeOrder.subtotal || 0)}</span>
                  </div>
                </div>
                {safeOrder.discount > 0 && (
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-green-700">Discount</span>
                      <span className="text-lg font-bold text-green-600">-{formatPrice(safeOrder.discount || 0)}</span>
                    </div>
                  </div>
                )}
                {safeOrder.tax > 0 && (
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600">Tax</span>
                      <span className="text-lg font-bold text-gray-900">{formatPrice(safeOrder.tax || 0)}</span>
                    </div>
                  </div>
                )}
                {safeOrder.shipping_charge > 0 && (
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600">Shipping Charge</span>
                      <span className="text-lg font-bold text-gray-900">{formatPrice(safeOrder.shipping_charge || 0)}</span>
                    </div>
                  </div>
                )}
                {safeOrder.payment_method && (
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FiCreditCard className="text-blue-600" size={18} />
                      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Payment Method</p>
                    </div>
                    <p className="font-bold text-gray-900">
                      {String(safeOrder.payment_method).split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </p>
                    {safeOrder.payment_status && (
                      <p className="text-xs text-gray-600 mt-1">
                        Status: <span className="font-semibold">{String(safeOrder.payment_status).split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                      </p>
                    )}
                    {safeOrder.transaction_id && (
                      <p className="text-xs text-gray-600 mt-1">
                        Transaction ID: <span className="font-semibold">{String(safeOrder.transaction_id)}</span>
                      </p>
                    )}
                  </div>
                )}
                {safeOrder.is_emi && safeOrder.emi_months && safeOrder.emi_amount && (
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <FiDollarSign className="text-white" size={16} />
                      </div>
                      <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">EMI Payment Plan</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">EMI Tenure:</span>
                        <span className="font-bold text-gray-900">{safeOrder.emi_months} months</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monthly Payment:</span>
                        <span className="font-bold text-purple-600">{formatPrice(safeOrder.emi_amount)}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl border-2 border-blue-500 shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-white">Total Amount</span>
                    <span className="text-2xl font-bold text-white">{formatPrice(safeOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Note */}
            {safeOrder.customer_note && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <FiMail className="text-white" size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Delivery Instructions</h2>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                  <p className="text-sm text-gray-700 leading-relaxed">{String(safeOrder.customer_note)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border-2 border-gray-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                  <FiXCircle className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Cancel Order</h3>
              </div>
              <button
                onClick={() => setShowCancelModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <FiXCircle size={24} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Please provide a reason for cancelling this order. This will help us improve our service.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g., Ordered by mistake, Found better price, Changed my mind, etc."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-6 resize-none text-sm"
              rows={4}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Close
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={!cancelReason.trim() || isCancelling}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-bold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-sm"
              >
                {isCancelling ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" size={18} />
                    Cancelling...
                  </span>
                ) : (
                  'Cancel Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

