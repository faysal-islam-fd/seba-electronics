'use client';

import Link from 'next/link';
import CartItem from '@/app/components/CartItem';
import OrderSummary from '@/app/components/OrderSummary';
import EMIBanner from '@/app/components/EMIBanner';
import Breadcrumb from '@/app/components/Breadcrumb';
import { useCart } from '@/app/context/CartContext';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
  };

  const handleSaveForLater = (id: string) => {
    // In real app, this would move item to saved items
    console.log('Save for later:', id);
    // For now, just remove from cart
    removeFromCart(id);
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 1000; // Mock discount
  const shipping = 0; // Free shipping
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Cart' },
            ]}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Cart Items Section */}
          <div className="flex-1">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                <div className="text-4xl sm:text-6xl mb-4">🛒</div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
                <Link
                  href="/"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                {/* Warning for items missing product_attribute_id */}
                {cartItems.some(item => item.id.includes('-') && !item.product_attribute_id) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="text-yellow-600 text-xl">⚠️</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-yellow-900 mb-1">Action Required</h3>
                        <p className="text-sm text-yellow-800 mb-2">
                          Some products in your cart are missing variation information. Please remove and re-add them with a selected variation.
                        </p>
                        <div className="text-sm text-yellow-700">
                          {cartItems
                            .filter(item => item.id.includes('-') && !item.product_attribute_id)
                            .map(item => item.name)
                            .join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      {...item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemove}
                      onSaveForLater={handleSaveForLater}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-96">
            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              itemCount={itemCount}
            />
          </div>
        </div>

    
        {/* Proceed To Checkout Button - Bottom */}
        {cartItems.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <Link
              href="/checkout"
              className="block sm:inline-block w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors text-base sm:text-lg"
            >
              Proceed To Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

