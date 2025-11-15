// Component to display user's order history

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  imageUrl?: string;
}

interface Order {
  _id: string;
  restaurantId: Restaurant;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  specialInstructions?: string;
  createdAt: string;
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      preparing: 'bg-purple-100 text-purple-800 border-purple-300',
      ready: 'bg-green-100 text-green-800 border-green-300',
      delivered: 'bg-gray-100 text-gray-800 border-gray-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      ready: 'Ready',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return texts[status] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center py-12">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Orders</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet. Start exploring restaurants!
          </p>
          <Link
            href="/restaurants"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div className="flex items-start gap-4 mb-4 md:mb-0">
                {order.restaurantId.imageUrl && (
                  <img
                    src={order.restaurantId.imageUrl}
                    alt={order.restaurantId.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {order.restaurantId.name}
                  </h3>
                  <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                  <p className="text-sm text-gray-500 mt-1">Order ID: {order._id.slice(-8)}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
                <p className="text-xl font-bold text-orange-600">
                  ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="border-t pt-4 mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Items Ordered:</p>
              <div className="space-y-1">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm text-gray-600">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/orders/${order._id}`}
                className="flex-1 min-w-[150px] text-center bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                View Details
              </Link>
              {order.status === 'delivered' && (
                <Link
                  href={`/restaurants/${order.restaurantId._id}`}
                  className="flex-1 min-w-[150px] text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Order Again
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}