import { apiSlice } from './apiSlice';

export interface Campaign {
    id: number;
    name: string;
    slug: string;
    image: string;
    is_lifetime: boolean;
    start_date: string;
    end_date: string;
    products_count?: number;
}

export interface Product {
    id: number;
    title: string;
    slug: string;
    thumbnail: string;
    price: number;
    final_price: number;
    discount: number;
    discount_type: string;
    stock: number;
    is_featured: boolean;
    brand?: { id: number; name: string };
    category?: { id: number; name: string };
    shipping_in_dhaka: number;
    shipping_outside_dhaka: number;
}

export interface CampaignsResponse {
    success: boolean;
    data: Campaign[];
}

export interface CampaignDetailsResponse {
    success: boolean;
    data: {
        campaign: Campaign;
        products: Product[];
    };
}

export const campaignsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCampaigns: builder.query<CampaignsResponse, { home_page?: number } | void>({
            query: (params) => ({
                url: '/campaigns',
                params: params || undefined,
            }),
            providesTags: ['Campaigns'],
        }),
        getCampaignDetails: builder.query<CampaignDetailsResponse, string>({
            query: (slug) => `/campaigns/${slug}`,
            providesTags: (result, error, slug) => [{ type: 'Campaigns', id: slug }],
        }),
    }),
});

export const {
    useGetCampaignsQuery,
    useGetCampaignDetailsQuery,
} = campaignsApi;
