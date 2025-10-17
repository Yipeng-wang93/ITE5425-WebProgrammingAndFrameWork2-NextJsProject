// Filter panel for refining restaurant search results

'use client';

import { SearchFilters } from '@/types';
import { cuisineTypes } from '@/lib/mockData';

interface FilterPanelProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

export default function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const handleCuisineChange = (cuisine: string) => {
    onFilterChange({ ...filters, cuisine: cuisine === 'all' ? undefined : cuisine });
  };

  const handlePriceChange = (price: string) => {
    onFilterChange({ ...filters, priceRange: price === 'all' ? undefined : parseInt(price) });
  };

  const handleSortChange = (sort: string) => {
    onFilterChange({ ...filters, sortBy: sort === 'rating' ? 'rating' : 'name' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Type</label>
        <select
          value={filters.cuisine || 'all'}
          onChange={(e) => handleCuisineChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Cuisines</option>
          {cuisineTypes.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
        <select
          value={filters.priceRange || 'all'}
          onChange={(e) => handlePriceChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">Any Price</option>
          <option value="1">$ - Budget</option>
          <option value="2">$$ - Moderate</option>
          <option value="3">$$$ - Expensive</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
        <select
          value={filters.sortBy || 'rating'}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="rating">Highest Rated</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>
    </div>
  );
}