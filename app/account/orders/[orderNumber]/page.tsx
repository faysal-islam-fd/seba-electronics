'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetOrderDetailsQuery, useCancelOrderMutation } from '@/app/store/api/ordersApi';
import { getAuthToken, getUser } from '@/app/lib/authApi';
import { useGetOrdersQuery } from '@/app/store/api/ordersApi';
import { useAuth } from '@/app/context/AuthContext';
import { FiLoader, FiArrowLeft, FiPackage, FiMapPin, FiPhone, FiMail, FiXCircle, FiTruck, FiCheckCircle, FiClock, FiDollarSign, FiCreditCard } from 'react-icons/fi';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  // Decode the order number from URL params (it might be URL encoded)
  const rawOrderNumber = params?.orderNumber as string;
  
  // Decode the order number from URL params
  // Next.js automatically decodes URL params, but we handle edge cases
  let orderNumber = '';
  if (rawOrderNumber) {
    try {
      // Next.js should already decode it, but handle any edge cases
      orderNumber = decodeURIComponent(rawOrderNumber);
    } catch (e) {
      // If decoding fails, use the raw value (might already be decoded)
      console.warn('Failed to decode order number, using raw value:', e);
      orderNumber = rawOrderNumber;
    }
  }
  
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { user } = useAuth();
  
  // Get orders list to verify the order exists for this user
  // Also use this as fallback if detail endpoint fails
  const { data: ordersData, isLoading: isLoadingOrders } = useGetOrdersQuery({ page: 1, per_page: 100 });
  
  // Pass the decoded order number to the query - it will be encoded in the API call
  const { data, isLoading, error } = useGetOrderDetailsQuery(orderNumber || '', {
    skip: !orderNumber || orderNumber === '',
  });
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  
  // Check if order exists in user's orders list
  const orderInList = ordersData?.data?.find(o => o.order_number === orderNumber);
  
  // If detail query fails with 403 but order is in list, try to get basic info from list
  const orderFromList = orderInList || null;

  // Debug logging and manual test for troubleshooting
  useEffect(() => {
    if (orderNumber && typeof window !== 'undefined') {
      const token = getAuthToken();
      const currentUser = getUser();
      
      console.log('🔍 Order Details Debug:', {
        orderNumber,
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token ? `${token.substring(0, 20)}...${token.substring(token.length - 10)}` : null,
        endpoint: `/customer/orders/${encodeURIComponent(orderNumber)}`,
        fullUrl: `https://seba.rangpurit.com/api/v1/customer/orders/${encodeURIComponent(orderNumber)}`,
        currentUser: currentUser ? { id: currentUser.id, email: currentUser.email, name: currentUser.name } : null,
      });
      
      if (!token) {
        console.warn('⚠️ No authentication token found! User may need to log in again.');
      } else {
        console.log('✅ Token found, Authorization header will be added automatically');
        
        // Manual test function - you can call this from console: testOrderRequest()
        (window as any).testOrderRequest = async () => {
          const testToken = getAuthToken();
          // Try both encoded and unencoded versions
          const testUrlEncoded = `https://seba.rangpurit.com/api/v1/customer/orders/${encodeURIComponent(orderNumber)}`;
          const testUrlUnencoded = `https://seba.rangpurit.com/api/v1/customer/orders/${orderNumber}`;
          
          console.log('🧪 Testing manual request with exact token...', {
            orderNumber,
            urlEncoded: testUrlEncoded,
            urlUnencoded: testUrlUnencoded,
            token: testToken,
            tokenLength: testToken?.length,
            headers: {
              'Authorization': `Bearer ${testToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            }
          });
          
          // Try unencoded first (most backends expect this for simple order numbers)
          try {
            console.log('🔄 Trying UNENCODED URL...');
            const response1 = await fetch(testUrlUnencoded, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${testToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
            });
            
            const data1 = await response1.json();
            console.log('📥 UNENCODED response:', {
              status: response1.status,
              statusText: response1.statusText,
              ok: response1.ok,
              data: data1,
            });
            
            if (response1.ok) {
              return { status: response1.status, data: data1, ok: true, method: 'unencoded' };
            }
            
            // If unencoded fails, try encoded
            if (response1.status === 403 || response1.status === 404) {
              console.log('🔄 Trying ENCODED URL...');
              const response2 = await fetch(testUrlEncoded, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${testToken}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                },
              });
              
              const data2 = await response2.json();
              console.log('📥 ENCODED response:', {
                status: response2.status,
                statusText: response2.statusText,
                ok: response2.ok,
                data: data2,
              });
              
              return { status: response2.status, data: data2, ok: response2.ok, method: 'encoded' };
            }
            
            return { status: response1.status, data: data1, ok: false, method: 'unencoded' };
          } catch (error) {
            console.error('❌ Manual test error:', error);
            return { error };
          }
        };
        
        console.log('💡 Tip: Run testOrderRequest() in console to test the API call manually');
        console.log('💡 Also check: Does order', orderNumber, 'appear in your orders list?');
      }
    }
  }, [orderNumber]);

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
    if (!cancelReason.trim()) return;
    
    try {
      // Use the decoded order number for the cancel request
      await cancelOrder({ orderNumber: orderNumber, reason: cancelReason }).unwrap();
      setShowCancelModal(false);
      // Refresh the order details
      router.refresh();
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert('Failed to cancel order. Please try again.');
    }
  };

  const canCancel = data?.data?.status && 
    !['cancelled', 'delivered', 'shipped'].includes(data.data.status.toLowerCase());

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
              <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check for fallback BEFORE error handling
  // If detail query fails but order is in list, use list data as fallback
  // This handles cases where detail endpoint has authorization issues (403) or route not found (404)
  let order = data?.data;
  
  // RTK Query error structure: error.status or error.data.status
  const errorStatus = error 
    ? ('status' in error ? (error as any).status : ('data' in error && (error as any).data?.status ? (error as any).data.status : null))
    : null;
  
  // Use fallback if we get 403 (Forbidden) or 404 (Not Found) and order exists in list
  const useFallbackData = !order && orderFromList && (errorStatus === 403 || errorStatus === 404);
  
  if (useFallbackData && orderFromList) {
    console.warn(`⚠️ Using fallback data from orders list due to ${errorStatus} error on detail endpoint`);
    // Create a minimal order object from list data
    order = {
      id: orderFromList.id,
      order_number: orderFromList.order_number,
      status: orderFromList.status,
      total: orderFromList.total,
      payment_method: orderFromList.payment_method,
      created_at: orderFromList.created_at,
      items: orderFromList.items || [],
      // Missing fields will be handled gracefully
      shipping_name: 'N/A',
      shipping_phone: 'N/A',
      shipping_address: 'N/A',
      shipping_city: 'N/A',
    } as any;
  }

  // Only show error page if we don't have fallback data
  if (error && !useFallbackData) {
    // RTK Query error structure: { status: number, data: { message: string, ... }, ... }
    let errorMessage = 'Failed to load order details. Please try again later.';
    let statusCode: number | undefined;
    
    if ('status' in error) {
      statusCode = error.status as number;
      
      // Check if data exists and has a message
      if ('data' in error && error.data) {
        const errorData = error.data as any;
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      }
      
      // Handle specific status codes
      if (statusCode === 401) {
        errorMessage = 'You are not authorized to view this order. Please log in.';
      } else if (statusCode === 404) {
        errorMessage = 'Order not found.';
      } else if (statusCode === 403) {
        // Check if order is in user's orders list
        if (orderInList) {
          errorMessage = 'Access denied. This order appears in your list but details cannot be accessed. Please try refreshing or contact support.';
        } else {
          errorMessage = 'Access denied. This order does not appear in your orders list. It may belong to a different account.';
        }
      }
    } else if ('message' in error) {
      errorMessage = (error as any).message;
    }
    
    const token = getAuthToken();
    const currentUser = getUser();
    
    console.error('❌ Order details error:', {
      error,
      errorType: typeof error,
      errorKeys: error ? Object.keys(error) : [],
      statusCode,
      errorMessage,
      orderNumber,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 30)}...${token.substring(token.length - 20)}` : 'No token',
      tokenLength: token?.length || 0,
      currentUser: currentUser ? { id: currentUser.id, email: currentUser.email, name: currentUser.name } : null,
      contextUser: user ? { id: user.id, email: user.email, name: user.name } : null,
      fullError: JSON.stringify(error, null, 2),
    });
    
    // If 403, check if token might be for different user
    if (statusCode === 403) {
      console.error('🚫 403 Forbidden - Detailed Analysis:');
      console.error('1. Current User ID:', currentUser?.id || user?.id || 'Unknown');
      console.error('2. Token exists:', !!token);
      console.error('3. Token length:', token?.length || 0);
      console.error('4. Full token (for debugging):', token);
      console.error('5. Order Number:', orderNumber);
      console.error('6. Order in user orders list:', orderInList ? 'YES ✅' : 'NO ❌');
      console.error('7. Check if order belongs to this user');
      console.error('8. Verify token matches the user in context');
      console.error('9. Try logging out and back in to refresh token');
      console.error('10. Run testOrderRequest() in console to test manually');
      
      if (!orderInList) {
        console.error('⚠️ WARNING: This order does NOT appear in your orders list!');
        console.error('This suggests the order belongs to a different user.');
      }
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-white rounded-2xl border-2 border-red-200 shadow-xl p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiXCircle className="text-red-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Order</h2>
            <p className="text-red-600 font-semibold mb-2 text-lg">
              {errorMessage}
            </p>
            {statusCode && (
              <p className="text-sm text-gray-500 mb-4">Status Code: {statusCode}</p>
            )}
            
            {statusCode === 403 && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6 text-left max-w-2xl mx-auto">
                <p className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Troubleshooting Steps:</p>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                  <li>Check if this order appears in your <Link href="/account/orders" className="underline font-semibold">orders list</Link></li>
                  <li>If not, this order may belong to a different account</li>
                  <li>Try logging out and back in to refresh your session</li>
                  <li>Open browser console and run: <code className="bg-yellow-100 px-2 py-1 rounded">testOrderRequest()</code></li>
                </ul>
                {!orderInList && (
                  <p className="text-sm font-bold text-red-700 mt-3">
                    ⚠️ This order does NOT appear in your orders list!
                  </p>
                )}
              </div>
            )}
            
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/account/orders"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-700 font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FiArrowLeft size={18} />
                Back to Orders
              </Link>
              {statusCode === 401 && (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Log In
                </Link>
              )}
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiLoader size={18} />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Debug: Log error structure to understand it better
  if (error && !order && orderFromList) {
    console.log('🔍 Fallback Check:', {
      hasError: !!error,
      errorStatus,
      errorKeys: Object.keys(error || {}),
      errorStructure: error,
      hasOrderFromList: !!orderFromList,
      orderNumber: orderFromList?.order_number,
    });
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-white rounded-2xl border-2 border-red-200 shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiXCircle className="text-red-600" size={32} />
            </div>
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
  const statusColors = getStatusColor(order.status);

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
              <p className="text-sm text-gray-600 mt-1">Order #{order.order_number}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/order-track?orderId=${encodeURIComponent(order.order_number)}`}
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
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Order Status</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Placed on {formatDate(order.created_at)}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl border-2 ${statusColors.badge} shadow-md`}>
                  {getStatusDisplay(order.status)}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <FiPackage className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Order Items</h2>
              </div>
              {useFallbackData && (
                <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-800 font-semibold">⚠️ Using limited data from orders list</p>
                </div>
              )}
              <div className="space-y-4">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="flex gap-5 p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0 relative border-2 border-gray-300 shadow-inner">
                        <Image
                          src={item.product.thumbnail || '/products/placeholder.jpg'}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.product.title}</h3>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Quantity</p>
                            <p className="text-sm font-bold text-gray-900">{item.quantity}</p>
                          </div>
                          <div className="px-3 py-1 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Price</p>
                            <p className="text-sm font-bold text-gray-900">{formatPrice(item.price)}</p>
                          </div>
                        </div>
                        <div className="pt-3 border-t-2 border-gray-200">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-600">Subtotal</p>
                            <p className="text-xl font-bold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-gray-50 rounded-xl border-2 border-gray-200">
                    <FiPackage className="text-gray-400 mx-auto mb-3" size={48} />
                    <p className="text-gray-600 font-semibold">Items information not available</p>
                    {useFallbackData && (
                      <p className="text-sm text-gray-500 mt-2">Full item details require API access</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shipping Information */}
            {useFallbackData ? (
              <div className="bg-yellow-50 rounded-2xl border-2 border-yellow-200 shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <FiMapPin className="text-white" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                </div>
                <div className="bg-white rounded-xl p-4 border-2 border-yellow-300">
                  <p className="text-sm text-yellow-800 font-semibold mb-2">⚠️ Limited Information Available</p>
                  <p className="text-sm text-gray-600">
                    Full shipping details are not available due to API authorization restrictions. 
                    Please contact support for complete order information.
                  </p>
                </div>
              </div>
            ) : (
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
                    <p className="font-bold text-gray-900 text-base">{order.shipping_name}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Address</p>
                    <p className="text-gray-700 leading-relaxed">{order.shipping_address}</p>
                    <p className="text-gray-700 mt-1">{order.shipping_city}{order.shipping_state ? `, ${order.shipping_state}` : ''}</p>
                    {order.shipping_zip && <p className="text-gray-700 mt-1">Postal Code: {order.shipping_zip}</p>}
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                    <p className="flex items-center gap-2">
                      <FiPhone className="text-blue-600" size={18} />
                      <span className="font-semibold text-gray-900">{order.shipping_phone}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                    <span className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</span>
                  </div>
                </div>
                {order.payment_method && (
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FiCreditCard className="text-blue-600" size={18} />
                      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Payment Method</p>
                    </div>
                    <p className="font-bold text-gray-900">
                      {order.payment_method.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </p>
                  </div>
                )}
                {order.is_emi && order.emi_months && order.emi_amount && (
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
                        <span className="font-bold text-gray-900">{order.emi_months} months</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monthly Payment:</span>
                        <span className="font-bold text-purple-600">{formatPrice(order.emi_amount)}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl border-2 border-blue-500 shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-white">Total Amount</span>
                    <span className="text-2xl font-bold text-white">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Note */}
            {order.customer_note && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <FiMail className="text-white" size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Delivery Instructions</h2>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                  <p className="text-sm text-gray-700 leading-relaxed">{order.customer_note}</p>
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

