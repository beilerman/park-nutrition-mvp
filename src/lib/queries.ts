// src/lib/queries.ts

import { useQuery } from '@tanstack/react-query'
import { supabase } from './supabase'
import type { Park, Restaurant, MenuItemWithNutrition, Filters } from './types'

export function useParks() {
  return useQuery({
    queryKey: ['parks'],
    queryFn: async (): Promise<Park[]> => {
      const { data, error } = await supabase
        .from('parks')
        .select('*')
        .order('name')
      if (error) throw error
      return data
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
      return data
    },
    enabled: !!parkId,
  })
}

export function useMenuItems(restaurantId: string | undefined, filters?: Filters) {
  return useQuery({
    queryKey: ['menuItems', restaurantId, filters],
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

      // Client-side filtering for nutrition and allergens
      let items = data as MenuItemWithNutrition[]

      if (filters?.maxCalories !== undefined) {
        items = items.filter(item =>
          item.nutritional_data &&
          item.nutritional_data.calories !== null &&
          item.nutritional_data.calories <= filters.maxCalories!
        )
      }

      if (filters?.excludeAllergens?.length) {
        items = items.filter(item =>
          !item.allergens.some(a =>
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
      return data as MenuItemWithNutrition
    },
    enabled: !!id,
  })
}

export function useSearch(query: string, filters?: Filters) {
  return useQuery({
    queryKey: ['search', query, filters],
    queryFn: async (): Promise<MenuItemWithNutrition[]> => {
      if (!query.trim()) return []

      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          nutritional_data (*),
          allergens (*),
          restaurant:restaurants (*, park:parks (*))
        `)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('name')
        .limit(50)

      if (error) throw error

      let items = data as MenuItemWithNutrition[]

      if (filters?.maxCalories !== undefined) {
        items = items.filter(item =>
          item.nutritional_data &&
          item.nutritional_data.calories !== null &&
          item.nutritional_data.calories <= filters.maxCalories!
        )
      }

      if (filters?.excludeAllergens?.length) {
        items = items.filter(item =>
          !item.allergens.some(a =>
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
