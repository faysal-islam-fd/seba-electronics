import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'https://seba.rangpurit.com/api/v1';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Products', 'Categories', 'Brands', 'FeaturedProducts', 'TopSellingProducts'],
  endpoints: () => ({}),
});

