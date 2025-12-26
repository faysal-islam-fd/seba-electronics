import { apiSlice } from './apiSlice';
import { getAuthToken } from '@/app/lib/authApi';

// Order Item Types
export interface OrderItem {
  product_id: number;
  product_attribute_id?: number;
  quantity: number;
}

// Place Order Request Types
export interface PlaceOrderRequest {
  // Guest information (for guest orders)
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
  shipping_charge?: number;
  customer_note?: string;
  
  // SSL Commerz specific fields
  cus_phone?: string;
}

// Order Response Types
export interface Order {
  order_number: string;
  status: string;
  total: number;
  is_emi?: boolean;
  emi_months?: number;
  emi_amount?: number;
}

export interface PlaceOrderResponse {
  success: boolean;
  message: string;
  data: {
    order: Order;
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
  phone_or_email: string;
}

export interface TrackOrderResponse {
  success: boolean;
  message: string;
  data?: OrderDetailResponse['data'];
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
        console.log('📡 [Order Details] Making request:', {
          orderNumber: cleanOrderNumber,
          originalOrderNumber: orderNumber,
          url,
          fullUrl: `https://seba.rangpurit.com/api/v1${url}`,
          hasToken: !!getAuthToken(),
          tokenPreview: getAuthToken() ? `${getAuthToken()?.substring(0, 20)}...` : null,
          note: 'Using /customer/orders/{orderNumber} endpoint for authenticated users',
        });
        
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
      query: ({ orderNumber, reason }) => ({
        url: `/orders/${orderNumber}/cancel`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useGetOrdersQuery,
  useGetOrderDetailsQuery,
  useTrackOrderMutation,
  useCancelOrderMutation,
} = ordersApi;

