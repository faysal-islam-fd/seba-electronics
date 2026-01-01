import { apiSlice } from './apiSlice';

export interface CompareSpecification {
    group: string;
    value: string;
}

export interface CompareWarranty {
    group: string;
    duration: string;
    description: string;
}

export interface CompareAttribute {
    id: number;
    sku: string;
    price: string;
    final_price: string;
    stock: number;
    variation_text: string;
}

export interface ComparisonItem {
    id: number;
    title: string;
    slug: string;
    thumbnail_image: string;
    price: string;
    final_price: string;
    brand: string;
    category: string;
    specifications: CompareSpecification[];
    warranties: CompareWarranty[];
    attributes: CompareAttribute[];
}

export interface ComparisonResponse {
    status: string;
    data: ComparisonItem[];
}

export const compareApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getComparisonList: builder.query<ComparisonResponse, void>({
            query: () => '/compare',
            providesTags: ['Compare'],
        }),
        addToCompare: builder.mutation<{ status: string; message: string }, number>({
            query: (productId) => ({
                url: '/compare',
                method: 'POST',
                body: { product_id: productId },
            }),
            invalidatesTags: ['Compare'],
        }),
        removeFromCompare: builder.mutation<{ status: string; message: string }, number>({
            query: (productId) => ({
                url: `/compare/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Compare'],
        }),
        clearComparisonList: builder.mutation<{ status: string; message: string }, void>({
            query: () => ({
                url: '/compare/clear',
                method: 'POST',
            }),
            invalidatesTags: ['Compare'],
        }),
    }),
});

export const {
    useGetComparisonListQuery,
    useAddToCompareMutation,
    useRemoveFromCompareMutation,
    useClearComparisonListMutation,
} = compareApi;
