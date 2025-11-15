// Review listing and creation endpoints
// FIXED: Only customers can create reviews

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';
import Restaurant from '@/models/Restaurant';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch reviews for a restaurant
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');

    if (!restaurantId) {
      return NextResponse.json(
        { error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ restaurantId })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        reviews: reviews.map((r) => ({
          id: r._id.toString(),
          restaurantId: r.restaurantId.toString(),
          userId: r.userId.toString(), // Convert to string for comparison
          userName: r.userName,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt.toISOString(),
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Create new review (authenticated CUSTOMERS only)
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // FIXED: Only customers can create reviews
    if (currentUser.role !== 'customer') {
      return NextResponse.json(
        { error: 'Only customers can write reviews' },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { restaurantId, rating, comment } = body;

    // Validation
    if (!restaurantId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Restaurant ID, rating, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (comment.length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Get user name
    const user = await User.findById(currentUser.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user already reviewed this restaurant
    const existingReview = await Review.findOne({
      restaurantId,
      userId: currentUser.userId,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this restaurant' },
        { status: 400 }
      );
    }

    // Create review
    const review = await Review.create({
      restaurantId,
      userId: currentUser.userId,
      userName: user.name,
      rating,
      comment,
    });

    // Update restaurant rating
    const allReviews = await Review.find({ restaurantId });
    const averageRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    restaurant.rating = Math.round(averageRating * 10) / 10;
    await restaurant.save();

    return NextResponse.json(
      {
        message: 'Review created successfully',
        review: {
          id: review._id,
          restaurantId: review.restaurantId,
          userId: review.userId,
          userName: review.userName,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}