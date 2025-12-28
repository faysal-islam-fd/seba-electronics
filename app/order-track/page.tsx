'use client';

import Link from 'next/link';
import { useState, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTrackOrderMutation, useGetOrderDetailsQuery } from '@/app/store/api/ordersApi';
import {
  FiSearch,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiHome,
  FiClock,
  FiMapPin,
  FiPhone,
  FiLoader,
  FiAlertCircle,
  FiXCircle,
} from 'react-icons/fi';
import Image from 'next/image';

type StatusStep = 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const getStatusSteps = (status: string): StatusStep[] => {
  const statusLower = status.toLowerCase();
  if (statusLower === 'cancelled') return ['placed', 'cancelled'];
  if (statusLower === 'delivered') return ['placed', 'processing', 'shipped', 'delivered'];
  if (statusLower === 'shipped' || statusLower === 'out_for_delivery') return ['placed', 'processing', 'shipped'];
  if (statusLower === 'processing' || statusLower === 'confirmed') return ['placed', 'processing'];
  return ['placed'];
};

const timelineSteps: Record<StatusStep, { label: string; description: string }> = {
  placed: {
    label: 'Order Placed',
    description: 'We have received your order and it is being verified.',
  },
  processing: {
    label: 'Processing',
    description: 'Your items are being prepared for shipment.',
  },
  shipped: {
    label: 'Shipped',
    description: 'Your package has left our warehouse and is on the way.',
  },
  delivered: {
    label: 'Delivered',
    description: 'Your order has been delivered.',
  },
  cancelled: {
    label: 'Cancelled',
    description: 'This order has been cancelled.',
  },
};

function OrderTrackContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrderId.replace('#', ''));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [trackedOrderNumber, setTrackedOrderNumber] = useState<string | null>(null);

  const [trackOrder, { isLoading: isTracking, data: trackData, error }] = useTrackOrderMutation();
  
  // Fetch full order details after successful tracking
  const { data: orderDetailsData, isLoading: isLoadingDetails } = useGetOrderDetailsQuery(
    trackedOrderNumber || '',
    {
      skip: !trackedOrderNumber || trackedOrderNumber === '',
    }
  );

  // CRITICAL: Process orderData with useMemo to ensure shipping object is extracted BEFORE any rendering
  // This prevents React from trying to render the shipping object directly
  // Use order details data if available, otherwise fall back to track data
  const orderData = useMemo(() => {
    // Prioritize order details data (has full order info)
    const rawOrderData = orderDetailsData?.data 
      ? orderDetailsData.data 
      : (trackData?.success && trackData.data ? trackData.data : null);

    if (!rawOrderData) return null;

    const orderDataAny = rawOrderData as any;
    
    // Handle shipping_address object (from order details API)
    if (orderDataAny.shipping_address && typeof orderDataAny.shipping_address === 'object' && !Array.isArray(orderDataAny.shipping_address)) {
      const shipping = orderDataAny.shipping_address;
      // Create new order object without shipping_address property
      const { shipping_address, ...rest } = orderDataAny;
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
    
    // Handle shipping object (from track API - legacy format)
    if (orderDataAny.shipping && typeof orderDataAny.shipping === 'object' && !Array.isArray(orderDataAny.shipping)) {
      const shipping = orderDataAny.shipping;
      // Extract shipping object to individual fields
      const shippingName = shipping.name || shipping.shipping_name || orderDataAny.shipping_name || 'N/A';
      const shippingPhone = shipping.phone || shipping.shipping_phone || orderDataAny.shipping_phone || 'N/A';
      const shippingEmail = shipping.email || shipping.shipping_email || orderDataAny.shipping_email || '';
      const shippingAddress = shipping.address || shipping.shipping_address || orderDataAny.shipping_address || 'N/A';
      const shippingCity = shipping.city || shipping.shipping_city || orderDataAny.shipping_city || 'N/A';
      const shippingState = shipping.state || shipping.shipping_state || orderDataAny.shipping_state || '';
      const shippingZip = shipping.zip || shipping.shipping_zip || orderDataAny.shipping_zip || '';

      // CRITICAL: Create a completely new orderData object WITHOUT the shipping property
      // Use object destructuring to exclude shipping, then add the extracted fields
      const { shipping: _, ...orderDataWithoutShipping } = orderDataAny;
      return {
        ...orderDataWithoutShipping,
        shipping_name: shippingName,
        shipping_phone: shippingPhone,
        shipping_email: shippingEmail,
        shipping_address: shippingAddress,
        shipping_city: shippingCity,
        shipping_state: shippingState,
        shipping_zip: shippingZip,
      } as any;
    }

    return rawOrderData;
  }, [orderDetailsData?.data, trackData?.success, trackData?.data]);
  
  // Get timeline from track data (has timeline array)
  const timelineData = useMemo(() => {
    return trackData?.success && trackData.data?.timeline ? trackData.data.timeline : null;
  }, [trackData?.success, trackData?.data?.timeline]);

  const hasResult = !!orderData;
  const isLoading = isTracking || isLoadingDetails;

  // Helper function to get shipping information
  // Shipping object has already been extracted to individual fields above
  const getShippingInfo = (order: any) => {
    if (!order) return null;
    // Use individual fields (shipping object has already been extracted and deleted)
    return {
      name: order.shipping_name || 'N/A',
      phone: order.shipping_phone || 'N/A',
      email: order.shipping_email || '',
      address: order.shipping_address || 'N/A',
      city: order.shipping_city || 'N/A',
      state: order.shipping_state || '',
      zip: order.shipping_zip || '',
      country: order.shipping_country || '',
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number | undefined | null) => {
    if (price === undefined || price === null || isNaN(price)) {
      return '৳ 0';
    }
    return `৳ ${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'delivered') return 'bg-green-50 text-green-700 border-green-100';
    if (statusLower === 'shipped' || statusLower === 'out_for_delivery') return 'bg-blue-50 text-blue-700 border-blue-100';
    if (statusLower === 'cancelled' || statusLower === 'failed') return 'bg-red-50 text-red-700 border-red-100';
    return 'bg-yellow-50 text-yellow-700 border-yellow-100';
  };

  const getStatusDisplay = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!orderNumber.trim()) {
      setErrorMessage('Please enter your order number');
      return;
    }

    try {
      const cleanedOrderNumber = orderNumber.trim().replace('#', '');
      const result = await trackOrder({
        order_number: cleanedOrderNumber,
      }).unwrap();
      
      // If tracking is successful, fetch full order details
      if (result.success) {
        setTrackedOrderNumber(cleanedOrderNumber);
      }
    } catch (err: any) {
      console.error('Track order error:', err);
      setTrackedOrderNumber(null); // Reset on error
      setErrorMessage(
        err.data?.message ||
        err.message ||
        'Failed to track order. Please check your order number.'
      );
    }
  };

  // Use timeline from track API if available, otherwise fall back to status steps
  const statusSteps = orderData ? getStatusSteps(orderData.status) : [];

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
              Enter your order ID to see real-time status, ETA, and delivery details.
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

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Order ID
                  </label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. ORD-20250101-XYZ1"
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 shadow-inner shadow-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                    <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={isLoading || !orderNumber.trim()}
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/20"
                  >
                    {isLoading ? (
                      <>
                        <FiLoader className="animate-spin" size={16} />
                        {isTracking ? 'Checking status...' : 'Loading details...'}
                      </>
                    ) : (
                      <>
                        <FiSearch size={16} />
                        Track order
                      </>
                    )}
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
              {hasResult && orderData ? (
                <>
                  <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                          Order Number
                        </p>
                        <p className="text-2xl font-bold text-slate-900 mb-3">{orderData.order_number}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-0.5">Items</p>
                            <p className="font-bold text-slate-900">
                              {orderData.items?.length || 0} {(orderData.items?.length || 0) === 1 ? 'item' : 'items'}
                            </p>
                          </div>
                          <div className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-0.5">Total</p>
                            <p className="font-bold text-slate-900">{formatPrice(orderData.total)}</p>
                          </div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold border-2 shadow-md ${getStatusColor(orderData.status)}`}>
                        <span className={`w-3 h-3 rounded-full animate-pulse ${orderData.status.toLowerCase() === 'delivered' ? 'bg-green-500' :
                            orderData.status.toLowerCase() === 'cancelled' ? 'bg-red-500' :
                              'bg-blue-500'
                          }`} />
                        {getStatusDisplay(orderData.status)}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-md">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <FiPackage className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">Current Status</p>
                        <p className="text-base font-bold text-slate-900">
                          {getStatusDisplay(orderData.status)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 shadow-md">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <FiClock className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">Order Date</p>
                        <p className="text-base font-bold text-slate-900">
                          {formatDate(orderData.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <FiClock className="text-white" size={20} />
                      </div>
                      <p className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                        Delivery Timeline
                      </p>
                    </div>
                    <ol className="relative border-l-4 border-gradient-to-b from-blue-200 to-blue-300 ml-4 pl-6 space-y-6">
                      {timelineData && timelineData.length > 0 ? (
                        // Use timeline from track API (reverse to show oldest to newest)
                        [...timelineData].reverse().map((timelineItem: any, index: number) => {
                          const isActive = index === timelineData.length - 1; // Most recent (last after reverse) is active
                          const isCancelled = timelineItem.status?.toLowerCase() === 'cancelled';
                          const statusLower = timelineItem.status?.toLowerCase() || '';
                          
                          const getTimelineIcon = () => {
                            if (isCancelled) return <FiXCircle className="text-red-600" size={18} />;
                            if (isActive) return <FiCheckCircle className="text-blue-600" size={18} />;
                            if (statusLower === 'shipped' || statusLower === 'out_for_delivery') return <FiTruck className="text-slate-400" size={18} />;
                            return <FiPackage className="text-slate-400" size={18} />;
                          };

                          const getStatusLabel = () => {
                            return timelineItem.status
                              ? timelineItem.status.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                              : 'Unknown';
                          };

                          return (
                            <li key={index} className="relative">
                              <div className={`absolute -left-[34px] top-0 flex h-10 w-10 items-center justify-center rounded-full border-4 shadow-lg transition-all duration-300 ${isCancelled
                                  ? 'border-red-500 bg-red-50 shadow-red-500/30'
                                  : isActive
                                    ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-blue-500/30 animate-pulse'
                                    : 'border-slate-300 bg-white shadow-slate-500/20'
                                }`}>
                                {getTimelineIcon()}
                              </div>
                              <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${isCancelled
                                  ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
                                  : isActive
                                    ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-md'
                                    : 'bg-white border-slate-200'
                                }`}>
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <p className={`text-base font-bold ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                                    {getStatusLabel()}
                                  </p>
                                  {timelineItem.date && (
                                    <p className={`text-xs whitespace-nowrap ${isActive ? 'text-slate-600' : 'text-slate-400'}`}>
                                      {new Date(timelineItem.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </p>
                                  )}
                                </div>
                                <p className={`text-sm ${isActive ? 'text-slate-700' : 'text-slate-500'}`}>
                                  {timelineItem.note || 'No additional information'}
                                </p>
                              </div>
                            </li>
                          );
                        })
                      ) : (
                        // Fall back to status steps if no timeline data
                        statusSteps.map((step, index) => {
                          const stepInfo = timelineSteps[step];
                          const isActive = index < statusSteps.length - 1;
                          const isLast = index === statusSteps.length - 1;
                          const isCancelled = step === 'cancelled';

                          return (
                            <li key={step} className="relative">
                              <div className={`absolute -left-[34px] top-0 flex h-10 w-10 items-center justify-center rounded-full border-4 shadow-lg transition-all duration-300 ${isCancelled
                                  ? 'border-red-500 bg-red-50 shadow-red-500/30'
                                  : isActive
                                    ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-blue-500/30 animate-pulse'
                                    : 'border-slate-300 bg-white shadow-slate-500/20'
                                }`}>
                                {isCancelled ? (
                                  <FiXCircle className="text-red-600" size={18} />
                                ) : isActive ? (
                                  <FiCheckCircle className="text-blue-600" size={18} />
                                ) : step === 'shipped' ? (
                                  <FiTruck className="text-slate-400" size={18} />
                                ) : (
                                  <FiPackage className="text-slate-400" size={18} />
                                )}
                              </div>
                              <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${isCancelled
                                  ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
                                  : isActive
                                    ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-md'
                                    : 'bg-white border-slate-200'
                                }`}>
                                <p className={`text-base font-bold mb-1 ${isActive ? 'text-slate-900' : 'text-slate-500'
                                  }`}>
                                  {stepInfo.label}
                                </p>
                                <p className={`text-sm ${isActive ? 'text-slate-700' : 'text-slate-500'}`}>
                                  {stepInfo.description}
                                </p>
                              </div>
                            </li>
                          );
                        })
                      )}
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
                    Enter your order number to pull the latest status, ETA, and delivery details.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <aside className="space-y-4 lg:space-y-5">
            <div className="rounded-2xl border border-slate-200/70 bg-white shadow-xl shadow-slate-900/5 p-5 sm:p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-3">Shipping Address</h3>
              {orderData ? (() => {
                const shippingInfo = getShippingInfo(orderData);
                return shippingInfo ? (
                  <div className="space-y-3 text-sm text-slate-700">
                    <div className="flex items-start gap-2">
                      <FiMapPin className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                      <div>
                        <p className="font-semibold text-slate-900">{shippingInfo.name}</p>
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}{shippingInfo.state ? `, ${shippingInfo.state}` : ''}</p>
                        {shippingInfo.zip && <p>Postal Code: {shippingInfo.zip}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiPhone className="text-blue-600" size={16} />
                      <span>{shippingInfo.phone}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">
                    Shipping address information not available.
                  </p>
                );
              })() : (
                <p className="text-sm text-slate-600">
                  Search for an order to see shipping address details.
                </p>
              )}
            </div>

            {/* Order Items Preview */}
            {orderData && orderData.items && Array.isArray(orderData.items) && orderData.items.length > 0 && (
              <div className="rounded-2xl border border-slate-200/70 bg-white shadow-xl shadow-slate-900/5 p-5 sm:p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {orderData.items.slice(0, 3).map((item: any, index: number) => {
                    // Handle both nested product object and flat fields
                    const productImage = item.product?.thumbnail || item.product_image || '/products/placeholder.jpg';
                    const productTitle = item.product?.title || item.product_name || 'Product';
                    const itemId = item.id || item.product_id || index;
                    
                    return (
                      <div key={itemId} className="flex gap-3">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 relative">
                          <Image
                            src={productImage}
                            alt={productTitle}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{productTitle}</p>
                          <p className="text-xs text-slate-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    );
                  })}
                  {orderData.items && orderData.items.length > 3 && (
                    <p className="text-xs text-slate-500 text-center pt-2">
                      +{orderData.items.length - 3} more {orderData.items.length - 3 === 1 ? 'item' : 'items'}
                    </p>
                  )}
                </div>
              </div>
            )}

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

export default function OrderTrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
        </div>
      </div>
    }>
      <OrderTrackContent />
    </Suspense>
  );
}


