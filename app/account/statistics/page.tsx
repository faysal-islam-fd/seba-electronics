'use client';

import { useGetProfileStatisticsQuery } from '@/app/store/api/authApi';
import { FiPieChart, FiShoppingBag, FiCheckCircle, FiClock, FiXCircle, FiTrendingUp, FiCalendar } from 'react-icons/fi';

export default function StatisticsPage() {
    const { data: statsData, isLoading } = useGetProfileStatisticsQuery(undefined);
    const stats = statsData?.data;

    // Render Skeleton Loader
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Account Statistics</h1>
                    <p className="text-gray-500 mt-1">Overview of your shopping activity</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading your statistics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Account Statistics</h1>
                <p className="text-gray-500 mt-1">Overview of your shopping activity</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Total Orders */}
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                        <h3 className="text-3xl font-bold text-gray-900">{stats?.total_orders || 0}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <FiShoppingBag size={24} />
                    </div>
                </div>

                {/* Completed Orders */}
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-green-600 mb-1">Completed</p>
                        <h3 className="text-3xl font-bold text-gray-900">{stats?.completed_orders || 0}</h3>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                        <FiCheckCircle size={24} />
                    </div>
                </div>

                {/* Pending Orders */}
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-amber-600 mb-1">Pending</p>
                        <h3 className="text-3xl font-bold text-gray-900">{stats?.pending_orders || 0}</h3>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                        <FiClock size={24} />
                    </div>
                </div>

                {/* Cancelled Orders */}
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-red-600 mb-1">Cancelled</p>
                        <h3 className="text-3xl font-bold text-gray-900">{stats?.cancelled_orders || 0}</h3>
                    </div>
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                        <FiXCircle size={24} />
                    </div>
                </div>

                {/* Member Since */}
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Member Since</p>
                        <h3 className="text-xl font-bold text-gray-900">
                            {stats?.member_since ? new Date(stats.member_since).toLocaleDateString() : 'N/A'}
                        </h3>
                    </div>
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600">
                        <FiCalendar size={24} />
                    </div>
                </div>

                {/* Last Order Date */}
                {stats?.last_order_date && (
                    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Last Order</p>
                            <h3 className="text-xl font-bold text-gray-900">
                                {new Date(stats.last_order_date).toLocaleDateString()}
                            </h3>
                        </div>
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600">
                            <FiClock size={24} />
                        </div>
                    </div>
                )}

            </div>

            {/* Total Spent - Large Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="text-indigo-100 font-medium mb-2 flex items-center gap-2">
                            <FiTrendingUp size={18} />
                            Total Lifetime Spending
                        </p>
                        <h2 className="text-4xl sm:text-5xl font-bold">
                            ৳ {(stats?.total_spent || 0).toLocaleString()}
                        </h2>
                        <p className="text-indigo-100 text-sm mt-3">
                            Thank you for being a valued customer!
                        </p>
                    </div>
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-inner">
                        <FiPieChart size={40} className="text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}
