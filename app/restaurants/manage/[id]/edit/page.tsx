// Restaurant editing page with API integration

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import RestaurantForm from '@/components/restaurants/manage/RestaurantForm';
import { Restaurant } from '@/types';

interface EditRestaurantPageProps {
  params: Promise<{ id: string }>;
}

export default function EditRestaurantPage({ params }: EditRestaurantPageProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }

    if (user && user.role !== 'partner') {
      router.push('/');
    }

    params.then(({ id }) => {
      setRestaurantId(id);
      fetchRestaurant(id);
    });
  }, [user, authLoading, router, params]);

  const fetchRestaurant = async (id: string) => {
    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        alert('Restaurant not found');
        router.push('/restaurants/manage');
        return;
      }

      // Debug logging to identify the exact values and types
      console.log('Restaurant ownerUserId:', data.restaurant.ownerUserId);
      console.log('Type:', typeof data.restaurant.ownerUserId);
      console.log('Current user ID:', user?.id);
      console.log('Type:', typeof user?.id);
      console.log('Are they equal?:', data.restaurant.ownerUserId === user?.id);

      // Check if the current user owns this restaurant
      if (data.restaurant.ownerUserId !== user?.id) {
        alert('You do not have permission to edit this restaurant');
        router.push('/restaurants/manage');
        return;
      }

      setRestaurant(data.restaurant);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      alert('Failed to load restaurant');
      router.push('/restaurants/manage');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (data: Partial<Restaurant>) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update restaurant');
      }

      alert('Restaurant updated successfully!');
      router.push('/restaurants/manage');
    } catch (error: any) {
      alert(error.message || 'Failed to update restaurant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || fetchLoading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== 'partner' || !restaurant) {
    return null;
  }

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