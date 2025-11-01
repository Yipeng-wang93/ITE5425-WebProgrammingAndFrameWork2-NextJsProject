// Individual restaurant operations

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Restaurant from '@/models/Restaurant';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch single restaurant
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const restaurant = await Restaurant.findById(id).populate('ownerUserId', 'name email');

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        restaurant: {
          id: restaurant._id,
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          description: restaurant.description,
          address: restaurant.address,
          priceRange: restaurant.priceRange,
          rating: restaurant.rating,
          imageUrl: restaurant.imageUrl,
          ownerUserId: restaurant.ownerUserId,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get restaurant error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant' },
      { status: 500 }
    );
  }
}

// PUT - Update restaurant (owner only)
export async function PUT(
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

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (restaurant.ownerUserId.toString() !== currentUser.userId) {
      return NextResponse.json(
        { error: 'You can only update your own restaurants' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, cuisine, description, address, priceRange, imageUrl } = body;

    // Validation
    if (name && name.length < 3) {
      return NextResponse.json(
        { error: 'Restaurant name must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (description && description.length < 20) {
      return NextResponse.json(
        { error: 'Description must be at least 20 characters' },
        { status: 400 }
      );
    }

    // Update fields
    if (name) restaurant.name = name;
    if (cuisine) restaurant.cuisine = cuisine;
    if (description) restaurant.description = description;
    if (address) restaurant.address = address;
    if (priceRange) restaurant.priceRange = priceRange;
    if (imageUrl !== undefined) restaurant.imageUrl = imageUrl;

    await restaurant.save();

    return NextResponse.json(
      {
        message: 'Restaurant updated successfully',
        restaurant: {
          id: restaurant._id,
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          description: restaurant.description,
          address: restaurant.address,
          priceRange: restaurant.priceRange,
          rating: restaurant.rating,
          imageUrl: restaurant.imageUrl,
          ownerUserId: restaurant.ownerUserId, // Include ownerUserId in response to help clients verify ownership, may be useful for UI logic (phase 3)
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update restaurant error:', error);
    return NextResponse.json(
      { error: 'Failed to update restaurant' },
      { status: 500 }
    );
  }
}

// DELETE - Delete restaurant (owner only)
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

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (restaurant.ownerUserId.toString() !== currentUser.userId) {
      return NextResponse.json(
        { error: 'You can only delete your own restaurants' },
        { status: 403 }
      );
    }

    await Restaurant.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Restaurant deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete restaurant error:', error);
    return NextResponse.json(
      { error: 'Failed to delete restaurant' },
      { status: 500 }
    );
  }
}