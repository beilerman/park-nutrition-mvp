// src/hooks/useFilters.ts

import { useSearchParams } from 'react-router-dom'
import type { Filters } from '../lib/types'

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const categoryParam = searchParams.get('category')
  const validCategories = ['entree', 'snack', 'beverage', 'dessert', 'side'] as const
  const category = categoryParam && validCategories.includes(categoryParam as typeof validCategories[number])
    ? (categoryParam as Filters['category'])
    : undefined

  const filters: Filters = {
    maxCalories: searchParams.get('maxCalories') ? Number(searchParams.get('maxCalories')) : undefined,
    excludeAllergens: searchParams.getAll('exclude'),
    category,
  }

  const setFilter = (key: keyof Filters, value: unknown) => {
    const newParams = new URLSearchParams(searchParams)

    if (key === 'excludeAllergens' && Array.isArray(value)) {
      newParams.delete('exclude')
      value.forEach((v) => newParams.append('exclude', v))
    } else if (value === undefined || value === null || value === '') {
      newParams.delete(key === 'maxCalories' ? 'maxCalories' : key)
    } else {
      newParams.set(key === 'maxCalories' ? 'maxCalories' : key, String(value))
    }

    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  return { filters, setFilter, clearFilters }
}
