'use client';

import { useState, useEffect, Suspense } from 'react';
import { useTrackOrderMutation } from '@/app/store/api/ordersApi';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function TrackOrderContent() {
    const searchParams = useSearchParams();
    const initialOrderNumber = searchParams.get('order_number') || '';

    const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
    const [trackOrder, { data, isLoading, isError, error }] = useTrackOrderMutation();
    const [hasSearched, setHasSearched] = useState(false);

    // Auto-track if order number is provided in URL
    useEffect(() => {
        if (initialOrderNumber) {
            setOrderNumber(initialOrderNumber);
            handleTrackOrder(initialOrderNumber);
        }
    }, [initialOrderNumber]);

    const handleTrackOrder = async (orderNum: string) => {
        if (!orderNum.trim()) return;
        setHasSearched(true);
        try {
            await trackOrder({ order_number: orderNum }).unwrap();
        } catch (err) {
            console.error('Failed to track order:', err);
        }
    };

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        handleTrackOrder(orderNumber);
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'delivered':
                return <FiCheckCircle className="text-green-600" size={24} />;
            case 'processing':
            case 'confirmed':
                return <FiPackage className="text-blue-600" size={24} />;
            case 'shipped':
            case 'out_for_delivery':
                return <FiTruck className="text-purple-600" size={24} />;
            case 'pending':
                return <FiClock className="text-orange-600" size={24} />;
            case 'cancelled':
                return <FiAlertCircle className="text-red-600" size={24} />;
            default:
                return <FiCheckCircle className="text-gray-600" size={24} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'processing':
            case 'confirmed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped':
            case 'out_for_delivery':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'pending':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
                    <p className="text-gray-600">Enter your order ID to check the status of your order</p>
                </div>

                {/* Tracking Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
                    <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label htmlFor="order_number" className="sr-only">Order ID</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiPackage className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="order_number"
                                    placeholder="Enter Order ID (e.g., ORD-12345)"
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Tracking...
                                </>
                            ) : (
                                <>
                                    <FiSearch className="mr-2" />
                                    Track Order
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Results */}
                {hasSearched && (
                    <div className="space-y-6">
                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">Retrieving order details...</p>
                            </div>
                        ) : isError ? (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FiAlertCircle className="text-red-600" size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-red-800 mb-1">Order Not Found</h3>
                                <p className="text-red-600">
                                    {(error as any)?.data?.message || 'We couldn\'t find an order with that ID. Please check and try again.'}
                                </p>
                            </div>
                        ) : data && data.success ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                {/* Header */}
                                <div className="bg-gray-50 border-b border-gray-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Order #{data.data?.order_number}</h2>
                                        <p className="text-sm text-gray-500 mt-1">Check the current status of your order</p>
                                    </div>
                                    {data.data?.status && (
                                        <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide border ${getStatusColor(data.data.status)}`}>
                                            {data.data.status.replace(/_/g, ' ')}
                                        </span>
                                    )}
                                </div>

                                {/* Tracking Details */}
                                <div className="p-6 md:p-8">
                                    {/* Timeline */}
                                    {data.data?.timeline && data.data.timeline.length > 0 ? (
                                        <div className="relative">
                                            {data.data.timeline.map((event, index) => (
                                                <div key={index} className="flex gap-4 pb-8 last:pb-0 relative">
                                                    {/* Connector Line */}
                                                    {index !== data.data!.timeline!.length - 1 && (
                                                        <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-gray-200"></div>
                                                    )}

                                                    {/* Icon */}
                                                    <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                                                        {getStatusIcon(event.status)}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 pt-2">
                                                        <h3 className="text-lg font-semibold text-gray-900 capitalize">
                                                            {event.status.replace(/_/g, ' ')}
                                                        </h3>
                                                        <p className="text-gray-600 mt-1">{event.note}</p>
                                                        <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
                                                            <FiClock size={14} />
                                                            {new Date(event.date).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            No timeline information available for this order.
                                        </div>
                                    )}
                                </div>

                                {/* Footer Actions */}
                                <div className="bg-gray-50 border-t border-gray-200 p-6 flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/my-orders" className="text-blue-600 font-semibold hover:underline">
                                        View My Orders
                                    </Link>
                                    <span className="hidden sm:inline text-gray-300">|</span>
                                    <Link href="/" className="text-blue-600 font-semibold hover:underline">
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
                </div>
            </div>
        }>
            <TrackOrderContent />
        </Suspense>
    );
}
