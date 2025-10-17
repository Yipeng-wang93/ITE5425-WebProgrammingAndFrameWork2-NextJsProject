// Restaurant creation page for partners

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RestaurantForm from '@/components/restaurants/manage/RestaurantForm';
import { Restaurant } from '@/types';
import { mockCurrentPartnerId } from '@/lib/mockData';

export default function NewRestaurantPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: Partial<Restaurant>) => {
    setIsLoading(true);

    // Mock API call for Phase 1
    setTimeout(() => {
        const newRestaurant = {
            ...data,
            ownerUserId: mockCurrentPartnerId, // Assign current partner as owner
            id: Date.now().toString(), // Generate temporary ID for Phase 1
            rating: 0, // New restaurants start with no rating
        };
            console.log('Restaurant created:', newRestaurant);
            // In Phase 2, this will call: await fetch('/api/restaurants', { method: 'POST', ... })
            alert('Restaurant created successfully!');
            router.push('/restaurants/manage');
            setIsLoading(false);
        }, 1000);
};

  return (
    <div className="min-h-screen bg-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Restaurant</h1>
            <p className="text-gray-600">
              Create a new restaurant profile to start managing your business on our platform
            </p>
          </div>

          <RestaurantForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitLabel="Create Restaurant"
          />
        </div>
      </div>
    </div>
  );
}