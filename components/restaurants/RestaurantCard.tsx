// Card component for displaying restaurant summary in list views

import Link from 'next/link';
import { Restaurant } from '@/types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const priceSymbols = '$'.repeat(restaurant.priceRange);

  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        <div className="h-48 overflow-hidden flex-shrink-0">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-800 line-clamp-1 flex-1 mr-2">{restaurant.name}</h3>
            <div className="flex items-center flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span className="ml-1 text-gray-600">{restaurant.rating}</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-2">{restaurant.cuisine}</p>
          <p className="text-gray-500 text-sm mb-3 line-clamp-2 flex-grow">{restaurant.description}</p>

          <div className="flex justify-between items-center mt-auto">
            <span className="text-gray-600">{priceSymbols}</span>
            <span className="text-sm text-gray-500 truncate ml-2">{restaurant.address.split(',')[0]}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}