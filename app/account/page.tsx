'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { FiShield, FiMail, FiLock, FiChevronRight, FiUser, FiPhone, FiCalendar, FiMapPin, FiCreditCard, FiEdit3 } from 'react-icons/fi';

export default function AccountPage() {
  const { user } = useAuth();

  const parsedName = useMemo(() => {
    const display = user?.name || user?.email?.split('@')[0] || 'Pickaboo User';
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
    { label: 'Contact Number', value: '+880 1XXXXXXXXX', icon: FiPhone },
    { label: 'Date of Birth', value: 'Tap to add date', icon: FiCalendar },
    { label: 'Location', value: 'Dhaka, Bangladesh', icon: FiMapPin },
  ];

  const securityItems = [
    {
      label: 'Email Address',
      value: user?.email || 'Not set',
      description: 'Used for login and notifications',
      action: 'Change',
      link: '/account/change-email',
      icon: FiMail,
      color: 'blue'
    },
    {
      label: 'Password',
      value: '••••••••',
      description: 'Last changed 30 days ago',
      action: 'Update',
      link: '/account/change-password',
      icon: FiLock,
      color: 'violet'
    },
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

      {/* Security Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-blue-900/5 border border-white/50 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <FiShield className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
              <p className="text-sm text-gray-500">Keep your account safe and secure</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {securityItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="group relative p-5 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color === 'blue' ? 'from-blue-500 to-indigo-500' : 'from-violet-500 to-purple-500'
                      } flex items-center justify-center shadow-lg ${item.color === 'blue' ? 'shadow-blue-500/25' : 'shadow-violet-500/25'
                      }`}>
                      <Icon className="text-white" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{item.label}</p>
                      <p className="text-base font-semibold text-gray-900 mt-1 truncate">{item.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                    </div>
                  </div>
                  <Link
                    href={item.link}
                    className="absolute top-5 right-5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 shadow-sm"
                  >
                    {item.action}
                    <FiChevronRight size={12} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/account/orders"
          className="group p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <FiShield className="text-white" size={18} />
            </div>
            <span className="text-sm font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">My Orders</span>
          </div>
          <p className="text-xs text-gray-500">Track and manage your purchases</p>
        </Link>

        <Link
          href="/account/addresses"
          className="group p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <FiMapPin className="text-white" size={18} />
            </div>
            <span className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">Addresses</span>
          </div>
          <p className="text-xs text-gray-500">Manage your delivery locations</p>
        </Link>

        <Link
          href="/account/payments"
          className="group p-5 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <FiCreditCard className="text-white" size={18} />
            </div>
            <span className="text-sm font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">Payment Methods</span>
          </div>
          <p className="text-xs text-gray-500">Manage cards and wallets</p>
        </Link>
      </div>
    </div>
  );
}