// Detailed restaurant information component

import { Restaurant } from '@/types';

interface RestaurantDetailProps {
  restaurant: Restaurant;
}

export default function RestaurantDetail({ restaurant }: RestaurantDetailProps) {
  const priceSymbols = '$'.repeat(restaurant.priceRange);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="h-96 overflow-hidden">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{restaurant.name}</h1>
            <p className="text-xl text-gray-600">{restaurant.cuisine}</p>
          </div>
          <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-lg">
            <svg className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="ml-2 text-xl font-semibold">{restaurant.rating}</span>
          </div>
        </div>

        <p className="text-gray-600 text-lg mb-6">{restaurant.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Address</h3>
            <p className="text-gray-800">{restaurant.address}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Price Range</h3>
            <p className="text-gray-800 text-xl">{priceSymbols}</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Menu</h2>
          <p className="text-gray-600">
            Menu items will be displayed here in Phase 2 when backend integration is complete.
          </p>
        </div>
      </div>
    </div>
  );
}