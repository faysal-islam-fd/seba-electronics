'use client';

import { useGetComparisonListQuery, useRemoveFromCompareMutation, useClearComparisonListMutation } from '@/app/store/api/compareApi';
import Image from 'next/image';
import Link from 'next/link';
import { FiTrash2, FiX, FiShoppingCart, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';
import { encodeId } from '@/app/utils/encryption';
import { useToast } from '@/app/context/ToastContext';
import ProductCardSkeleton from '@/app/components/ProductCardSkeleton';
import { normalizeImageUrl } from '@/app/utils/imageUtils';
import { getPlaceholderImage } from '@/app/utils/imagePlaceholder';

export default function ComparePage() {
    const { data: comparisonData, isLoading } = useGetComparisonListQuery();
    const [removeFromCompare] = useRemoveFromCompareMutation();
    const [clearComparisonList] = useClearComparisonListMutation();
    const { addToCart } = useCart();
    const router = useRouter();
    const { showSuccess, showError } = useToast();

    const products = comparisonData?.data || [];

    const handleRemove = async (id: number) => {
        try {
            await removeFromCompare(id).unwrap();
            showSuccess('Product removed from comparison');
        } catch (error) {
            showError('Failed to remove product');
        }
    };

    const handleClear = async () => {
        try {
            await clearComparisonList().unwrap();
            showSuccess('Comparison list cleared');
        } catch (error) {
            showError('Failed to clear comparison list');
        }
    };

    const getProductPrice = (product: any, type: 'price' | 'final_price') => {
        if (product[type] !== null && product[type] !== undefined) {
            const price = parseFloat(product[type]);
            if (!isNaN(price)) return price;
        }
        if (product.attributes && product.attributes.length > 0) {
            const attrPrice = parseFloat(product.attributes[0][type]);
            if (!isNaN(attrPrice)) return attrPrice;
        }
        return 0;
    };

    const isVariableProduct = (product: any) => {
        return product.attributes && product.attributes.length > 0;
    };

    const handleAddToCart = (product: any) => {
        if (isVariableProduct(product)) {
            router.push(`/product/${encodeId(product.id)}`);
            return;
        }

        const price = getProductPrice(product, 'final_price');
        const originalPrice = getProductPrice(product, 'price');

        if (price <= 0) {
            router.push(`/product/${encodeId(product.id)}`);
            return;
        }

        addToCart({
            id: product.id.toString(),
            name: product.title,
            image: normalizeImageUrl(product.thumbnail_image || getPlaceholderImage(product.category?.toLowerCase() || 'product')),
            seller: product.brand || 'Official Store',
            price: price,
            originalPrice: originalPrice,
            quantity: 1,
            product_id: product.id,
        });
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Compare Products</h1>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform duration-300">
                        <FiRefreshCw size={36} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No products to compare</h2>
                    <p className="text-gray-500 mb-8">Add products to your comparison list to see them side by side.</p>
                    <Link href="/" className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg hover:shadow-blue-200">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const allSpecGroups = Array.from(new Set(products.flatMap(p => p.specifications ? p.specifications.map((s: any) => s.group) : [])));
    const allWarrantyGroups = Array.from(new Set(products.flatMap(p => p.warranties ? p.warranties.map((w: any) => w.group) : [])));

    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            <div className="container mx-auto px-2 sm:px-4 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
                    <div>
                        <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Product Comparison</h1>
                        <p className="text-xs sm:text-base text-gray-500 mt-1">{products.length} items</p>
                    </div>
                    <button
                        onClick={handleClear}
                        className="text-xs sm:text-sm flex items-center gap-2 text-red-600 bg-white border border-red-100 font-medium px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
                    >
                        <FiTrash2 size={16} />
                        <span>Clear List</span>
                    </button>
                </div>

                {/* Mobile/Desktop Responsive Table Wrapper */}
                <div className="relative rounded-xl sm:rounded-2xl bg-white shadow-lg border border-gray-100 flex flex-col max-h-[80vh] sm:max-h-none overflow-hidden">
                    <div className="overflow-auto custom-scrollbar relative bg-white">
                        <table className="w-full min-w-max border-separate border-spacing-0">
                            <thead className="bg-white">
                                <tr>
                                    {/* Top Left Corner - Sticky to both top and left */}
                                    <th className="p-3 sm:p-6 text-left w-24 sm:w-64 min-w-[100px] sm:min-w-[200px] bg-white border-b border-r border-gray-100 sticky left-0 top-0 z-40 shadow-sm align-bottom">
                                        <span className="text-[10px] sm:text-sm font-semibold text-gray-400 uppercase tracking-wider block pt-20 sm:pt-0">Details</span>
                                    </th>

                                    {/* Product Headers - Sticky to top */}
                                    {products.map(product => (
                                        <th key={product.id} className="p-3 sm:p-6 min-w-[140px] w-[140px] sm:min-w-[280px] sm:w-[280px] border-b border-gray-100 align-top relative group bg-white sticky top-0 z-30">
                                            <button
                                                onClick={() => handleRemove(product.id)}
                                                className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 z-50 bg-white shadow-sm sm:shadow-none border sm:border-none border-gray-100"
                                                title="Remove"
                                            >
                                                <FiX size={14} className="sm:w-5 sm:h-5" />
                                            </button>

                                            <div className="flex flex-col h-full items-center sm:items-stretch">
                                                <div className="relative w-16 h-16 sm:w-32 sm:h-32 mb-2 sm:mb-4 bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden">
                                                    <Image
                                                        src={normalizeImageUrl(product.thumbnail_image || getPlaceholderImage(product.category?.toLowerCase() || 'product'))}
                                                        alt={product.title}
                                                        fill
                                                        className="object-contain p-1 sm:p-4"
                                                        unoptimized
                                                    />
                                                </div>

                                                <div className="flex-1 flex flex-col w-full">
                                                    <Link href={`/product/${encodeId(product.id)}`} className="text-[10px] sm:text-base font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 mb-1 sm:mb-2 transition-colors text-center sm:text-left h-8 sm:h-auto leading-tight">
                                                        {product.title}
                                                    </Link>

                                                    <div className="mt-auto pt-1 sm:pt-2 space-y-2 sm:space-y-3 w-full">
                                                        <div className="flex flex-col items-center sm:items-start">
                                                            {getProductPrice(product, 'final_price') > 0 ? (
                                                                <>
                                                                    <span className="text-sm sm:text-xl font-bold text-blue-600">
                                                                        ৳{getProductPrice(product, 'final_price').toLocaleString()}
                                                                    </span>
                                                                    {getProductPrice(product, 'price') > getProductPrice(product, 'final_price') && (
                                                                        <span className="text-[9px] sm:text-sm text-gray-400 line-through">
                                                                            ৳{getProductPrice(product, 'price').toLocaleString()}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span className="text-xs sm:text-lg font-bold text-gray-400">Price Varies</span>
                                                            )}
                                                        </div>

                                                        <button
                                                            onClick={() => handleAddToCart(product)}
                                                            className={`w-full py-1.5 sm:py-2.5 rounded-md sm:rounded-lg text-[10px] sm:text-sm font-semibold flex items-center justify-center gap-1 sm:gap-2 transition-all shadow-sm ${isVariableProduct(product)
                                                                ? 'bg-white border sm:border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                                                                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                                                                }`}
                                                        >
                                                            <FiShoppingCart size={12} className="sm:w-4 sm:h-4" />
                                                            <span className="truncate">{isVariableProduct(product) ? 'Select' : 'Add'}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {/* Basic Info Row - Brand & Category */}
                                <tr className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="p-2 sm:p-4 text-[10px] sm:text-base font-semibold text-gray-700 bg-gray-50/95 sticky left-0 z-20 border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Brand</td>
                                    {products.map(product => (
                                        <td key={product.id} className="p-2 sm:p-4 text-center text-gray-600 font-medium text-[10px] sm:text-base bg-white">{product.brand || '-'}</td>
                                    ))}
                                </tr>
                                <tr className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="p-2 sm:p-4 text-[10px] sm:text-base font-semibold text-gray-700 bg-gray-50/95 sticky left-0 z-20 border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Category</td>
                                    {products.map(product => (
                                        <td key={product.id} className="p-2 sm:p-4 text-center text-gray-600 font-medium text-[10px] sm:text-base bg-white">{product.category || '-'}</td>
                                    ))}
                                </tr>

                                {/* Specifications Section */}
                                {allSpecGroups.length > 0 && (
                                    <tr>
                                        <td colSpan={products.length + 1} className="bg-gray-100 p-2 sm:p-3 font-bold text-gray-800 sticky left-0 z-10 text-center uppercase text-[10px] sm:text-xs tracking-wider border-y border-gray-200">
                                            Technical Specifications
                                        </td>
                                    </tr>
                                )}
                                {allSpecGroups.map(group => (
                                    <tr key={group} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="p-2 sm:p-4 text-[10px] sm:text-sm font-semibold text-gray-700 bg-gray-50/95 sticky left-0 z-20 border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] break-words">
                                            {group}
                                        </td>
                                        {products.map(product => {
                                            const spec = product.specifications?.find((s: any) => s.group === group);
                                            return (
                                                <td key={product.id} className="p-2 sm:p-4 text-center text-gray-600 text-[10px] sm:text-sm bg-white">
                                                    {spec ? spec.value : <span className="text-gray-300">-</span>}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}

                                {/* Warranty Section */}
                                {allWarrantyGroups.length > 0 && (
                                    <tr>
                                        <td colSpan={products.length + 1} className="bg-gray-100 p-2 sm:p-3 font-bold text-gray-800 sticky left-0 z-10 text-center uppercase text-[10px] sm:text-xs tracking-wider border-y border-gray-200">
                                            Warranty Information
                                        </td>
                                    </tr>
                                )}
                                {allWarrantyGroups.map(group => (
                                    <tr key={group} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="p-2 sm:p-4 text-[10px] sm:text-sm font-semibold text-gray-700 bg-gray-50/95 sticky left-0 z-20 border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] break-words">
                                            {group}
                                        </td>
                                        {products.map(product => {
                                            const warranty = product.warranties?.find((w: any) => w.group === group);
                                            return (
                                                <td key={product.id} className="p-2 sm:p-4 text-center text-gray-600 text-[10px] sm:text-sm bg-white">
                                                    {warranty ? (
                                                        <div className="flex flex-col gap-0.5 sm:gap-1 items-center">
                                                            <span className="font-medium text-gray-900 bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[10px] sm:text-xs inline-block whitespace-nowrap">
                                                                {warranty.duration}
                                                            </span>
                                                            {warranty.description && (
                                                                <span className="text-[9px] sm:text-xs text-gray-500 leading-tight max-w-[120px] sm:max-w-[200px] block line-clamp-2">
                                                                    {warranty.description}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : <span className="text-gray-300">-</span>}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty Specifications/Warranty Fallback */}
                    {allSpecGroups.length === 0 && allWarrantyGroups.length === 0 && (
                        <div className="p-8 text-center text-gray-500 border-t border-gray-100">
                            <FiAlertCircle className="mx-auto mb-2 text-gray-300" size={24} />
                            <p>No detailed specifications available for comparison.</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 6px;
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-corner {
                    background: transparent;
                }
            `}</style>
        </div>
    );
}
