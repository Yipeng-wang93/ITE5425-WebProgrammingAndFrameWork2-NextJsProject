// Restaurant card for partner dashboard with API integration

import Link from 'next/link';
import { useState } from 'react';
import { Restaurant } from '@/types';
import Button from '@/components/ui/Button';

interface PartnerRestaurantCardProps {
  restaurant: Restaurant;
  onUpdate: () => void;
}

export default function PartnerRestaurantCard({ restaurant, onUpdate }: PartnerRestaurantCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const priceSymbols = '$'.repeat(restaurant.priceRange);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${restaurant.name}? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/restaurants/${restaurant.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        onUpdate();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete restaurant');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete restaurant. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img
          src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
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

        <div className="space-y-2">
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
            <Button 
              variant="danger" 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="px-3"
            >
              {isDeleting ? '...' : 'Delete'}
            </Button>
          </div>
          <Link href={`/restaurants/manage/${restaurant.id}/menu`} className="block">
            <Button variant="secondary" className="w-full">
              🍽️ Manage Menu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}