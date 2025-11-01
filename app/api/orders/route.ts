// Order listing and creation endpoints

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import MenuItem from '@/models/MenuItem';
import Restaurant from '@/models/Restaurant';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch orders for current user or restaurant
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');

    let query: any = {};

    if (restaurantId) {
      // Partner viewing orders for their restaurant
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return NextResponse.json(
          { error: 'Restaurant not found' },
          { status: 404 }
        );
      }

      if (restaurant.ownerUserId.toString() !== currentUser.userId) {
        return NextResponse.json(
          { error: 'You can only view orders for your own restaurants' },
          { status: 403 }
        );
      }

      query.restaurantId = restaurantId;
    } else {
      // Customer viewing their own orders
      query.userId = currentUser.userId;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('restaurantId', 'name address')
      .populate('userId', 'name email');

    return NextResponse.json(
      {
        orders: orders.map((order) => ({
          id: order._id,
          userId: order.userId,
          restaurantId: order.restaurantId,
          items: order.items,
          totalAmount: order.totalAmount,
          status: order.status,
          deliveryAddress: order.deliveryAddress,
          specialInstructions: order.specialInstructions,
          createdAt: order.createdAt,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { restaurantId, items, deliveryAddress, specialInstructions } = body;

    // Validation
    if (!restaurantId || !items || !deliveryAddress) {
      return NextResponse.json(
        { error: 'Restaurant ID, items, and delivery address are required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
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

    // Verify all menu items exist and calculate total
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      if (!item.menuItemId || !item.quantity || item.quantity < 1) {
        return NextResponse.json(
          { error: 'Each item must have a valid menu item ID and quantity' },
          { status: 400 }
        );
      }

      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return NextResponse.json(
          { error: `Menu item ${item.menuItemId} not found` },
          { status: 404 }
        );
      }

      if (menuItem.restaurantId.toString() !== restaurantId) {
        return NextResponse.json(
          { error: 'All menu items must belong to the same restaurant' },
          { status: 400 }
        );
      }

      if (!menuItem.isAvailable) {
        return NextResponse.json(
          { error: `Menu item ${menuItem.name} is currently unavailable` },
          { status: 400 }
        );
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
      });
    }

    // Get user for delivery address fallback
    const user = await User.findById(currentUser.userId);
    const finalDeliveryAddress = deliveryAddress || user?.address || '';

    if (!finalDeliveryAddress) {
      return NextResponse.json(
        { error: 'Delivery address is required' },
        { status: 400 }
      );
    }

    // Create order
    const order = await Order.create({
      userId: currentUser.userId,
      restaurantId,
      items: orderItems,
      totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
      status: 'pending',
      deliveryAddress: finalDeliveryAddress,
      specialInstructions: specialInstructions || '',
    });

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order: {
          id: order._id,
          userId: order.userId,
          restaurantId: order.restaurantId,
          items: order.items,
          totalAmount: order.totalAmount,
          status: order.status,
          deliveryAddress: order.deliveryAddress,
          specialInstructions: order.specialInstructions,
          createdAt: order.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}