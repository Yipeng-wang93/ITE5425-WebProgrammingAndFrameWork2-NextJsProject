// Individual review operations

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';
import Restaurant from '@/models/Restaurant';
import { getCurrentUser } from '@/lib/auth';

// DELETE - Delete review (owner only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id } = await params;

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (review.userId.toString() !== currentUser.userId) {
      return NextResponse.json(
        { error: 'You can only delete your own reviews' },
        { status: 403 }
      );
    }

    const restaurantId = review.restaurantId;
    await Review.findByIdAndDelete(id);

    // Update restaurant rating
    const allReviews = await Review.find({ restaurantId });
    const restaurant = await Restaurant.findById(restaurantId);
    
    if (restaurant) {
      if (allReviews.length > 0) {
        const averageRating =
          allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
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