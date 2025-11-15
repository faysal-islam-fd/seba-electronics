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
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Cart' },
          ]}
        />

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Cart Items Section */}
          <div className="flex-1">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
                <Link
                  href="/"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
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
          <div className="mt-8 flex justify-center">
            <Link
              href="/checkout"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
            >
              Proceed To Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

