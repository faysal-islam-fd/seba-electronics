'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateReturnRequestMutation } from '@/app/store/api/returnRequestsApi';
import { useGetOrdersQuery } from '@/app/store/api/ordersApi';
import { FiRefreshCw, FiLoader, FiArrowLeft, FiUpload, FiX, FiAlertCircle } from 'react-icons/fi';
import Image from 'next/image';

export default function NewReturnRequestPage() {
  const router = useRouter();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<number | null>(null);
  const [type, setType] = useState<'single_item' | 'full_order'>('single_item');
  const [reason, setReason] = useState<'defective' | 'wrong_item' | 'damaged' | 'not_as_described' | 'other'>('defective');
  const [description, setDescription] = useState('');
  const [refundMethod, setRefundMethod] = useState<'original' | 'bank_transfer' | 'wallet'>('original');
  const [refundAccountInfo, setRefundAccountInfo] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const { data: ordersData } = useGetOrdersQuery({ page: 1, per_page: 100 });
  const [createRequest, { isLoading, error }] = useCreateReturnRequestMutation();

  const orders = ordersData?.data || [];
  const selectedOrder = orders.find(o => o.id === selectedOrderId);
  const orderItems = selectedOrder?.items || [];

  useEffect(() => {
    // Reset order item when order changes
    setSelectedOrderItemId(null);
  }, [selectedOrderId]);

  useEffect(() => {
    // Clear account info when refund method changes to original
    if (refundMethod === 'original') {
      setRefundAccountInfo('');
    }
  }, [refundMethod]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    
    const newImages = [...images, ...files];
    setImages(newImages);
    
    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
    // Revoke object URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrderId || !selectedOrderItemId) {
      alert('Please select an order and item');
      return;
    }
    
    if (!description.trim()) {
      alert('Please provide a description');
      return;
    }
    
    if (refundMethod === 'bank_transfer' && !refundAccountInfo.trim()) {
      alert('Please provide bank account information for bank transfer refund');
      return;
    }

    try {
      const result = await createRequest({
        order_id: selectedOrderId,
        order_item_id: selectedOrderItemId,
        type,
        reason,
        description,
        images: images.length > 0 ? images : undefined,
        refund_method: refundMethod,
        refund_account_info: refundMethod === 'bank_transfer' ? refundAccountInfo : undefined,
      }).unwrap();
      
      router.push(`/account/return-requests/${result.data.id}`);
    } catch (err: any) {
      console.error('Failed to create return request:', err);
      alert(err?.data?.message || 'Failed to create return request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/account/return-requests"
            className="w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-200 hover:border-rose-300 rounded-xl text-rose-600 hover:text-rose-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">New Return Request</h1>
            <p className="text-sm text-gray-600 mt-1">Request a return and refund for your product</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-6 md:p-8 space-y-6">
          {/* Order Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Order <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedOrderId || ''}
              onChange={(e) => setSelectedOrderId(parseInt(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-medium"
              required
            >
              <option value="">Choose an order...</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.order_number} - {order.items_count} item(s) - ৳ {order.total.toLocaleString()}
                </option>
              ))}
            </select>
            {orders.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No orders found. <Link href="/account/orders" className="text-rose-600 font-semibold">View orders</Link></p>
            )}
          </div>

          {/* Order Item Selection */}
          {selectedOrder && orderItems.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Product <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedOrderItemId(item.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedOrderItemId === item.id
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                        <Image
                          src={item.product.thumbnail || '/products/placeholder.jpg'}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{item.product.title}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">৳ {item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Return Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Return Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['single_item', 'full_order'] as const).map((reqType) => (
                <button
                  key={reqType}
                  type="button"
                  onClick={() => setType(reqType)}
                  className={`px-4 py-3 rounded-xl border-2 font-semibold transition-all ${
                    type === reqType
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {reqType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Return Reason */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Return Reason <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-medium"
              required
            >
              <option value="defective">Defective</option>
              <option value="wrong_item">Wrong Item</option>
              <option value="damaged">Damaged</option>
              <option value="not_as_described">Not as Described</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe why you want to return this product..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none"
              rows={6}
              required
            />
          </div>

          {/* Refund Method */}
          <div className="space-y-4 pt-4 border-t-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Refund Method</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                How would you like to receive your refund? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['original', 'bank_transfer', 'wallet'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setRefundMethod(method)}
                    className={`px-4 py-3 rounded-xl border-2 font-semibold transition-all ${
                      refundMethod === method
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {method.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {refundMethod === 'bank_transfer' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bank Account Information <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={refundAccountInfo}
                  onChange={(e) => setRefundAccountInfo(e.target.value)}
                  placeholder="Bank name, account number, account holder name..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none"
                  rows={3}
                  required={refundMethod === 'bank_transfer'}
                />
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Attach Images (Optional, Max 5)
            </label>
            <div className="space-y-4">
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-rose-400 hover:bg-rose-50 transition-colors">
                <div className="text-center">
                  <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-sm text-gray-600">Click to upload images</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={images.length >= 5}
                />
              </label>
              
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
              <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-700 mt-1">
                  {(error as any)?.data?.message || 'Failed to create return request. Please try again.'}
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
            <Link
              href="/account/return-requests"
              className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all duration-200 shadow-sm hover:shadow-md text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading || !selectedOrderId || !selectedOrderItemId}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-bold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <FiLoader className="animate-spin" size={18} />
                  Creating...
                </span>
              ) : (
                'Create Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

