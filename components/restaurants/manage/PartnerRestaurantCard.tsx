// Restaurant card for partner dashboard with management actions

import Link from 'next/link';
import { Restaurant } from '@/types';
import Button from '@/components/ui/Button';

interface PartnerRestaurantCardProps {
  restaurant: Restaurant;
  onDelete?: (id: string) => void;
}

export default function PartnerRestaurantCard({ restaurant, onDelete }: PartnerRestaurantCardProps) {
  const priceSymbols = '$'.repeat(restaurant.priceRange);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{restaurant.name}</h3>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="ml-1 text-gray-600">{restaurant.rating}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-2">{restaurant.cuisine} • {priceSymbols}</p>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{restaurant.description}</p>

        <div className="flex gap-2">
          <Link href={`/restaurants/manage/${restaurant.id}/edit`} className="flex-1">
            <Button variant="primary" className="w-full">
              Edit
            </Button>
          </Link>
          <Link href={`/restaurants/${restaurant.id}`} className="flex-1">
            <Button variant="secondary" className="w-full">
              View
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}