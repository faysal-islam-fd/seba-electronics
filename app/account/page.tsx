'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { 
  FiUser, 
  FiShoppingBag, 
  FiStar, 
  FiMessageSquare, 
  FiAward, 
  FiShare2, 
  FiMapPin, 
  FiCreditCard,
  FiHelpCircle 
} from 'react-icons/fi';

export default function AccountPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account-info');
  
  // Extract name parts from user email/name
  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  const [firstName, lastName] = displayName.includes(' ') 
    ? displayName.split(' ', 2) 
    : [displayName, ''];
  
  const [userInfo] = useState({
    firstName: firstName,
    lastName: lastName,
    phone: '',
    dateOfBirth: '',
    gender: 'None',
    email: user?.email || '',
  });

  const menuItems = [
    { id: 'account-info', icon: FiUser, label: 'Account Information', href: '/account' },
    { id: 'orders', icon: FiShoppingBag, label: 'My Orders', href: '/account/orders' },
    { id: 'reviews', icon: FiStar, label: 'My Product Reviews', href: '/account/reviews' },
    { id: 'tickets', icon: FiMessageSquare, label: 'Support Tickets', href: '/account/tickets' },
    { id: 'club', icon: FiAward, label: 'Pickaboo Club', href: '/account/club' },
    { id: 'share', icon: FiShare2, label: 'Share & Earn', href: '/account/share' },
    { id: 'addresses', icon: FiMapPin, label: 'Manage Addresses', href: '/account/addresses' },
    { id: 'payment', icon: FiCreditCard, label: 'Saved Payment Methods', href: '/account/payment' },
    { id: 'help', icon: FiHelpCircle, label: 'Help & Knowledge Base', href: '/account/help' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">My Account</h2>
              
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.id === activeTab;
                  
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(item.id);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 space-y-6">
            {/* Account Information Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Account Information</h2>
                <button className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    First Name
                  </label>
                  <div className="text-gray-900">{userInfo.firstName}</div>
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Last Name
                  </label>
                  <div className="text-gray-900">{userInfo.lastName}</div>
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Contact Number
                  </label>
                  <div className="text-gray-400">
                    {userInfo.phone || 'Enter your number'}
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Date of Birth
                  </label>
                  <div className="text-gray-400">
                    {userInfo.dateOfBirth || 'Enter your birthday'}
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Gender
                  </label>
                  <div className="text-gray-900">{userInfo.gender}</div>
                </div>
              </div>
            </div>

            {/* Account Security Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account Security</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email
                  </label>
                  <div className="text-gray-900 mb-2">{userInfo.email}</div>
                  <Link 
                    href="/account/change-email"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                  >
                    Change email address
                  </Link>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Password
                  </label>
                  <div className="text-gray-900 mb-2">••••••••</div>
                  <Link 
                    href="/account/change-password"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                  >
                    Change password
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

