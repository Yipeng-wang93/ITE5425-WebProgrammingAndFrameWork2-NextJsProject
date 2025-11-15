// Menu management page for restaurant partners

'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import MenuItemsList from '@/components/menuitems/MenuItemsList';
import MenuItemForm from '@/components/menuitems/MenuItemForm';
import Button from '@/components/ui/Button';

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

export default function MenuManagementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const restaurantId = resolvedParams.id;
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingItem(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDelete = async (itemId: string) => {
    const response = await fetch(`/api/menuitems/${itemId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete menu item');
    }
  };

  const handleBack = () => {
    router.push('/restaurants/manage');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-orange-600 hover:text-orange-700 mb-4"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Restaurant Management
          </button>
          
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
            {!showForm && (
              <Button variant="primary" onClick={handleAddNew}>
                + Add Menu Item
              </Button>
            )}
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
            <MenuItemForm
              restaurantId={restaurantId}
              initialData={editingItem || undefined}
              onSubmitSuccess={handleFormSuccess}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Menu Items List */}
        {!showForm && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Menu</h2>
            <MenuItemsList
              restaurantId={restaurantId}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showActions={true}
              refreshTrigger={refreshTrigger}
            />
          </div>
        )}
      </div>
    </div>
  );
}
