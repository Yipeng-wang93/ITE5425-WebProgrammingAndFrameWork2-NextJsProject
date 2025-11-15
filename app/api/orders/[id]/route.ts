// API route for getting and updating individual orders

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { verifyAuth } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(req);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;
    const order = await Order.findById(id)
      .populate('userId', 'name email phone')
      .populate('restaurantId', 'name address phone imageUrl');

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check authorization
    const isOwner = order.userId._id.toString() === authResult.user.id;
    const isRestaurantOwner = authResult.user.role === 'partner'; // Would need to check if they own this restaurant

    if (!isOwner && !isRestaurantOwner) {
      return NextResponse.json(
        { error: 'Not authorized to view this order' },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(req);
    if (!authResult.authenticated || !authResult.user) {
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

    const body = await req.json();
    const { status } = body;

    // Customers can only cancel their own orders
    if (authResult.user.role === 'customer') {
      const isOwner = order.userId.toString() === authResult.user.id;
      if (!isOwner) {
        return NextResponse.json(
          { error: 'Not authorized to modify this order' },
          { status: 403 }
        );
      }

      if (status !== 'cancelled') {
        return NextResponse.json(
          { error: 'Customers can only cancel orders' },
          { status: 403 }
        );
      }

      if (!['pending', 'confirmed'].includes(order.status)) {
        return NextResponse.json(
          { error: 'Cannot cancel order in current status' },
          { status: 400 }
        );
      }
    }

    // Partners can update order status (would need to verify they own the restaurant)
    if (authResult.user.role === 'partner') {
      const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid order status' },
          { status: 400 }
        );
      }
    }

    order.status = status;
    await order.save();

    await order.populate('userId', 'name email phone');
    await order.populate('restaurantId', 'name address phone imageUrl');

    return NextResponse.json({ 
      message: 'Order updated successfully',
      order 
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// PUT is an alias for PATCH to support both methods
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PATCH(req, { params });
}