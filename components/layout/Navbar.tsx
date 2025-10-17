// Main navigation component with authentication-aware menu
// {process.env.NODE_ENV === 'development' && (...)} is for testing auth state in Phase 1, we can remove it later.

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Mock auth state for Phase 1

  const isActive = (path: string) => pathname === path;

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
              className={`hover:text-blue-600 transition-colors ${
                isActive('/restaurants') ? 'text-orange-600 font-semibold' : 'text-gray-700'
              }`}
            >
              Restaurants
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className={`hover:text-orange-600 transition-colors ${
                    isActive('/profile') ? 'text-orange-600 font-semibold' : 'text-gray-700'
                  }`}
                >
                  Profile
                </Link>
                <Link
                  href="/restaurants/manage"
                  className={`hover:text-orange-600 transition-colors ${
                    isActive('/restaurants/manage') ? 'text-orange-600 font-semibold' : 'text-gray-700'
                  }`}
                >
                  Manage
                </Link>
                <button
                  onClick={() => setIsAuthenticated(false)}
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
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <button onClick={() => setIsAuthenticated(!isAuthenticated)} className="font-semibold">
            {isAuthenticated ? '🔓 Logout (Test)' : '🔒 Login (Test)'}
          </button>
        </div>
      )}
    </nav>
  );
}