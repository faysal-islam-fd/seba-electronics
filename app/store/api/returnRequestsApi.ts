import { apiSlice } from './apiSlice';

// Return Request Types
export interface ReturnRequest {
  id: number;
  order_id: number;
  order_item_id: number;
  type: 'single_item' | 'full_order';
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
  reason: 'defective' | 'wrong_item' | 'damaged' | 'not_as_described' | 'other';
  description: string;
  refund_method: 'original' | 'bank_transfer' | 'wallet';
  refund_account_info?: string;
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

export interface ReturnRequestsListResponse {
  success: boolean;
  data: ReturnRequest[];
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface ReturnRequestDetailResponse {
  success: boolean;
  data: ReturnRequest;
}

export interface CreateReturnRequestRequest {
  order_id: number;
  order_item_id: number;
  type: 'single_item' | 'full_order';
  reason: 'defective' | 'wrong_item' | 'damaged' | 'not_as_described' | 'other';
  description: string;
  images?: File[];
  refund_method: 'original' | 'bank_transfer' | 'wallet';
  refund_account_info?: string;
}

export interface CreateReturnRequestResponse {
  success: boolean;
  message: string;
  data: ReturnRequest;
}

export interface CancelReturnRequestResponse {
  success: boolean;
  message: string;
}

export interface ReturnRequestsQueryParams {
  page?: number;
  per_page?: number;
  status?: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
}

export const returnRequestsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReturnRequests: builder.query<ReturnRequestsListResponse, ReturnRequestsQueryParams | void>({
      query: (params) => ({
        url: '/return-requests',
        params: (params || {}) as Record<string, any>,
      }),
      providesTags: ['ReturnRequests'],
    }),
    getReturnRequest: builder.query<ReturnRequestDetailResponse, number>({
      query: (id) => ({
        url: `/return-requests/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'ReturnRequests', id }],
    }),
    createReturnRequest: builder.mutation<CreateReturnRequestResponse, CreateReturnRequestRequest>({
      query: (requestData) => {
        // Handle file uploads using FormData
        const formData = new FormData();
        formData.append('order_id', requestData.order_id.toString());
        formData.append('order_item_id', requestData.order_item_id.toString());
        formData.append('type', requestData.type);
        formData.append('reason', requestData.reason);
        formData.append('description', requestData.description);
        formData.append('refund_method', requestData.refund_method);
        
        if (requestData.refund_account_info) {
          formData.append('refund_account_info', requestData.refund_account_info);
        }
        
        // Append images if provided
        if (requestData.images && requestData.images.length > 0) {
          requestData.images.forEach((image) => {
            formData.append('images[]', image);
          });
        }

        return {
          url: '/return-requests',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['ReturnRequests'],
    }),
    cancelReturnRequest: builder.mutation<CancelReturnRequestResponse, number>({
      query: (id) => ({
        url: `/return-requests/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'ReturnRequests', id }, 'ReturnRequests'],
    }),
  }),
});

export const {
  useGetReturnRequestsQuery,
  useGetReturnRequestQuery,
  useCreateReturnRequestMutation,
  useCancelReturnRequestMutation,
} = returnRequestsApi;


