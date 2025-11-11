import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-16">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-xl font-extrabold mb-6 flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 w-1 h-6 rounded"></span>
              ABOUT
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-300"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-300"></span>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-300"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-300"></span>
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-300"></span>
                  Warranty Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-xl font-extrabold mb-6 flex items-center gap-2">
              <span className="bg-gradient-to-r from-green-500 to-green-600 w-1 h-6 rounded"></span>
              CUSTOMER SERVICE
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="hover:text-green-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-green-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-green-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/payment-methods" className="hover:text-green-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-green-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                  Delivery Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-xl font-extrabold mb-6 flex items-center gap-2">
              <span className="bg-gradient-to-r from-purple-500 to-purple-600 w-1 h-6 rounded"></span>
              CATEGORIES
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/category/laptops" className="hover:text-purple-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-purple-400 transition-all duration-300"></span>
                  Laptops
                </Link>
              </li>
              <li>
                <Link href="/category/desktops" className="hover:text-purple-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-purple-400 transition-all duration-300"></span>
                  Desktops
                </Link>
              </li>
              <li>
                <Link href="/category/components" className="hover:text-purple-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-purple-400 transition-all duration-300"></span>
                  Components
                </Link>
              </li>
              <li>
                <Link href="/category/monitors" className="hover:text-purple-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-purple-400 transition-all duration-300"></span>
                  Monitors
                </Link>
              </li>
              <li>
                <Link href="/category/accessories" className="hover:text-purple-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-purple-400 transition-all duration-300"></span>
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-white text-xl font-extrabold mb-6 flex items-center gap-2">
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 w-1 h-6 rounded"></span>
              CONTACT US
            </h3>
            <div className="space-y-4 mb-8">
              <p className="flex items-center gap-3 group hover:text-white transition-colors cursor-pointer">
                <FiPhone className="text-blue-400 group-hover:scale-110 transition-transform" size={18} />
                <span className="font-medium">+880 1234-567890</span>
              </p>
              <p className="flex items-center gap-3 group hover:text-white transition-colors cursor-pointer">
                <FiMail className="text-blue-400 group-hover:scale-110 transition-transform" size={18} />
                <span className="font-medium">info@pickaboo.com</span>
              </p>
              <p className="flex items-center gap-3 group hover:text-white transition-colors cursor-pointer">
                <FiMapPin className="text-blue-400 group-hover:scale-110 transition-transform" size={18} />
                <span className="font-medium">123 Tech Street, Dhaka 1212</span>
              </p>
            </div>
            <h4 className="text-white font-bold mb-4 text-sm tracking-wider">FOLLOW US</h4>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-blue-600 p-3 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-blue-400 p-3 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-pink-600 p-3 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <FaInstagram size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-red-600 p-3 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <FaYoutube size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-blue-700 p-3 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="text-gray-400 font-medium">&copy; 2025 Pickaboo. All rights reserved.</p>
            <p className="text-gray-500 mt-2 md:mt-0">
              Powered by <span className="text-blue-400 font-semibold">Next.js</span> | Designed with <span className="text-red-500">❤</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

