// Home page with hero section and featured restaurants

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import { Restaurant } from '@/types';

export default function Home() {
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeaturedRestaurants();
  }, []);

  const fetchFeaturedRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/restaurants?sortBy=rating');
      
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }

      const data = await response.json();
      // Get top 3 highest rated restaurants
      setFeaturedRestaurants(data.restaurants.slice(0, 3));
      setError('');
    } catch (err: any) {
      console.error('Error fetching restaurants:', err);
      setError('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Discover Your Next Favorite Restaurant</h1>
          <p className="text-xl mb-8">Browse, order, and enjoy delicious meals from local restaurants</p>
          <Link
            href="/restaurants"
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Explore Restaurants
          </Link>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Restaurants</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-gray-600">Loading restaurants...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchFeaturedRestaurants}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : featuredRestaurants.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Restaurants Yet</h3>
            <p className="text-gray-600 mb-4">Be the first to add a restaurant!</p>
            <Link
              href="/restaurants/manage/new"
              className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Add Restaurant
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/restaurants"
                className="text-orange-600 hover:text-orange-800 font-semibold"
              >
                View All Restaurants →
              </Link>
            </div>
          </>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Restaurants</h3>
              <p className="text-gray-600">Explore a wide variety of local restaurants and cuisines</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Place Your Order</h3>
              <p className="text-gray-600">Choose your favorite dishes and customize your order</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Your Meal</h3>
              <p className="text-gray-600">Track your order and enjoy delicious food delivered to you</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}