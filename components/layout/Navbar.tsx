// Navigation bar with authentication and cart

'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/Cartcontext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const router = useRouter();
  const cartItemCount = getCartItemCount();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-orange-600">FoodDelivery</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/restaurants" 
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              Restaurants
            </Link>
            
            {/* Partner Links */}
            {user?.role === 'partner' && (
              <>
                <Link 
                  href="/restaurants/manage" 
                  className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
                >
                  My Restaurants
                </Link>
                <Link 
                  href="/restaurants/manage/orders" 
                  className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
                >
                  Orders
                </Link>
              </>
            )}

            {/* Customer Order History Link */}
            {user?.role === 'customer' && (
              <Link 
                href="/orders" 
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                My Orders
              </Link>
            )}
          </div>

          {/* Right Side - Auth & Cart */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon - Only for customers or non-logged users */}
            {(!user || user.role === 'customer') && (
              <Link 
                href="/checkout" 
                className="relative text-gray-700 hover:text-orange-600 transition-colors"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/profile" 
                  className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
                >
                  {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu (Optional - you can expand this) */}
      <div className="md:hidden px-4 pb-4">
        <Link 
          href="/restaurants" 
          className="block py-2 text-gray-700 hover:text-orange-600 font-medium"
        >
          Restaurants
        </Link>
        
        {/* Partner Links */}
        {user?.role === 'partner' && (
          <>
            <Link 
              href="/restaurants/manage" 
              className="block py-2 text-gray-700 hover:text-orange-600 font-medium"
            >
              My Restaurants
            </Link>
            <Link 
              href="/restaurants/manage/orders" 
              className="block py-2 text-gray-700 hover:text-orange-600 font-medium"
            >
              Orders
            </Link>
          </>
        )}

        {/* Customer Order History Link */}
        {user?.role === 'customer' && (
          <Link 
            href="/orders" 
            className="block py-2 text-gray-700 hover:text-orange-600 font-medium"
          >
            My Orders
          </Link>
        )}
      </div>
    </nav>
  );
}