'use client';

import Link from 'next/link';

const orders = [
  {
    id: '#PO-103984',
    date: '14 Nov 2024',
    items: 'Philips Mixer Grinder + JBL Wave Flex',
    total: '৳ 14,980',
    status: 'Delivered',
    image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?w=300&h=300&fit=crop',
    payment: 'Paid via bKash',
    delivery: 'Delivered on 16 Nov 2024',
  },
  {
    id: '#PO-103712',
    date: '02 Nov 2024',
    items: 'Casio G-Shock Watch',
    total: '৳ 9,990',
    status: 'Shipped',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=300&fit=crop',
    payment: 'Cash on Delivery',
    delivery: 'Estimated delivery: 05 Nov 2024',
  },
  {
    id: '#PO-103388',
    date: '18 Oct 2024',
    items: 'Samsung 43" UHD TV',
    total: '৳ 52,990',
    status: 'Processing',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300&h=300&fit=crop',
    payment: 'EMI via Visa',
    delivery: 'We will notify you once shipped',
  },
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] py-8">
      <div className="container mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-500">Track the status of your recent purchases.</p>
          </div>
          <Link
            href="/account"
            className="text-blue-600 text-sm font-semibold"
          >
            Back to account
          </Link>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-28 h-28 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={order.image} alt={order.items} className="object-cover w-full h-full" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">{order.id}</span>
                    <span>•</span>
                    <span>{order.date}</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{order.items}</p>
                  <p className="text-sm text-gray-600">{order.payment}</p>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-gray-600 text-sm">
                      Total <span className="font-semibold text-gray-900">{order.total}</span>
                    </p>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'Delivered'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'Shipped'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{order.delivery}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="text-blue-600 text-sm font-semibold">Track order</button>
                <button className="text-gray-600 text-sm font-semibold">Need help?</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

