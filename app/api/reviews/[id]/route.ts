// Review update and delete endpoints

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';
import Restaurant from '@/models/Restaurant';
import { getCurrentUser } from '@/lib/auth';

// PUT - Update a review
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    const review = await Review.findById(params.id);

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if user owns this review
    if (review.userId.toString() !== currentUser.userId) {
      return NextResponse.json(
        { error: 'You can only edit your own reviews' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { rating, comment } = body;

    // Validation
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (comment !== undefined && comment.length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Update review
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    await review.save();

    // Update restaurant rating
    const allReviews = await Review.find({ restaurantId: review.restaurantId });
    const averageRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    const restaurant = await Restaurant.findById(review.restaurantId);
    if (restaurant) {
      restaurant.rating = Math.round(averageRating * 10) / 10;
      await restaurant.save();
    }

    return NextResponse.json(
      {
        message: 'Review updated successfully',
        review: {
          id: review._id.toString(),
          restaurantId: review.restaurantId.toString(),
          userId: review.userId.toString(),
          userName: review.userName,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt.toISOString(),
          updatedAt: review.updatedAt.toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update review error:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    const review = await Review.findById(params.id);

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if user owns this review
    if (review.userId.toString() !== currentUser.userId) {
      return NextResponse.json(
        { error: 'You can only delete your own reviews' },
        { status: 403 }
      );
    }

    const restaurantId = review.restaurantId;

    // Delete the review
    await Review.findByIdAndDelete(params.id);

    // Update restaurant rating
    const remainingReviews = await Review.find({ restaurantId });
    const restaurant = await Restaurant.findById(restaurantId);
    
    if (restaurant) {
      if (remainingReviews.length > 0) {
        const averageRating =
          remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length;
        restaurant.rating = Math.round(averageRating * 10) / 10;
      } else {
        restaurant.rating = 0;
      }
      await restaurant.save();
    }

    return NextResponse.json(
      { message: 'Review deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}