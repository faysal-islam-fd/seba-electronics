'use client';

import { useState } from 'react';
import { FiX, FiSend } from 'react-icons/fi';

interface ReviewReplyFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reply: string) => Promise<void>;
    isLoading?: boolean;
    existingReply?: string;
}

export default function ReviewReplyForm({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
    existingReply,
}: ReviewReplyFormProps) {
    const [reply, setReply] = useState(existingReply || '');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!reply.trim()) {
            newErrors.reply = 'Reply is required';
        } else if (reply.trim().length < 5) {
            newErrors.reply = 'Reply must be at least 5 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await onSubmit(reply.trim());
            setReply('');
            onClose();
        } catch (error) {
            // Error handling done by parent
        }
    };

    const handleClose = () => {
        setReply(existingReply || '');
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
                            {existingReply ? 'Edit Reply' : 'Reply to Review'}
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
                        {/* Reply Textarea */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Your Reply <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="Write your reply to this review (minimum 5 characters)"
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                            />
                            {errors.reply && (
                                <p className="mt-1 text-sm text-red-500">{errors.reply}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-400">
                                {reply.length}/500 characters
                            </p>
                        </div>

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
                                disabled={isLoading || !reply.trim() || reply.trim().length < 5}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    'Submitting...'
                                ) : (
                                    <>
                                        <FiSend size={18} />
                                        {existingReply ? 'Update Reply' : 'Submit Reply'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


