// Main navigation component with authentication-aware menu
// {process.env.NODE_ENV === 'development' && (...)} is for testing auth state in Phase 1, we can remove it later.

// Navigation with real authentication state

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-orange-600">
              Grab A Food
            </Link>
            <div className="flex items-center space-x-6">
              <div className="text-gray-400">Loading...</div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-orange-600">
            Grab A Food
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/restaurants"
              className={`hover:text-orange-600 transition-colors ${
                isActive('/restaurants') ? 'text-orange-600 font-semibold' : 'text-gray-700'
              }`}
            >
              Restaurants
            </Link>

            {user ? (
              <>
                <Link
                  href="/profile"
                  className={`hover:text-orange-600 transition-colors ${
                    isActive('/profile') ? 'text-orange-600 font-semibold' : 'text-gray-700'
                  }`}
                >
                  Profile
                </Link>
                {user.role === 'partner' && (
                  <Link
                    href="/restaurants/manage"
                    className={`hover:text-orange-600 transition-colors ${
                      pathname.startsWith('/restaurants/manage')
                        ? 'text-orange-600 font-semibold'
                        : 'text-gray-700'
                    }`}
                  >
                    Manage
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-orange-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`hover:text-orange-600 transition-colors ${
                    isActive('/login') ? 'text-orange-600 font-semibold' : 'text-gray-700'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}