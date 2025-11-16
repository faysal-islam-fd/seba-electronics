'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { useAuth } from '@/app/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Login with mobile number
    login(mobileNumber, '');
    
    // Redirect to home
    router.push('/');
    setIsLoading(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Login with email and password
    login(email, password);
    
    // Redirect to home
    router.push('/');
    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    // Handle Google login
    login('google.user@gmail.com', '');
    router.push('/');
  };

  const handleFacebookLogin = () => {
    // Handle Facebook login
    login('facebook.user@facebook.com', '');
    router.push('/');
  };

  const handleEmailLogin = () => {
    setShowEmailLogin(true);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome to Pickaboo!
          </h1>
          <p className="text-xl text-gray-900">Please login.</p>
        </div>

        {/* Login Form */}
        {!showEmailLogin ? (
          <div className="space-y-4">
            {/* Login with Email Button */}
            <button
              onClick={handleEmailLogin}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-gray-300"
            >
              <FiMail size={20} className="text-gray-600" />
              <span>Login with <strong>Email</strong></span>
            </button>

            {/* Or Divider */}
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-600">Or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Mobile Number Input */}
            <form onSubmit={handleMobileSubmit} className="space-y-4">
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Please enter a mobile number"
                required
                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />

              {/* Sign Up/Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 px-4 rounded-lg transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  'Sign Up/Login'
                )}
              </button>
            </form>

            {/* Forgot Password Link */}
            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-gray-700 hover:text-gray-900 hover:underline"
              >
                Forgot Your Password?
              </Link>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {/* Google Login */}
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <FaGoogle className="text-red-500" size={18} />
                <span>Google</span>
              </button>

              {/* Facebook Login */}
              <button
                onClick={handleFacebookLogin}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <FaFacebook size={18} />
                <span>Facebook</span>
              </button>
            </div>
          </div>
        ) : (
          /* Email Login Form */
          <div className="space-y-4">
            {/* Back Button */}
            <button
              onClick={() => setShowEmailLogin(false)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <FiArrowLeft size={20} />
              <span>Back</span>
            </button>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 px-4 rounded-lg transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {/* Forgot Password Link */}
            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-gray-700 hover:text-gray-900 hover:underline"
              >
                Forgot Your Password?
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

