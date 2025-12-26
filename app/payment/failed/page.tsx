'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { useGetOrderDetailsQuery } from '@/app/store/api/ordersApi';

function PaymentFailedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Processing payment...');
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  
  // Get order number from URL
  const orderParam = searchParams.get('order') || searchParams.get('order_number') || searchParams.get('orderNumber');
  
  // Fetch order details to verify actual status
  const { data: orderData, isLoading: isLoadingOrder } = useGetOrderDetailsQuery(orderParam || '', {
    skip: !orderParam,
  });

  useEffect(() => {
    const processPaymentStatus = async () => {
      try {
        // Log all URL parameters for debugging
        const allParams: Record<string, string | null> = {};
        searchParams.forEach((value, key) => {
          allParams[key] = value;
        });
        console.log('🔔 Payment failed page received:', {
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
        
        // PRIORITY 1: Check order status from API (most reliable)
        if (orderData?.success && orderData.data) {
          const order = orderData.data;
          const orderStatus = order.status?.toLowerCase();
          const paymentStatus = (order as any).payment_status?.toLowerCase();
          
          console.log('📦 Order details from API:', {
            order_number: order.order_number,
            status: orderStatus,
            payment_status: paymentStatus,
          });
          
          // Check if order is confirmed/paid - this is the most reliable check
          const isOrderConfirmed = 
            orderStatus === 'confirmed' || 
            orderStatus === 'paid' ||
            orderStatus === 'processing' ||
            paymentStatus === 'paid' ||
            paymentStatus === 'success';
          
          if (isOrderConfirmed) {
            console.log('✅ Order is confirmed/paid according to API, redirecting immediately to success');
            
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
            
            // Redirect immediately - no delay, no "failed" message shown
            const params = new URLSearchParams();
            params.set('order_number', order.order_number);
            params.set('status', 'paid');
            params.set('total', order.total.toString());
            console.log('🔗 Redirecting immediately to order success page:', `/order-success?${params.toString()}`);
            router.replace(`/order-success?${params.toString()}`);
            return;
          }
        }
        
        // PRIORITY 2: Check URL parameters for success indicators (quick check)
        const paymentStatus = searchParams.get('status') || searchParams.get('Status');
        const valId = searchParams.get('val_id') || searchParams.get('valId') || searchParams.get('valID');
        const tranId = searchParams.get('tran_id') || searchParams.get('tranId') || searchParams.get('tranID');
        const payStatus = searchParams.get('pay_status') || searchParams.get('payStatus') || searchParams.get('PayStatus');
        const amount = searchParams.get('amount') || searchParams.get('Amount');
        const bankTranId = searchParams.get('bank_tran_id') || searchParams.get('bankTranId');
        
        const normalizedStatus = paymentStatus?.toUpperCase();
        const normalizedPayStatus = payStatus?.toUpperCase();
        const hasValidId = valId && valId !== '0' && valId !== '' && valId !== 'null';
        const hasValidStatus = normalizedStatus === 'VALID' || normalizedStatus === 'SUCCESS';
        const hasValidPayStatus = normalizedPayStatus === 'SUCCESSFUL' || normalizedPayStatus === 'VALID' || normalizedPayStatus === 'SUCCESS';
        const hasTransactionId = tranId && tranId !== '0' && tranId !== '';
        const hasBankTranId = bankTranId && bankTranId !== '0' && bankTranId !== '';
        
        // If we have clear success indicators, redirect immediately
        if (hasValidId || hasValidStatus || hasValidPayStatus || (hasTransactionId && normalizedStatus !== 'FAILED' && normalizedStatus !== 'CANCELLED')) {
          console.log('✅ Success indicators found in URL, redirecting immediately');
          const pendingOrder = sessionStorage.getItem('pendingOrder');
          if (pendingOrder) {
            try {
              const order = JSON.parse(pendingOrder);
              sessionStorage.setItem('lastOrder', pendingOrder);
              sessionStorage.removeItem('pendingOrder');
              
              const params = new URLSearchParams();
              params.set('order_number', order.order_number);
              params.set('status', 'paid');
              params.set('total', order.total?.toString() || amount || '0');
              router.replace(`/order-success?${params.toString()}`);
              return;
            } catch (e) {
              console.error('Failed to parse pending order:', e);
            }
          }
        }
        
        // PRIORITY 3: Check if we have pending order (means payment was initiated)
        const hasPendingOrder = !!sessionStorage.getItem('pendingOrder');
        
        // If order API is still loading and we have order number, wait for it
        if (isLoadingOrder && orderParam) {
          console.log('⏳ Waiting for order details from API...');
          return;
        }
        
        // If we have pending order but API check didn't confirm success, 
        // and we're not explicitly failed, assume it might be processing
        if (hasPendingOrder && !isLoadingOrder && orderParam && !orderData) {
          // API might have failed, but order could still be successful
          // Check if we're in demo mode or have transaction indicators
          const isDemo = window.location.href.includes('sandbox') || 
                        window.location.href.includes('demo') ||
                        window.location.href.includes('sslcommerz.com');
          
          if (isDemo || hasTransactionId) {
            console.log('✅ Assuming success based on pending order and demo/transaction indicators');
            const pendingOrder = JSON.parse(sessionStorage.getItem('pendingOrder') || '{}');
            sessionStorage.setItem('lastOrder', JSON.stringify(pendingOrder));
            sessionStorage.removeItem('pendingOrder');
            
            const params = new URLSearchParams();
            params.set('order_number', pendingOrder.order_number || orderParam);
            params.set('status', 'paid');
            params.set('total', pendingOrder.total?.toString() || '0');
            router.replace(`/order-success?${params.toString()}`);
            return;
          }
        }

        // PRIORITY 4: Check if it's explicitly failed
        const isActuallyFailed = 
          normalizedStatus === 'FAILED' || 
          normalizedPayStatus === 'FAILED' ||
          (normalizedStatus === 'INVALID' && !hasValidId && !hasTransactionId);
        
        console.log('🔍 Payment status check on /failed page:', {
          hasOrderData: !!orderData,
          orderStatus: orderData?.data?.status,
          paymentStatus: normalizedStatus,
          payStatus: normalizedPayStatus,
          valId,
          tranId,
          hasPendingOrder,
          isActuallyFailed,
          allParams,
        });

        // Only show failed if we're absolutely certain
        if (isActuallyFailed && !hasValidId && !hasValidStatus && !hasValidPayStatus) {
          console.log('❌ Payment explicitly failed');
          setStatus('failed');
          setMessage('Payment failed. Please try again or choose a different payment method.');
        } else {
          // If status is unclear but we have indicators, assume success
          // This handles the case where backend redirects to /failed even on success
          console.log('✅ Status unclear but has success indicators, assuming success');
          const pendingOrder = sessionStorage.getItem('pendingOrder');
          if (pendingOrder) {
            try {
              const order = JSON.parse(pendingOrder);
              sessionStorage.setItem('lastOrder', pendingOrder);
              sessionStorage.removeItem('pendingOrder');
              
              const params = new URLSearchParams();
              params.set('order_number', order.order_number || finalOrderNumber || orderParam || '');
              params.set('status', 'paid');
              params.set('total', order.total?.toString() || amount || '0');
              router.replace(`/order-success?${params.toString()}`);
              return;
            } catch (e) {
              console.error('Failed to parse pending order:', e);
            }
          }
          
          // Last resort: if we have order number but can't verify, show generic message
          setStatus('failed');
          setMessage('Unable to verify payment status. Please check your order status in your account or contact support if payment was deducted.');
        }
      } catch (error) {
        console.error('Payment failed page error:', error);
        setStatus('failed');
        setMessage('An error occurred while processing your payment. Please contact support if payment was deducted.');
      }
    };

    processPaymentStatus();
  }, [searchParams, router, orderData, isLoadingOrder, orderParam]);

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

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing payment...</h2>
        </div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}

