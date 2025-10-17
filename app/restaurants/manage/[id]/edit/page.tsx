// Restaurant editing page for partners

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import RestaurantForm from '@/components/restaurants/manage/RestaurantForm';
import { mockRestaurants } from '@/lib/mockData';
import { Restaurant } from '@/types';

interface EditRestaurantPageProps {
  params: Promise<{ id: string }>;
}

export default function EditRestaurantPage({ params }: EditRestaurantPageProps) {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    params.then(({ id }) => {
      const foundRestaurant = mockRestaurants.find((r) => r.id === id);
      if (foundRestaurant) {
        setRestaurant(foundRestaurant);
      }
    });
  }, [params]);

  if (restaurant === null) {
    return null;
  }

  const handleSubmit = async (data: Partial<Restaurant>) => {
    setIsLoading(true);

    // Mock API call for Phase 1
    setTimeout(() => {
      console.log('Restaurant updated:', { id: restaurant.id, ...data });
      // In Phase 2, this will call: await fetch(`/api/restaurants/${restaurant.id}`, { method: 'PUT', ... })
      alert('Restaurant updated successfully!');
      router.push('/restaurants/manage');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Restaurant</h1>
            <p className="text-gray-600">Update your restaurant information and details</p>
          </div>

          <RestaurantForm
            initialData={restaurant}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitLabel="Update Restaurant"
          />
        </div>
      </div>
    </div>
  );
}