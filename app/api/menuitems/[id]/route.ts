// Individual menu item operations

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MenuItem from '@/models/MenuItem';
import Restaurant from '@/models/Restaurant';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch single menu item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const menuItem = await MenuItem.findById(id).populate('restaurantId', 'name');

    if (!menuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
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
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get menu item error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu item' },
      { status: 500 }
    );
  }
}

// PUT - Update menu item (must own restaurant)
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

    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    // Check restaurant ownership
    const restaurant = await Restaurant.findById(menuItem.restaurantId);
    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    if (restaurant.ownerUserId.toString() !== currentUser.userId) {
      return NextResponse.json(
        { error: 'You can only update menu items for your own restaurants' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, price, category, dietaryTags, isAvailable, imageUrl } = body;

    // Validation
    if (name && name.length < 2) {
      return NextResponse.json(
        { error: 'Menu item name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (description && description.length < 10) {
      return NextResponse.json(
        { error: 'Description must be at least 10 characters' },
        { status: 400 }
      );
    }

    if (price !== undefined && price < 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    // Update fields
    if (name) menuItem.name = name;
    if (description) menuItem.description = description;
    if (price !== undefined) menuItem.price = price;
    if (category) menuItem.category = category;
    if (dietaryTags !== undefined) menuItem.dietaryTags = dietaryTags;
    if (isAvailable !== undefined) menuItem.isAvailable = isAvailable;
    if (imageUrl !== undefined) menuItem.imageUrl = imageUrl;

    await menuItem.save();

    return NextResponse.json(
      {
        message: 'Menu item updated successfully',
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
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update menu item error:', error);
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete menu item (must own restaurant)
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

    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    // Check restaurant ownership
    const restaurant = await Restaurant.findById(menuItem.restaurantId);
    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    if (restaurant.ownerUserId.toString() !== currentUser.userId) {
      return NextResponse.json(
        { error: 'You can only delete menu items for your own restaurants' },
        { status: 403 }
      );
    }

    await MenuItem.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Menu item deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete menu item error:', error);
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
}