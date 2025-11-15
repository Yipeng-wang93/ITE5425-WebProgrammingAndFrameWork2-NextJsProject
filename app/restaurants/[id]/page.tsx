// Restaurant detail page with API integration

'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import RestaurantDetail from '@/components/restaurants/RestaurantDetail';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import { Restaurant, Review } from '@/types';

interface RestaurantPageProps {
  params: Promise<{ id: string }>;
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string>('');

  useEffect(() => {
    params.then(({ id }) => {
      setRestaurantId(id);
      fetchRestaurantData(id);
    });
  }, [params]);

  const fetchRestaurantData = async (id: string) => {
    try {
      setLoading(true);

      const restaurantResponse = await fetch(`/api/restaurants/${id}`);
      const restaurantData = await restaurantResponse.json();

      if (!restaurantResponse.ok) {
        setRestaurant(null);
        return;
      }

      setRestaurant(restaurantData.restaurant);

      const reviewsResponse = await fetch(`/api/reviews?restaurantId=${id}`);
      const reviewsData = await reviewsResponse.json();

      if (reviewsResponse.ok) {
        setReviews(reviewsData.reviews);
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      setRestaurant(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    fetchRestaurantData(restaurantId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading restaurant details...</div>
      </div>
    );
  }

  if (!restaurant) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <RestaurantDetail restaurant={restaurant} />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
          <ReviewList reviews={reviews} />
        </div>

        <div className="lg:col-span-1">
          {user ? (
            <ReviewForm restaurantId={restaurantId} onSubmitSuccess={handleReviewSubmitted} />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Write a Review</h3>
              <p className="text-gray-600 mb-4">
                Please log in to submit a review for this restaurant.
              </p>
              <a
                href="/login"
                className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Login to Review
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}