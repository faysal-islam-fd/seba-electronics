'use client';

import { useState, useRef } from 'react';
import { FiX, FiStar, FiUpload, FiTrash2 } from 'react-icons/fi';
import Image from 'next/image';

interface ReviewFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        rating: number;
        title?: string;
        comment?: string;
        images?: File[];
    }) => Promise<void>;
    initialData?: {
        rating: number;
        title?: string;
        comment?: string;
    };
    productName?: string;
    isLoading?: boolean;
    mode?: 'create' | 'edit';
}

export default function ReviewForm({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    productName,
    isLoading = false,
    mode = 'create',
}: ReviewFormProps) {
    const [rating, setRating] = useState(initialData?.rating || 0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [title, setTitle] = useState(initialData?.title || '');
    const [comment, setComment] = useState(initialData?.comment || '');
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (images.length + files.length > 5) {
            setErrors({ ...errors, images: 'Maximum 5 images allowed' });
            return;
        }

        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                setErrors({ ...errors, images: 'Only image files are allowed' });
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                setErrors({ ...errors, images: 'Each image must be less than 5MB' });
                return false;
            }
            return true;
        });

        setImages([...images, ...validFiles]);
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
        setErrors({ ...errors, images: '' });
    };

    const removeImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setImages(images.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (rating === 0) {
            newErrors.rating = 'Please select a rating';
        }

        if (comment && comment.length < 10) {
            newErrors.comment = 'Comment must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await onSubmit({
                rating,
                title: title || undefined,
                comment: comment || undefined,
                images: images.length > 0 ? images : undefined,
            });

            // Reset form on success
            setRating(0);
            setTitle('');
            setComment('');
            setImages([]);
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
            setImagePreviews([]);
            onClose();
        } catch (error) {
            // Error handling done by parent
        }
    };

    const handleClose = () => {
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={handleClose}
                />

                {/* Modal */}
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">
                            {mode === 'edit' ? 'Edit Your Review' : 'Write a Review'}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Product Name */}
                        {productName && (
                            <div className="text-sm text-gray-600">
                                Reviewing: <span className="font-medium text-gray-900">{productName}</span>
                            </div>
                        )}

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Your Rating <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="p-1 transition-transform hover:scale-110"
                                    >
                                        <FiStar
                                            size={28}
                                            className={`transition-colors ${star <= (hoveredRating || rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 text-sm text-gray-500 self-center">
                                    {rating > 0 && ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                                </span>
                            </div>
                            {errors.rating && (
                                <p className="mt-1 text-sm text-red-500">{errors.rating}</p>
                            )}
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Review Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Sum up your experience in a few words"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                maxLength={100}
                            />
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Your Review
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your experience with this product (minimum 10 characters)"
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                            />
                            {errors.comment && (
                                <p className="mt-1 text-sm text-red-500">{errors.comment}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-400">
                                {comment.length}/500 characters
                            </p>
                        </div>

                        {/* Image Upload - Only for create mode */}
                        {mode === 'create' && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Add Photos (Optional)
                                </label>
                                <div className="space-y-3">
                                    {/* Image Previews */}
                                    {imagePreviews.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative group">
                                                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                                                        <Image
                                                            src={preview}
                                                            alt={`Preview ${index + 1}`}
                                                            width={80}
                                                            height={80}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Upload Button */}
                                    {images.length < 5 && (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                                        >
                                            <FiUpload size={18} />
                                            <span className="text-sm font-medium">
                                                Upload Images ({images.length}/5)
                                            </span>
                                        </button>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    {errors.images && (
                                        <p className="text-sm text-red-500">{errors.images}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Submit Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || rating === 0}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Submitting...' : mode === 'edit' ? 'Update Review' : 'Submit Review'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
