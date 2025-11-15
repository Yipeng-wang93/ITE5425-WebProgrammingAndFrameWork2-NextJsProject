// API route for partners to view orders placed at their restaurants
// PARTNER ONLY - For restaurant order management and fulfillment

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Restaurant from '@/models/Restaurant';
import { verifyAuth } from '@/lib/auth';

// GET - Fetch orders for partner's restaurants
export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAuth(req);
    
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only partners can access restaurant orders
    if (authResult.user.role !== 'partner') {
      return NextResponse.json(
        { error: 'Only restaurant partners can access this endpoint' },
        { status: 403 }
      );
    }

    await dbConnect();

    // Get all restaurants owned by this partner
    const partnerRestaurants = await Restaurant.find({ 
      ownerUserId: authResult.user.id 
    }).select('_id name');
    
    if (partnerRestaurants.length === 0) {
      return NextResponse.json({ 
        orders: [],
        restaurants: [] 
      });
    }
    
    const restaurantIds = partnerRestaurants.map(r => r._id);
    
    // Optional status filter
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status');
    
    let query: any = { 
      restaurantId: { $in: restaurantIds } 
    };
    
    if (statusFilter && statusFilter !== 'all') {
      query.status = statusFilter;
    }
    
    // Query orders for partner's restaurants
    const orders = await Order.find(query)
      .populate('restaurantId', 'name address imageUrl')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({ 
      orders,
      restaurants: partnerRestaurants 
    });
  } catch (error) {
    console.error('Error fetching restaurant orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant orders' },
      { status: 500 }
    );
  }
}