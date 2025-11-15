'use client';

// Service for fetching restaurant and menu data from external public API
// Using TheMealDB API (free, no auth required)

const MEAL_DB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export interface ExternalMeal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string;
  [key: string]: any;
}

export interface ExternalCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

// Fetch all categories (acts as restaurants/cuisines)
export const fetchCategories = async (): Promise<ExternalCategory[]> => {
  try {
    const response = await fetch(`${MEAL_DB_BASE_URL}/categories.php`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Fetch meals by category (acts as restaurant's menu items)
export const fetchMealsByCategory = async (category: string): Promise<ExternalMeal[]> => {
  try {
    const response = await fetch(`${MEAL_DB_BASE_URL}/filter.php?c=${category}`);
    if (!response.ok) {
      throw new Error('Failed to fetch meals');
    }
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching meals by category:', error);
    return [];
  }
};

// Fetch meal details by ID
export const fetchMealById = async (id: string): Promise<ExternalMeal | null> => {
  try {
    const response = await fetch(`${MEAL_DB_BASE_URL}/lookup.php?i=${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch meal details');
    }
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error('Error fetching meal by ID:', error);
    return null;
  }
};

// Fetch meals by area/cuisine (acts as restaurant specialties)
export const fetchMealsByArea = async (area: string): Promise<ExternalMeal[]> => {
  try {
    const response = await fetch(`${MEAL_DB_BASE_URL}/filter.php?a=${area}`);
    if (!response.ok) {
      throw new Error('Failed to fetch meals by area');
    }
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching meals by area:', error);
    return [];
  }
};

// Search meals by name
export const searchMeals = async (query: string): Promise<ExternalMeal[]> => {
  try {
    const response = await fetch(`${MEAL_DB_BASE_URL}/search.php?s=${query}`);
    if (!response.ok) {
      throw new Error('Failed to search meals');
    }
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error searching meals:', error);
    return [];
  }
};

// Get random meal (for featured items)
export const getRandomMeal = async (): Promise<ExternalMeal | null> => {
  try {
    const response = await fetch(`${MEAL_DB_BASE_URL}/random.php`);
    if (!response.ok) {
      throw new Error('Failed to fetch random meal');
    }
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error('Error fetching random meal:', error);
    return null;
  }
};

// Transform category to restaurant format
export const transformCategoryToRestaurant = (category: ExternalCategory, index: number) => {
  // Generate consistent rating based on category name
  const ratings = [4.7, 4.5, 4.3, 4.6, 4.4, 4.8, 4.2, 4.5, 4.6, 4.3];
  const priceRanges = [2, 2, 1, 2, 3, 2, 1, 2, 2, 1];
  
  // Mock addresses for different cuisines
  const addresses = [
    '123 Main St, Toronto, ON M5H 2N2',
    '456 Queen St W, Toronto, ON M5V 2A2',
    '789 King St E, Toronto, ON M5A 1M3',
    '321 Yonge St, Toronto, ON M5B 1R7',
    '654 Bloor St W, Toronto, ON M6G 1K8',
    '987 Dundas St W, Toronto, ON M6J 1W3',
    '147 College St, Toronto, ON M5T 1P7',
    '258 Spadina Ave, Toronto, ON M5T 2C2',
    '369 Harbord St, Toronto, ON M6G 1H3',
    '741 Ossington Ave, Toronto, ON M6G 3T9',
  ];

  return {
    id: category.idCategory,
    name: `${category.strCategory} House`,
    cuisine: category.strCategory,
    description: category.strCategoryDescription.slice(0, 200) + '...',
    address: addresses[index % addresses.length],
    priceRange: priceRanges[index % priceRanges.length],
    rating: ratings[index % ratings.length],
    imageUrl: category.strCategoryThumb,
    ownerUserId: `owner-${category.idCategory}`,
  };
};

// Transform meal to menu item format
export const transformMealToMenuItem = (meal: ExternalMeal, restaurantId: string) => {
  // Generate price based on meal name length (just for variety)
  const basePrice = 8 + (meal.strMeal.length % 15);
  
  return {
    id: meal.idMeal,
    restaurantId: restaurantId,
    name: meal.strMeal,
    description: meal.strInstructions ? meal.strInstructions.slice(0, 100) + '...' : 'Delicious specialty dish',
    price: basePrice + 0.99,
    category: meal.strCategory || 'Main Course',
    imageUrl: meal.strMealThumb,
    available: true,
  };
};