// Individual review display component

'use client';

import { useState } from 'react';
import { Review } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewCardProps {
  review: Review;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
}

export default function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (onDelete) {
          onDelete(review.id);
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(review.id);
    }
  };

  // Check if current user owns this review
  const isOwner = user && user.id === review.userId;

  // Debug logging (remove in production)
  if (typeof window !== 'undefined') {
    console.log('ReviewCard Debug:', {
      currentUserId: user?.id,
      reviewUserId: review.userId,
      isOwner: isOwner,
      userIdType: typeof review.userId,
      currentUserIdType: typeof user?.id
    });
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-800 mb-1">{review.userName}</h4>
          {renderStars(review.rating)}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
          {isOwner && (
            <div className="flex gap-2 ml-4">
              <button
                onClick={handleEdit}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                aria-label="Edit review"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors disabled:opacity-50"
                aria-label="Delete review"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
    </div>
  );
}