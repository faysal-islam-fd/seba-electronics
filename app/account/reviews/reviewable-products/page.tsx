'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiStar, FiPackage, FiAlertCircle, FiShoppingBag, FiCalendar } from 'react-icons/fi';
import { useGetReviewableProductsQuery } from '@/app/store/api/reviewsApi';
import { useToast } from '@/app/context/ToastContext';
import { useRouter } from 'next/navigation';
import ReviewForm from '@/app/components/ReviewForm';
import { useCreateReviewMutation } from '@/app/store/api/reviewsApi';

export default function ReviewableProductsPage() {
    const { data: productsData, isLoading, error, refetch } = useGetReviewableProductsQuery();
    const [createReview, { isLoading: isCreatingReview }] = useCreateReviewMutation();
    const { showSuccess, showError } = useToast();
    const router = useRouter();

    const [reviewingProduct, setReviewingProduct] = useState<{
        id: number;
        title: string;
    } | null>(null);

    const handleCreateReview = async (data: {
        rating: number;
        title?: string;
        comment?: string;
        images?: File[];
    }) => {
        if (!reviewingProduct) return;

        try {
            await createReview({
                product_id: reviewingProduct.id,
                ...data,
            }).unwrap();
            showSuccess('Review submitted successfully!');
            setReviewingProduct(null);
            refetch(); // Refresh the list to remove reviewed product
        } catch (err: any) {
            showError(err?.data?.message || 'Failed to submit review');
            throw err;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 p-6 sm:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Products You Can Review</h1>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="flex gap-4">
                                <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                                    <div className="h-3 bg-gray-200 rounded w-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 p-6 sm:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Products You Can Review</h1>
                <div className="text-center py-12">
                    <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                    <p className="text-gray-600 mb-4">Failed to load reviewable products. Please try again.</p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const products = productsData?.data || [];

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Products You Can Review</h1>
                <span className="text-sm text-gray-500">
                    {products.length} {products.length === 1 ? 'product' : 'products'}
                </span>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                        <FiShoppingBag className="text-blue-500" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products to Review</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        You don't have any products available for review right now. Purchase a product and wait for delivery to leave a review!
                    </p>
                    <Link
                        href="/search"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
                    >
                        <FiPackage size={18} />
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="border border-gray-100 rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:border-blue-100 transition-all"
                        >
                            <div className="flex gap-4">
                                {/* Product Image */}
                                <Link href={`/product/${product.id}`} className="flex-shrink-0">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100">
                                        {product.thumbnail_image ? (
                                            <Image
                                                src={product.thumbnail_image}
                                                alt={product.title}
                                                width={96}
                                                height={96}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <FiPackage size={32} />
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/product/${product.id}`}
                                        className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2"
                                    >
                                        {product.title}
                                    </Link>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center gap-1.5">
                                            <FiShoppingBag size={14} />
                                            <span>Order #{product.order_id}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <FiCalendar size={14} />
                                            <span>{formatDate(product.order_date)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setReviewingProduct({
                                            id: product.id,
                                            title: product.title,
                                        })}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm"
                                    >
                                        <FiStar size={16} />
                                        Write Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Review Form Modal */}
            {reviewingProduct && (
                <ReviewForm
                    isOpen={true}
                    onClose={() => setReviewingProduct(null)}
                    onSubmit={handleCreateReview}
                    isLoading={isCreatingReview}
                    mode="create"
                    productName={reviewingProduct.title}
                />
            )}
        </div>
    );
}



