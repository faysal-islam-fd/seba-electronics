import { apiSlice } from './apiSlice';
import { getAuthToken } from '@/app/lib/authApi';

// Order Item Types
export interface OrderItem {
  product_id: number;
  product_attribute_id?: number | null;
  quantity: number;
}

// Send OTP Types
export interface SendOtpRequest {
  phone: string;
}



export interface SendOtpResponse {
  success: boolean;
  message: string;
  otp_hint?: string; // Only shown in development
}



// Apply Coupon Types
export interface ApplyCouponRequest {
  code: string;
  order_amount: number;
  items: { product_id: number }[];
}

export interface ApplyCouponResponse {
  success: boolean;
  message: string;
  discount_amount?: number;
  coupon_id?: number;
}

// Place Order Request Types
export interface PlaceOrderRequest {
  // OTP verification (required for order placement)
  otp: string;

  // Guest information - REQUIRED if user is not logged in (no auth token)
  // NOTE: guest_name and guest_phone are required if user_id is missing
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;

  // Shipping information
  shipping_name: string;
  shipping_phone: string;
  shipping_email?: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state?: string;
  shipping_zip?: string;

  // Order items
  items: OrderItem[];

  // Payment information
  payment_method: 'cod' | 'ssl_commerz';
  is_emi?: boolean;
  emi_months?: number;
  customer_note?: string;

  // Coupon & Points
  coupon_code?: string;
  club_points_used?: number;

  // Location-based shipping
  // NOTE: shipping_charge is automatically calculated by backend based on is_inside_dhaka
  is_inside_dhaka: boolean;
  tax?: number;

  // SSL Commerz specific fields
  cus_phone?: string;
}

// Order Response Types
export interface Order {
  order_number: string;
  status: string;
  total: number;
  payment_method?: string;
  is_emi?: boolean;
  emi_months?: number;
  emi_amount?: number;
}

export interface PlaceOrderResponse {
  success: boolean;
  message: string;
  data: {
    order_number: string;
    status: string;
    payment_method: string;
    total: number;
    order?: Order; // For backwards compatibility
    payment_url?: string;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Order List Types
export interface OrderListItem {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  items_count: number;
  created_at: string;
  payment_method?: string;
  items?: {
    id: number;
    product: {
      id: number;
      title: string;
      thumbnail: string;
    };
    quantity: number;
    price: number;
  }[];
}

export interface OrdersListResponse {
  success: boolean;
  data: OrderListItem[];
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface OrderDetailResponse {
  success: boolean;
  data: {
    id: number;
    order_number: string;
    status: string;
    total: number;
    payment_method?: string;
    is_emi?: boolean;
    emi_months?: number;
    emi_amount?: number;
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_state?: string;
    shipping_zip?: string;
    customer_note?: string;
    created_at: string;
    items: {
      id: number;
      product: {
        id: number;
        title: string;
        thumbnail: string;
      };
      quantity: number;
      price: number;
    }[];
  };
}

export interface OrdersQueryParams {
  page?: number;
  per_page?: number;
  status?: string;
}

// Track Order Types (Public endpoint)
export interface TrackOrderRequest {
  order_number: string;
  phone_or_email?: string; // Optional - can track by order number only
}

export interface TrackOrderResponse {
  success: boolean;
  message: string;
  data?: {
    order_number: string;
    status: string;
    timeline?: Array<{
      status: string;
      note: string;
      date: string;
    }>;
    tracking_info?: any;
  };
}

// Cancel Order Types
export interface CancelOrderRequest {
  reason: string;
}

export interface CancelOrderResponse {
  success: boolean;
  message: string;
}

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    placeOrder: builder.mutation<PlaceOrderResponse, PlaceOrderRequest>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Orders'],
    }),
    getOrders: builder.query<OrdersListResponse, OrdersQueryParams | void>({
      query: (params) => ({
        url: '/customer/orders',
        params: (params || {}) as Record<string, any>,
      }),
      providesTags: ['Orders'],
    }),
    getOrderDetails: builder.query<OrderDetailResponse, string>({
      query: (orderNumber) => {
        // Use /customer/orders/{orderNumber} endpoint for authenticated users
        // This is the correct endpoint as confirmed by user testing
        // Order numbers like "ORD-20251226-8F27" are URL-safe, no encoding needed
        const cleanOrderNumber = orderNumber.trim();

        // Use the authenticated customer endpoint
        const url = `/customer/orders/${cleanOrderNumber}`;

        // Debug logging


        return url;
      },
      providesTags: (result, error, orderNumber) => [{ type: 'Orders', id: orderNumber }],
    }),
    trackOrder: builder.mutation<TrackOrderResponse, TrackOrderRequest>({
      query: (trackData) => ({
        url: '/orders/track',
        method: 'POST',
        body: trackData,
      }),
      // This is a public endpoint, so we don't invalidate tags
    }),
    cancelOrder: builder.mutation<CancelOrderResponse, { orderNumber: string; reason: string }>({
      query: ({ orderNumber, reason }) => {
        // Clean order number (remove any encoding issues)
        const cleanOrderNumber = orderNumber.trim();



        return {
          url: `/orders/${cleanOrderNumber}/cancel`,
          method: 'POST',
          body: { reason },
        };
      },
      invalidatesTags: (result, error, { orderNumber }) => [
        'Orders',
        { type: 'Orders', id: orderNumber },
      ],
    }),
    sendOtp: builder.mutation<SendOtpResponse, SendOtpRequest>({
      query: (data) => ({
        url: '/orders/send-otp',
        method: 'POST',
        body: data,
      }),
      // This is a public endpoint
    }),
    applyCoupon: builder.mutation<ApplyCouponResponse, ApplyCouponRequest>({
      query: (data) => ({
        url: '/orders/apply-coupon',
        method: 'POST',
        body: data,
      }),
      // This is a public endpoint
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useGetOrdersQuery,
  useGetOrderDetailsQuery,
  useTrackOrderMutation,
  useCancelOrderMutation,
  useSendOtpMutation,
  useApplyCouponMutation,
} = ordersApi;

