// Restaurant listing and creation endpoints

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Restaurant from '@/models/Restaurant';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch restaurants with optional filtering
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const cuisine = searchParams.get('cuisine');
    const priceRange = searchParams.get('priceRange');
    const sortBy = searchParams.get('sortBy') || 'rating';
    const search = searchParams.get('search');

    const query: any = {};

    if (cuisine) {
      query.cuisine = cuisine;
    }

    if (priceRange) {
      query.priceRange = parseInt(priceRange);
    }

    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions: any = {};
    if (sortBy === 'rating') {
      sortOptions.rating = -1;
    } else if (sortBy === 'name') {
      sortOptions.name = 1;
    }

    const restaurants = await Restaurant.find(query)
      .sort(sortOptions)
      .populate('ownerUserId', 'name email');

    return NextResponse.json(
      {
        restaurants: restaurants.map((r) => ({
          id: r._id,
          name: r.name,
          cuisine: r.cuisine,
          description: r.description,
          address: r.address,
          priceRange: r.priceRange,
          rating: r.rating,
          imageUrl: r.imageUrl,
          ownerUserId: r.ownerUserId,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get restaurants error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}

// POST - Create new restaurant (partner only)
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (currentUser.role !== 'partner') {
      return NextResponse.json(
        { error: 'Only partners can create restaurants' },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { name, cuisine, description, address, priceRange, imageUrl } = body;

    // Validation
    if (!name || !cuisine || !description || !address) {
      return NextResponse.json(
        { error: 'Name, cuisine, description, and address are required' },
        { status: 400 }
      );
    }

    if (name.length < 3) {
      return NextResponse.json(
        { error: 'Restaurant name must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (description.length < 20) {
      return NextResponse.json(
        { error: 'Description must be at least 20 characters' },
        { status: 400 }
      );
    }

    // Create restaurant
    const restaurant = await Restaurant.create({
      name,
      cuisine,
      description,
      address,
      priceRange: priceRange || 2,
      rating: 0,
      imageUrl: imageUrl || '',
      ownerUserId: currentUser.userId,
    });

    return NextResponse.json(
      {
        message: 'Restaurant created successfully',
        restaurant: {
          id: restaurant._id,
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          description: restaurant.description,
          address: restaurant.address,
          priceRange: restaurant.priceRange,
          rating: restaurant.rating,
          imageUrl: restaurant.imageUrl,
          ownerUserId: restaurant.ownerUserId, // Populate if needed
                                               // which is helpful for phase 3 when implementing partner dashboards that display only restaurants owned by the authenticated user
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create restaurant error:', error);
    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    );
  }
}