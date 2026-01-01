'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useGetOrderDetailsQuery } from '@/app/store/api/ordersApi';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const { isLoggedIn, refreshUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Processing payment...');
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const hasProcessedRef = useRef(false); // Track if we've already processed the redirect
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get order number from URL parameter (SSL Commerz sends it as 'order')
  const orderParam = searchParams.get('order') ||
    searchParams.get('order_number') ||
    searchParams.get('orderNumber') ||
    searchParams.get('tran_id') ||
    searchParams.get('tranId');

  // Fetch order details to verify actual status from backend API
  const { data: orderData, isLoading: isLoadingOrder, error: orderError } = useGetOrderDetailsQuery(orderParam || '', {
    skip: !orderParam,
  });

  // Effect 1: Handle API response when it arrives
  useEffect(() => {
    if (hasProcessedRef.current || !orderParam) return;

    // Async function to handle the payment processing
    const handlePaymentProcessing = async () => {
      // If API returned data, process it
      if (orderData?.success && orderData.data) {
        hasProcessedRef.current = true;
        const order = orderData.data;
        const orderStatus = order.status?.toLowerCase();
        const paymentStatus = (order as any).payment_status?.toLowerCase();

        console.log('📦 Order details from API:', {
          order_number: order.order_number,
          status: orderStatus,
          payment_status: paymentStatus,
        });

        // Check if order is cancelled or payment failed
        const isOrderCancelled = orderStatus === 'cancelled';
        const isPaymentFailed =
          paymentStatus === 'failed' ||
          paymentStatus === 'cancelled' ||
          orderStatus === 'failed';

        if (isOrderCancelled || isPaymentFailed) {
          console.log('❌ Order is cancelled or payment failed according to API');
          setStatus('failed');
          setMessage('Payment failed. Your order has been cancelled. Please try again or choose a different payment method.');

          setTimeout(() => {
            const params = new URLSearchParams();
            params.set('order', order.order_number);
            router.push(`/payment/failed?${params.toString()}`);
          }, 2000);
          return;
        }

        // Check if order is confirmed/paid
        const isOrderConfirmed =
          orderStatus === 'confirmed' ||
          orderStatus === 'paid' ||
          orderStatus === 'processing' ||
          paymentStatus === 'paid' ||
          paymentStatus === 'success';

        if (isOrderConfirmed) {
          console.log('✅ Order is confirmed/paid according to API');

          sessionStorage.setItem('lastOrder', JSON.stringify({
            order_number: order.order_number,
            status: order.status,
            total: order.total,
            is_emi: order.is_emi,
            emi_months: order.emi_months,
            emi_amount: order.emi_amount,
          }));
          sessionStorage.removeItem('pendingOrder');

          clearCart();

          // Refresh user profile to get updated club points (if logged in)
          if (isLoggedIn) {
            try {
              await refreshUser();
              console.log('✅ User profile refreshed - club points updated');
            } catch (error) {
              console.warn('⚠️ Failed to refresh user profile:', error);
              // Don't block success flow if refresh fails
            }
          }

          setStatus('success');
          setMessage('Payment completed successfully! Your order is being processed.');

          setTimeout(() => {
            const params = new URLSearchParams();
            params.set('order_number', order.order_number);
            params.set('status', 'paid');
            params.set('total', order.total.toString());
            router.push(`/order-success?${params.toString()}`);
          }, 2000);
          return;
        }

        // If order status is unclear (not cancelled, not confirmed), treat as failed to be safe
        console.warn('⚠️ Order status unclear from API - treating as failed for safety:', {
          order_status: orderStatus,
          payment_status: paymentStatus,
        });
        setStatus('failed');
        setMessage('Payment status could not be verified. Please check your order status in your account or contact support if payment was deducted.');

        setTimeout(() => {
          const params = new URLSearchParams();
          params.set('order', order.order_number);
          router.push(`/payment/failed?${params.toString()}`);
        }, 2000);
      }
    };

    // Call the async function
    handlePaymentProcessing();
  }, [orderData, orderParam, router, clearCart, isLoggedIn, refreshUser]);

  // Effect 2: Handle initial processing and fallback when API times out or fails
  useEffect(() => {
    if (hasProcessedRef.current || !orderParam) return;

    const processPaymentSuccess = () => {
      try {
        // Log all URL parameters for debugging
        const allParams: Record<string, string | null> = {};
        searchParams.forEach((value, key) => {
          allParams[key] = value;
        });
        console.log('🔔 Payment success callback received:', {
          url: window.location.href,
          allParams,
          timestamp: new Date().toISOString(),
        });

        // Try to get order number from sessionStorage if not in URL
        let finalOrderNumber = orderParam;
        if (!finalOrderNumber) {
          const pendingOrder = sessionStorage.getItem('pendingOrder');
          if (pendingOrder) {
            try {
              const order = JSON.parse(pendingOrder);
              finalOrderNumber = order.order_number;
            } catch (e) {
              console.error('Failed to parse pending order:', e);
            }
          }
        }

        // Store order number if available
        if (finalOrderNumber) {
          setOrderNumber(finalOrderNumber);
        }

        // If API is still loading, wait for it (with timeout)
        if (isLoadingOrder && !orderError) {
          console.log('⏳ Waiting for order details from API...');

          // Set a timeout fallback - if API takes too long, proceed with URL parameters
          if (!redirectTimeoutRef.current) {
            redirectTimeoutRef.current = setTimeout(() => {
              console.log('⏱️ API timeout - proceeding with URL parameter check');
              hasProcessedRef.current = false; // Allow processing to continue
            }, 5000); // Wait 5 seconds max for API
          }
          return;
        }

        // If API already processed (hasProcessedRef is true), don't process again
        if (hasProcessedRef.current) {
          return;
        }

        // PRIORITY 3: Check URL parameters for payment status indicators
        const paymentStatus = searchParams.get('status') || searchParams.get('Status');
        const valId = searchParams.get('val_id') || searchParams.get('valId') || searchParams.get('valID');
        const tranId = searchParams.get('tran_id') || searchParams.get('tranId') || searchParams.get('tranID');
        const payStatus = searchParams.get('pay_status') || searchParams.get('payStatus') || searchParams.get('PayStatus');
        const amount = searchParams.get('amount') || searchParams.get('Amount');
        const bankTranId = searchParams.get('bank_tran_id') || searchParams.get('bankTranId');

        // Normalize status values for comparison (case-insensitive)
        const normalizedStatus = paymentStatus?.toUpperCase();
        const normalizedPayStatus = payStatus?.toUpperCase();

        // Check for explicit failure indicators
        const isFailed =
          normalizedStatus === 'FAILED' ||
          normalizedPayStatus === 'FAILED' ||
          normalizedStatus === 'CANCELLED' ||
          normalizedPayStatus === 'CANCELLED' ||
          (normalizedStatus === 'INVALID' && !valId);

        if (isFailed) {
          console.log('❌ Payment explicitly failed based on URL parameters');
          setStatus('failed');
          setMessage('Payment failed. Please try again or choose a different payment method.');

          setTimeout(() => {
            const params = new URLSearchParams();
            if (finalOrderNumber) params.set('order', finalOrderNumber);
            router.push(`/payment/failed?${params.toString()}`);
          }, 2000);
          return;
        }

        // Check payment status - SSL Commerz success indicators
        const hasValidId = valId && valId !== '0' && valId !== '' && valId !== 'null';
        const hasValidStatus = normalizedStatus === 'VALID' || normalizedStatus === 'SUCCESS';
        const hasValidPayStatus = normalizedPayStatus === 'SUCCESSFUL' || normalizedPayStatus === 'VALID' || normalizedPayStatus === 'SUCCESS';
        const hasTransactionId = tranId && tranId !== '0' && tranId !== '';
        const hasBankTranId = bankTranId && bankTranId !== '0' && bankTranId !== '';

        const hasSuccessIndicators =
          hasValidId || // Most reliable indicator
          (hasValidStatus && hasTransactionId) ||
          (hasValidPayStatus && hasTransactionId) ||
          (hasBankTranId && normalizedStatus !== 'FAILED' && normalizedStatus !== 'CANCELLED');

        console.log('🔍 Payment status check:', {
          hasSuccessIndicators,
          paymentStatus,
          normalizedStatus,
          payStatus,
          normalizedPayStatus,
          valId,
          hasValidId,
          tranId,
          hasTransactionId,
          bankTranId,
          hasBankTranId,
          amount,
          finalOrderNumber,
          allParams: allParams,
          orderDataAvailable: !!orderData,
        });

        // CRITICAL: NEVER assume success without API confirmation!
        // URL parameters can be misleading - the backend API is the ONLY source of truth
        // If API hasn't responded, we must wait or show error - never redirect to success

        // If API error or no data after timeout, show error
        if (orderError || (!isLoadingOrder && !orderData)) {
          console.warn('⚠️ API error or no data - cannot verify payment status safely');
          hasProcessedRef.current = true;
          setStatus('failed');
          setMessage('Unable to verify payment status. Please check your order status in your account. If payment was deducted, please contact support.');
          return;
        }

        // If API is still loading, keep waiting (timeout already set above)
        if (isLoadingOrder) {
          console.log('⏳ Still waiting for API response to verify payment status...');
          return;
        }

        // Final fallback - should not reach here, but if we do, show error
        hasProcessedRef.current = true;
        setStatus('failed');
        setMessage('Unable to verify payment status. Please check your order status in your account or contact support if payment was deducted.');
      } catch (error) {
        console.error('Payment success callback error:', error);
        setStatus('failed');
        setMessage('An error occurred while processing your payment. Please contact support if payment was deducted.');
      }
    };

    processPaymentSuccess();

    // Cleanup timeout on unmount
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }
    };
  }, [searchParams, router, clearCart, isLoadingOrder, orderParam, orderError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 md:p-10 text-center">
          {status === 'loading' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center animate-pulse">
                  <FiLoader className="text-blue-600 animate-spin" size={52} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Processing Payment</h2>
              <p className="text-gray-600 mb-2">{message}</p>
              <div className="mt-4">
                <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                  <FiCheckCircle className="text-green-600" size={52} />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h2>
              <p className="text-gray-600 mb-4 text-base">{message}</p>
              {orderNumber && (
                <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Order Number</p>
                  <p className="text-lg font-bold text-green-700">{orderNumber}</p>
                </div>
              )}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                  <FiLoader className="animate-spin" size={16} />
                  Redirecting to order confirmation...
                </p>
              </div>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                  <FiXCircle className="text-red-600" size={52} />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Payment Verification Failed</h2>
              <p className="text-gray-600 mb-6 text-base">{message}</p>
              {orderNumber && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Order Number</p>
                  <p className="text-lg font-semibold text-gray-900">{orderNumber}</p>
                </div>
              )}
              <div className="flex flex-col gap-3">
                <Link
                  href="/account/orders"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Check Orders
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-semibold px-6 py-3 rounded-lg transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing payment...</h2>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

