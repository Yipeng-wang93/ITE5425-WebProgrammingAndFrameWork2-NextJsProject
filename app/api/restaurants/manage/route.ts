// Partner restaurant management endpoint

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Restaurant from '@/models/Restaurant';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch restaurants owned by current partner
export async function GET(request: NextRequest) {
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
        { error: 'Only partners can access restaurant management' },
        { status: 403 }
      );
    }

    await dbConnect();

    const restaurants = await Restaurant.find({ ownerUserId: currentUser.userId })
      .sort({ createdAt: -1 });

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
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get managed restaurants error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}