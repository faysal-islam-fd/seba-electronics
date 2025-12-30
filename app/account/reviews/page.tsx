'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiStar, FiEdit2, FiTrash2, FiPackage, FiAlertCircle } from 'react-icons/fi';
import { useGetMyReviewsQuery, useDeleteReviewMutation, useUpdateReviewMutation } from '@/app/store/api/reviewsApi';
import { useToast } from '@/app/context/ToastContext';
import { useConfirm } from '@/app/context/ConfirmContext';
import ReviewForm from '@/app/components/ReviewForm';

export default function MyReviewsPage() {
    const { data: reviewsData, isLoading, error, refetch } = useGetMyReviewsQuery();
    const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
    const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
    const { showSuccess, showError } = useToast();
    const { confirm } = useConfirm();

    const [editingReview, setEditingReview] = useState<{
        id: number;
        rating: number;
        title?: string;
        comment?: string;
    } | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDeleteReview = async (reviewId: number) => {
        confirm(
            'Are you sure you want to delete this review? This action cannot be undone.',
            async () => {
                setDeletingId(reviewId);
                try {
                    await deleteReview(reviewId).unwrap();
                    showSuccess('Review deleted successfully');
                    refetch();
                } catch (err: any) {
                    showError(err?.data?.message || 'Failed to delete review');
                } finally {
                    setDeletingId(null);
                }
            },
            {
                type: 'danger',
                title: 'Delete Review',
                confirmText: 'Delete',
                cancelText: 'Cancel',
            }
        );
    };

    const handleUpdateReview = async (data: {
        rating: number;
        title?: string;
        comment?: string;
    }) => {
        if (!editingReview) return;

        try {
            await updateReview({
                reviewId: editingReview.id,
                rating: data.rating,
                title: data.title,
                comment: data.comment,
            }).unwrap();
            showSuccess('Review updated successfully');
            setEditingReview(null);
            refetch();
        } catch (err: any) {
            showError(err?.data?.message || 'Failed to update review');
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

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                        key={star}
                        size={16}
                        className={`${star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 p-6 sm:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">My Reviews</h1>
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
                <h1 className="text-2xl font-bold text-gray-900 mb-6">My Reviews</h1>
                <div className="text-center py-12">
                    <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                    <p className="text-gray-600">Failed to load your reviews. Please try again.</p>
                    <button
                        onClick={() => refetch()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const reviews = Array.isArray(reviewsData?.data) ? reviewsData.data : reviewsData?.data?.data || [];

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
                <div className="flex items-center gap-4">
                    <Link
                        href="/account/reviews/reviewable-products"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5"
                    >
                        <FiPackage size={16} />
                        Products to Review
                    </Link>
                    <span className="text-sm text-gray-500">
                        {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                    </span>
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                        <FiStar className="text-blue-500" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        You haven't reviewed any products yet. Purchase a product and share your experience!
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
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="border border-gray-100 rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:border-blue-100 transition-all"
                        >
                            <div className="flex gap-4">
                                {/* Product Image */}
                                {review.product && (
                                    <Link href={`/product/${review.product.id}`} className="flex-shrink-0">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100">
                                            {review.product.thumbnail_image ? (
                                                <Image
                                                    src={review.product.thumbnail_image}
                                                    alt={review.product.title}
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
                                )}

                                {/* Review Content */}
                                <div className="flex-1 min-w-0">
                                    {/* Product Title */}
                                    {review.product && (
                                        <Link
                                            href={`/product/${review.product.id}`}
                                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1 mb-1"
                                        >
                                            {review.product.title}
                                        </Link>
                                    )}

                                    {/* Rating & Date */}
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        {renderStars(review.rating)}
                                        <span className="text-sm text-gray-500">
                                            {formatDate(review.created_at)}
                                        </span>
                                    </div>

                                    {/* Review Title */}
                                    {review.title && (
                                        <h4 className="font-medium text-gray-800 mb-1">{review.title}</h4>
                                    )}

                                    {/* Review Comment */}
                                    {review.comment && (
                                        <p className="text-gray-600 text-sm line-clamp-2">{review.comment}</p>
                                    )}

                                    {/* Review Images */}
                                    {review.images && review.images.length > 0 && (
                                        <div className="flex gap-2 mt-3">
                                            {review.images.slice(0, 3).map((img: { id: number; image_path: string }, idx: number) => (
                                                <div
                                                    key={img.id}
                                                    className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100"
                                                >
                                                    <Image
                                                        src={img.image_path}
                                                        alt={`Review image ${idx + 1}`}
                                                        width={48}
                                                        height={48}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                            {review.images.length > 3 && (
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                                                    +{review.images.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Vendor Reply */}
                                    {review.vendor_reply && (
                                        <div className="mt-3 p-3 bg-blue-50 rounded-xl">
                                            <p className="text-xs font-semibold text-blue-600 mb-1">
                                                Seller Response:
                                            </p>
                                            <p className="text-sm text-gray-700">{review.vendor_reply.reply}</p>
                                        </div>
                                    )}

                                    {/* Helpful Count */}
                                    {review.helpful_count > 0 && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            {review.helpful_count} {review.helpful_count === 1 ? 'person' : 'people'} found this helpful
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => setEditingReview({
                                            id: review.id,
                                            rating: review.rating,
                                            title: review.title,
                                            comment: review.comment,
                                        })}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit review"
                                    >
                                        <FiEdit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteReview(review.id)}
                                        disabled={deletingId === review.id}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                        title="Delete review"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Review Modal */}
            {editingReview && (
                <ReviewForm
                    isOpen={true}
                    onClose={() => setEditingReview(null)}
                    onSubmit={handleUpdateReview}
                    initialData={editingReview}
                    mode="edit"
                    isLoading={isUpdating}
                />
            )}
        </div>
    );
}
