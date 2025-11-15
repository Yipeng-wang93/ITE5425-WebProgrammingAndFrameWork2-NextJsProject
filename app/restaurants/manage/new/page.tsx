// Restaurant creation page with API integration

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import RestaurantForm from '@/components/restaurants/manage/RestaurantForm';
import { Restaurant } from '@/types';

export default function NewRestaurantPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }

    if (user && user.role !== 'partner') {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (data: Partial<Restaurant>) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create restaurant');
      }

      alert('Restaurant created successfully!');
      router.push('/restaurants/manage');
    } catch (error: any) {
      alert(error.message || 'Failed to create restaurant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== 'partner') {
    return null;
  }

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