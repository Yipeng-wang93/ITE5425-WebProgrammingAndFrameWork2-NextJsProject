// Detailed restaurant information component with menu items and cart functionality

'use client';

import { Restaurant } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/Cartcontext';
import { useRouter } from 'next/navigation';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  dietaryTags: string[];
  isAvailable: boolean;
  imageUrl: string;
}

interface RestaurantDetailProps {
  restaurant: Restaurant;
  menuItems?: MenuItem[];
}

export default function RestaurantDetail({ restaurant, menuItems = [] }: RestaurantDetailProps) {
  const { user } = useAuth();
  const { 
    cart, 
    restaurantId,
    restaurantName,
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    getCartItemCount,
    getItemQuantity 
  } = useCart();
  const router = useRouter();
  
  const priceSymbols = '$'.repeat(restaurant.priceRange);

  // Check if user can add to cart (customer or not logged in)
  const canAddToCart = !user || user.role === 'customer';

  // Filter cart items for this restaurant
  const restaurantCartItems = cart.filter(item => item.restaurantId === restaurant.id);

  // Group menu items by category
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const categoryOrder = ['Appetizer', 'Main Course', 'Side Dish', 'Dessert', 'Beverage', 'Special'];
  const orderedCategories = categoryOrder.filter(cat => groupedMenuItems[cat]);

  // Cart functions
  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      imageUrl: item.imageUrl
    });
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveFromCart = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleCheckout = () => {
    if (!user) {
      // Redirect to login with return URL
      router.push(`/login?returnUrl=/checkout`);
    } else {
      router.push('/checkout');
    }
  };

  const restaurantTotal = restaurantCartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="h-96 overflow-hidden">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{restaurant.name}</h1>
            <p className="text-xl text-gray-600">{restaurant.cuisine}</p>
          </div>
          <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-lg">
            <svg className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="ml-2 text-xl font-semibold">{restaurant.rating}</span>
          </div>
        </div>

        <p className="text-gray-600 text-lg mb-6">{restaurant.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Address</h3>
            <p className="text-gray-800">{restaurant.address}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Price Range</h3>
            <p className="text-gray-800 text-xl">{priceSymbols}</p>
          </div>
        </div>

        {/* Cart Summary - Only show if there are items from this restaurant */}
        {canAddToCart && restaurantCartItems.length > 0 && (
          <div className="mb-8 bg-orange-50 border-2 border-orange-200 rounded-lg p-6 sticky top-4 z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Your Cart</h3>
              <div className="text-right">
                <p className="text-sm text-gray-600">{restaurantCartItems.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                <p className="text-2xl font-bold text-orange-600">${restaurantTotal.toFixed(2)}</p>
              </div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {restaurantCartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-white rounded p-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 font-semibold border-x">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-gray-800 w-20 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="text-red-600 hover:text-red-800 ml-2"
                      title="Remove from cart"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}

        <div className="border-t pt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu</h2>
          
          {menuItems.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600 text-lg">No menu items available yet.</p>
              <p className="text-gray-500 text-sm mt-2">Check back soon for our delicious offerings!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {orderedCategories.map(category => (
                <div key={category}>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-orange-500">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groupedMenuItems[category].map(item => {
                      const itemQuantity = getItemQuantity(item.id);
                      
                      return (
                        <div
                          key={item.id}
                          className={`bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
                            !item.isAvailable ? 'opacity-60' : ''
                          }`}
                        >
                          {item.imageUrl && (
                            <div className="h-48 overflow-hidden">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Hide image if it fails to load
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 text-lg">
                                  {item.name}
                                  {!item.isAvailable && (
                                    <span className="ml-2 text-xs text-red-600 font-normal">
                                      (Unavailable)
                                    </span>
                                  )}
                                </h4>
                                {item.dietaryTags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.dietaryTags.map(tag => (
                                      <span
                                        key={tag}
                                        className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <span className="text-lg font-bold text-orange-600 ml-4">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                            
                            {/* Add to Cart section - Only visible for customers or non-logged-in users */}
                            {canAddToCart && item.isAvailable && (
                              <div className="mt-3 pt-3 border-t">
                                {itemQuantity > 0 ? (
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center border-2 border-orange-500 rounded-lg">
                                      <button
                                        onClick={() => handleUpdateQuantity(item.id, itemQuantity - 1)}
                                        className="px-3 py-1 text-orange-600 hover:bg-orange-50 rounded-l-lg font-bold"
                                      >
                                        −
                                      </button>
                                      <span className="px-4 py-1 font-semibold border-x-2 border-orange-500 min-w-[3rem] text-center">
                                        {itemQuantity}
                                      </span>
                                      <button
                                        onClick={() => handleUpdateQuantity(item.id, itemQuantity + 1)}
                                        className="px-3 py-1 text-orange-600 hover:bg-orange-50 rounded-r-lg font-bold"
                                      >
                                        +
                                      </button>
                                    </div>
                                    <span className="font-bold text-gray-800">
                                      ${(item.price * itemQuantity).toFixed(2)}
                                    </span>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleAddToCart(item)}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Add to Cart
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}