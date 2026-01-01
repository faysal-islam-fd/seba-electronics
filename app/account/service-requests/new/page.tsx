'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateServiceRequestMutation } from '@/app/store/api/serviceRequestsApi';
import { useGetOrdersQuery, useGetOrderDetailsQuery } from '@/app/store/api/ordersApi';
import { useAlert } from '@/app/context/AlertContext';
import { FiLoader, FiArrowLeft, FiUpload, FiX, FiAlertCircle } from 'react-icons/fi';
import Image from 'next/image';

export default function NewServiceRequestPage() {
  const router = useRouter();
  const { showError, showWarning } = useAlert();
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(null);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<number | null>(null);
  const [type, setType] = useState<'warranty' | 'repair' | 'other'>('warranty');
  const [reason, setReason] = useState<'defective' | 'wrong_item' | 'not_as_described' | 'damaged' | 'changed_mind' | 'other'>('defective');
  const [description, setDescription] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [refundMethod, setRefundMethod] = useState<'original' | 'store_credit' | 'bank_transfer'>('original');
  const [refundAccountInfo, setRefundAccountInfo] = useState('');
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
  const selectedOrder = orders.find(o => o.order_number === selectedOrderNumber);
  const orderItems = orderDetailsData?.data?.items || selectedOrder?.items || [];

  // Handle order selection change
  const handleOrderChange = useCallback((orderNumber: string | null) => {
    setSelectedOrderNumber(orderNumber);
    setSelectedOrderItemId(null);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      showWarning('Maximum 5 images allowed', 'Image Limit Reached');
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

      return;
    }

    if (!selectedOrderNumber) {
      showWarning('Please select an order', 'Order Required');
      return;
    }

    if (!selectedOrderItemId) {
      showWarning('Please select a product for service request', 'Item Required');
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      showWarning('Please provide a detailed description (at least 10 characters)', 'Description Required');
      return;
    }

    if (!customerName.trim()) {
      showWarning('Please provide your name', 'Name Required');
      return;
    }

    if (!customerPhone.trim()) {
      showWarning('Please provide your phone number', 'Phone Required');
      return;
    }

    // Validate phone format (Bangladesh phone: 11 digits, starts with 01)
    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(customerPhone.trim())) {
      showWarning('Please provide a valid Bangladesh phone number (11 digits, starting with 01)', 'Invalid Phone');
      return;
    }

    if (!customerAddress.trim()) {
      showWarning('Please provide your address', 'Address Required');
      return;
    }

    if (refundMethod === 'bank_transfer' && !refundAccountInfo.trim()) {
      showWarning('Please provide bank account information for bank transfer refund', 'Account Information Required');
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
        reason,
        description: description.trim(),
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_address: customerAddress.trim(),
        images: images.length > 0 ? images : undefined,
        refund_method: refundMethod,
        refund_account_info: refundMethod === 'bank_transfer' ? refundAccountInfo.trim() : undefined,
      };


      const result = await createRequest(requestData).unwrap();


      router.push(`/account/service-requests/${result.data.id}`);
    } catch (err: any) {
      console.error('Failed to create service request:', err);
      showError(err?.data?.message || 'Failed to create service request. Please try again.', 'Request Failed');
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
            <p className="text-sm text-gray-600 mt-1">Submit a service request for an order</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-6 md:p-8 space-y-6">
          {/* Order Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Order <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedOrderNumber || ''}
              onChange={(e) => handleOrderChange(e.target.value || null)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
              required
              disabled={isSubmitting}
            >
              <option value="">Choose an order...</option>
              {orders.map((order) => (
                <option key={order.order_number} value={order.order_number}>
                  {order.order_number} - {order.items_count} item(s) - ৳ {order.total.toLocaleString()}
                </option>
              ))}
            </select>
            {orders.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No orders found. <Link href="/account/orders" className="text-blue-600 font-semibold">View orders</Link></p>
            )}
          </div>

          {/* Request Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['warranty', 'repair', 'other'] as const).map((reqType) => (
                <button
                  key={reqType}
                  type="button"
                  onClick={() => setType(reqType)}
                  className={`px-4 py-3 rounded-xl border-2 font-semibold transition-all ${type === reqType
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {reqType.charAt(0).toUpperCase() + reqType.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Order Item Selection - Always show for selecting which product needs service */}
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



                    return (
                      <div
                        key={`${itemId}-${index}`}
                        onClick={() => {

                          setSelectedOrderItemId(itemId);
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedOrderItemId === itemId
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

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Return Reason <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as typeof reason)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
              required
              disabled={isSubmitting}
            >
              <option value="defective">Defective</option>
              <option value="wrong_item">Wrong Item</option>
              <option value="not_as_described">Not as Described</option>
              <option value="damaged">Damaged</option>
              <option value="changed_mind">Changed Mind</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Detailed Description <span className="text-red-500">*</span>
              {description.length > 0 && (
                <span className={`ml-2 text-xs ${description.trim().length < 10 ? 'text-red-500' : 'text-green-600'}`}>
                  ({description.trim().length}/10 minimum)
                </span>
              )}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide a detailed explanation of the return reason (minimum 10 characters)..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={6}
              required
              minLength={10}
            />
            {description.trim().length > 0 && description.trim().length < 10 && (
              <p className="text-sm text-red-600 mt-1">Description must be at least 10 characters long</p>
            )}
          </div>

          {/* Customer Information */}
          <div className="space-y-4 pt-4 border-t-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Customer Information</h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
                {customerPhone && (
                  <span className={`ml-2 text-xs ${/^01[0-9]{9}$/.test(customerPhone.trim()) ? 'text-green-600' : 'text-red-500'}`}>
                    {/^01[0-9]{9}$/.test(customerPhone.trim()) ? '✓ Valid' : '✗ Invalid format'}
                  </span>
                )}
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="01XXXXXXXXX (11 digits)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                pattern="^01[0-9]{9}$"
              />
              <p className="text-xs text-gray-500 mt-1">Enter Bangladesh phone number (11 digits, starting with 01)</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Enter your full address (house/flat, road, area, city)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Refund Method */}
          <div className="space-y-4 pt-4 border-t-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Refund Information</h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Refund Method <span className="text-red-500">*</span>
              </label>
              <select
                value={refundMethod}
                onChange={(e) => {
                  setRefundMethod(e.target.value as typeof refundMethod);
                  if (e.target.value !== 'bank_transfer') {
                    setRefundAccountInfo('');
                  }
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                required
                disabled={isSubmitting}
              >
                <option value="original">Original Payment Method</option>
                <option value="store_credit">Store Credit</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            {/* Bank Account Info - Only show if refund_method is bank_transfer */}
            {refundMethod === 'bank_transfer' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bank Account Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={refundAccountInfo}
                  onChange={(e) => setRefundAccountInfo(e.target.value)}
                  placeholder="Enter your bank account number, bank name, branch name, and account holder name..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                  required
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
          {(!selectedOrderNumber ||
            !selectedOrderItemId ||
            description.trim().length < 10 ||
            !customerName.trim() ||
            !customerPhone.trim() ||
            !/^01[0-9]{9}$/.test(customerPhone.trim()) ||
            !customerAddress.trim() ||
            (refundMethod === 'bank_transfer' && !refundAccountInfo.trim())) && (
              <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl flex items-start gap-3">
                <FiAlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">Please complete the following:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {!selectedOrderNumber && <li>Select an order</li>}
                    {!selectedOrderItemId && <li>Select a product from the order (click on a product card above)</li>}
                    {description.trim().length < 10 && <li>Provide a detailed description (at least 10 characters)</li>}
                    {!customerName.trim() && <li>Enter your name</li>}
                    {!customerPhone.trim() && <li>Enter your phone number</li>}
                    {customerPhone.trim() && !/^01[0-9]{9}$/.test(customerPhone.trim()) && <li>Enter a valid Bangladesh phone number (11 digits, starting with 01)</li>}
                    {!customerAddress.trim() && <li>Enter your address</li>}
                    {refundMethod === 'bank_transfer' && !refundAccountInfo.trim() && <li>Provide bank account information for bank transfer refund</li>}
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
              disabled={
                isLoading ||
                isSubmitting ||
                !selectedOrderNumber ||
                !selectedOrderItemId ||
                description.trim().length < 10 ||
                !customerName.trim() ||
                !customerPhone.trim() ||
                !/^01[0-9]{9}$/.test(customerPhone.trim()) ||
                !customerAddress.trim() ||
                (refundMethod === 'bank_transfer' && !refundAccountInfo.trim())
              }
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-bold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-sm"
              title={
                !selectedOrderNumber
                  ? 'Please select an order'
                  : !selectedOrderItemId
                    ? 'Please select a product from the order'
                    : description.trim().length < 10
                      ? 'Please provide a detailed description (at least 10 characters)'
                      : !customerName.trim()
                        ? 'Please enter your name'
                        : !customerPhone.trim()
                          ? 'Please enter your phone number'
                          : !/^01[0-9]{9}$/.test(customerPhone.trim())
                            ? 'Please enter a valid phone number'
                            : !customerAddress.trim()
                              ? 'Please enter your address'
                              : refundMethod === 'bank_transfer' && !refundAccountInfo.trim()
                                ? 'Please provide bank account information'
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

