// Shared form component for restaurant creation and editing

'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Restaurant } from '@/types';

interface RestaurantFormProps {
  initialData?: Partial<Restaurant>;
  onSubmit: (data: Partial<Restaurant>) => void;
  isLoading: boolean;
  submitLabel: string;
}

export default function RestaurantForm({
  initialData = {},
  onSubmit,
  isLoading,
  submitLabel,
}: RestaurantFormProps) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    cuisine: initialData.cuisine || '',
    description: initialData.description || '',
    address: initialData.address || '',
    priceRange: initialData.priceRange || 2,
    imageUrl: initialData.imageUrl || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'priceRange' ? parseInt(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Restaurant name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Restaurant name must be at least 3 characters';
    }

    if (!formData.cuisine.trim()) {
      newErrors.cuisine = 'Cuisine type is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (formData.imageUrl && !formData.imageUrl.startsWith('http')) {
      newErrors.imageUrl = 'Image URL must be a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Restaurant Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Please enter restaurant name"
          required
          error={errors.name}
        />

        <div className="mb-4">
          <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-2">
            Cuisine Type <span className="text-red-500">*</span>
          </label>
          <select
            id="cuisine"
            name="cuisine"
            value={formData.cuisine}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.cuisine ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select cuisine type</option>
            <option value="Italian">Italian</option>
            <option value="Japanese">Japanese</option>
            <option value="American">American</option>
            <option value="Indian">Indian</option>
            <option value="French">French</option>
            <option value="Chinese">Chinese</option>
            <option value="Mexican">Mexican</option>
            <option value="Thai">Thai</option>
            <option value="Mediterranean">Mediterranean</option>
          </select>
          {errors.cuisine && <p className="mt-1 text-sm text-red-500">{errors.cuisine}</p>}
        </div>
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
          placeholder="Describe your restaurant's unique offerings and atmosphere..."
          rows={4}
          required
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>

      <Input
        label="Address"
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Your street, City, Province, Postal Code"
        required
        error={errors.address}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mb-4">
          <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-2">
            Price Range <span className="text-red-500">*</span>
          </label>
          <select
            id="priceRange"
            name="priceRange"
            value={formData.priceRange}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value={1}>$ - Budget Friendly</option>
            <option value={2}>$$ - Moderate</option>
            <option value={3}>$$$ - Upscale</option>
          </select>
        </div>

        <Input
          label="Image URL"
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/restaurant-image.jpg"
          error={errors.imageUrl}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : submitLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}