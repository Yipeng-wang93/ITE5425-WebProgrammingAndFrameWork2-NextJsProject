// Menu item model with restaurant relationship

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMenuItem extends Document {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  dietaryTags: string[];
  isAvailable: boolean;
  imageUrl: string;
  restaurantId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
      trim: true,
      minlength: [2, 'Menu item name must be at least 2 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Side Dish', 'Special'],
        message: 'Category must be one of: Appetizer, Main Course, Dessert, Beverage, Side Dish, Special',
      },
    },
    dietaryTags: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
MenuItemSchema.index({ restaurantId: 1, category: 1 });
MenuItemSchema.index({ restaurantId: 1, isAvailable: 1 });
MenuItemSchema.index({ name: 'text', description: 'text' });

const MenuItem: Model<IMenuItem> =
  mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);

export default MenuItem;