'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateServiceRequestMutation } from '@/app/store/api/serviceRequestsApi';
import { useGetOrdersQuery, useGetOrderDetailsQuery } from '@/app/store/api/ordersApi';
import { FiLoader, FiArrowLeft, FiUpload, FiX, FiAlertCircle } from 'react-icons/fi';
import Image from 'next/image';

export default function NewServiceRequestPage() {
  const router = useRouter();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(null);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | string | null>(null);
  const [type, setType] = useState<'warranty' | 'repair' | 'other'>('warranty');
  const [description, setDescription] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use ref to prevent double submissions
  const submitInProgress = useRef(false);
  
  const { data: ordersData } = useGetOrdersQuery({ page: 1, per_page: 100 });
  const { data: orderDetailsData } = useGetOrderDetailsQuery(selectedOrderNumber || '', {
    skip: !selectedOrderNumber,
  });
  const [createRequest, { isLoading, error }] = useCreateServiceRequestMutation();

  const orders = ordersData?.data || [];
  const selectedOrder = orders.find(o => o.id === selectedOrderId);
  // Use order details if available, otherwise fall back to order list items
  const orderItems = orderDetailsData?.data?.items || selectedOrder?.items || [];

  // Handle order selection change
  const handleOrderChange = useCallback((orderId: number | null) => {
    setSelectedOrderId(orderId);
    setSelectedOrderItemId(null);
    setSelectedProductId(null);
    if (orderId) {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        setSelectedOrderNumber(order.order_number);
      }
    } else {
      setSelectedOrderNumber(null);
    }
  }, [orders]);

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
    
    // Prevent double submission
    if (submitInProgress.current || isSubmitting || isLoading) {
      console.log('Submission already in progress, ignoring...');
      return;
    }
    
    if (!selectedOrderNumber || !selectedOrderItemId) {
      alert('Please select an order and item');
      return;
    }
    
    if (!description.trim()) {
      alert('Please provide a description');
      return;
    }
    
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert('Please fill in all customer information');
      return;
    }

    // Set submission flags
    submitInProgress.current = true;
    setIsSubmitting(true);

    try {
      const requestData = {
        order_number: selectedOrderNumber,
        order_item_id: selectedOrderItemId,
        type,
        description,
        images: images.length > 0 ? images : undefined,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
      };
      console.log('Creating service request with data:', requestData);
      console.log('Selected order:', selectedOrder);
      console.log('Order items available:', orderItems);
      
      const result = await createRequest(requestData).unwrap();
      
      console.log('Service request created successfully:', result);
      router.push(`/account/service-requests/${result.data.id}`);
    } catch (err: any) {
      console.error('Failed to create service request:', err);
      alert(err?.data?.message || 'Failed to create service request. Please try again.');
      // Reset flags on error so user can try again
      submitInProgress.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/account/service-requests"
            className="w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-200 hover:border-blue-300 rounded-xl text-blue-600 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">New Service Request</h1>
            <p className="text-sm text-gray-600 mt-1">Create a warranty or repair request</p>
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
              onChange={(e) => handleOrderChange(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
              required
              disabled={isSubmitting}
            >
              <option value="">Choose an order...</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.order_number} - {order.items_count} item(s) - ৳ {order.total.toLocaleString()}
                </option>
              ))}
            </select>
            {orders.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No orders found. <Link href="/account/orders" className="text-blue-600 font-semibold">View orders</Link></p>
            )}
          </div>

          {/* Order Item Selection */}
          {selectedOrder && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Product <span className="text-red-500">*</span>
              </label>
              {selectedOrderNumber && !orderDetailsData && (
                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-center gap-3">
                  <FiLoader className="animate-spin text-blue-600" size={20} />
                  <p className="text-sm text-blue-800">Loading order items...</p>
                </div>
              )}
              {orderItems.length > 0 ? (
                <div className="space-y-3">
                  {orderItems.map((item: any, index: number) => {
                    // Debug: Log each item structure
                    console.log(`Item ${index}:`, item, 'Keys:', Object.keys(item));
                    
                    // Handle different item structures:
                    // - Flat structure: product_name, product_image, product_id (from order details)
                    // - Nested structure: product.title, product.thumbnail, product.id (from order list)
                    const productTitle = item.product_name || item.product?.title || item.title || item.name || 'Product';
                    const productThumbnail = item.product_image || item.product?.thumbnail || item.thumbnail || item.image || '/products/placeholder.jpg';
                    const itemPrice = item.price || item.unit_price || 0;
                    const itemQuantity = item.quantity || 1;
                    
                    // The order_item_id is the actual ID of the order-product relationship record
                    // Try multiple possible field names
                    const itemId = item.order_item_id || item.id || item.item_id || item.pivot?.id || item.product_id || index + 1;
                    
                    console.log(`Item ${index} - Using ID:`, itemId, 'from fields:', {
                      order_item_id: item.order_item_id,
                      id: item.id,
                      item_id: item.item_id,
                      product_id: item.product_id,
                      pivot_id: item.pivot?.id
                    });
                    
                    // Get product_id separately (always available from API)
                    const productId = item.product_id || item.product?.id;
                    
                    return (
                      <div
                        key={`${itemId}-${index}`}
                        onClick={() => {
                          console.log('Selected item:', { itemId, productId, item });
                          setSelectedOrderItemId(itemId);
                          setSelectedProductId(productId);
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedOrderItemId === itemId
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                            <Image
                              src={productThumbnail}
                              alt={productTitle}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/products/placeholder.jpg';
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">{productTitle}</h3>
                            <p className="text-sm text-gray-600">Quantity: {itemQuantity}</p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">৳ {itemPrice.toLocaleString()}</p>
                            <p className="text-xs text-gray-400 mt-1">ID: {itemId}</p>
                            {selectedOrderItemId === itemId && (
                              <p className="text-xs text-blue-600 mt-1 font-medium">✓ Selected</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : selectedOrderNumber && orderDetailsData && orderItems.length === 0 ? (
                <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-800">
                    No items found for this order. Please make sure the order has items before creating a service request.
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {/* Request Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Request Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['warranty', 'repair', 'other'] as const).map((reqType) => (
                <button
                  key={reqType}
                  type="button"
                  onClick={() => setType(reqType)}
                  className={`px-4 py-3 rounded-xl border-2 font-semibold transition-all ${
                    type === reqType
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {reqType.charAt(0).toUpperCase() + reqType.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Issue Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue with your product..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={6}
              required
            />
          </div>

          {/* Customer Information */}
          <div className="space-y-4 pt-4 border-t-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="01700000000"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Your complete address..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Attach Images (Optional, Max 5)
            </label>
            <div className="space-y-4">
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
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
                  {(error as any)?.data?.message || 'Failed to create service request. Please try again.'}
                </p>
              </div>
            </div>
          )}

          {/* Validation Status */}
          {(!selectedOrderNumber || !selectedOrderItemId) && (
            <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl flex items-start gap-3">
              <FiAlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Please complete the following:</p>
                <ul className="list-disc list-inside space-y-1">
                  {!selectedOrderNumber && <li>Select an order</li>}
                  {selectedOrderNumber && !selectedOrderItemId && <li>Select a product from the order (click on a product card above)</li>}
                </ul>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
            <Link
              href="/account/service-requests"
              className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all duration-200 shadow-sm hover:shadow-md text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading || isSubmitting || !selectedOrderNumber || !selectedOrderItemId}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-bold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-sm"
              title={
                !selectedOrderId
                  ? 'Please select an order'
                  : !selectedOrderItemId
                  ? 'Please select a product from the order'
                  : ''
              }
            >
              {(isLoading || isSubmitting) ? (
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

