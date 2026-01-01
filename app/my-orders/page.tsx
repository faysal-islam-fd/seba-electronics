'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    FiPackage,
    FiClock,
    FiCheckCircle,
    FiTruck,
    FiX,
    FiChevronRight,
    FiShoppingBag,
    FiMapPin,
    FiCreditCard,
    FiCalendar,
    FiTrash2
} from 'react-icons/fi';

interface GuestOrderItem {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    originalPrice?: number;
}

interface GuestOrder {
    order_number: string;
    status: string;
    total: number;
    subtotal: number;
    shipping: number;
    is_emi?: boolean;
    emi_months?: number;
    emi_amount?: number;
    payment_method: string;
    created_at: string;
    shipping_info: {
        name: string;
        phone: string;
        email: string;
        address: string;
        city: string;
        area: string;
        postalCode: string;
    };
    items: GuestOrderItem[];
}

export default function MyOrdersPage() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<GuestOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<GuestOrder | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // If logged in, redirect to account orders
        if (isLoggedIn) {
            router.push('/account/orders');
            return;
        }

        // Load guest orders from localStorage
        try {
            const storedOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
            setOrders(storedOrders);
        } catch (error) {
            console.error('Failed to load guest orders:', error);
            setOrders([]);
        }
        setIsLoading(false);
    }, [isLoggedIn, router]);

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'delivered':
                return <FiCheckCircle className="text-green-600" size={18} />;
            case 'processing':
            case 'confirmed':
                return <FiPackage className="text-blue-600" size={18} />;
            case 'shipped':
            case 'out_for_delivery':
                return <FiTruck className="text-purple-600" size={18} />;
            case 'pending':
                return <FiClock className="text-orange-600" size={18} />;
            case 'cancelled':
                return <FiX className="text-red-600" size={18} />;
            default:
                return <FiClock className="text-gray-600" size={18} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'processing':
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
            case 'out_for_delivery':
                return 'bg-purple-100 text-purple-800';
            case 'pending':
                return 'bg-orange-100 text-orange-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-BD', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const clearAllOrders = () => {
        if (confirm('Are you sure you want to clear all order history from this browser?')) {
            localStorage.removeItem('guestOrders');
            setOrders([]);
            setSelectedOrder(null);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
                            <p className="text-gray-600 mt-1">View orders placed from this browser</p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/track-order"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                <FiTruck size={16} />
                                Track Order
                            </Link>
                            {orders.length > 0 && (
                                <button
                                    onClick={clearAllOrders}
                                    className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                                >
                                    <FiTrash2 size={16} />
                                    Clear History
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {orders.length === 0 ? (
                    /* Empty State */
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiShoppingBag className="text-gray-400" size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h2>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            You haven't placed any orders from this browser yet. Orders placed as a guest will appear here.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                <FiShoppingBag size={18} />
                                Start Shopping
                            </Link>
                            <Link
                                href="/track-order"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors font-medium"
                            >
                                <FiTruck size={18} />
                                Track an Order
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Orders List */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 bg-gray-50">
                                    <h2 className="font-semibold text-gray-900">Order History ({orders.length})</h2>
                                </div>
                                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                                    {orders.map((order) => (
                                        <button
                                            key={order.order_number}
                                            onClick={() => setSelectedOrder(order)}
                                            className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${selectedOrder?.order_number === order.order_number ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 text-sm truncate">
                                                        {order.order_number}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatDate(order.created_at)}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                            {getStatusIcon(order.status)}
                                                            {order.status.replace(/_/g, ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="font-bold text-gray-900">৳{order.total.toLocaleString()}</p>
                                                    <p className="text-xs text-gray-500">{order.items.length} items</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="lg:col-span-2">
                            {selectedOrder ? (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                    {/* Order Header */}
                                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                                                <p className="text-gray-600 mt-1">{selectedOrder.order_number}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(selectedOrder.status)}`}>
                                                    {getStatusIcon(selectedOrder.status)}
                                                    {selectedOrder.status.replace(/_/g, ' ').toUpperCase()}
                                                </span>
                                                <Link
                                                    href={`/track-order?order_number=${selectedOrder.order_number}`}
                                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                >
                                                    Track <FiChevronRight size={14} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Content */}
                                    <div className="p-6 space-y-6">
                                        {/* Items */}
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <FiPackage size={18} className="text-blue-600" />
                                                Order Items
                                            </h3>
                                            <div className="space-y-3">
                                                {selectedOrder.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                                        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                            <Image
                                                                src={item.image || '/products/placeholder.jpg'}
                                                                alt={item.name}
                                                                width={64}
                                                                height={64}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-gray-900 text-sm line-clamp-2">{item.name}</p>
                                                            <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                                        </div>
                                                        <div className="text-right flex-shrink-0">
                                                            <p className="font-bold text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</p>
                                                            {item.originalPrice && item.originalPrice > item.price && (
                                                                <p className="text-xs text-gray-400 line-through">৳{(item.originalPrice * item.quantity).toLocaleString()}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Shipping Info */}
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <FiMapPin size={18} className="text-blue-600" />
                                                Shipping Address
                                            </h3>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="font-medium text-gray-900">{selectedOrder.shipping_info.name}</p>
                                                <p className="text-gray-600 text-sm mt-1">{selectedOrder.shipping_info.phone}</p>
                                                <p className="text-gray-600 text-sm">{selectedOrder.shipping_info.email}</p>
                                                <p className="text-gray-600 text-sm mt-2">
                                                    {selectedOrder.shipping_info.address}, {selectedOrder.shipping_info.area}, {selectedOrder.shipping_info.city}
                                                    {selectedOrder.shipping_info.postalCode && ` - ${selectedOrder.shipping_info.postalCode}`}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Payment & Summary */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Payment Method */}
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                    <FiCreditCard size={18} className="text-blue-600" />
                                                    Payment
                                                </h3>
                                                <div className="bg-gray-50 rounded-xl p-4">
                                                    <p className="font-medium text-gray-900 capitalize">
                                                        {selectedOrder.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                                                    </p>
                                                    {selectedOrder.is_emi && (
                                                        <p className="text-sm text-blue-600 mt-1">
                                                            EMI: {selectedOrder.emi_months} months @ ৳{selectedOrder.emi_amount?.toLocaleString()}/month
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Order Date */}
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                    <FiCalendar size={18} className="text-blue-600" />
                                                    Order Date
                                                </h3>
                                                <div className="bg-gray-50 rounded-xl p-4">
                                                    <p className="font-medium text-gray-900">{formatDate(selectedOrder.created_at)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Summary */}
                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Subtotal</span>
                                                    <span className="text-gray-900">৳{selectedOrder.subtotal.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Shipping</span>
                                                    <span className="text-gray-900">৳{selectedOrder.shipping.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                                                    <span className="text-gray-900">Total</span>
                                                    <span className="text-blue-600">৳{selectedOrder.total.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* No Order Selected */
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                        <FiPackage className="text-blue-600" size={28} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Order</h3>
                                    <p className="text-gray-600">Click on an order from the list to view its details</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Info Note */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                    <p className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">ℹ️</span>
                        <span>
                            <strong>Note:</strong> This order history is stored locally in your browser. It will be cleared if you clear your browser data.
                            For permanent order tracking, you can use the <Link href="/track-order" className="underline font-medium">Track Order</Link> feature with your order number.
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
