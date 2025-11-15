// Menu item card component for displaying and managing menu items

'use client';

import { useState } from 'react';
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

interface MenuItemCardProps {
  item: MenuItem;
  onEdit?: (item: MenuItem) => void;
  onDelete?: (itemId: string) => void;
  showActions?: boolean;
}

export default function MenuItemCard({
  item,
  onEdit,
  onDelete,
  showActions = false
}: MenuItemCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(item.id);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg ${
      !item.isAvailable ? 'opacity-60' : ''
    }`}>
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-48 h-48 md:h-auto bg-gray-200 flex-shrink-0">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                {!item.isAvailable && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                    Unavailable
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-2">{item.category}</p>
              <p className="text-gray-700 text-sm mb-3">{item.description}</p>

              {/* Dietary Tags */}
              {item.dietaryTags && item.dietaryTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.dietaryTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Price */}
              <p className="text-xl font-bold text-orange-600">
                ${item.price.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="mt-4 flex gap-2">
              {onEdit && (
                <Button
                  variant="secondary"
                  onClick={() => onEdit(item)}
                  className="text-sm px-4 py-1"
                >
                  Edit
                </Button>
              )}
              {onDelete && !showDeleteConfirm && (
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-sm px-4 py-1"
                >
                  Delete
                </Button>
              )}
              {showDeleteConfirm && (
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-gray-700">Are you sure?</span>
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-sm px-3 py-1"
                  >
                    {isDeleting ? 'Deleting...' : 'Yes'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-sm px-3 py-1"
                  >
                    No
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
