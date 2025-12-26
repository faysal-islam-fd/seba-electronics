# SSL Commerz Payment Flow Verification Guide

## Payment Flow Overview

### 1. **Order Placement** (`/checkout`)
   - User fills shipping info and selects "Pay Via Mobile Banking (bKash, Rocket etc), Any Cards or Your Bank Online"
   - User clicks "Place Order Securely"
   - **What happens:**
     - Order is sent to `POST /api/v1/orders` with `payment_method: "ssl_commerz"`
     - Backend creates order and returns `payment_url` from SSL Commerz
     - **VERIFICATION:** Check browser console for log: `✅ Order placed successfully` with `payment_url`
     - Order details stored in `sessionStorage` as `pendingOrder`
     - **REDIRECT HAPPENS:** `window.location.href = result.data.payment_url`

### 2. **SSL Commerz Payment Gateway**
   - User is redirected to SSL Commerz payment page
   - User completes payment (card, mobile banking, etc.)
   - **VERIFICATION:** You should see the SSL Commerz payment page
   - After payment, SSL Commerz redirects back to your callback URL

### 3. **Payment Callback** (`/payment/callback`)
   - SSL Commerz redirects user back with payment status parameters
   - **VERIFICATION:** Check browser console for log: `🔔 Payment callback received` with all URL parameters
   - Callback page checks payment status from URL parameters
   - **Success indicators:**
     - `status === 'VALID'` or `status === 'success'`
     - `pay_status === 'Successful'` or `pay_status === 'VALID'`
     - `val_id` is present and not '0'
   - **VERIFICATION:** Check console for `✅ Payment successful!` log

### 4. **Order Success Page** (`/order-success`)
   - After successful payment, user is redirected here
   - Shows order confirmation with order number
   - **VERIFICATION:** User sees order success page with order details

## How to Verify Payment is Working

### Step 1: Check Redirect to Payment Gateway
1. Place an order with SSL Commerz payment method
2. Open browser console (F12)
3. Look for these logs:
   ```
   ✅ Order placed successfully: { payment_url: "https://sandbox.sslcommerz.com/..." }
   🔗 Redirecting to SSL Commerz payment gateway...
   💾 Order details stored in sessionStorage
   ```
4. **VERIFY:** Browser should redirect to SSL Commerz payment page
5. **If redirect doesn't happen:** Check if `result.data.payment_url` exists in the API response

### Step 2: Check Payment Callback
1. After completing payment on SSL Commerz page
2. Check browser console for:
   ```
   🔔 Payment callback received: { url: "...", allParams: {...} }
   🔍 Payment status check: { isSuccess: true, ... }
   ✅ Payment successful!
   ```
3. **VERIFY:** You should be redirected to `/payment/callback` page
4. **If callback doesn't work:** Check backend SSL Commerz configuration:
   - Success URL should be: `https://yourdomain.com/payment/callback`
   - Failure URL should be: `https://yourdomain.com/payment/callback`
   - Cancel URL should be: `https://yourdomain.com/payment/callback`

### Step 3: Verify Order Success
1. After successful payment, check console for:
   ```
   💾 Order moved from pendingOrder to lastOrder
   🔗 Redirecting to order success page
   ```
2. **VERIFY:** User should see order success page with order number

## Backend Configuration Required

### SSL Commerz Callback URLs
Your backend must configure SSL Commerz with these callback URLs:

**Success URL:**
```
https://yourdomain.com/payment/callback
```

**Failure URL:**
```
https://yourdomain.com/payment/callback
```

**Cancel URL:**
```
https://yourdomain.com/payment/callback
```

**IPN (Instant Payment Notification) URL (optional but recommended):**
```
https://yourdomain.com/api/payment/ipn
```

## Debugging Checklist

### If redirect to payment_url doesn't happen:
- [ ] Check browser console for API response
- [ ] Verify `result.data.payment_url` exists
- [ ] Check if `result.success === true`
- [ ] Verify no JavaScript errors in console

### If payment callback doesn't work:
- [ ] Check backend SSL Commerz configuration
- [ ] Verify callback URLs are correct
- [ ] Check browser console for callback parameters
- [ ] Verify `sessionStorage` has `pendingOrder` data

### If payment status is unclear:
- [ ] Check all URL parameters in callback
- [ ] Verify SSL Commerz documentation for parameter names
- [ ] Check backend logs for payment verification

## Console Logs Reference

### Order Placement:
```javascript
📦 Order Data: { payment_method, cus_phone, ... }
✅ Order placed successfully: { payment_url, order_number }
🔗 Redirecting to SSL Commerz payment gateway...
💾 Order details stored in sessionStorage
```

### Payment Callback:
```javascript
🔔 Payment callback received: { url, allParams }
🔍 Payment status check: { isSuccess, paymentStatus, ... }
✅ Payment successful! { order_number, valId, tranId }
💾 Order moved from pendingOrder to lastOrder
🔗 Redirecting to order success page
```

## Testing in Sandbox Mode

When testing with SSL Commerz sandbox:
1. Use test credentials provided by SSL Commerz
2. Use test card numbers for card payments
3. Check SSL Commerz dashboard for transaction logs
4. Verify callback URLs are accessible (not localhost in production)

## Important Notes

1. **The redirect to `payment_url` is CRITICAL** - This is what takes the user to SSL Commerz
2. **Payment confirmation happens on the callback page** - SSL Commerz sends status via URL parameters
3. **Backend must verify payment** - Don't rely only on frontend callback, backend should verify with SSL Commerz API
4. **SessionStorage is used** - Order details are stored temporarily for callback handling

