'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { usePlaceOrderMutation, useSendOtpMutation, useApplyCouponMutation } from '@/app/store/api/ordersApi';
import { useVerifyRegistrationOTPMutation } from '@/app/store/api/authApi';
import Breadcrumb from '@/app/components/Breadcrumb';
import { FiMapPin, FiCreditCard, FiTruck, FiLock, FiCheck, FiTag, FiPhone, FiStar } from 'react-icons/fi';
import { validatePhoneNumber } from '@/app/utils/phoneValidation';
import { useToast } from '@/app/context/ToastContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart, getShippingTotal } = useCart();
  const { user, isLoggedIn, refreshUser } = useAuth();
  const { showError, showSuccess } = useToast();
  const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceOrderMutation();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [applyCoupon, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();
  const [step, setStep] = useState<'shipping' | 'verification' | 'payment'>('shipping');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '', // Will be 'inside_dhaka' or 'outside_dhaka'
    area: '',
    postalCode: '',
    state: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'ssl_commerz'>('cod');
  const [isEmi, setIsEmi] = useState(false);
  const [emiMonths, setEmiMonths] = useState<number>(3);
  const [customerNote, setCustomerNote] = useState('');

  // OTP States
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Coupon States
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount_amount: number;
    coupon_id: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Club Points States
  const [useClubPoints, setUseClubPoints] = useState(false);
  const [clubPointsToUse, setClubPointsToUse] = useState(0);
  const userClubPoints = user?.club_points || 0;
  // Each club point = ৳1 discount
  const maxClubPointsDiscount = Math.min(userClubPoints, Math.floor(getCartTotal() * 0.5)); // Max 50% of cart total

  // Location-based shipping - using product-specific shipping costs
  const isInsideDhaka = shippingInfo.city === 'inside_dhaka';
  const shippingCharge = getShippingTotal(isInsideDhaka);

  const subtotal = getCartTotal();
  const discount = appliedCoupon?.discount_amount || 0;
  const clubPointsDiscount = useClubPoints ? clubPointsToUse : 0;
  const total = subtotal - discount - clubPointsDiscount + shippingCharge;

  // Calculate EMI amount if EMI is selected
  const calculateEMIAmount = () => {
    if (paymentMethod === 'ssl_commerz' && isEmi && emiMonths) {
      // This is a rough estimate - actual calculation will be done by backend
      // Typically EMI includes a convenience fee
      const convenienceFeePercent = emiMonths <= 6 ? 0 : emiMonths <= 9 ? 5 : emiMonths <= 12 ? 6 : 8;
      const convenienceFee = (total * convenienceFeePercent) / 100;
      const totalWithFee = total + convenienceFee;
      return Math.ceil(totalWithFee / emiMonths);
    }
    return 0;
  };

  const emiAmount = calculateEMIAmount();

  // Handle sending OTP and moving to verification step
  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate phone number before sending OTP
    const phoneNumber = shippingInfo.phone?.trim() || '';
    if (!phoneNumber) {
      showError('Phone number is required');
      return;
    }

    const phoneValidation = validatePhoneNumber(phoneNumber);
    if (!phoneValidation.isValid) {
      showError(phoneValidation.error || 'Invalid phone number');
      return;
    }

    // Send OTP
    try {
      const result = await sendOtp({ phone: phoneNumber }).unwrap();
      if (result.success) {
        setOtpSent(true);
        showSuccess(result.message);
        // Show OTP hint in development if provided
        if (result.otp_hint) {
          console.log('📱 OTP Hint (Dev only):', result.otp_hint);
        }
        setStep('verification');
      } else {
        showError(result.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      console.error('OTP send error:', error);
      showError(error.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    const phoneNumber = shippingInfo.phone?.trim() || '';
    try {
      const result = await sendOtp({ phone: phoneNumber }).unwrap();
      if (result.success) {
        showSuccess('OTP resent successfully!');
        if (result.otp_hint) {
          console.log('📱 OTP Hint (Dev only):', result.otp_hint);
        }
      } else {
        showError(result.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      showError(error.data?.message || 'Failed to resend OTP');
    }
  };

  // Verify OTP (Client-side format check only due to missing API)
  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      showError('Please enter a valid OTP');
      return;
    }

    // Simulate brief processing for UX
    // setIsVerifyingOtp(true); // If we had state
    await new Promise(resolve => setTimeout(resolve, 500));

    setOtpVerified(true);
    setStep('payment');
    showSuccess('Proceeding to payment...');
  };

  // Apply coupon
  const handleApplyCoupon = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponError(null);
    try {
      const items = cartItems.map(item => ({
        product_id: item.product_id || extractProductId(item.id)
      }));

      const result = await applyCoupon({
        code: couponCode.trim().toUpperCase(),
        order_amount: subtotal,
        items,
      }).unwrap();

      if (result.success && result.discount_amount && result.coupon_id) {
        setAppliedCoupon({
          code: couponCode.trim().toUpperCase(),
          discount_amount: result.discount_amount,
          coupon_id: result.coupon_id,
        });
        showSuccess(`Coupon applied! You saved ৳${result.discount_amount.toLocaleString()}`);
        setCouponCode('');
      } else {
        setCouponError(result.message || 'Invalid coupon code');
      }
    } catch (error: any) {
      console.error('Coupon apply error:', error);
      setCouponError(error.data?.message || 'Failed to apply coupon');
    }
  };

  // Remove applied coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    showSuccess('Coupon removed');
  };

  // Helper function to extract product_id from cart item ID
  const extractProductId = (itemId: string): number => {
    // If cart item has product_id stored, use it
    const item = cartItems.find(i => i.id === itemId);
    if (item?.product_id) {
      return item.product_id;
    }

    // Otherwise, try to extract from ID string (format: "productId" or "productId-sku")
    const parts = itemId.split('-');
    const productId = parseInt(parts[0], 10);
    if (!isNaN(productId)) {
      return productId;
    }

    throw new Error(`Invalid product ID in cart item: ${itemId}`);
  };

  const handlePlaceOrder = async () => {
    setErrorMessage(null);

    try {
      // Validate that all cart items have required fields
      // Check for variable products that might be missing product_attribute_id
      const itemsWithMissingAttributes = cartItems.filter(item => {
        // If item ID contains a hyphen (suggests variable product with SKU) but no product_attribute_id
        return item.id.includes('-') && !item.product_attribute_id;
      });

      if (itemsWithMissingAttributes.length > 0) {
        const productNames = itemsWithMissingAttributes.map(item => item.name).join(', ');
        setErrorMessage(
          `The following products require a variation selection: ${productNames}. Please remove these items from your cart and add them again with a selected variation.`
        );
        return;
      }

      // Map cart items to order items
      const items = cartItems.map((item) => {
        const productId = item.product_id || extractProductId(item.id);
        const orderItem: any = {
          product_id: productId,
          quantity: item.quantity,
        };

        // For variable products, product_attribute_id is REQUIRED
        // If product_attribute_id exists in cart item, include it
        if (item.product_attribute_id) {
          orderItem.product_attribute_id = item.product_attribute_id;
        }
        // If product_attribute_id is missing but item ID suggests it's a variable product,
        // we'll let the backend validate and return an error

        return orderItem;
      });

      // Additional validation: Check if any items are missing product_attribute_id
      // This will catch cases where the item was added before attribute ID support
      const missingAttributeItems = items.filter(item => {
        // If the cart item ID contains a hyphen (variable product pattern) but no product_attribute_id in order item
        const cartItem = cartItems.find(ci => (ci.product_id || extractProductId(ci.id)) === item.product_id);
        return cartItem && cartItem.id.includes('-') && !item.product_attribute_id;
      });

      if (missingAttributeItems.length > 0) {
        const productNames = missingAttributeItems.map(item => {
          const cartItem = cartItems.find(ci => (ci.product_id || extractProductId(ci.id)) === item.product_id);
          return cartItem?.name || `Product ID ${item.product_id}`;
        }).join(', ');
        setErrorMessage(
          `The following products require a variation selection: ${productNames}. Please remove these items from your cart and add them again with a selected variation.`
        );
        return;
      }

      // Get phone number from shipping info (already validated in handleShippingSubmit)
      const phoneNumber = shippingInfo.phone?.trim() || '';

      // Validate OTP is provided
      if (!otp || otp.length < 4) {
        setErrorMessage('Please verify your phone number with OTP first');
        setStep('shipping');
        return;
      }

      // For guest checkout, guest_name and guest_phone are REQUIRED
      if (!isLoggedIn) {
        if (!shippingInfo.fullName.trim()) {
          setErrorMessage('Full name is required for guest checkout');
          setStep('shipping');
          return;
        }
        if (!phoneNumber) {
          setErrorMessage('Phone number is required for guest checkout');
          setStep('shipping');
          return;
        }
      }

      // Validate EMI fields if EMI is selected
      if (paymentMethod === 'ssl_commerz' && isEmi) {
        if (!emiMonths || emiMonths < 3 || emiMonths > 24) {
          setErrorMessage('Please select a valid EMI tenure (3-24 months)');
          return;
        }
      }

      // Build order request with new API format
      const orderData: any = {
        // OTP verification (required)
        otp: otp,

        // Shipping information
        shipping_name: shippingInfo.fullName,
        shipping_phone: phoneNumber,
        shipping_address: shippingInfo.address,
        shipping_city: shippingInfo.city,

        // Order items
        items,

        // Payment information
        payment_method: paymentMethod,

        // Location-based shipping
        is_inside_dhaka: isInsideDhaka,

        // Tax (defaulting to 0)
        tax: 0,

        // Club points used for discount
        club_points_used: clubPointsDiscount,
      };

      // Add coupon code if applied
      if (appliedCoupon) {
        orderData.coupon_code = appliedCoupon.code;
      }

      // Add customer note if provided
      if (customerNote.trim()) {
        orderData.customer_note = customerNote.trim();
      }

      // Add guest information if not logged in
      if (!isLoggedIn) {
        orderData.guest_name = shippingInfo.fullName;
        orderData.guest_email = shippingInfo.email;
        orderData.guest_phone = shippingInfo.phone.trim();
      }

      // Add SSL Commerz specific fields
      // SSL Commerz requires cus_phone (customer phone) - MUST be included
      if (paymentMethod === 'ssl_commerz') {
        // Set cus_phone for SSL Commerz - this is required by the payment gateway
        // Use the already validated phoneNumber
        orderData.cus_phone = phoneNumber;

        // Add EMI information if EMI is selected
        if (isEmi && emiMonths) {
          orderData.is_emi = true;
          orderData.emi_months = emiMonths;
        }
      }

      // Debug: Log order data before sending
      console.log('📦 Order Data:', {
        payment_method: orderData.payment_method,
        is_emi: orderData.is_emi,
        emi_months: orderData.emi_months,
        cus_phone: orderData.cus_phone,
        shipping_phone: orderData.shipping_phone,
        hasCusPhone: !!orderData.cus_phone,
        phoneValue: shippingInfo.phone,
        items_count: orderData.items.length,
        fullOrderData: JSON.stringify(orderData, null, 2),
      });

      // Debug: Log each item's structure
      console.log('🔍 ORDER ITEMS DETAILS:');
      orderData.items.forEach((item: any, index: number) => {
        console.log(`Item ${index}:`, {
          product_id: item.product_id,
          product_attribute_id: item.product_attribute_id,
          quantity: item.quantity,
          has_attribute_id: !!item.product_attribute_id,
          attribute_id_type: typeof item.product_attribute_id,
          full_item: JSON.stringify(item, null, 2),
        });
      });

      // Place order
      const result = await placeOrder(orderData).unwrap();

      // Handle different API response structures:
      // SSL Commerz: result.data.order.order_number
      // COD: result.data.order_number
      const order = result.data.order || result.data;
      const resultData = result.data as any;
      const orderNumber = order.order_number || resultData.order_number;
      const orderStatus = order.status || resultData.status;
      const orderTotal = order.total || resultData.total;
      const orderIsEmi = order.is_emi || resultData.is_emi;
      const orderEmiMonths = order.emi_months || resultData.emi_months;
      const orderEmiAmount = order.emi_amount || resultData.emi_amount;
      const paymentUrl = result.data.payment_url;

      console.log('✅ Order placed successfully:', {
        success: result.success,
        message: result.message,
        order_number: orderNumber,
        payment_url: paymentUrl,
        payment_method: paymentMethod,
        is_emi: orderIsEmi,
        emi_months: orderEmiMonths,
        emi_amount: orderEmiAmount,
        order_total: orderTotal,
        response_structure: result.data.order ? 'nested' : 'flat',
      });

      if (result.success) {
        // Verify EMI data if EMI was requested
        if (paymentMethod === 'ssl_commerz' && isEmi) {
          if (!orderIsEmi) {
            console.warn('⚠️ EMI was requested but order response does not include is_emi flag');
          }
          if (!orderEmiMonths) {
            console.warn('⚠️ EMI months were requested but not returned in order response');
          }
          if (!orderEmiAmount) {
            console.warn('⚠️ EMI amount not returned in order response');
          }
        }

        // If payment URL is provided (SSL Commerz), redirect to payment gateway
        if (paymentUrl) {
          console.log('🔗 Redirecting to SSL Commerz payment gateway...', {
            payment_url: paymentUrl,
            order_number: orderNumber,
            is_emi: orderIsEmi,
            emi_months: orderEmiMonths,
          });

          // Store order details before redirecting for callback handling
          sessionStorage.setItem('pendingOrder', JSON.stringify({
            order_number: orderNumber,
            status: orderStatus,
            total: orderTotal,
            is_emi: orderIsEmi,
            emi_months: orderEmiMonths,
            emi_amount: orderEmiAmount,
          }));

          console.log('💾 Order details stored in sessionStorage:', {
            order_number: orderNumber,
            status: orderStatus,
            is_emi: orderIsEmi,
            emi_months: orderEmiMonths,
          });

          // Redirect to payment gateway
          // IMPORTANT: This redirect is what takes the user to SSL Commerz
          // After payment, SSL Commerz will redirect back to your callback URL
          window.location.href = paymentUrl;
          return;
        }

        // For COD or other direct payments, clear cart and redirect to success page

        // Store comprehensive order details in localStorage for guest order history
        if (!isLoggedIn) {
          const guestOrderDetails = {
            order_number: orderNumber,
            status: orderStatus,
            total: orderTotal,
            subtotal,
            shipping: shippingCharge,
            is_emi: orderIsEmi,
            emi_months: orderEmiMonths,
            emi_amount: orderEmiAmount,
            payment_method: paymentMethod,
            created_at: new Date().toISOString(),
            shipping_info: {
              name: shippingInfo.fullName,
              phone: shippingInfo.phone,
              email: shippingInfo.email,
              address: shippingInfo.address,
              city: shippingInfo.city,
              area: shippingInfo.area,
              postalCode: shippingInfo.postalCode,
            },
            items: cartItems.map(item => ({
              id: item.id,
              name: item.name,
              image: item.image,
              price: item.price,
              quantity: item.quantity,
              originalPrice: item.originalPrice,
            })),
          };

          // Get existing guest orders from localStorage
          const existingOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
          // Add new order at the beginning
          existingOrders.unshift(guestOrderDetails);
          // Keep only last 20 orders
          const trimmedOrders = existingOrders.slice(0, 20);
          localStorage.setItem('guestOrders', JSON.stringify(trimmedOrders));
        }

        clearCart();

        // Refresh user profile to get updated club points (if logged in)
        if (isLoggedIn) {
          try {
            await refreshUser();
            console.log('✅ User profile refreshed - club points updated');
          } catch (error) {
            console.warn('⚠️ Failed to refresh user profile:', error);
            // Don't block order success page if refresh fails
          }
        }

        // Store order details in sessionStorage to display on success page
        sessionStorage.setItem('lastOrder', JSON.stringify({
          order_number: orderNumber,
          status: orderStatus,
          total: orderTotal,
          is_emi: orderIsEmi,
          emi_months: orderEmiMonths,
          emi_amount: orderEmiAmount,
        }));
        router.push('/order-success');
      } else {
        setErrorMessage(result.message || 'Failed to place order. Please try again.');
      }
    } catch (error: any) {
      console.error('❌ Order placement error:', {
        error,
        errorData: error.data,
        errorMessage: error.message,
        paymentMethod,
        isEmi,
        emiMonths,
      });

      // Handle error response
      if (error.data) {
        // Check for specific EMI-related errors
        if (error.data.errors) {
          const errorMessages = Object.values(error.data.errors).flat() as string[];
          const emiError = errorMessages.find(msg =>
            msg.toLowerCase().includes('emi') ||
            msg.toLowerCase().includes('installment')
          );
          if (emiError) {
            setErrorMessage(emiError);
            return;
          }
        }

        // Handle OTP specific errors
        const errorMessage = error.data.message || 'Failed to place order.';
        if (errorMessage.toLowerCase().includes('otp')) {
          setOtpVerified(false);
          setStep('verification');
          showError(errorMessage);
          return;
        }

        setErrorMessage(errorMessage);
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl sm:text-6xl mb-4">🛒</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">Add items to your cart to proceed to checkout.</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm sm:text-base"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: 'Cart', href: '/cart' },
              { label: 'Checkout' },
            ]}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Main Checkout Form */}
          <div className="flex-1">
            {/* Progress Steps - 3 Steps: Shipping, Verification, Payment */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                {/* Step 1: Shipping */}
                <div className={`flex items-center gap-3 ${step === 'shipping' ? 'text-blue-600' : 'text-green-600'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 'shipping' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                    {step === 'shipping' ? '1' : '✓'}
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-semibold">Shipping</p>
                    <p className="text-sm text-gray-500">Delivery details</p>
                  </div>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-2 sm:mx-4"></div>

                {/* Step 2: Verification */}
                <div className={`flex items-center gap-3 ${step === 'verification' ? 'text-blue-600' :
                  step === 'payment' ? 'text-green-600' : 'text-gray-400'
                  }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 'verification' ? 'bg-blue-600 text-white' :
                    step === 'payment' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                    {step === 'payment' ? '✓' : '2'}
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-semibold">Verify</p>
                    <p className="text-sm text-gray-500">OTP verification</p>
                  </div>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-2 sm:mx-4"></div>

                {/* Step 3: Payment */}
                <div className={`flex items-center gap-3 ${step === 'payment' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    3
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-semibold">Payment</p>
                    <p className="text-sm text-gray-500">Payment method</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information Form */}
            {step === 'shipping' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FiMapPin className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                </div>

                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.fullName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="01712345678 or +8801712345678"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="House/Flat No, Road, Area"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Area *
                      </label>
                      <select
                        required
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Delivery Area</option>
                        <option value="inside_dhaka">Inside Dhaka</option>
                        <option value="outside_dhaka">Outside Dhaka</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Area / State *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.area}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, area: e.target.value, state: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Gulshan, Dhanmondi, Dhaka Division, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.postalCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1200"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSendingOtp}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isSendingOtp ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          <FiPhone size={18} />
                          Send OTP & Continue
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* OTP Verification Step */}
            {step === 'verification' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FiPhone className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Verify Your Phone Number</h2>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    We've sent a 6-digit OTP to <span className="font-bold">{shippingInfo.phone}</span>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Please enter the code to verify your phone number.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter OTP *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest font-mono"
                      placeholder="• • • • • •"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isSendingOtp}
                      className="text-sm text-blue-600 hover:text-blue-700 font-semibold disabled:text-gray-400"
                    >
                      {isSendingOtp ? 'Sending...' : 'Resend OTP'}
                    </button>
                    <p className="text-xs text-gray-500">
                      Didn't receive the code?
                    </p>
                  </div>

                  <div className="pt-4 space-y-3">
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={!otp || otp.length < 4}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FiCheck size={18} />
                      Verify & Continue to Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('shipping')}
                      className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      ← Back to Shipping
                    </button>
                  </div>
                </div>
              </div>
            )}


            {/* Removed Verification Step Block */}



            {/* Payment Method Selection */}
            {step === 'payment' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FiCreditCard className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                </div>

                <div className="space-y-3 mb-6">
                  {/* Cash on Delivery */}
                  <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === 'cod'
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value as 'cod');
                        setIsEmi(false);
                      }}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-900 text-base">Cash on Delivery</p>
                          <p className="text-sm text-gray-600 mt-0.5">Pay when you receive your order</p>
                        </div>
                        <div className="text-3xl ml-4">💵</div>
                      </div>
                    </div>
                    {paymentMethod === 'cod' && (
                      <div className="ml-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* SSL Commerz (Mobile Banking, Cards, Bank Online) */}
                  <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === 'ssl_commerz'
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="ssl_commerz"
                      checked={paymentMethod === 'ssl_commerz'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'ssl_commerz')}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-gray-900 text-base">Pay Via Mobile Banking (bKash, Rocket etc), Any Cards or Your Bank Online</p>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded whitespace-nowrap">Secure</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-0.5">Pay via SSL Commerz gateway</p>
                          <p className="text-xs text-blue-600 mt-1 font-medium">✓ EMI Available</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                          <div className="w-10 h-6 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
                        </div>
                      </div>
                    </div>
                    {paymentMethod === 'ssl_commerz' && (
                      <div className="ml-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </label>
                </div>

                {paymentMethod === 'ssl_commerz' && (
                  <div className="border-t border-gray-200 pt-6 mt-6 space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl">
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={isEmi}
                          onChange={(e) => setIsEmi(e.target.checked)}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                        />
                        <div className="flex-1">
                          <span className="text-base font-bold text-gray-900">Pay with EMI (Easy Installment)</span>
                          <p className="text-xs text-gray-600 mt-0.5">Split your payment into easy monthly installments</p>
                        </div>
                        <div className="text-2xl">💳</div>
                      </label>
                    </div>

                    {isEmi && (
                      <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            EMI Tenure (Months) *
                          </label>
                          <select
                            value={emiMonths}
                            onChange={(e) => setEmiMonths(parseInt(e.target.value, 10))}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                          >
                            <option value={3}>3 Months</option>
                            <option value={6}>6 Months</option>
                            <option value={9}>9 Months</option>
                            <option value={12}>12 Months</option>
                            <option value={18}>18 Months</option>
                            <option value={24}>24 Months</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1.5">Select your preferred EMI tenure</p>
                        </div>

                        {emiAmount > 0 && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center gap-2 mb-3">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm font-semibold text-gray-900">EMI Preview</span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total Amount:</span>
                                <span className="font-semibold text-gray-900">৳ {total.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">EMI Tenure:</span>
                                <span className="font-semibold text-gray-900">{emiMonths} months</span>
                              </div>
                              <div className="pt-2 border-t border-blue-200 flex justify-between items-center">
                                <span className="font-semibold text-gray-900">Monthly Payment (Est.):</span>
                                <span className="text-lg font-bold text-blue-600">৳ {emiAmount.toLocaleString()}/month</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-3 italic">* Final EMI amount will be calculated by the payment gateway</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Customer Note */}
                <div className="border-t pt-6 mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Please call before delivery, Leave at door, etc."
                  />
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t mt-6 space-y-3">
                  <button
                    onClick={() => setStep('verification')}
                    className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Verification
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
                  >
                    {isPlacingOrder ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <FiLock size={20} />
                        Place Order Securely
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-gray-500">
                    By placing your order, you agree to our Terms & Conditions
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-96">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiTruck className="text-blue-600" size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
              </div>

              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-b-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</p>
                      <p className="text-sm font-bold text-gray-900 mt-1.5">
                        ৳ {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <FiTag className="text-blue-600" size={18} />
                  <span className="font-semibold text-gray-900">Have a Coupon?</span>
                </div>

                {appliedCoupon ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-green-700">{appliedCoupon.code}</p>
                        <p className="text-xs text-green-600">
                          You save ৳{appliedCoupon.discount_amount.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError(null);
                        }}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponCode.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-semibold rounded-lg transition-colors"
                      >
                        {isApplyingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-600">{couponError}</p>
                    )}
                    <p className="text-xs text-gray-500">Try: SUMMER50 for 20% off</p>
                  </div>
                )}
              </div>

              {/* Club Points Section */}
              {isLoggedIn && userClubPoints > 0 && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FiStar className="text-yellow-500" size={18} />
                    <span className="font-semibold text-gray-900">Club Points</span>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Available Points</p>
                        <p className="text-lg font-bold text-yellow-600">{userClubPoints.toLocaleString()} pts</p>
                        <p className="text-xs text-gray-500">= ৳{userClubPoints.toLocaleString()} discount</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={useClubPoints}
                          onChange={(e) => {
                            setUseClubPoints(e.target.checked);
                            if (e.target.checked) {
                              setClubPointsToUse(maxClubPointsDiscount);
                            } else {
                              setClubPointsToUse(0);
                            }
                          }}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                      </label>
                    </div>

                    {useClubPoints && (
                      <div className="mt-3 pt-3 border-t border-yellow-200">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Points to use (max {maxClubPointsDiscount.toLocaleString()})
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min={0}
                            max={maxClubPointsDiscount}
                            value={clubPointsToUse}
                            onChange={(e) => {
                              const value = Math.min(maxClubPointsDiscount, Math.max(0, parseInt(e.target.value) || 0));
                              setClubPointsToUse(value);
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                          <button
                            type="button"
                            onClick={() => setClubPointsToUse(maxClubPointsDiscount)}
                            className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            Use Max
                          </button>
                        </div>
                        <p className="text-xs text-green-600 mt-2 font-medium">
                          You will save ৳{clubPointsToUse.toLocaleString()} on this order!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} {cartItems.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold text-gray-900">৳ {subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Discount {appliedCoupon ? <span className="text-green-600">({appliedCoupon.code})</span> : ''}
                    </span>
                    <span className="font-semibold text-green-600">-৳ {discount.toLocaleString()}</span>
                  </div>
                )}

                {clubPointsDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Club Points <span className="text-yellow-600">({clubPointsDiscount} pts)</span>
                    </span>
                    <span className="font-semibold text-yellow-600">-৳ {clubPointsDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Shipping {shippingInfo.city && (
                      <span className={`text-xs px-1.5 py-0.5 rounded ${isInsideDhaka ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {isInsideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'}
                      </span>
                    )}
                  </span>
                  <span className="font-semibold text-gray-900">
                    ৳ {shippingCharge.toLocaleString()}
                  </span>
                </div>

                {paymentMethod === 'ssl_commerz' && isEmi && emiAmount > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200 mt-3">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-bold text-blue-900">EMI Payment Plan</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Total Amount:</span>
                        <span className="font-semibold text-gray-900">৳ {total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">EMI Tenure:</span>
                        <span className="font-semibold text-gray-900">{emiMonths} months</span>
                      </div>
                      <div className="pt-2 border-t border-blue-200 flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Monthly Payment:</span>
                        <span className="text-base font-bold text-blue-600">৳ {emiAmount.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 italic">* Final amount calculated by payment gateway</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold pt-4 border-t-2 border-gray-300 mt-3">
                  <span className="text-gray-900">Total Amount</span>
                  <span className="text-blue-600">৳ {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
                  <FiLock size={14} className="text-green-600" />
                  <span className="flex-1">
                    <span className="font-semibold text-gray-900">Secure checkout</span> with SSL encryption
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

