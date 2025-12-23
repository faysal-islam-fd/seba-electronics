import { apiSlice } from './apiSlice';

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string;
}

export interface BrandsResponse {
  success: boolean;
  data: Brand[];
}

export interface BrandsQueryParams {
  active?: boolean;
}

export const brandsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<BrandsResponse, BrandsQueryParams | void>({
      query: (params) => ({
        url: '/brands',
        params: params || {},
      }),
      providesTags: ['Brands'],
    }),
  }),
});

export const { useGetBrandsQuery } = brandsApi;

