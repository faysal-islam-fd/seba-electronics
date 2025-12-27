import { apiSlice } from './apiSlice';

// Service Request Types
export interface ServiceRequest {
  id: number;
  user_id: number;
  order_id: number;
  order_item_id: number | string;
  product_id?: number | string;
  request_number?: string;
  type: 'warranty' | 'repair' | 'other';
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
  description: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  images?: string[];
  created_at: string;
  updated_at: string;
  order?: {
    id: number;
    order_number: string;
    status?: string;
    payment_status?: string;
    total?: string | number;
  };
  order_item?: {
    id: number;
    order_id?: string | number;
    product_id?: string | number;
    product_name?: string;
    product_sku?: string;
    product_image?: string;
    variation_details?: string | null;
    price?: string | number;
    discount?: string | number;
    quantity?: string | number;
    subtotal?: string | number;
    // Legacy nested product structure
    product?: {
      id: number;
      title: string;
      thumbnail: string;
    };
  };
  product?: {
    id: number;
    title: string;
    slug?: string;
    thumbnail_image?: string;
  };
}

export interface ServiceRequestsListResponse {
  success: boolean;
  data: ServiceRequest[];
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface ServiceRequestDetailResponse {
  success: boolean;
  data: ServiceRequest;
}

export interface CreateServiceRequestRequest {
  order_number: string; // The order number (e.g., "ORD-20251226-4691")
  order_item_id: number; // The order_item table ID
  type: 'warranty' | 'repair' | 'other';
  description: string;
  images?: File[];
  customer_name: string;
  customer_phone: string;
  customer_address: string;
}

export interface CreateServiceRequestResponse {
  success: boolean;
  message: string;
  data: ServiceRequest;
}

export interface CancelServiceRequestResponse {
  success: boolean;
  message: string;
}

export interface ServiceRequestsQueryParams {
  page?: number;
  per_page?: number;
  status?: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
  type?: 'warranty' | 'repair' | 'other';
}

export const serviceRequestsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServiceRequests: builder.query<ServiceRequestsListResponse, ServiceRequestsQueryParams | void>({
      query: (params) => ({
        url: '/service-requests',
        params: (params || {}) as Record<string, any>,
      }),
      providesTags: ['ServiceRequests'],
    }),
    getServiceRequest: builder.query<ServiceRequestDetailResponse, number>({
      query: (id) => ({
        url: `/service-requests/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'ServiceRequests', id }],
    }),
    createServiceRequest: builder.mutation<CreateServiceRequestResponse, CreateServiceRequestRequest>({
      query: (requestData) => {
        // Handle file uploads using FormData
        const formData = new FormData();
        formData.append('order_number', requestData.order_number);
        formData.append('order_item_id', requestData.order_item_id.toString());
        formData.append('type', requestData.type);
        formData.append('description', requestData.description);
        formData.append('customer_name', requestData.customer_name);
        formData.append('customer_phone', requestData.customer_phone);
        formData.append('customer_address', requestData.customer_address);
        
        // Append images if provided
        if (requestData.images && requestData.images.length > 0) {
          requestData.images.forEach((image) => {
            formData.append('images[]', image);
          });
        }

        console.log('Service Request FormData:', {
          order_number: requestData.order_number,
          order_item_id: requestData.order_item_id,
          type: requestData.type,
        });

        return {
          url: '/service-requests',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['ServiceRequests'],
    }),
    cancelServiceRequest: builder.mutation<CancelServiceRequestResponse, number>({
      query: (id) => ({
        url: `/service-requests/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'ServiceRequests', id }, 'ServiceRequests'],
    }),
  }),
});

export const {
  useGetServiceRequestsQuery,
  useGetServiceRequestQuery,
  useCreateServiceRequestMutation,
  useCancelServiceRequestMutation,
} = serviceRequestsApi;


