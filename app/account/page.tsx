'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { FiUser, FiPhone, FiEdit3, FiMail, FiStar } from 'react-icons/fi';

export default function AccountPage() {
  const { user } = useAuth();

  const parsedName = useMemo(() => {
    const display = user?.name || user?.email?.split('@')[0] || 'Sheba User';
    const [first, ...rest] = display.split(' ');
    const last = rest.join(' ');
    return {
      firstName: first,
      lastName: last || '',
    };
  }, [user]);

  const infoRows = [
    { label: 'First Name', value: parsedName.firstName, icon: FiUser },
    { label: 'Last Name', value: parsedName.lastName || 'Not set', icon: FiUser },
    { label: 'Email Address', value: user?.email || 'Not set', icon: FiMail },
    { label: 'Contact Number', value: user?.phone_number || 'Not set', icon: FiPhone },
  ];


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
          <p className="text-gray-500 mt-1">Manage your personal information and security</p>
        </div>
      </div>

      {/* Profile Information Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-blue-900/5 border border-white/50 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <FiUser className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                <p className="text-sm text-gray-500">Your basic profile details</p>
              </div>
            </div>
            <Link
              href="/account/profile"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30"
            >
              <FiEdit3 size={14} />
              Edit Profile
            </Link>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {infoRows.map((row) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.label}
                  className="group p-4 rounded-xl bg-gray-50/50 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 border border-transparent hover:border-blue-100 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0 group-hover:shadow-md transition-shadow">
                      <Icon size={14} className="text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{row.label}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">{row.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Club Points Card */}
      <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-2xl shadow-lg shadow-orange-900/5 border border-orange-100 overflow-hidden">
        <div className="p-6 border-b border-orange-100/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <FiStar className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Club Points</h2>
                <p className="text-sm text-gray-600">Your rewards balance</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Available Points</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {user?.club_points?.toLocaleString() || '0'}
                </span>
                <span className="text-lg font-semibold text-gray-500">pts</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500 mb-1">Worth</p>
              <p className="text-2xl font-bold text-green-600">
                ৳{(user?.club_points || 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-orange-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">💡</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">How to use your points</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Redeem your club points at checkout to get instant discounts. Each point equals ৳1 off your order!
                </p>
              </div>
            </div>
          </div>

          {(user?.club_points || 0) > 0 && (
            <div className="mt-4">
              <Link
                href="/checkout"
                className="block w-full text-center px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl font-semibold shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40 transition-all duration-200"
              >
                Use Points at Checkout
              </Link>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}