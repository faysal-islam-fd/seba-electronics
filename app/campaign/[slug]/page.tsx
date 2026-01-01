import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getCampaignDetails } from '@/app/lib/api';
import ProductCard from '@/app/components/ProductCard';
import Breadcrumb from '@/app/components/Breadcrumb';
import { isProductInStock } from '@/app/utils/stockUtils';
import { FiClock, FiCalendar } from 'react-icons/fi';

interface CampaignPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function CampaignPage({ params }: CampaignPageProps) {
    const { slug } = await params;
    const data = await getCampaignDetails(slug);

    if (!data || !data.success) {
        notFound();
    }

    const { campaign, products } = data.data;

    // Calculate days remaining
    const getDaysRemaining = () => {
        if (!campaign.end_date) return null;
        const end = new Date(campaign.end_date);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const daysRemaining = getDaysRemaining();

    // Format dates
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Hero Banner Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
                    <Breadcrumb
                        items={[
                            { label: 'Campaigns', href: '/' }, // Maybe should point to a campaigns list if exists
                            { label: campaign.name },
                        ]}
                    />

                    <div className="mt-4 sm:mt-6 relative rounded-2xl overflow-hidden aspect-[3/1] sm:aspect-[4/1] bg-gray-100">
                        {campaign.image ? (
                            <Image
                                src={campaign.image}
                                alt={campaign.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1280px) 100vw, 1280px"
                                priority
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-blue-50 text-blue-200">
                                <span className="text-4xl text-blue-900 font-bold opacity-10">{campaign.name}</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                        <div className="absolute bottom-0 left-0 p-4 sm:p-8 md:p-10 w-full">
                            <div className="max-w-4xl">
                                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 sm:mb-4 drop-shadow-md">
                                    {campaign.name}
                                </h1>

                                <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-white/90">
                                    {!campaign.is_lifetime && daysRemaining !== null && (
                                        <div className="flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold shadow-sm">
                                            <FiClock />
                                            {daysRemaining > 0 ? `Ends in ${daysRemaining} days` : 'Ending Soon'}
                                        </div>
                                    )}

                                    {campaign.start_date && campaign.end_date && (
                                        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                            <FiCalendar />
                                            <span>{formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid Section */}
            <div className="container mx-auto px-3 sm:px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        Featured Products
                        <span className="ml-2 text-sm font-normal text-gray-500">
                            ({products.length} {products.length === 1 ? 'Item' : 'Items'})
                        </span>
                    </h2>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id.toString()}
                                name={product.title}
                                price={product.final_price}
                                originalPrice={product.price !== product.final_price ? product.price : undefined}
                                image={product.thumbnail || '/products/placeholder.jpg'}
                                discount={product.discount > 0 ? Math.round(product.discount) : undefined}
                                badge={product.is_featured ? 'Featured' : undefined}
                                inStock={isProductInStock(product.stock, false)} // Assuming is_out_of_stock is usually redundant if stock > 0
                                shipping_in_dhaka={product.shipping_in_dhaka}
                                shipping_outside_dhaka={product.shipping_outside_dhaka}
                                soldBy={product.brand?.name} // Use brand as seller if no vendor info available in listing
                                type={product.type || 'simple'}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="text-4xl mb-4">🛍️</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
                        <p className="text-gray-500">
                            This campaign typically has products, but none are currently listed.
                            <br />Please check back later!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Enable ISR
export const revalidate = 3600;

export async function generateMetadata({ params }: CampaignPageProps) {
    const { slug } = await params;
    const data = await getCampaignDetails(slug);

    if (!data || !data.success) {
        return {
            title: 'Campaign Not Found',
        };
    }

    const { campaign } = data.data;

    return {
        title: `${campaign.name} | Big Sale`,
        description: `Shop products from ${campaign.name}. Limited time offers!`,
        openGraph: {
            images: [campaign.image],
        },
    };
}
