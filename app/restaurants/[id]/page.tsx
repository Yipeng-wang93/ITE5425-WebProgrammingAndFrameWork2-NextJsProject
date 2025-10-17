// Restaurant detail page showing full information and integrated reviews

import { notFound } from 'next/navigation';
import RestaurantDetail from '@/components/restaurants/RestaurantDetail';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import { mockRestaurants, mockReviews } from '@/lib/mockData';

interface RestaurantPageProps {
  params: Promise<{ id: string }>;
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params;
  const restaurant = mockRestaurants.find((r) => r.id === id);

  if (!restaurant) {
    notFound();
  }

  const restaurantReviews = mockReviews.filter((review) => review.restaurantId === id);

  return (
    <div className="container mx-auto px-4 py-8">
      <RestaurantDetail restaurant={restaurant} />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
          <ReviewList reviews={restaurantReviews} />
        </div>

        <div className="lg:col-span-1">
          <ReviewForm restaurantId={id} />
        </div>
      </div>
    </div>
  );
}