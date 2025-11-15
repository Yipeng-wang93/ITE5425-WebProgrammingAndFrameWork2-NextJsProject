// Container component for displaying multiple reviews

'use client';

import { Review } from '@/types';
import ReviewCard from './ReviewCard';

interface ReviewListProps {
  reviews: Review[];
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
}

export default function ReviewList({ reviews, onEdit, onDelete }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600">No reviews yet. Be the first to review this restaurant!</p>
      </div>
    );
  }

  const averageRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);

  return (
    <div>
      <div className="mb-6 bg-orange-50 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600">{averageRating}</div>
            <div className="text-sm text-gray-600 mt-1">Average Rating</div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(parseFloat(averageRating))
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 fill-current'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard 
            key={review.id} 
            review={review} 
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}