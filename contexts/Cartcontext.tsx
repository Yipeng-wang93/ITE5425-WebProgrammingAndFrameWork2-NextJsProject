// Cart context provider for managing shopping cart state across the application

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  imageUrl?: string;
}

interface CartContextType {
  cart: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  getItemQuantity: (itemId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRestaurantId = localStorage.getItem('cartRestaurantId');
    const savedRestaurantName = localStorage.getItem('cartRestaurantName');
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    
    if (savedRestaurantId) {
      setRestaurantId(savedRestaurantId);
    }
    
    if (savedRestaurantName) {
      setRestaurantName(savedRestaurantName);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    if (restaurantId) {
      localStorage.setItem('cartRestaurantId', restaurantId);
    }
    if (restaurantName) {
      localStorage.setItem('cartRestaurantName', restaurantName);
    }
  }, [cart, restaurantId, restaurantName]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    // If cart has items from a different restaurant, warn and clear
    if (restaurantId && restaurantId !== item.restaurantId) {
      const shouldClear = window.confirm(
        `Your cart contains items from ${restaurantName}. Adding items from ${item.restaurantName} will clear your current cart. Continue?`
      );
      
      if (!shouldClear) {
        return;
      }
      
      clearCart();
    }

    setRestaurantId(item.restaurantId);
    setRestaurantName(item.restaurantName);

    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      
      return [...prevCart, { ...item, quantity }];
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== itemId);
      
      // If cart is empty, clear restaurant info
      if (newCart.length === 0) {
        setRestaurantId(null);
        setRestaurantName(null);
        localStorage.removeItem('cartRestaurantId');
        localStorage.removeItem('cartRestaurantName');
      }
      
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    setRestaurantId(null);
    setRestaurantName(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('cartRestaurantId');
    localStorage.removeItem('cartRestaurantName');
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getItemQuantity = (itemId: string) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        restaurantId,
        restaurantName,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartItemCount,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}