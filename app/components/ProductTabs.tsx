'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { FiStar, FiThumbsUp, FiMessageSquare, FiChevronDown, FiUser, FiChevronLeft, FiChevronRight, FiEdit2 } from 'react-icons/fi';
import Image from 'next/image';
import { useGetProductReviewsQuery, useMarkReviewHelpfulMutation, useCreateReviewMutation, useCheckCanReviewQuery, useReplyToReviewMutation, useUpdateReviewMutation } from '@/app/store/api/reviewsApi';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/app/context/ToastContext';
import { useRouter } from 'next/navigation';
import ReviewForm from './ReviewForm';
import ReviewReplyForm from './ReviewReplyForm';
import { normalizeImageUrl } from '@/app/utils/imageUtils';

interface ProductTabsProps {
  productId: string | number;
  description: string;
  specifications: Record<string, string>;
  features: string[];
  warranty: string;
  shipping: string;
}

export interface ProductTabsRef {
  switchToReviewsTab: () => void;
}

const ProductTabs = forwardRef<ProductTabsRef, ProductTabsProps>(({ productId, description, specifications, features, warranty, shipping }, ref) => {
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  // Expose method to switch to reviews tab from parent
  useImperativeHandle(ref, () => ({
    switchToReviewsTab: () => {
      setActiveTab('reviews');
      // Small delay to ensure tab content is rendered before scrolling
      setTimeout(() => {
        const tabsSection = document.querySelector('[data-reviews-tab]');
        if (tabsSection) {
          tabsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    },
  }));

  // Check URL hash on mount and when component is visible
  useEffect(() => {
    // Check if URL has #reviews hash
    if (typeof window !== 'undefined' && window.location.hash === '#reviews') {
      setActiveTab('reviews');
      setTimeout(() => {
        const tabsSection = document.querySelector('[data-reviews-tab]');
        if (tabsSection) {
          tabsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }

    // Listen for custom event to switch to reviews tab
    const handleSwitchToReviews = () => {
      setActiveTab('reviews');
      setTimeout(() => {
        const tabsSection = document.querySelector('[data-reviews-tab]');
        if (tabsSection) {
          tabsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    };

    window.addEventListener('switchToReviewsTab', handleSwitchToReviews);
    return () => {
      window.removeEventListener('switchToReviewsTab', handleSwitchToReviews);
    };
  }, []);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating_high' | 'rating_low'>('recent');
  const [filterRating, setFilterRating] = useState<number | undefined>(undefined);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;
  const [replyingToReview, setReplyingToReview] = useState<number | null>(null);
  const [editingReview, setEditingReview] = useState<{
    id: number;
    rating: number;
    title?: string;
    comment?: string;
  } | null>(null);

  const { isLoggedIn, user } = useAuth();
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  // Fetch reviews - always fetch so we can show review count in tab label
  const { data: reviewsData, isLoading: isLoadingReviews, error: reviewsError, refetch } = useGetProductReviewsQuery({
    productId,
    sort_by: sortBy,
    rating: filterRating,
    page: currentPage,
    per_page: reviewsPerPage,
  });

  // Reset to page 1 when sort or filter changes
  const handleSortChange = (newSort: typeof sortBy) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleFilterChange = (newRating: number | undefined) => {
    setFilterRating(newRating);
    setCurrentPage(1);
  };

  // Check if user can review (always check when logged in, not just when reviews tab is active)
  const { data: canReviewData, isLoading: isLoadingCanReview, error: canReviewError } = useCheckCanReviewQuery(productId, {
    skip: !isLoggedIn,
  });

  // Mutations
  const [markHelpful, { isLoading: isMarkingHelpful }] = useMarkReviewHelpfulMutation();
  const [createReview, { isLoading: isCreatingReview }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdatingReview }] = useUpdateReviewMutation();
  const [replyToReview, { isLoading: isReplying }] = useReplyToReviewMutation();

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: 'Reviews' },
  ] as const;

  // Safe access to reviews data with fallbacks
  // Handle both new structure (data.data) and legacy structure (data)
  const reviews = Array.isArray(reviewsData?.data?.data)
    ? reviewsData.data.data
    : Array.isArray(reviewsData?.data)
      ? reviewsData.data
      : [];

  // Handle pagination metadata - new structure has it nested in data
  const paginationMeta = reviewsData?.data?.current_page
    ? {
      current_page: reviewsData.data.current_page,
      per_page: reviewsData.data.per_page,
      total: reviewsData.data.total,
      last_page: reviewsData.data.last_page,
    }
    : reviewsData?.meta;

  // Handle rating summary - new structure has it at root level as 'summary'
  const ratingSummary = (reviewsData?.summary || reviewsData?.rating_summary) as any;

  // Calculate rating summary if not provided by API
  const calculatedSummary = {
    average: ratingSummary?.average_rating
      ? parseFloat(String(ratingSummary.average_rating))
      : ratingSummary?.average ?? (reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (parseInt(String(r.rating)) || 0), 0) / reviews.length
        : 0),
    total: ratingSummary?.total_reviews ?? reviews.length,
    breakdown: ratingSummary?.rating_distribution ?? ratingSummary?.rating_breakdown ?? {
      5: reviews.filter(r => parseInt(String(r.rating)) === 5).length,
      4: reviews.filter(r => parseInt(String(r.rating)) === 4).length,
      3: reviews.filter(r => parseInt(String(r.rating)) === 3).length,
      2: reviews.filter(r => parseInt(String(r.rating)) === 2).length,
      1: reviews.filter(r => parseInt(String(r.rating)) === 1).length,
    },
  };

  const handleMarkHelpful = async (reviewId: number, isHelpful: boolean) => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    try {
      await markHelpful({ reviewId, is_helpful: isHelpful }).unwrap();
      showSuccess(isHelpful ? 'Marked as helpful' : 'Removed helpful mark');
      refetch();
    } catch (err: any) {
      showError(err?.data?.message || 'Failed to update');
    }
  };

  const handleCreateReview = async (data: {
    rating: number;
    title?: string;
    comment?: string;
    images?: File[];
  }) => {
    try {
      await createReview({
        product_id: typeof productId === 'string' ? parseInt(productId, 10) : productId,
        ...data,
      }).unwrap();
      showSuccess('Review submitted successfully!');
      setIsReviewFormOpen(false);
      refetch();
    } catch (err: any) {
      // Show more detailed error message
      const errorMessage = err?.data?.message || err?.data?.error || 'Failed to submit review';
      showError(errorMessage);
      throw err;
    }
  };

  const handleWriteReviewClick = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    // If we have definitive data that user can't review, show error with reason
    if (canReviewData && !canReviewData.can_review) {
      const errorMessage = canReviewData.reason ||
        'You cannot review this product. You may need to purchase and receive this product first.';
      showError(errorMessage);
      return;
    }

    // If check is still loading or hasn't been performed yet, 
    // open the form anyway - API will validate on submit
    // This provides better UX as the user doesn't have to wait
    setIsReviewFormOpen(true);
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
      showSuccess('Review updated successfully!');
      setEditingReview(null);
      refetch();
    } catch (err: any) {
      showError(err?.data?.message || 'Failed to update review');
      throw err;
    }
  };

  const handleReplyToReview = async (reply: string) => {
    if (!replyingToReview) return;

    try {
      await replyToReview({
        reviewId: replyingToReview,
        reply,
      }).unwrap();
      showSuccess('Reply submitted successfully!');
      setReplyingToReview(null);
      refetch();
    } catch (err: any) {
      showError(err?.data?.message || 'Failed to submit reply');
      throw err;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClass = size === 'lg' ? 'text-xl' : size === 'md' ? 'text-base' : 'text-sm';
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${sizeClass} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm" data-reviews-tab>
      {/* Tab Headers */}
      <div className="border-b">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap transition-colors relative text-sm sm:text-base ${activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
                }`}
            >
              {tab.label}
              {tab.id === 'reviews' && calculatedSummary.total > 0 && (
                <span className="ml-1 text-xs text-gray-400">({calculatedSummary.total})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6">
        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Product Description</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{description}</p>
            </div>

            {features.length > 0 && (
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-3">
                      <span className="text-blue-600 mt-1 flex-shrink-0">✓</span>
                      <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 pt-4">
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-2">Warranty Information</h4>
                <p className="text-xs sm:text-sm text-gray-700">{warranty}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-2">Shipping & Delivery</h4>
                <p className="text-xs sm:text-sm text-gray-700">{shipping}</p>
              </div>
            </div>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specifications' && (
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Technical Specifications</h3>
            <div className="border rounded-lg overflow-hidden">
              {Object.entries(specifications).map(([key, value], index) => (
                <div
                  key={key}
                  className={`grid grid-cols-1 sm:grid-cols-3 p-3 sm:p-4 gap-2 sm:gap-0 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                >
                  <div className="font-semibold text-sm sm:text-base text-gray-900">{key}</div>
                  <div className="sm:col-span-2 text-sm sm:text-base text-gray-700">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Customer Reviews</h3>

              {/* Sort & Filter */}
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="helpful">Most Helpful</option>
                    <option value="rating_high">Highest Rating</option>
                    <option value="rating_low">Lowest Rating</option>
                  </select>
                  <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
                <div className="relative">
                  <select
                    value={filterRating || ''}
                    onChange={(e) => handleFilterChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                  <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            {/* Rating Summary */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-6 items-center">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-black text-gray-900 mb-2">
                  {calculatedSummary.average.toFixed(1)}
                </div>
                {renderStars(Math.round(calculatedSummary.average), 'lg')}
                <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  Based on {calculatedSummary.total} {calculatedSummary.total === 1 ? 'review' : 'reviews'}
                </p>
              </div>
              <div className="flex-1 space-y-2 w-full">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = calculatedSummary.breakdown[star as keyof typeof calculatedSummary.breakdown] || 0;
                  const percentage = calculatedSummary.total > 0 ? (count / calculatedSummary.total) * 100 : 0;
                  return (
                    <button
                      key={star}
                      onClick={() => setFilterRating(filterRating === star ? undefined : star)}
                      className={`flex items-center gap-2 sm:gap-3 w-full hover:bg-gray-100 rounded p-1 transition-colors ${filterRating === star ? 'bg-blue-50' : ''
                        }`}
                    >
                      <span className="text-xs sm:text-sm text-gray-600 w-10 sm:w-12">{star} Star</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600 w-8 sm:w-10">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pagination */}
            {paginationMeta && paginationMeta.last_page > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || isLoadingReviews}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, paginationMeta.last_page) }, (_, i) => {
                    let pageNum: number;
                    if (paginationMeta.last_page <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= paginationMeta.last_page - 2) {
                      pageNum = paginationMeta.last_page - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={isLoadingReviews}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(paginationMeta.last_page, prev + 1))}
                  disabled={currentPage === paginationMeta.last_page || isLoadingReviews}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
                <span className="text-sm text-gray-500 ml-2">
                  Page {paginationMeta.current_page} of {paginationMeta.last_page}
                </span>
              </div>
            )}

            {/* Loading State */}
            {isLoadingReviews && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse border rounded-lg p-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/6" />
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!isLoadingReviews && reviewsError && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <FiStar className="text-red-400" size={32} />
                </div>
                <p className="text-gray-600 mb-4">Unable to load reviews at this time.</p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* No Reviews */}
            {!isLoadingReviews && !reviewsError && reviews.length === 0 && (
              <div className="text-center py-12">
                <FiStar className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500 mb-4">
                  {filterRating
                    ? `No ${filterRating}-star reviews yet`
                    : 'No reviews yet. Be the first to review!'}
                </p>
              </div>
            )}

            {/* Review List */}
            {!isLoadingReviews && !reviewsError && reviews.length > 0 && (
              <div className="space-y-3 sm:space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-3 sm:p-4">
                    <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                      <div className="flex items-start gap-3 flex-1">
                        {/* User Avatar */}
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                          {review.user.profile_picture ? (
                            <Image
                              src={review.user.profile_picture}
                              alt={review.user.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold">
                              {review.user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-semibold text-sm sm:text-base text-gray-900">
                              {review.user.name}
                            </div>
                            {/* Edit Button - Only show if current user is the review author */}
                            {isLoggedIn && user && String(user.id) === String(review.user_id) && (
                              <button
                                onClick={() => setEditingReview({
                                  id: review.id,
                                  rating: parseInt(String(review.rating)),
                                  title: review.title || undefined,
                                  comment: review.comment || undefined,
                                })}
                                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 text-sm"
                                title="Edit your review"
                              >
                                <FiEdit2 size={14} />
                                Edit
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {renderStars(parseInt(String(review.rating)))}
                            {review.title && (
                              <span className="text-sm font-medium text-gray-700 truncate">
                                {review.title}
                              </span>
                            )}
                            {review.is_verified_purchase && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(review.created_at)}
                      </span>
                    </div>

                    {/* Comment */}
                    {review.comment && (
                      <p className="text-sm sm:text-base text-gray-700 mb-3">
                        {review.comment}
                      </p>
                    )}

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {review.images.map((img: string, idx: number) => (
                          <div
                            key={idx}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100"
                          >
                            <Image
                              src={normalizeImageUrl(img)}
                              alt="Review image"
                              width={80}
                              height={80}
                              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Replies (Admin/Vendor Responses) */}
                    {review.replies && review.replies.length > 0 && (
                      <div className="space-y-3 mb-3">
                        {review.replies.map((reply: { id: number; replier_type: string; replier_name: string; created_at: string; reply: string }) => (
                          <div key={reply.id} className="bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <FiMessageSquare className="text-blue-600" size={14} />
                              <span className="text-xs font-semibold text-blue-600">
                                {reply.replier_type === 'admin' ? 'Admin Response' : 'Seller Response'}
                              </span>
                              <span className="text-xs text-gray-500">
                                by {reply.replier_name}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatDate(reply.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{reply.reply}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Legacy Vendor Reply Support */}
                    {review.vendor_reply && !review.replies && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <FiMessageSquare className="text-blue-600" size={14} />
                          <span className="text-xs font-semibold text-blue-600">
                            Seller Response
                          </span>
                          {review.vendor_reply.vendor && (
                            <span className="text-xs text-gray-500">
                              by {review.vendor_reply.vendor.name}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{review.vendor_reply.reply}</p>
                      </div>
                    )}

                    {/* Reply Button (for vendors/admins) */}
                    {isLoggedIn && (!review.replies || review.replies.length === 0) && !review.vendor_reply && (
                      <div className="mb-3">
                        <button
                          onClick={() => setReplyingToReview(review.id)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                          <FiMessageSquare size={14} />
                          Reply to this review
                        </button>
                      </div>
                    )}

                    {/* Helpful Button */}
                    <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => {
                          const currentHelpful = review.user_vote?.is_helpful ?? false;
                          handleMarkHelpful(review.id, !currentHelpful);
                        }}
                        disabled={isMarkingHelpful}
                        className={`flex items-center gap-1.5 text-sm transition-colors ${review.user_vote?.is_helpful
                          ? 'text-blue-600'
                          : 'text-gray-500 hover:text-blue-600'
                          }`}
                      >
                        <FiThumbsUp size={14} className={review.user_vote?.is_helpful ? 'fill-current' : ''} />
                        <span>Helpful ({parseInt(String(review.helpful_count)) || 0})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Write Review Button */}
            {!isLoggedIn ? (
              <button
                onClick={() => router.push('/login')}
                className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
              >
                Login to Write a Review
              </button>
            ) : canReviewData && !canReviewData.can_review ? (
              <div className="w-full border-2 border-orange-300 bg-orange-50 rounded-lg p-4 text-center">
                <p className="text-sm text-orange-800 font-medium mb-2">
                  {canReviewData.reason || 'You cannot review this product at this time.'}
                </p>
                <p className="text-xs text-orange-600">
                  You may need to purchase and receive this product first. Check your <Link href="/account/reviews/reviewable-products" className="underline font-medium">reviewable products</Link> to see products you can review.
                </p>
              </div>
            ) : (
              <button
                onClick={handleWriteReviewClick}
                disabled={isLoadingCanReview}
                className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingCanReview ? 'Checking...' : 'Write a Review'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Review Form Modal */}
      <ReviewForm
        isOpen={isReviewFormOpen}
        onClose={() => setIsReviewFormOpen(false)}
        onSubmit={handleCreateReview}
        isLoading={isCreatingReview}
        mode="create"
      />

      {/* Edit Review Form Modal */}
      {editingReview && (
        <ReviewForm
          isOpen={true}
          onClose={() => setEditingReview(null)}
          onSubmit={handleUpdateReview}
          initialData={editingReview}
          isLoading={isUpdatingReview}
          mode="edit"
        />
      )}

      {/* Reply Form Modal */}
      {replyingToReview && (
        <ReviewReplyForm
          isOpen={true}
          onClose={() => setReplyingToReview(null)}
          onSubmit={handleReplyToReview}
          isLoading={isReplying}
          existingReply={
            reviews.find(r => r.id === replyingToReview)?.replies?.[0]?.reply ||
            reviews.find(r => r.id === replyingToReview)?.vendor_reply?.reply
          }
        />
      )}
    </div>
  );
});

ProductTabs.displayName = 'ProductTabs';

export default ProductTabs;
