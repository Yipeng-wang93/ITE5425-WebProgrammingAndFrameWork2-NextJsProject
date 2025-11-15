// API route for creating new orders and fetching user's order history
// CUSTOMER ONLY - Partners cannot place orders or view order history

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { verifyAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(req);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only customers can create orders
    if (authResult.user.role !== 'customer') {
      return NextResponse.json(
        { error: 'Only customers can place orders' },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { restaurantId, items, deliveryAddress, phone, specialInstructions, totalAmount } = body;

    // Validation
    if (!restaurantId) {
      return NextResponse.json(
        { error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!deliveryAddress || deliveryAddress.trim() === '') {
      return NextResponse.json(
        { error: 'Delivery address is required' },
        { status: 400 }
      );
    }

    if (!phone || phone.trim() === '') {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate items structure
    for (const item of items) {
      if (!item.menuItemId || !item.name || item.price === undefined || !item.quantity) {
        return NextResponse.json(
          { error: 'Invalid item data' },
          { status: 400 }
        );
      }
      if (item.quantity < 1) {
        return NextResponse.json(
          { error: 'Item quantity must be at least 1' },
          { status: 400 }
        );
      }
    }

    // Calculate total to verify
    const calculatedTotal = items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return NextResponse.json(
        { error: 'Total amount mismatch' },
        { status: 400 }
      );
    }

    // Create order
    const order = await Order.create({
      userId: authResult.user.id,
      restaurantId,
      items,
      totalAmount,
      deliveryAddress: deliveryAddress.trim(),
      phone: phone.trim(),
      specialInstructions: specialInstructions?.trim() || '',
      status: 'pending',
    });

    // Populate order with user and restaurant details
    await order.populate('userId', 'name email phone');
    await order.populate('restaurantId', 'name address phone');

    return NextResponse.json(
      { 
        message: 'Order created successfully', 
        order: {
          _id: order._id,
          restaurantId: order.restaurantId,
          items: order.items,
          totalAmount: order.totalAmount,
          status: order.status,
          deliveryAddress: order.deliveryAddress,
          phone: order.phone,
          specialInstructions: order.specialInstructions,
          createdAt: order.createdAt,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET - Fetch user's personal order history (CUSTOMER ONLY)
export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(req);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only customers can view order history (their own orders)
    if (authResult.user.role !== 'customer') {
      return NextResponse.json(
        { error: 'Only customers can view order history. Partners should use the restaurant management interface.' },
        { status: 403 }
      );
    }

    await dbConnect();

    // Fetch only this user's orders (user-specific)
    const orders = await Order.find({ userId: authResult.user.id })
      .populate('restaurantId', 'name address imageUrl')
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}