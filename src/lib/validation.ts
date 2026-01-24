// src/lib/validation.ts

import type { Park, Restaurant, MenuItemWithNutrition, NutritionalData, Allergen } from './types'

/**
 * Runtime validation helpers for Supabase responses.
 * These functions validate the shape of data returned from the database
 * to catch schema mismatches early.
 */

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

export function validatePark(data: unknown): Park {
  if (!isObject(data)) {
    throw new Error('Invalid park data: expected object')
  }
  if (!isString(data.id) || !isString(data.name) || !isString(data.location)) {
    throw new Error('Invalid park data: missing required fields')
  }
  return data as unknown as Park
}

export function validateParks(data: unknown): Park[] {
  if (!Array.isArray(data)) {
    throw new Error('Invalid parks data: expected array')
  }
  return data.map(validatePark)
}

export function validateRestaurant(data: unknown): Restaurant {
  if (!isObject(data)) {
    throw new Error('Invalid restaurant data: expected object')
  }
  if (!isString(data.id) || !isString(data.park_id) || !isString(data.name)) {
    throw new Error('Invalid restaurant data: missing required fields')
  }
  return data as unknown as Restaurant
}

export function validateRestaurants(data: unknown): Restaurant[] {
  if (!Array.isArray(data)) {
    throw new Error('Invalid restaurants data: expected array')
  }
  return data.map(validateRestaurant)
}

function validateNutritionalData(data: unknown): NutritionalData | null {
  if (data === null) return null
  if (!isObject(data)) {
    throw new Error('Invalid nutritional data: expected object or null')
  }
  if (!isString(data.id) || !isString(data.menu_item_id)) {
    throw new Error('Invalid nutritional data: missing required fields')
  }
  return data as unknown as NutritionalData
}

function validateAllergen(data: unknown): Allergen {
  if (!isObject(data)) {
    throw new Error('Invalid allergen data: expected object')
  }
  if (!isString(data.id) || !isString(data.menu_item_id) || !isString(data.allergen_type)) {
    throw new Error('Invalid allergen data: missing required fields')
  }
  return data as unknown as Allergen
}

function validateAllergens(data: unknown): Allergen[] {
  if (!Array.isArray(data)) {
    return []
  }
  return data.map(validateAllergen)
}

export function validateMenuItem(data: unknown): MenuItemWithNutrition {
  if (!isObject(data)) {
    throw new Error('Invalid menu item data: expected object')
  }
  if (!isString(data.id) || !isString(data.restaurant_id) || !isString(data.name)) {
    throw new Error('Invalid menu item data: missing required fields')
  }
  if (!isString(data.category)) {
    throw new Error('Invalid menu item data: missing category')
  }
  if (!isBoolean(data.is_seasonal)) {
    throw new Error('Invalid menu item data: is_seasonal must be boolean')
  }

  // Handle price - Supabase returns DECIMAL as string
  const price = data.price
  if (price !== null && typeof price === 'string') {
    data.price = parseFloat(price)
  }

  // Validate nested relations
  const result = {
    ...data,
    nutritional_data: validateNutritionalData(data.nutritional_data),
    allergens: validateAllergens(data.allergens),
  } as MenuItemWithNutrition

  // Validate optional restaurant relation if present
  if (data.restaurant !== undefined && data.restaurant !== null) {
    result.restaurant = validateRestaurant(data.restaurant)
  }

  return result
}

export function validateMenuItems(data: unknown): MenuItemWithNutrition[] {
  if (!Array.isArray(data)) {
    throw new Error('Invalid menu items data: expected array')
  }
  return data.map(validateMenuItem)
}
