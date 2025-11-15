// Restaurant listing page with API integration

'use client';

import { useState, useEffect } from 'react';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import SearchBar from '@/components/restaurants/SearchBar';
import FilterPanel from '@/components/restaurants/FilterPanel';
import { Restaurant, SearchFilters } from '@/types';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'rating',
  });

  useEffect(() => {
    fetchRestaurants();
  }, [filters]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.cuisine) {
        params.append('cuisine', filters.cuisine);
      }
      if (filters.priceRange) {
        params.append('priceRange', filters.priceRange.toString());
      }
      if (filters.sortBy) {
        params.append('sortBy', filters.sortBy);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/restaurants?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setRestaurants(data.restaurants);
      } else {
        console.error('Failed to fetch restaurants:', data.error);
        setRestaurants([]);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams();

    if (filters.cuisine) {
      params.append('cuisine', filters.cuisine);
    }
    if (filters.priceRange) {
      params.append('priceRange', filters.priceRange.toString());
    }
    if (filters.sortBy) {
      params.append('sortBy', filters.sortBy);
    }
    if (query) {
      params.append('search', query);
    }

    fetch(`/api/restaurants?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.restaurants) {
          setRestaurants(data.restaurants);
        }
      })
      .catch((error) => console.error('Search error:', error));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Discover Restaurants</h1>

      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <FilterPanel filters={filters} onFilterChange={setFilters} />
        </aside>

        <main className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-600 text-lg">Loading restaurants...</div>
            </div>
          ) : restaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No restaurants found matching your criteria. Try adjusting your filters.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}