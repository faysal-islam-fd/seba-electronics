import { apiSlice } from './apiSlice';

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  parent_id: number | null;
  children?: Category[];
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface CategoriesQueryParams {
  with_children?: boolean;
  active?: boolean;
}

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, CategoriesQueryParams | void>({
      query: (params = {}) => ({
        url: '/categories',
        params,
      }),
      providesTags: ['Categories'],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;

