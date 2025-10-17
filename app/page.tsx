// Home page with hero section and featured restaurants

import Link from 'next/link';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import { mockRestaurants } from '@/lib/mockData';

export default function Home() {
  const featuredRestaurants = mockRestaurants.slice(0, 3);

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
