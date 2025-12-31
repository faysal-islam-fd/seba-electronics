'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import {
    FiUser,
    FiShoppingBag,
    FiStar,
    FiShield,
    FiRefreshCw,
    FiHeart,
    FiLogOut,
    FiChevronRight,
    FiPieChart,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const navigationItems = [
    { id: 'account', label: 'Account Information', icon: FiUser, href: '/account' },
    { id: 'statistics', label: 'Statistics', icon: FiPieChart, href: '/account/statistics' },
    { id: 'orders', label: 'My Orders', icon: FiShoppingBag, href: '/account/orders' },
    { id: 'wishlist', label: 'My Wishlist', icon: FiHeart, href: '/account/wishlist' },
    { id: 'service-requests', label: 'Service Requests', icon: FiShield, href: '/account/service-requests' },
    { id: 'return-requests', label: 'Return Requests', icon: FiRefreshCw, href: '/account/return-requests' },
    { id: 'reviews', label: 'My Product Reviews', icon: FiStar, href: '/account/reviews' },
] as const;

// Helper function to check if a profile picture is a real uploaded photo (not a fallback/placeholder)
const isRealProfilePicture = (profilePicture: string | null | undefined): boolean => {
    if (!profilePicture || profilePicture.trim() === '') return false;
    // Exclude ui-avatars.com and other placeholder services
    if (profilePicture.includes('ui-avatars.com')) return false;
    if (profilePicture.includes('placeholder')) return false;
    return true;
};

export default function AccountLayout({ children }: { children: ReactNode }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const getActiveItem = () => {
        for (const item of navigationItems) {
            if (item.href === '/account') {
                if (pathname === '/account') return item.id;
            } else {
                if (pathname.startsWith(item.href)) return item.id;
            }
        }
        return 'account';
    };

    const activeItem = getActiveItem();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    // Get user initials for avatar
    const getInitials = () => {
        const name = user?.name || user?.email?.split('@')[0] || 'U';
        return name.charAt(0).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
            {/* Decorative background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative py-6 sm:py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    {/* Mobile Navigation */}
                    <div className="lg:hidden mb-6">
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-blue-900/5 border border-white/50 p-4">
                            {/* User Info */}
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                                {isRealProfilePicture(user?.profile_picture) ? (
                                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-blue-500/30 flex-shrink-0">
                                        <Image
                                            src={user!.profile_picture!}
                                            alt={user?.name || 'Profile'}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30 flex-shrink-0">
                                        {getInitials()}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Welcome back!'}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                </div>
                            </div>

                            <select
                                value={activeItem}
                                onChange={(e) => {
                                    const item = navigationItems.find(i => i.id === e.target.value);
                                    if (item) window.location.href = item.href;
                                }}
                                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            >
                                {navigationItems.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6 lg:gap-8">
                        {/* Premium Sidebar */}
                        <aside className="hidden lg:block">
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 overflow-hidden sticky top-24">
                                {/* Gradient Header with User Info */}
                                <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-6">
                                    {/* Decorative pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                                    </div>

                                    <div className="relative flex items-center gap-4">
                                        {isRealProfilePicture(user?.profile_picture) ? (
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-white/30 shadow-lg flex-shrink-0">
                                                <Image
                                                    src={user!.profile_picture!}
                                                    alt={user?.name || 'Profile'}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl ring-4 ring-white/30 shadow-lg flex-shrink-0">
                                                {getInitials()}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-semibold text-lg truncate">{user?.name || 'Welcome!'}</p>
                                            <p className="text-blue-100 text-sm truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation */}
                                <nav className="p-4 space-y-1">
                                    {navigationItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = item.id === activeItem;
                                        return (
                                            <Link
                                                key={item.id}
                                                href={item.href}
                                                className={`group w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive
                                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                <Icon size={18} className={`transition-transform duration-200 ${isActive ? 'text-white' : 'text-blue-500 group-hover:scale-110'}`} />
                                                <span className="flex-1">{item.label}</span>
                                                {isActive && <FiChevronRight size={16} className="opacity-70" />}
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* Logout Button */}
                                <div className="p-4 pt-0">
                                    <div className="border-t border-gray-100 pt-4">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                                        >
                                            <FiLogOut size={18} />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <main className="min-w-0">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}
