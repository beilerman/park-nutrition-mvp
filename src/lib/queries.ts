// src/lib/queries.ts

import { useQuery } from '@tanstack/react-query'
import { supabase } from './supabase'
import type { Park, Restaurant, MenuItemWithNutrition, Filters } from './types'
import {
  validateParks,
  validateRestaurants,
  validateRestaurant,
  validateMenuItems,
  validateMenuItem,
} from './validation'

const DEFAULT_FILTERS_KEY = {
  category: null,
  maxCalories: null,
  excludeAllergens: '',
}

function getFiltersKey(filters?: Filters) {
  if (!filters) return DEFAULT_FILTERS_KEY

  return {
    category: filters.category ?? null,
    maxCalories: filters.maxCalories ?? null,
    excludeAllergens: (filters.excludeAllergens ?? []).slice().sort().join(','),
  }
}

function getSafeAllergens(allergens: MenuItemWithNutrition['allergens']) {
  return allergens ?? []
}

function escapeSearchQuery(query: string): string {
  // Escape special characters for PostgreSQL ILIKE and PostgREST query syntax
  // 1. Escape backslashes first (must be done before other escapes)
  // 2. Escape LIKE wildcards: % and _
  // 3. Escape PostgREST special chars: comma, parentheses, quotes, dots
  return query
    .replace(/\\/g, '\\\\')
    .replace(/[%_]/g, '\\$&')
    .replace(/[,().'"]/g, '')
}

export function useParks() {
  return useQuery({
    queryKey: ['parks'],
    queryFn: async (): Promise<Park[]> => {
      const { data, error } = await supabase
        .from('parks')
        .select('*')
        .order('name')
      if (error) throw error
      return validateParks(data)
    },
  })
}

export function useRestaurants(parkId: string | undefined) {
  return useQuery({
    queryKey: ['restaurants', parkId],
    queryFn: async (): Promise<Restaurant[]> => {
      if (!parkId) return []
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('park_id', parkId)
        .order('name')
      if (error) throw error
      return validateRestaurants(data)
    },
    enabled: !!parkId,
  })
}

export interface RestaurantWithPark extends Restaurant {
  park: { id: string; name: string }
}

export function useRestaurant(id: string | undefined) {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: async (): Promise<RestaurantWithPark | null> => {
      if (!id) return null
      const { data, error } = await supabase
        .from('restaurants')
        .select('*, park:parks (id, name)')
        .eq('id', id)
        .single()
      if (error) throw error
      return {
        ...validateRestaurant(data),
        park: data.park as { id: string; name: string },
      }
    },
    enabled: !!id,
  })
}

export function useMenuItems(restaurantId: string | undefined, filters?: Filters) {
  return useQuery({
    queryKey: ['menuItems', restaurantId, getFiltersKey(filters)],
    queryFn: async (): Promise<MenuItemWithNutrition[]> => {
      if (!restaurantId) return []

      let query = supabase
        .from('menu_items')
        .select(`
          *,
          nutritional_data (*),
          allergens (*)
        `)
        .eq('restaurant_id', restaurantId)

      if (filters?.category) {
        query = query.eq('category', filters.category)
      }

      const { data, error } = await query.order('name')
      if (error) throw error

      // Validate and filter
      let items = validateMenuItems(data)

      if (filters?.maxCalories !== undefined) {
        items = items.filter(item =>
          item.nutritional_data &&
          item.nutritional_data.calories !== null &&
          item.nutritional_data.calories <= filters.maxCalories!
        )
      }

      if (filters?.excludeAllergens?.length) {
        items = items.filter(item =>
          !getSafeAllergens(item.allergens).some(a =>
            filters.excludeAllergens!.includes(a.allergen_type) &&
            a.severity === 'contains'
          )
        )
      }

      return items
    },
    enabled: !!restaurantId,
  })
}

export function useMenuItem(id: string | undefined) {
  return useQuery({
    queryKey: ['menuItem', id],
    queryFn: async (): Promise<MenuItemWithNutrition | null> => {
      if (!id) return null
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          nutritional_data (*),
          allergens (*),
          restaurant:restaurants (*, park:parks (*))
        `)
        .eq('id', id)
        .single()
      if (error) throw error
      return validateMenuItem(data)
    },
    enabled: !!id,
  })
}

export function useSearch(query: string, filters?: Filters) {
  return useQuery({
    queryKey: ['search', query, getFiltersKey(filters)],
    queryFn: async (): Promise<MenuItemWithNutrition[]> => {
      if (!query.trim()) return []

      const escapedQuery = escapeSearchQuery(query.trim())
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          nutritional_data (*),
          allergens (*),
          restaurant:restaurants (*, park:parks (*))
        `)
        .or(`name.ilike.%${escapedQuery}%,description.ilike.%${escapedQuery}%`)
        .order('name')
        .limit(50)

      if (error) throw error

      let items = validateMenuItems(data)

      if (filters?.maxCalories !== undefined) {
        items = items.filter(item =>
          item.nutritional_data &&
          item.nutritional_data.calories !== null &&
          item.nutritional_data.calories <= filters.maxCalories!
        )
      }

      if (filters?.excludeAllergens?.length) {
        items = items.filter(item =>
          !getSafeAllergens(item.allergens).some(a =>
            filters.excludeAllergens!.includes(a.allergen_type) &&
            a.severity === 'contains'
          )
        )
      }

      return items
    },
    enabled: query.trim().length > 0,
  })
}

export interface Stats {
  menuItemCount: number
  allergenTypesCount: number
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async (): Promise<Stats> => {
      // Get menu items count
      const { count: menuItemCount, error: menuError } = await supabase
        .from('menu_items')
        .select('*', { count: 'exact', head: true })

      if (menuError) throw menuError

      // Get distinct allergen types (only fetch unique values, not every row)
      const { data: allergenData, error: allergenError } = await supabase
        .from('allergens')
        .select('allergen_type')
        .limit(1000)

      if (allergenError) throw allergenError

      const uniqueAllergens = new Set(allergenData?.map(a => a.allergen_type) ?? [])

      return {
        menuItemCount: menuItemCount ?? 0,
        allergenTypesCount: uniqueAllergens.size,
      }
    },
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  })
}
