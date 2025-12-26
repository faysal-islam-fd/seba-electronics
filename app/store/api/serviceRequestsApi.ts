import { apiSlice } from './apiSlice';

// Service Request Types
export interface ServiceRequest {
  id: number;
  order_id: number;
  order_item_id: number;
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
  };
  order_item?: {
    id: number;
    product: {
      id: number;
      title: string;
      thumbnail: string;
    };
    quantity: number;
    price: number;
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
  order_id: number;
  order_item_id: number;
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
        formData.append('order_id', requestData.order_id.toString());
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


