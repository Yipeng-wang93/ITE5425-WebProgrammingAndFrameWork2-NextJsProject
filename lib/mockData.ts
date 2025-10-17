// Mock data for Phase 1 UI demonstration before backend integration
import { Restaurant, Review, UserProfile } from '@/types';

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Shinta Japanese BBQ',
    cuisine: 'Japanese',
    description: 'At Shinta, we specialize in bringing you the finest Wagyu and Angus beef, expertly prepared for an unforgettable dining experience.',
    address: '5095 Yonge St 2rd Floor, North York, ON M2N 6Z4',
    priceRange: 2,
    rating: 4.7,
    imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/a2/f3/2d/dining-room.jpg?w=1400&h=800&s=1',
    ownerUserId: 'partner1',
  },
  {
    id: '2',
    name: 'Swiss Chalet',
    cuisine: 'Canadian',
    description: 'Swiss Chalet in Etobicoke, ON is an iconic Canadian restaurant, proudly serving up its famous Rotisserie Chicken, slow-roasted over an open flame, as well as Fresh-Cut Fries, Smoky BBQ Ribs, & their top-secret Signature Chalet Sauce.',
    address: '2955 Bloor St W, Etobicoke, ON M8X 1B8',
    priceRange: 1,
    rating: 3.9,
    imageUrl: 'https://dynl.mktgcdn.com/p/BnSXm_UG0DQgtGXNyFHmPUyb1OyL_ebMzan8r0p7q6s/1200x1200.jpg',
    ownerUserId: 'partner1',
  },
  {
    id: '3',
    name: 'Burger King',
    cuisine: 'American',
    description: 'Burger King is known for serving high-quality, great-tasting, and affordable food. Founded in 1954, Burger King is the second largest fast food hamburger chain in the world. The original Home of the Whopper, our commitment to premium ingredients, signature recipes, and family-friendly dining experiences is what has defined our brand for 70 successful years.',
    address: '4141 Dixie Rd Store No. 12, Mississauga, ON L4W 1V5',
    priceRange: 1,
    rating: 3.6,
    imageUrl: 'https://www.allrecipes.com/thmb/muInfcIc1KDD7OBGW-nVmSiUlNk=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/ar-burger-king-getty-4x3-2-25772f696b734be5b78cb73cc4529ec7.jpg',
    ownerUserId: 'partner2',
  },
  {
    id: '4',
    name: 'Kothur Indian Cuisine',
    cuisine: 'Indian',
    description: 'This small Indian restaurant has achieved what others have not to keep the same food quality after at least 20 years.',
    address: '649 Yonge St, Toronto, ON M4Y 1Z9',
    priceRange: 2,
    rating: 4.3,
    imageUrl: 'https://torontoblogs.ca/wp-content/uploads/2021/10/unnamed-36-1200x799.png',
    ownerUserId: 'partner2',
  },
  {
    id: '5',
    name: 'Hou Kee Chinese Bistro',
    cuisine: 'Chinese',
    description: 'Hou Kee Chinese Bistro is a classic Cantonese-style Chinese bistro known for serving a variety of traditional pig trotter rice dishes at very affordable prices.',
    address: '5 Northtown Way, on yonge #7, North York, ON M2N 7A1',
    priceRange: 1,
    rating: 4.6,
    imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipPcx7gCQsNvi8n-XGpS0x3BRECEDOvYMErBIzVK=w289-h312-n-k-no',
    ownerUserId: 'partner2',
  },
];

export const cuisineTypes = ['Japanese', 'Canadian', 'American', 'Indian', 'French', 'Chinese', 'Mexican', 'Italian', 'Thai', 'Korean', 'Mediterranean'];

// For Cristian's features - Reviews and User Profiles
export const mockReviews: Review[] = [
  {
    id: '1',
    restaurantId: '1',
    userId: 'user1',
    userName: 'Yipeng Wang',
    rating: 5,
    comment: 'Absolutely fantastic! The good was fresh and the service was impeccable. Will definitely return.',
    createdAt: '2025-10-17T15:20:00Z',
  },
  {
    id: '2',
    restaurantId: '1',
    userId: 'user2',
    userName: 'Hazique Ahmed Syed',
    rating: 4,
    comment: 'The food was excellent, though the wait time was a bit long during peak hours.',
    createdAt: '2025-08-21T20:42:00Z',
  },
  {
    id: '3',
    restaurantId: '2',
    userId: 'user3',
    userName: 'Samuel JoJo',
    rating: 5,
    comment: 'Best food in Toronto! You must try. Highly recommended for family dinners.',
    createdAt: '2025-06-14T20:15:00Z',
  },
  {
    id: '4',
    restaurantId: '2',
    userId: 'user4',
    userName: 'Cristian Rodriguez Ayala',
    rating: 5,
    comment: 'Outstanding quality. The flavors were rich and authentic.',
    createdAt: '2025-09-12T21:00:00Z',
  },
  {
    id: '5',
    restaurantId: '3',
    userId: 'user5',
    userName: 'Nithya Thayananthan',
    rating: 4,
    comment: 'The atmosphere is casual and perfect for families.',
    createdAt: '2025-07-13T19:20:00Z',
  },
];

export const mockUserProfile: UserProfile = {
  id: 'user1',
  name: 'Narendra Bengaluru Thippeswamy',
  email: 'narendra@test.com',
  role: 'customer',
  displayName: 'NarendraBT',
  phone: '(123) 456-7890',
  address: '59 Hayden St Unit 400, Toronto, ON M4Y 0E7',
};

//This constant will be replaced by authentication context that provides 
// the actual authenticated user's information throughout our application.
export const mockCurrentPartnerId = 'partner1'; // You can change to partner2 to test as well. but it will be removed during Phase 2