// Component for partners to view and manage orders for their restaurants
// PARTNER ONLY

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

interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface Order {
  _id: string;
  restaurantId: Restaurant;
  userId: Customer;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  phone: string;
  specialInstructions?: string;
  createdAt: string;
}

export default function RestaurantOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending'); // Default to pending orders
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' 
        ? '/api/restaurants/orders'
        : `/api/restaurants/orders?status=${statusFilter}`;
        
      const response = await fetch(url, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch restaurant orders');
      }

      const data = await response.json();
      setOrders(data.orders);
      if (data.restaurants) {
        setRestaurants(data.restaurants);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Refresh orders after successful update
      await fetchOrders();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update order status');
    }
  };

  // Filter orders by selected restaurant
  const filteredOrders = selectedRestaurant === 'all'
    ? orders
    : orders.filter(order => order.restaurantId._id === selectedRestaurant);

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
            <p className="mt-4 text-gray-600">Loading orders...</p>
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

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4">
        {/* Restaurant Filter - Always visible */}
        {restaurants.length > 0 && (
          <div className="mb-4 pb-4 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Restaurant
            </label>
            <select
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Restaurants ({orders.length})</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant._id} value={restaurant._id}>
                  {restaurant.name} ({orders.filter(o => o.restaurantId._id === restaurant._id).length})
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {['pending', 'confirmed', 'preparing', 'ready', 'all', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status === 'pending' && ' ⚠️'}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {statusFilter === 'all' ? 'No Orders Yet' : `No ${statusFilter} Orders`}
              </h3>
              <p className="text-gray-600 mb-6">
                {statusFilter === 'all' 
                  ? "You haven't received any orders yet. Make sure your restaurant is active and visible!"
                  : `No orders with status "${statusFilter}" found. Try selecting a different filter.`
                }
              </p>
              {statusFilter !== 'all' && (
                <button
                  onClick={() => setStatusFilter('all')}
                  className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors mr-3"
                >
                  View All Orders
                </button>
              )}
              <Link
                href="/restaurants/manage"
                className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Manage Restaurants
              </Link>
            </div>
          </div>
        ) : (
          filteredOrders.map((order) => (
          <div
            key={order._id}
            className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
              order.status === 'pending' ? 'border-2 border-yellow-400' : ''
            }`}
          >
            {/* Order Header */}
            <div className="flex justify-between items-start mb-4 pb-4 border-b">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {order.restaurantId.name}
                </h3>
                <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                <p className="text-xs text-gray-500 font-mono mt-1">Order #{order._id.slice(-8)}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <p className="text-2xl font-bold text-orange-600 mt-2">
                  ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-3">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-sm font-semibold text-blue-900">Customer Information</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-blue-700 font-medium mb-1">Name</p>
                  <p className="text-sm text-blue-900 font-semibold">{order.userId.name}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-700 font-medium mb-1">Phone</p>
                  <p className="text-sm text-blue-900 font-semibold">{order.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-blue-700 font-medium mb-1">Delivery Address</p>
                  <p className="text-sm text-blue-900">{order.deliveryAddress}</p>
                </div>
                {order.specialInstructions && (
                  <div className="md:col-span-2 bg-blue-100 rounded p-2 mt-1">
                    <p className="text-xs text-blue-700 font-medium mb-1">⚠️ Special Instructions</p>
                    <p className="text-sm text-blue-900 font-medium italic">{order.specialInstructions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Order Items</p>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-900">
                      <span className="inline-block bg-orange-100 text-orange-800 font-bold px-2 py-1 rounded mr-2 text-xs">
                        {item.quantity}x
                      </span>
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-700 font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-orange-600">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {/* Status Update Buttons */}
              {order.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateOrderStatus(order._id, 'confirmed')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    ✓ Confirm Order
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel this order?')) {
                        updateOrderStatus(order._id, 'cancelled');
                      }
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    ✗ Cancel
                  </button>
                </div>
              )}
              
              {order.status === 'confirmed' && (
                <button
                  onClick={() => updateOrderStatus(order._id, 'preparing')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  👨‍🍳 Start Preparing
                </button>
              )}
              
              {order.status === 'preparing' && (
                <button
                  onClick={() => updateOrderStatus(order._id, 'ready')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  ✓ Mark as Ready
                </button>
              )}
              
              {order.status === 'ready' && (
                <button
                  onClick={() => updateOrderStatus(order._id, 'delivered')}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  🚚 Mark as Delivered
                </button>
              )}
              
              {/* View Details Button */}
              <Link
                href={`/orders/${order._id}`}
                className="block text-center bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                📋 View Full Details
              </Link>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
}