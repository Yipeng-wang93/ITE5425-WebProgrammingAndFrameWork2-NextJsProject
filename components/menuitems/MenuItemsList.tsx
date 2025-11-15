// Menu items list component with loading and empty states

'use client';

import { useEffect, useState } from 'react';
import MenuItemCard from './MenuItemCard';

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

interface MenuItemsListProps {
  restaurantId: string;
  onEdit?: (item: MenuItem) => void;
  onDelete?: (itemId: string) => Promise<void>;
  showActions?: boolean;
  refreshTrigger?: number;
}

export default function MenuItemsList({
  restaurantId,
  onEdit,
  onDelete,
  showActions = false,
  refreshTrigger = 0
}: MenuItemsListProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const categories = [
    'All',
    'Appetizer',
    'Main Course',
    'Side Dish',
    'Dessert',
    'Beverage',
    'Special'
  ];

  useEffect(() => {
    fetchMenuItems();
  }, [restaurantId, refreshTrigger]);

  const fetchMenuItems = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/menuitems?restaurantId=${restaurantId}`,
        {
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch menu items');
      }

      setMenuItems(data.menuItems || []);
    } catch (error: any) {
      setError(error.message || 'Failed to load menu items');
      console.error('Fetch menu items error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!onDelete) return;

    try {
      await onDelete(itemId);
      // Refresh the list after successful deletion
      await fetchMenuItems();
    } catch (error) {
      console.error('Delete failed:', error);
      throw error;
    }
  };

  const filteredItems = categoryFilter && categoryFilter !== 'All'
    ? menuItems.filter(item => item.category === categoryFilter)
    : menuItems;

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchMenuItems}
          className="mt-2 text-sm text-red-700 underline hover:text-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg
          className="mx-auto h-16 w-16 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items yet</h3>
        <p className="text-gray-600">Get started by adding your first menu item.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat === 'All' ? '' : cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              (cat === 'All' && !categoryFilter) || categoryFilter === cat
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat}
            {cat !== 'All' && (
              <span className="ml-1 text-xs">
                ({menuItems.filter(item => item.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Menu Items by Category */}
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 border-b-2 border-orange-600 pb-2">
            {category}
          </h3>
          <div className="grid gap-4">
            {items.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDelete={handleDelete}
                showActions={showActions}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
