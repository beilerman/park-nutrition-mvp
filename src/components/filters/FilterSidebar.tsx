// src/components/filters/FilterSidebar.tsx

import type { Filters } from '../../lib/types'

const ALLERGENS = [
  'milk',
  'eggs',
  'fish',
  'shellfish',
  'tree nuts',
  'peanuts',
  'wheat',
  'soy',
]

const CALORIE_OPTIONS = [
  { label: 'Any', value: undefined },
  { label: 'Under 300', value: 300 },
  { label: 'Under 500', value: 500 },
  { label: 'Under 700', value: 700 },
  { label: 'Under 1000', value: 1000 },
]

interface FilterSidebarProps {
  filters: Filters
  onFilterChange: (key: keyof Filters, value: unknown) => void
  onClear: () => void
}

export default function FilterSidebar({ filters, onFilterChange, onClear }: FilterSidebarProps) {
  const toggleAllergen = (allergen: string) => {
    const current = filters.excludeAllergens || []
    const updated = current.includes(allergen)
      ? current.filter((a) => a !== allergen)
      : [...current, allergen]
    onFilterChange('excludeAllergens', updated)
  }

  const hasActiveFilters = filters.maxCalories || (filters.excludeAllergens?.length ?? 0) > 0

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-sm text-green-600 hover:text-green-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Max Calories</h4>
        <select
          value={filters.maxCalories ?? ''}
          onChange={(e) => onFilterChange('maxCalories', e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {CALORIE_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.value ?? ''}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Exclude Allergens</h4>
        <div className="space-y-2">
          {ALLERGENS.map((allergen) => (
            <label key={allergen} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.excludeAllergens?.includes(allergen) ?? false}
                onChange={() => toggleAllergen(allergen)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700 capitalize">{allergen}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
