// Restaurant listing page with search and filter functionality

'use client';

import { useState, useMemo } from 'react';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import SearchBar from '@/components/restaurants/SearchBar';
import FilterPanel from '@/components/restaurants/FilterPanel';
import { mockRestaurants } from '@/lib/mockData';
import { SearchFilters } from '@/types';

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'rating',
  });

  const filteredRestaurants = useMemo(() => {
    let results = [...mockRestaurants];

    // Apply search query
    if (searchQuery) {
      results = results.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply cuisine filter
    if (filters.cuisine) {
      results = results.filter((restaurant) => restaurant.cuisine === filters.cuisine);
    }

    // Apply price range filter
    if (filters.priceRange) {
      results = results.filter((restaurant) => restaurant.priceRange === filters.priceRange);
    }

    // Apply sorting
    if (filters.sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    return results;
  }, [searchQuery, filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Discover Restaurants</h1>

      <div className="mb-8">
        <SearchBar onSearch={setSearchQuery} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <FilterPanel filters={filters} onFilterChange={setFilters} />
        </aside>

        <main className="lg:col-span-3">
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
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