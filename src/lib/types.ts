// src/lib/types.ts

export interface Park {
  id: string
  name: string
  location: string
  timezone: string
  created_at: string
}

export interface Restaurant {
  id: string
  park_id: string
  name: string
  location_in_park: string | null
  cuisine_type: string | null
  hours: Record<string, string> | null
  latitude: number | null
  longitude: number | null
  created_at: string
}

export interface MenuItem {
  id: string
  restaurant_id: string
  name: string
  description: string | null
  price: number | null
  category: 'entree' | 'snack' | 'beverage' | 'dessert' | 'side'
  is_seasonal: boolean
  photo_url: string | null
  last_verified_date: string | null
  created_at: string
}

export interface NutritionalData {
  id: string
  menu_item_id: string
  source: 'official' | 'crowdsourced' | 'api_lookup'
  calories: number | null
  carbs: number | null
  sugar: number | null
  protein: number | null
  fat: number | null
  saturated_fat: number | null
  sodium: number | null
  fiber: number | null
  cholesterol: number | null
  confidence_score: number
  created_at: string
}

export interface Allergen {
  id: string
  menu_item_id: string
  allergen_type: string
  severity: 'contains' | 'may_contain'
  created_at: string
}

export interface MenuItemWithNutrition extends MenuItem {
  nutritional_data: NutritionalData | null
  allergens: Allergen[]
  restaurant?: Restaurant
}

export interface RestaurantWithMenuItems extends Restaurant {
  menu_items: MenuItemWithNutrition[]
  park?: Park
}

export interface Filters {
  maxCalories?: number
  minCalories?: number
  excludeAllergens?: string[]
  dietTags?: string[]
  category?: MenuItem['category']
  maxPrice?: number
}
