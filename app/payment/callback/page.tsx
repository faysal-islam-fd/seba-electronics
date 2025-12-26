'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Processing payment...');
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

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

        // SSL Commerz typically sends status and other params in the callback
        const paymentStatus = searchParams.get('status');
        const orderId = searchParams.get('order_id') || searchParams.get('tran_id');
        const orderNumberParam = searchParams.get('order_number') || searchParams.get('value_a') || searchParams.get('value_b');
        const valId = searchParams.get('val_id');
        const tranId = searchParams.get('tran_id');
        const payStatus = searchParams.get('pay_status');
        const amount = searchParams.get('amount');
        const currency = searchParams.get('currency');

        // Try to get order number from sessionStorage if not in URL
        let finalOrderNumber = orderNumberParam;
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

        // Check payment status - SSL Commerz success indicators
        const isSuccess = 
          paymentStatus === 'VALID' || 
          paymentStatus === 'success' || 
          payStatus === 'Successful' ||
          payStatus === 'VALID' ||
          (valId && valId !== '0') ||
          (tranId && paymentStatus !== 'FAILED' && paymentStatus !== 'CANCELLED');

        const isFailed = 
          paymentStatus === 'FAILED' || 
          paymentStatus === 'failed' || 
          payStatus === 'Failed' ||
          payStatus === 'FAILED';

        const isCancelled = 
          paymentStatus === 'CANCELLED' || 
          paymentStatus === 'cancelled' ||
          payStatus === 'CANCELLED';

        console.log('🔍 Payment status check:', {
          isSuccess,
          isFailed,
          isCancelled,
          paymentStatus,
          payStatus,
          valId,
          tranId,
          finalOrderNumber,
        });

        if (isSuccess) {
          console.log('✅ Payment successful!', {
            order_number: finalOrderNumber,
            valId,
            tranId,
            amount,
          });
          
          setStatus('success');
          setMessage('Payment completed successfully! Your order is being processed.');
          
          // Clear pending order from sessionStorage
          if (sessionStorage.getItem('pendingOrder')) {
            const pendingOrder = JSON.parse(sessionStorage.getItem('pendingOrder') || '{}');
            // Store in lastOrder for order success page
            sessionStorage.setItem('lastOrder', JSON.stringify(pendingOrder));
            sessionStorage.removeItem('pendingOrder');
            console.log('💾 Order moved from pendingOrder to lastOrder:', pendingOrder);
          }
          
          // Redirect to order success page after a short delay
          setTimeout(() => {
            const params = new URLSearchParams();
            if (finalOrderNumber) params.set('order_number', finalOrderNumber);
            params.set('status', 'paid');
            if (amount) params.set('total', amount);
            console.log('🔗 Redirecting to order success page:', `/order-success?${params.toString()}`);
            router.push(`/order-success?${params.toString()}`);
          }, 2500);
        } else if (isFailed) {
          setStatus('failed');
          setMessage('Payment failed. Please try again or choose a different payment method.');
        } else if (isCancelled) {
          setStatus('failed');
          setMessage('Payment was cancelled. You can try again when ready.');
        } else {
          // If status is unclear, check for val_id (SSL Commerz success indicator)
          if (valId && valId !== '0' && valId !== '') {
            setStatus('success');
            setMessage('Payment completed successfully!');
            setTimeout(() => {
              const params = new URLSearchParams();
              if (finalOrderNumber) params.set('order_number', finalOrderNumber);
              params.set('status', 'paid');
              if (amount) params.set('total', amount);
              router.push(`/order-success?${params.toString()}`);
            }, 2500);
          } else {
            setStatus('failed');
            setMessage('Unable to verify payment status. Please contact support if payment was deducted from your account.');
          }
        }
      } catch (error) {
        console.error('Payment callback error:', error);
        setStatus('failed');
        setMessage('An error occurred while processing your payment. Please contact support if payment was deducted.');
      }
    };

    processPaymentCallback();
  }, [searchParams, router]);

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


