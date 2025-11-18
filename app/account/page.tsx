'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
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
  FiHelpCircle,
  FiShield,
} from 'react-icons/fi';

const navigationItems = [
  { id: 'account', label: 'Account Information', icon: FiUser, href: '/account' },
  { id: 'orders', label: 'My Orders', icon: FiShoppingBag, href: '/account/orders' },
  { id: 'reviews', label: 'My Product Reviews', icon: FiStar, href: '/account/reviews' },
  { id: 'tickets', label: 'Support Tickets', icon: FiMessageSquare, href: '/account/tickets' },
  { id: 'club', label: 'Pickaboo Club', icon: FiAward, href: '/account/club' },
  { id: 'share', label: 'Share & Earn', icon: FiShare2, href: '/account/share' },
  { id: 'addresses', label: 'Manage Addresses', icon: FiMapPin, href: '/account/addresses' },
  { id: 'payments', label: 'Saved Payment Methods', icon: FiCreditCard, href: '/account/payments' },
  { id: 'help', label: 'Help & Knowledge Base', icon: FiHelpCircle, href: '/account/help' },
] as const;

const securityItems = [
  { label: 'Email', value: 'faysalislamfd@gmail.com', action: 'Change email address', link: '/account/change-email' },
  { label: 'Password', value: '********', action: 'Change password', link: '/account/change-password' },
];

const recentOrders = [
  {
    id: '#PO-103984',
    date: '14 Nov 2024',
    items: 'Philips Mixer Grinder + JBL Wave Flex',
    total: '৳ 14,980',
    status: 'Delivered',
    image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?w=300&h=300&fit=crop',
  },
  {
    id: '#PO-103712',
    date: '02 Nov 2024',
    items: 'Casio G-Shock Watch',
    total: '৳ 9,990',
    status: 'Shipped',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=300&fit=crop',
  },
];

const savedAddresses = [
  {
    label: 'Home',
    detail: 'House 19, Road 12, Dhanmondi, Dhaka',
    contact: '+880 1788-123456',
  },
  {
    label: 'Office',
    detail: 'Level 7, Silver Water Tower, Tejgaon, Dhaka',
    contact: '+880 1999-223344',
  },
];

const paymentMethods = [
  { type: 'VISA', masked: '**** **** **** 9321', expiry: '08/27', isPrimary: true },
  { type: 'bKash', masked: '+8801******87', isPrimary: false },
];

export default function AccountPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

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
    { label: 'First Name', value: parsedName.firstName },
    { label: 'Last Name', value: parsedName.lastName || 'Not set' },
    { label: 'Contact Number', value: '+880 1XXXXXXXXX' },
    { label: 'Date of Birth', value: 'Tap to add date' },
    { label: 'Gender', value: 'Prefer not to say' },
    { label: 'Location', value: 'Dhaka, Bangladesh' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
                  <p className="text-sm text-gray-500">Basic details associated with your Pickaboo profile.</p>
                </div>
                <button className="px-5 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-colors">
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                {infoRows.map((row) => (
                  <div key={row.label}>
                    <p className="text-xs uppercase tracking-wide text-gray-400">{row.label}</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FiShield />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Account Security</h3>
                  <p className="text-sm text-gray-500">Manage your login credentials and keep your account safe.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {securityItems.map((item) => (
                  <div key={item.label} className="border border-gray-200 rounded-xl px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-gray-400">{item.label}</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{item.value}</p>
                    <Link href={item.link} className="text-blue-600 text-sm font-semibold mt-2 inline-block">
                      {item.action}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      case 'orders':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                  <p className="text-sm text-gray-500">Quick overview of your last purchases.</p>
                </div>
                <Link href="/account/orders" className="text-blue-600 text-sm font-semibold">
                  View all orders
                </Link>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row gap-4 border border-gray-100 rounded-xl p-4">
                    <div className="w-full sm:w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={order.image} alt={order.items} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <span className="font-semibold text-gray-900">{order.id}</span>
                        <span>•</span>
                        <span>{order.date}</span>
                      </div>
                      <p className="text-gray-900 font-medium mt-1">{order.items}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                        <span className="text-gray-600">Total: <span className="font-semibold text-gray-900">{order.total}</span></span>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="text-blue-600 text-sm font-semibold">Track order</button>
                      <button className="text-gray-500 text-sm font-semibold">Need help?</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        );
      case 'addresses':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Saved Addresses</h4>
                    <p className="text-sm text-gray-500">Delivery spots you frequently use.</p>
                  </div>
                  <button className="text-blue-600 text-sm font-semibold">Add new</button>
                </div>
                <div className="space-y-3">
                  {savedAddresses.map((address) => (
                    <div key={address.label} className="border border-gray-100 rounded-xl p-4">
                      <p className="text-sm font-semibold text-gray-900">{address.label}</p>
                      <p className="text-sm text-gray-600 mt-1">{address.detail}</p>
                      <p className="text-sm text-gray-500 mt-1">{address.contact}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Payment Methods</h4>
                    <p className="text-sm text-gray-500">Manage cards, wallets and EMI options.</p>
                  </div>
                  <button className="text-blue-600 text-sm font-semibold">Add method</button>
                </div>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div key={method.masked} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{method.type}</p>
                        <p className="text-sm text-gray-600">{method.masked}</p>
                        {method.expiry && (
                          <p className="text-xs text-gray-500 mt-1">Expiry {method.expiry}</p>
                        )}
                      </div>
                      {method.isPrimary && (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
          </div>
        );
      case 'help':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500">Need help?</p>
                <h4 className="text-lg font-semibold text-gray-900 mt-1">Pickaboo Support Center</h4>
                <p className="text-sm text-gray-600 mt-2">
                  Chat with customer success, manage returns and replacements, or browse FAQs.
                </p>
                <div className="flex flex-wrap gap-3 mt-3">
                  <button className="text-blue-600 text-sm font-semibold">Chat with us</button>
                  <button className="text-gray-600 text-sm font-semibold">Create ticket</button>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500">Pickaboo Club</p>
                <h4 className="text-lg font-semibold text-gray-900 mt-1">Earn & redeem rewards</h4>
                <p className="text-sm text-gray-600 mt-2">
                  Collect club points and redeem exclusive vouchers on electronics, lifestyle and more.
                </p>
                <button className="mt-3 text-blue-600 text-sm font-semibold">Explore benefits</button>
              </div>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-sm text-gray-500">
            Coming soon.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
          {/* Sidebar */}
          <aside className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-fit">
            <div className="mb-6">
              <p className="text-sm text-gray-500">Logged in as</p>
              <p className="text-lg font-semibold text-gray-900 break-all">{user?.email}</p>
            </div>
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === activeTab;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-white' : 'text-blue-500'} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <section className="space-y-6">
            {renderContent()}
          </section>
        </div>
      </div>
    </div>
  );
}
