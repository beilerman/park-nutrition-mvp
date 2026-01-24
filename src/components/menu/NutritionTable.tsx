// src/components/menu/NutritionTable.tsx

import type { NutritionalData } from '../../lib/types'

interface NutritionTableProps {
  nutrition: NutritionalData
}

const NUTRIENTS = [
  { key: 'calories', label: 'Calories', unit: '' },
  { key: 'carbs', label: 'Carbohydrates', unit: 'g' },
  { key: 'sugar', label: 'Sugar', unit: 'g' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'fat', label: 'Total Fat', unit: 'g' },
  { key: 'saturated_fat', label: 'Saturated Fat', unit: 'g' },
  { key: 'fiber', label: 'Fiber', unit: 'g' },
  { key: 'sodium', label: 'Sodium', unit: 'mg' },
  { key: 'cholesterol', label: 'Cholesterol', unit: 'mg' },
] as const

export default function NutritionTable({ nutrition }: NutritionTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Nutrition Facts</h3>
        {nutrition.confidence_score < 70 && (
          <span className="text-sm text-orange-500 bg-orange-50 px-2 py-1 rounded">
            Estimated
          </span>
        )}
      </div>
      <div className="text-xs text-gray-500 mb-4">
        Source: {nutrition.source.replace('_', ' ')}
      </div>
      <table className="w-full">
        <tbody>
          {NUTRIENTS.map(({ key, label, unit }) => {
            const value = nutrition[key as keyof NutritionalData]
            if (value === null) return null
            return (
              <tr key={key} className="border-b border-gray-100 last:border-0">
                <td className="py-2 text-gray-700">{label}</td>
                <td className="py-2 text-right font-medium text-gray-900">
                  {value}{unit}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
