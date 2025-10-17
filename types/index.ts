// Centralized type definitions for authentication and restaurant features

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'partner';
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  address: string;
  priceRange: number;
  rating: number;
  imageUrl: string;
  ownerUserId?: string;
}

export interface SearchFilters {
  cuisine?: string;
  priceRange?: number;
  sortBy?: 'rating' | 'name';
}

export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

// For Cristian's feature - Reviews and User Profiles
export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface UserProfile extends User {
  displayName?: string;
  phone?: string;
  address?: string;
}
