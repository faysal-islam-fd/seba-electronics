'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { useCart } from '@/app/context/CartContext';
import { useGetOrderDetailsQuery } from '@/app/store/api/ordersApi';

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Processing payment...');
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // SSL Commerz typically sends status and other params in the callback
  // Get all possible parameter variations
  const orderNumberParam = searchParams.get('order_number') || searchParams.get('orderNumber') ||
    searchParams.get('value_a') || searchParams.get('value_b') ||
    searchParams.get('valueA') || searchParams.get('valueB') ||
    searchParams.get('order_id') || searchParams.get('tran_id') || searchParams.get('tranId');

  // Try to get order number from sessionStorage if not in URL
  let finalOrderNumber = orderNumberParam;
  if (!finalOrderNumber && typeof window !== 'undefined') {
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

  // Fetch order details to verify actual status from backend API
  const { data: orderData, isLoading: isLoadingOrder } = useGetOrderDetailsQuery(finalOrderNumber || '', {
    skip: !finalOrderNumber,
  });

  useEffect(() => {
    const processPaymentCallback = async () => {
      try {
        // Log all URL parameters for debugging
        const allParams: Record<string, string | null> = {};
        searchParams.forEach((value, key) => {
          allParams[key] = value;
        });
        console.log('🔔 Payment callback received:', {
          url: window.location.href,
          allParams,
          timestamp: new Date().toISOString(),
        });

        const paymentStatus = searchParams.get('status') || searchParams.get('Status');
        const valId = searchParams.get('val_id') || searchParams.get('valId') || searchParams.get('valID');
        const tranId = searchParams.get('tran_id') || searchParams.get('tranId') || searchParams.get('tranID');
        const payStatus = searchParams.get('pay_status') || searchParams.get('payStatus') || searchParams.get('PayStatus');
        const amount = searchParams.get('amount') || searchParams.get('Amount');
        const currency = searchParams.get('currency') || searchParams.get('Currency');
        const bankTranId = searchParams.get('bank_tran_id') || searchParams.get('bankTranId');
        const cardType = searchParams.get('card_type') || searchParams.get('cardType');
        const cardNo = searchParams.get('card_no') || searchParams.get('cardNo');

        // Store order number if available
        if (finalOrderNumber) {
          setOrderNumber(finalOrderNumber);
        }

        // PRIORITY 1: Check order status from API (most reliable - this is the source of truth)
        if (orderData?.success && orderData.data) {
          const order = orderData.data;
          const orderStatus = order.status?.toLowerCase();
          const paymentStatusFromApi = (order as any).payment_status?.toLowerCase();
          
          console.log('📦 Order details from API:', {
            order_number: order.order_number,
            status: orderStatus,
            payment_status: paymentStatusFromApi,
          });
          
          // Check if order is cancelled or payment failed
          const isOrderCancelled = orderStatus === 'cancelled';
          const isPaymentFailed = 
            paymentStatusFromApi === 'failed' || 
            paymentStatusFromApi === 'cancelled' ||
            orderStatus === 'failed';
          
          if (isOrderCancelled || isPaymentFailed) {
            console.log('❌ Order is cancelled or payment failed according to API:', {
              order_status: orderStatus,
              payment_status: paymentStatusFromApi,
            });
            
            // Redirect to payment failed page
            setStatus('failed');
            setMessage('Payment failed. Your order has been cancelled. Please try again or choose a different payment method.');
            
            setTimeout(() => {
              const params = new URLSearchParams();
              if (finalOrderNumber) params.set('order', finalOrderNumber);
              console.log('🔗 Redirecting to payment failed page:', `/payment/failed?${params.toString()}`);
              router.push(`/payment/failed?${params.toString()}`);
            }, 2000);
            return;
          }
          
          // Check if order is confirmed/paid - this is the most reliable check
          const isOrderConfirmed = 
            orderStatus === 'confirmed' || 
            orderStatus === 'paid' ||
            orderStatus === 'processing' ||
            paymentStatusFromApi === 'paid' ||
            paymentStatusFromApi === 'success';
          
          if (isOrderConfirmed) {
            console.log('✅ Order is confirmed/paid according to API, redirecting to success');
            
            // Store order details in sessionStorage
            sessionStorage.setItem('lastOrder', JSON.stringify({
              order_number: order.order_number,
              status: order.status,
              total: order.total,
              is_emi: order.is_emi,
              emi_months: order.emi_months,
              emi_amount: order.emi_amount,
            }));
            sessionStorage.removeItem('pendingOrder');
            
            // Clear the cart after successful payment
            clearCart();
            console.log('🛒 Cart cleared after successful payment');
            
            // Redirect to order success page
            setStatus('success');
            setMessage('Payment completed successfully! Your order is being processed.');
            
            setTimeout(() => {
              const params = new URLSearchParams();
              if (finalOrderNumber) params.set('order_number', finalOrderNumber);
              params.set('status', 'paid');
              params.set('total', order.total.toString());
              console.log('🔗 Redirecting to order success page:', `/order-success?${params.toString()}`);
              router.push(`/order-success?${params.toString()}`);
            }, 2000);
            return;
          }
        }
        
        // PRIORITY 2: If API is still loading and we have order number, wait for it
        if (isLoadingOrder && finalOrderNumber) {
          console.log('⏳ Waiting for order details from API...');
          return;
        }

        // PRIORITY 3: Check URL parameters for payment status indicators
        // Normalize status values for comparison (case-insensitive)
        const normalizedStatus = paymentStatus?.toUpperCase();
        const normalizedPayStatus = payStatus?.toUpperCase();

        // Check payment status - SSL Commerz success indicators
        // Success indicators (in order of reliability):
        // 1. val_id is present and not '0' or empty (most reliable)
        // 2. status is 'VALID' or 'SUCCESS'
        // 3. pay_status is 'SUCCESSFUL' or 'VALID'
        // 4. tran_id is present (transaction was processed)
        // 5. bank_tran_id is present (bank processed the transaction)
        const hasValidId = valId && valId !== '0' && valId !== '' && valId !== 'null';
        const hasValidStatus = normalizedStatus === 'VALID' || normalizedStatus === 'SUCCESS';
        const hasValidPayStatus = normalizedPayStatus === 'SUCCESSFUL' || normalizedPayStatus === 'VALID' || normalizedPayStatus === 'SUCCESS';
        const hasTransactionId = tranId && tranId !== '0' && tranId !== '';
        const hasBankTranId = bankTranId && bankTranId !== '0' && bankTranId !== '';

        // Check for explicit failure indicators
        const isFailed =
          normalizedStatus === 'FAILED' ||
          normalizedPayStatus === 'FAILED' ||
          normalizedStatus === 'CANCELLED' ||
          normalizedPayStatus === 'CANCELLED' ||
          (normalizedStatus === 'INVALID' && !hasValidId);

        const isCancelled =
          normalizedStatus === 'CANCELLED' ||
          normalizedStatus === 'CANCEL' ||
          normalizedPayStatus === 'CANCELLED';

        const hasSuccessIndicators =
          hasValidId || // Most reliable indicator
          (hasValidStatus && hasTransactionId) ||
          (hasValidPayStatus && hasTransactionId) ||
          (hasBankTranId && normalizedStatus !== 'FAILED' && normalizedStatus !== 'CANCELLED');

        console.log('🔍 Payment status check:', {
          hasSuccessIndicators,
          isFailed,
          isCancelled,
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
          cardType,
          cardNo,
          amount,
          currency,
          finalOrderNumber,
          allParams: allParams,
          orderDataAvailable: !!orderData,
        });

        if (isFailed || isCancelled) {
          console.log('❌ Payment explicitly failed or cancelled');
          setStatus('failed');
          setMessage(isCancelled ? 'Payment was cancelled. You can try again when ready.' : 'Payment failed. Please try again or choose a different payment method.');
          
          setTimeout(() => {
            const params = new URLSearchParams();
            if (finalOrderNumber) params.set('order', finalOrderNumber);
            router.push(`/payment/failed?${params.toString()}`);
          }, 2000);
          return;
        }

        if (hasSuccessIndicators && hasValidId) {
          console.log('✅ Payment appears successful based on strong indicators (val_id present)');
          
          // Still proceed with caution - if API didn't confirm, wait a bit or proceed if API check failed
          if (!orderData && !isLoadingOrder) {
            // API might be slow or failed, but we have strong success indicators
            const pendingOrder = sessionStorage.getItem('pendingOrder');
            if (pendingOrder) {
              try {
                const order = JSON.parse(pendingOrder);
                sessionStorage.setItem('lastOrder', pendingOrder);
                sessionStorage.removeItem('pendingOrder');
                
                clearCart();
                console.log('🛒 Cart cleared after successful payment');
                
                setStatus('success');
                setMessage('Payment completed successfully! Your order is being processed.');
                
                setTimeout(() => {
                  const params = new URLSearchParams();
                  if (finalOrderNumber) params.set('order_number', finalOrderNumber);
                  params.set('status', 'paid');
                  if (amount) params.set('total', amount);
                  console.log('🔗 Redirecting to order success page:', `/order-success?${params.toString()}`);
                  router.push(`/order-success?${params.toString()}`);
                }, 2000);
                return;
              } catch (e) {
                console.error('Failed to parse pending order:', e);
              }
            }
          }
        } else {
          // If we reach here, status is unclear - don't assume success
          // Wait for API response or show error
          if (!orderData && !isLoadingOrder) {
            console.warn('⚠️ Payment status unclear - no API data and no strong success indicators');
            setStatus('failed');
            setMessage('Unable to verify payment status. Please check your order status in your account or contact support if payment was deducted.');
          }
        }
      } catch (error) {
        console.error('Payment callback error:', error);
        setStatus('failed');
        setMessage('An error occurred while processing your payment. Please contact support if payment was deducted.');
      }
    };

    processPaymentCallback();
  }, [searchParams, router, clearCart, orderData, isLoadingOrder, finalOrderNumber]);

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
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Payment Failed</h2>
              <p className="text-gray-600 mb-6 text-base">{message}</p>
              {orderNumber && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Order Number</p>
                  <p className="text-lg font-semibold text-gray-900">{orderNumber}</p>
                </div>
              )}
              <div className="flex flex-col gap-3">
                <Link
                  href="/checkout"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
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

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing payment...</h2>
        </div>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  );
}


