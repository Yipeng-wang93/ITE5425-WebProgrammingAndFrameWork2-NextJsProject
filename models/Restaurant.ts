// Restaurant model with owner relationship

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRestaurant extends Document {
  _id: string;
  name: string;
  cuisine: string;
  description: string;
  address: string;
  priceRange: number;
  rating: number;
  imageUrl: string;
  ownerUserId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new Schema<IRestaurant>(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
      minlength: [3, 'Restaurant name must be at least 3 characters'],
    },
    cuisine: {
      type: String,
      required: [true, 'Cuisine type is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    priceRange: {
      type: Number,
      required: true,
      min: [1, 'Price range must be between 1 and 3'],
      max: [3, 'Price range must be between 1 and 3'],
      default: 2,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    ownerUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner user ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search optimization
RestaurantSchema.index({ name: 'text', description: 'text' });
RestaurantSchema.index({ cuisine: 1 });
RestaurantSchema.index({ priceRange: 1 });
RestaurantSchema.index({ rating: -1 });
RestaurantSchema.index({ ownerUserId: 1 });

const Restaurant: Model<IRestaurant> =
  mongoose.models.Restaurant || mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);

export default Restaurant;