// Menu item creation and editing form

'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface MenuItemFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  dietaryTags: string[];
  isAvailable: boolean;
  imageUrl: string;
}

interface MenuItemFormProps {
  restaurantId: string;
  initialData?: MenuItemFormData & { id: string };
  onSubmitSuccess: () => void;
  onCancel?: () => void;
}

export default function MenuItemForm({ 
  restaurantId, 
  initialData, 
  onSubmitSuccess,
  onCancel 
}: MenuItemFormProps) {
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    category: initialData?.category || 'Main Course',
    dietaryTags: initialData?.dietaryTags || [],
    isAvailable: initialData?.isAvailable ?? true,
    imageUrl: initialData?.imageUrl || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Appetizer',
    'Main Course',
    'Side Dish',
    'Dessert',
    'Beverage',
    'Special'
  ];

  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Halal',
    'Kosher'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'price') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const handleDietaryTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryTags: prev.dietaryTags.includes(tag)
        ? prev.dietaryTags.filter(t => t !== tag)
        : [...prev.dietaryTags, tag]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const url = initialData 
        ? `/api/menuitems/${initialData.id}`
        : '/api/menuitems';
      
      const method = initialData ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          restaurantId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save menu item');
      }

      onSubmitSuccess();
    } catch (error: any) {
      setError(error.message || 'Failed to save menu item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Item Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Margherita Pizza"
          required
        />

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          placeholder="Describe this menu item..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dietary Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {dietaryOptions.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => handleDietaryTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                formData.dietaryTags.includes(tag)
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Image URL (optional)"
        type="url"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
        placeholder="https://example.com/image.jpg"
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isAvailable"
          name="isAvailable"
          checked={formData.isAvailable}
          onChange={handleChange}
          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
        />
        <label htmlFor="isAvailable" className="ml-2 text-sm text-gray-700">
          Item is currently available
        </label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : (initialData ? 'Update Item' : 'Add Item')}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
