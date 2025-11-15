import Link from 'next/link';
import Image from 'next/image';

export default function EMIBanner() {
  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md overflow-hidden my-8">
      <div className="flex flex-col md:flex-row items-center justify-between p-6 text-white">
        <div className="flex-1 mb-4 md:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 text-xs font-semibold px-2 py-1 rounded">Sponsored</span>
          </div>
          <h3 className="text-xl font-bold mb-1">0% EMI for up to 6 months with Pickaboo X EBL Card</h3>
          <p className="text-sm text-green-50">Apply now and get instant approval</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Mastercard Logo Placeholder */}
          <div className="bg-white rounded-lg p-3 hidden md:block">
            <div className="w-12 h-8 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">MC</span>
            </div>
          </div>
          
          <Link
            href="/apply-emi"
            className="bg-white text-green-600 font-semibold px-6 py-3 rounded-lg hover:bg-green-50 transition-colors whitespace-nowrap"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
}

