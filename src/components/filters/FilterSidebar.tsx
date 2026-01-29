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
    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-md p-6 border border-park-purple/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-park-blue flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="text-park-gold text-xs">&#10022;</span>
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-sm text-park-purple hover:text-park-gold transition-colors font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Calories Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-park-slate mb-3">Max Calories</h4>
        <select
          value={filters.maxCalories ?? ''}
          onChange={(e) => onFilterChange('maxCalories', e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-4 py-2.5 bg-park-soft/50 border border-park-purple/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-park-purple/30 text-park-slate"
        >
          {CALORIE_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.value ?? ''}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Allergens Filter */}
      <div>
        <h4 className="text-sm font-medium text-park-slate mb-3">Exclude Allergens</h4>
        <div className="space-y-1.5">
          {ALLERGENS.map((allergen) => {
            const isChecked = filters.excludeAllergens?.includes(allergen) ?? false
            return (
              <label
                key={allergen}
                className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                  isChecked ? 'bg-park-red/5 border border-park-red/20' : 'hover:bg-park-soft/50 border border-transparent'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleAllergen(allergen)}
                  className="w-4 h-4 text-park-red border-park-slate/30 rounded focus:ring-park-red"
                />
                <span className={`text-sm capitalize ${isChecked ? 'text-park-red font-medium' : 'text-park-slate'}`}>
                  {allergen}
                </span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
