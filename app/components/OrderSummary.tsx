'use client';

import { FiChevronRight } from 'react-icons/fi';
import { useState } from 'react';

interface OrderSummaryProps {
  subtotal: number;
  discount?: number;
  shipping: number;
  itemCount: number;
}

export default function OrderSummary({
  subtotal,
  discount = 0,
  shipping,
  itemCount,
}: OrderSummaryProps) {
  const [showDiscountCode, setShowDiscountCode] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [showClubPoints, setShowClubPoints] = useState(false);

  const total = subtotal - discount + shipping;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Discount Code */}
      <div className="mb-4">
        <button
          onClick={() => setShowDiscountCode(!showDiscountCode)}
          className="w-full flex items-center justify-between p-3 text-left border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">Apply Discount Code</span>
          <FiChevronRight size={18} className="text-gray-500" />
        </button>
        {showDiscountCode && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Enter code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Club Points */}
      <div className="mb-6">
        <button
          onClick={() => setShowClubPoints(!showClubPoints)}
          className="w-full flex items-center justify-between p-3 text-left border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">Use Club Points</span>
          <FiChevronRight size={18} className="text-gray-500" />
        </button>
        {showClubPoints && (
          <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
            You have 0 club points available.
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Cart Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span className="font-medium text-gray-900">৳ {subtotal.toLocaleString()}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount (Visa Mastercard Offer)</span>
            <span className="font-medium text-green-600">-৳ {discount.toLocaleString()}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-gray-900">
            {shipping === 0 ? 'Free' : `৳ ${shipping.toLocaleString()}`}
          </span>
        </div>

        <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">৳ {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

