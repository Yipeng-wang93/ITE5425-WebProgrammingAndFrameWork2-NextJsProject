// Partner dashboard for managing restaurants

'use client';

import Link from 'next/link';
import { useState } from 'react';
import PartnerRestaurantCard from '@/components/restaurants/manage/PartnerRestaurantCard';
import Button from '@/components/ui/Button';
import { mockRestaurants, mockCurrentPartnerId } from '@/lib/mockData';

export default function ManageRestaurantsPage() {
  // const [restaurants] = useState(mockRestaurants.slice(0, 2));

  //client-side filtering operation that currently filters mockRestaurants based on 
  // mockCurrentPartnerId will be entirely replaced by an API call that fetches 
  // already-filtered data from our backend. 
    const [restaurants] = useState(
        mockRestaurants.filter(r => r.ownerUserId === mockCurrentPartnerId)
    );

  return (
    <div className="min-h-screen bg-orange-50 py-12 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Restaurants</h1>
            <p className="text-gray-600">Manage your restaurant profiles and information</p>
          </div>
          <Link href="/restaurants/manage/new">
            <Button variant="primary">
              + Add New Restaurant
            </Button>
          </Link>
        </div>

        {restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <PartnerRestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="max-w-md mx-auto">
              <svg
                className="w-24 h-24 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Restaurants Yet</h3>
              <p className="text-gray-600 mb-6">
                Start by adding your first restaurant to begin managing your business on our platform.
              </p>
              <Link href="/restaurants/manage/new">
                <Button variant="primary">
                  Create Your First Restaurant
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}