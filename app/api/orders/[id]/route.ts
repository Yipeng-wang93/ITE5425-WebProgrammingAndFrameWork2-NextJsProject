// Individual order operations

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Restaurant from '@/models/Restaurant';
import { getCurrentUser } from '@/lib/auth';

// GET - Fetch single order
export async function GET(
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

    const order = await Order.findById(id)
      .populate('restaurantId', 'name address phone')
      .populate('userId', 'name email phone');

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this order
    const restaurant = await Restaurant.findById(order.restaurantId);
    const isOwner = order.userId.toString() === currentUser.userId;
    const isRestaurantOwner = restaurant && restaurant.ownerUserId.toString() === currentUser.userId;

    if (!isOwner && !isRestaurantOwner) {
      return NextResponse.json(
        { error: 'You do not have permission to view this order' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
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
          updatedAt: order.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT - Update order status (restaurant owner only)
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

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if user owns the restaurant
    const restaurant = await Restaurant.findById(order.restaurantId);
    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    const isRestaurantOwner = restaurant.ownerUserId.toString() === currentUser.userId;
    const isOrderOwner = order.userId.toString() === currentUser.userId;

    const body = await request.json();
    const { status } = body;

    // Restaurant owners can update status to any value except cancelled
    // Order owners can only cancel their own orders
    if (status === 'cancelled') {
      if (!isOrderOwner) {
        return NextResponse.json(
          { error: 'Only the customer can cancel an order' },
          { status: 403 }
        );
      }
      if (order.status !== 'pending') {
        return NextResponse.json(
          { error: 'Only pending orders can be cancelled' },
          { status: 400 }
        );
      }
    } else {
      if (!isRestaurantOwner) {
        return NextResponse.json(
          { error: 'Only restaurant owners can update order status' },
          { status: 403 }
        );
      }
    }

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid order status' },
        { status: 400 }
      );
    }

    order.status = status;
    await order.save();

    return NextResponse.json(
      {
        message: 'Order status updated successfully',
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
          updatedAt: order.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}