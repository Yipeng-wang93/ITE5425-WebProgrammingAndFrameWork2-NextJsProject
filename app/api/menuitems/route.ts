// Menu item listing and creation endpoints

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MenuItem from '@/models/MenuItem';
import Restaurant from '@/models/Restaurant';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch menu items with optional filtering
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');
    const category = searchParams.get('category');
    const availableOnly = searchParams.get('availableOnly') === 'true';

    const query: any = {};

    if (restaurantId) {
      query.restaurantId = restaurantId;
    }

    if (category) {
      query.category = category;
    }

    if (availableOnly) {
      query.isAvailable = true;
    }

    const menuItems = await MenuItem.find(query)
      .sort({ category: 1, name: 1 })
      .populate('restaurantId', 'name');

    return NextResponse.json(
      {
        menuItems: menuItems.map((item) => ({
          id: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          dietaryTags: item.dietaryTags,
          isAvailable: item.isAvailable,
          imageUrl: item.imageUrl,
          restaurantId: item.restaurantId,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get menu items error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

// POST - Create new menu item (partner only, must own restaurant)
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
        { error: 'Only partners can create menu items' },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { name, description, price, category, dietaryTags, isAvailable, imageUrl, restaurantId } = body;

    // Validation
    if (!name || !description || price === undefined || !category || !restaurantId) {
      return NextResponse.json(
        { error: 'Name, description, price, category, and restaurant ID are required' },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        { error: 'Menu item name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (description.length < 10) {
      return NextResponse.json(
        { error: 'Description must be at least 10 characters' },
        { status: 400 }
      );
    }

    if (price < 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    // Check if restaurant exists and user owns it
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    if (restaurant.ownerUserId.toString() !== currentUser.userId) {
      return NextResponse.json(
        { error: 'You can only create menu items for your own restaurants' },
        { status: 403 }
      );
    }

    // Create menu item
    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      category,
      dietaryTags: dietaryTags || [],
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      imageUrl: imageUrl || '',
      restaurantId,
    });

    return NextResponse.json(
      {
        message: 'Menu item created successfully',
        menuItem: {
          id: menuItem._id,
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price,
          category: menuItem.category,
          dietaryTags: menuItem.dietaryTags,
          isAvailable: menuItem.isAvailable,
          imageUrl: menuItem.imageUrl,
          restaurantId: menuItem.restaurantId,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create menu item error:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}