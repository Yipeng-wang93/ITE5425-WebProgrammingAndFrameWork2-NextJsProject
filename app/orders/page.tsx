// Customer order history page

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import OrderHistory from '@/components/orders/orderhistory';

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }

    // Redirect partners to their restaurant orders page
    if (user && user.role === 'partner') {
      router.push('/restaurants/manage/orders');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Only customers should see this page
  if (user.role !== 'customer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-orange-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-gray-600">
            View and track all your food delivery orders
          </p>
        </div>

        {/* Order History Component */}
        <OrderHistory />
      </div>
    </div>
  );
}
