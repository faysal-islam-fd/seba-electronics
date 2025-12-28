import { apiSlice } from './apiSlice';

export interface SliderTarget {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
}

export interface Slider {
  id: number;
  image_url: string;
  type: string;
  target: SliderTarget | null;
  created_at: string;
  updated_at: string;
}

export interface SlidersResponse {
  success: boolean;
  message: string;
  data: Slider[];
}

export const slidersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSliders: builder.query<SlidersResponse, void>({
      query: () => ({
        url: '/cms/sliders',
      }),
      providesTags: ['Sliders'],
    }),
  }),
});

export const { useGetSlidersQuery } = slidersApi;



