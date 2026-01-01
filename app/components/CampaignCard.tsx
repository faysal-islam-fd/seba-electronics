import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar, FiArrowRight } from 'react-icons/fi';

interface CampaignCardProps {
    id: number;
    name: string;
    slug: string;
    image: string;
    startDate?: string;
    endDate?: string;
    productsCount?: number;
}

export default function CampaignCard({
    name,
    slug,
    image,
    endDate,
    productsCount
}: CampaignCardProps) {
    // Calculate days remaining if end date is present
    const getDaysRemaining = () => {
        if (!endDate) return null;
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const daysRemaining = getDaysRemaining();

    return (
        <Link
            href={`/campaign/${slug}`}
            className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full flex flex-col"
        >
            <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

                {/* Days Remaining Badge */}
                {daysRemaining !== null && daysRemaining > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                        Ends in {daysRemaining} days
                    </div>
                )}
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {name}
                </h3>

                <div className="mt-auto flex items-center justify-between">
                    {productsCount !== undefined && (
                        <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                            {productsCount} Items
                        </span>
                    )}

                    <div className="flex items-center gap-1 text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                        View Collection <FiArrowRight />
                    </div>
                </div>
            </div>
        </Link>
    );
}
