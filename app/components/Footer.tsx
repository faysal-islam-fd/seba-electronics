import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { getCategories } from '@/app/lib/api';

export default async function Footer() {
  // Fetch categories dynamically - same as left sidebar on home page
  const categoriesData = await getCategories(true);
  const categories = categoriesData.success ? categoriesData.data : [];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-8 sm:mt-12 md:mt-16">
      {/* Main Footer */}
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-10">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-base sm:text-lg md:text-xl font-extrabold mb-4 sm:mb-5 md:mb-6 flex items-center gap-1.5 sm:gap-2">
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 w-0.5 sm:w-1 h-4 sm:h-5 md:h-6 rounded"></span>
              ABOUT
            </h3>
            <ul className="space-y-2 sm:space-y-2.5 md:space-y-3">
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-1.5 sm:group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-300"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/why-shop" className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-1.5 sm:group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-300"></span>
                  Why Shop With Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-1.5 sm:group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-300"></span>
                  Careers
                </Link>
              </li> 
              <li>
                <Link href="/blog" className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-1.5 sm:group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-300"></span>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-white text-base sm:text-lg md:text-xl font-extrabold mb-4 sm:mb-5 md:mb-6 flex items-center gap-1.5 sm:gap-2">
              <span className="bg-gradient-to-r from-purple-500 to-purple-600 w-0.5 sm:w-1 h-4 sm:h-5 md:h-6 rounded"></span>
              POLICIES
            </h3>
            <ul className="space-y-2 sm:space-y-2.5 md:space-y-3">
              <li>
                <Link href="/terms" className="hover:text-purple-400 transition-colors duration-300 flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-1.5 sm:group-hover:w-2 h-0.5 bg-purple-400 transition-all duration-300"></span>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-purple-400 transition-colors duration-300 flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-1.5 sm:group-hover:w-2 h-0.5 bg-purple-400 transition-all duration-300"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-purple-400 transition-colors duration-300 flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-1.5 sm:group-hover:w-2 h-0.5 bg-purple-400 transition-all duration-300"></span>
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-purple-400 transition-colors duration-300 flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-1.5 sm:group-hover:w-2 h-0.5 bg-purple-400 transition-all duration-300"></span>
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-purple-400 transition-colors duration-300 flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-1.5 sm:group-hover:w-2 h-0.5 bg-purple-400 transition-all duration-300"></span>
                  Warranty Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-base sm:text-lg md:text-xl font-extrabold mb-4 sm:mb-5 md:mb-6 flex items-center gap-1.5 sm:gap-2">
              <span className="bg-gradient-to-r from-green-500 to-green-600 w-0.5 sm:w-1 h-4 sm:h-5 md:h-6 rounded"></span>
              CUSTOMER SERVICE
            </h3>
            <ul className="space-y-2 sm:space-y-2.5 md:space-y-3">
              <li>
                <Link href="/support" className="hover:text-green-400 transition-colors duration-300 flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-1.5 sm:group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                  Customer Support
                </Link>
              </li>
              <li>
                <Link href="/payments" className="hover:text-green-400 transition-colors duration-300 flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-1.5 sm:group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-green-400 transition-colors duration-300 flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-1.5 sm:group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-green-400 transition-colors duration-300 flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-1.5 sm:group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-green-400 transition-colors duration-300 flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-1.5 sm:group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-base sm:text-lg md:text-xl font-extrabold mb-4 sm:mb-5 md:mb-6 flex items-center gap-1.5 sm:gap-2">
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 w-0.5 sm:w-1 h-4 sm:h-5 md:h-6 rounded"></span>
              CATEGORIES
            </h3>
            <ul className="space-y-2 sm:space-y-2.5 md:space-y-3">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.id}>
                    <Link 
                      href={`/category/${category.slug}`} 
                      className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base"
                    >
                      <span className="w-0 group-hover:w-1.5 sm:group-hover:w-2 h-0.5 bg-amber-400 transition-all duration-300"></span>
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                // Fallback categories if API fails
                <>
                  <li>
                    <Link href="/category/laptops" className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base">
                      <span className="w-0 group-hover:w-1.5 sm:group-hover:w-2 h-0.5 bg-amber-400 transition-all duration-300"></span>
                      Laptops
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/desktops" className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base">
                      <span className="w-0 group-hover:w-1.5 sm:group-hover:w-2 h-0.5 bg-amber-400 transition-all duration-300"></span>
                      Desktops
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/components" className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base">
                      <span className="w-0 group-hover:w-1.5 sm:group-hover:w-2 h-0.5 bg-amber-400 transition-all duration-300"></span>
                      Components
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/monitors" className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base">
                      <span className="w-0 group-hover:w-1.5 sm:group-hover:w-2 h-0.5 bg-amber-400 transition-all duration-300"></span>
                      Monitors
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/accessories" className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-1.5 sm:gap-2 group text-sm sm:text-base">
                      <span className="w-0 group-hover:w-1.5 sm:group-hover:w-2 h-0.5 bg-amber-400 transition-all duration-300"></span>
                      Accessories
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-white text-base sm:text-lg md:text-xl font-extrabold mb-4 sm:mb-5 md:mb-6 flex items-center gap-1.5 sm:gap-2">
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 w-0.5 sm:w-1 h-4 sm:h-5 md:h-6 rounded"></span>
              CONTACT US
            </h3>
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <p className="flex items-center gap-2 sm:gap-3 group hover:text-white transition-colors cursor-pointer">
                <FiPhone className="text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0" size={16} />
                <span className="font-medium text-sm sm:text-base">+880 1898-805555</span>
              </p>
              <p className="flex items-center gap-2 sm:gap-3 group hover:text-white transition-colors cursor-pointer">
                <FiMail className="text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0" size={16} />
                <span className="font-medium text-sm sm:text-base break-all">support@shebaelectronics.co</span>
              </p>
              <p className="flex items-center gap-2 sm:gap-3 group hover:text-white transition-colors cursor-pointer">
                <FiMapPin className="text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0" size={16} />
                <span className="font-medium text-sm sm:text-base">Dhaka, Bangladesh</span>
              </p>
            </div>
            <h4 className="text-white font-bold mb-3 sm:mb-4 text-xs sm:text-sm tracking-wider">FOLLOW US</h4>
            <div className="flex gap-2 sm:gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-blue-600 p-2 sm:p-2.5 md:p-3 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <FaFacebook size={16} className="sm:w-5 sm:h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-blue-400 p-2 sm:p-2.5 md:p-3 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <FaTwitter size={16} className="sm:w-5 sm:h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-pink-600 p-2 sm:p-2.5 md:p-3 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <FaInstagram size={16} className="sm:w-5 sm:h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-red-600 p-2 sm:p-2.5 md:p-3 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <FaYoutube size={16} className="sm:w-5 sm:h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-blue-700 p-2 sm:p-2.5 md:p-3 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <FaLinkedin size={16} className="sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-5 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <p className="text-gray-400 font-medium text-center md:text-left">&copy; 2025 Sheba Electronics. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
