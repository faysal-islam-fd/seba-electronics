import { apiSlice } from './apiSlice';

// Types
export interface ReviewUser {
    id: number;
    name: string;
    profile_picture?: string;
}

export interface ReviewProduct {
    id: number;
    title: string;
    slug: string;
    thumbnail_image?: string;
}

export interface ReviewImage {
    id: number;
    image_path: string;
}

export interface ReviewReply {
    id: number;
    review_id: string;
    user_id: string;
    replier_name: string;
    replier_type: 'admin' | 'vendor';
    reply: string;
    created_at: string;
    updated_at: string;
    user?: ReviewUser;
}

export interface VendorReply {
    id: number;
    reply: string;
    created_at: string;
    vendor?: {
        id: number;
        name: string;
    };
}

export interface Review {
    id: number;
    user_id: string;
    product_id: string;
    rating: string | number; // API returns as string, but we'll convert to number
    title?: string | null;
    comment?: string | null;
    images?: string[]; // API returns array of image URLs (strings), not objects
    is_verified_purchase?: boolean;
    is_approved?: boolean;
    is_featured?: boolean;
    helpful_count: string | number;
    not_helpful_count?: string | number;
    user_vote?: {
        is_helpful: boolean;
    } | null;
    approved_at?: string | null;
    user: ReviewUser;
    product?: ReviewProduct;
    replies?: ReviewReply[]; // API returns array of replies
    vendor_reply?: VendorReply; // Legacy support
    created_at: string;
    updated_at: string;
}

export interface ReviewsResponse {
    success: boolean;
    data: {
        current_page: number;
        data: Review[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: Array<{
            url: string | null;
            label: string;
            page: number | null;
            active: boolean;
        }>;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
    summary?: {
        average_rating: string | number;
        total_reviews: number;
        rating_distribution: {
            5: number;
            4: number;
            3: number;
            2: number;
            1: number;
        };
    };
    // Legacy support for old structure
    meta?: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
    rating_summary?: {
        average: number;
        total_reviews: number;
        rating_breakdown: {
            5: number;
            4: number;
            3: number;
            2: number;
            1: number;
        };
    };
}

export interface SingleReviewResponse {
    success: boolean;
    data: Review;
}

export interface ReviewableProduct {
    id: number;
    title: string;
    slug: string;
    thumbnail_image?: string;
    order_id: number;
    order_date: string;
}

export interface ReviewableProductsResponse {
    success: boolean;
    data: ReviewableProduct[];
}

export interface CanReviewResponse {
    success: boolean;
    can_review: boolean;
    reason?: string;
}

export interface GetProductReviewsParams {
    productId: string | number;
    rating?: number; // 1-5
    sort_by?: 'recent' | 'helpful' | 'rating_high' | 'rating_low';
    page?: number;
    per_page?: number;
}

export interface CreateReviewData {
    product_id: number;
    rating: number;
    title?: string;
    comment?: string;
    images?: File[];
}

export interface UpdateReviewData {
    reviewId: number;
    rating: number;
    title?: string;
    comment?: string;
}

export interface MarkHelpfulData {
    reviewId: number;
    is_helpful: boolean;
}

export interface ReplyToReviewData {
    reviewId: number;
    reply: string;
}

export const reviewsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Public: Get product reviews
        // GET /api/v1/products/{product id}/reviews
        // Parameters: rating (1-5), sort_by (recent|helpful|rating_high|rating_low)
        getProductReviews: builder.query<ReviewsResponse, GetProductReviewsParams>({
            query: ({ productId, ...params }) => ({
                url: `/products/${productId}/reviews`,
                params,
            }),
            providesTags: (result, error, { productId }) => [
                { type: 'Reviews', id: `product-${productId}` },
                'Reviews',
            ],
        }),

        // Authenticated: Get my reviews
        // GET /api/v1/reviews/my-reviews
        getMyReviews: builder.query<ReviewsResponse, void>({
            query: () => '/reviews/my-reviews',
            providesTags: ['Reviews'],
        }),

        // Authenticated: Get reviewable products
        // GET /api/v1/reviews/reviewable-products
        getReviewableProducts: builder.query<ReviewableProductsResponse, void>({
            query: () => '/reviews/reviewable-products',
            providesTags: ['Reviews'],
        }),

        // Authenticated: Check if can review a product
        // GET /api/v1/reviews/can-review/{product}
        checkCanReview: builder.query<CanReviewResponse, string | number>({
            query: (productId) => `/reviews/can-review/${productId}`,
        }),

        // Authenticated: Create a review
        createReview: builder.mutation<SingleReviewResponse, CreateReviewData>({
            query: ({ product_id, rating, title, comment, images }) => {
                // Use FormData if images are provided
                if (images && images.length > 0) {
                    const formData = new FormData();
                    formData.append('product_id', product_id.toString());
                    formData.append('rating', rating.toString());
                    if (title) formData.append('title', title);
                    if (comment) formData.append('comment', comment);
                    // Append images using Laravel-style array format (images[])
                    images.forEach((image) => {
                        formData.append('images[]', image);
                    });
                    return {
                        url: '/reviews',
                        method: 'POST',
                        body: formData,
                    };
                }
                // JSON for reviews without images
                return {
                    url: '/reviews',
                    method: 'POST',
                    body: { product_id, rating, title, comment },
                };
            },
            invalidatesTags: ['Reviews'],
        }),

        // Authenticated: Update a review
        updateReview: builder.mutation<SingleReviewResponse, UpdateReviewData>({
            query: ({ reviewId, ...data }) => ({
                url: `/reviews/${reviewId}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Reviews'],
        }),

        // Authenticated: Delete a review
        deleteReview: builder.mutation<{ success: boolean }, number>({
            query: (reviewId) => ({
                url: `/reviews/${reviewId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Reviews'],
        }),

        // Authenticated: Mark review as helpful
        markReviewHelpful: builder.mutation<SingleReviewResponse, MarkHelpfulData>({
            query: ({ reviewId, is_helpful }) => ({
                url: `/reviews/${reviewId}/helpful`,
                method: 'POST',
                body: { is_helpful },
            }),
            invalidatesTags: ['Reviews'],
        }),

        // Authenticated: Reply to a review (vendor/admin)
        replyToReview: builder.mutation<SingleReviewResponse, ReplyToReviewData>({
            query: ({ reviewId, reply }) => ({
                url: `/reviews/${reviewId}/reply`,
                method: 'POST',
                body: { reply },
            }),
            invalidatesTags: ['Reviews'],
        }),
    }),
});

export const {
    useGetProductReviewsQuery,
    useGetMyReviewsQuery,
    useGetReviewableProductsQuery,
    useCheckCanReviewQuery,
    useCreateReviewMutation,
    useUpdateReviewMutation,
    useDeleteReviewMutation,
    useMarkReviewHelpfulMutation,
    useReplyToReviewMutation,
} = reviewsApi;
