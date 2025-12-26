'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiCheckCircle, FiPackage, FiHome, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { useCart } from '@/app/context/CartContext';

interface OrderDetails {
  order_number: string;
  status: string;
  total: number;
  is_emi?: boolean;
  emi_months?: number;
  emi_amount?: number;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const cartClearedRef = useRef(false);

  useEffect(() => {
    // Clear cart only once when the component mounts
    if (!cartClearedRef.current) {
      cartClearedRef.current = true;
      clearCart();
      console.log('🛒 Cart cleared on order success page');
    }

    // Try to get order details from URL params first (for payment callback)
    const orderNumber = searchParams.get('order_number');
    const status = searchParams.get('status');
    const total = searchParams.get('total');

    if (orderNumber) {
      // Try to get full order details from sessionStorage first
      const pendingOrder = sessionStorage.getItem('pendingOrder');
      const lastOrder = sessionStorage.getItem('lastOrder');

      let orderData = null;
      if (pendingOrder) {
        try {
          orderData = JSON.parse(pendingOrder);
          sessionStorage.removeItem('pendingOrder');
          sessionStorage.setItem('lastOrder', pendingOrder);
        } catch (e) {
          console.error('Failed to parse pending order:', e);
        }
      } else if (lastOrder) {
        try {
          orderData = JSON.parse(lastOrder);
        } catch (e) {
          console.error('Failed to parse last order:', e);
        }
      }

      if (orderData) {
        setOrderDetails(orderData);
      } else {
        setOrderDetails({
          order_number: orderNumber,
          status: status || 'pending',
          total: total ? parseFloat(total) : 0,
        });
      }
      // Clear URL params after reading
      window.history.replaceState({}, '', '/order-success');
    } else {
      // Try to get from sessionStorage (for COD orders)
      const lastOrder = sessionStorage.getItem('lastOrder');
      if (lastOrder) {
        try {
          setOrderDetails(JSON.parse(lastOrder));
          sessionStorage.removeItem('lastOrder');
        } catch (e) {
          console.error('Failed to parse order details:', e);
        }
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <FiCheckCircle className="text-green-600" size={48} />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-2">
            Thank you for your order. We've received your order and will begin processing it right away.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            You will receive an order confirmation email shortly.
          </p>

          {/* Order Details */}
          {orderDetails && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <FiPackage className="text-blue-600" size={20} />
                <h2 className="font-semibold text-gray-900">Order Details</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Order Number:</span>
                  <span className="font-semibold text-gray-900">{orderDetails.order_number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full uppercase">
                    {orderDetails.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <span className="font-bold text-gray-900 text-lg">৳ {orderDetails.total.toLocaleString()}</span>
                </div>
                {orderDetails.is_emi && orderDetails.emi_months && orderDetails.emi_amount && (
                  <div className="pt-4 mt-4 border-t-2 border-blue-200">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <FiDollarSign size={18} className="text-blue-600" />
                        <span className="text-sm font-bold text-blue-900">EMI Payment Plan</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Total Amount:</span>
                          <span className="font-semibold text-gray-900">৳ {orderDetails.total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">EMI Tenure:</span>
                          <span className="font-semibold text-gray-900">{orderDetails.emi_months} months</span>
                        </div>
                        <div className="pt-2 border-t border-blue-200 flex justify-between items-center">
                          <span className="font-semibold text-gray-900">Monthly Payment:</span>
                          <span className="text-base font-bold text-blue-600">৳ {orderDetails.emi_amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* What's Next Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <div className="flex items-center gap-2 mb-4">
              <FiCalendar className="text-blue-600" size={20} />
              <h2 className="font-semibold text-gray-900">What's Next?</h2>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>You will receive an order confirmation email with your order details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>We'll notify you once your order has been shipped</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Expected delivery: 3-5 business days</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <FiHome size={20} />
              Continue Shopping
            </Link>
            <Link
              href="/account/orders"
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <FiPackage size={20} />
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
