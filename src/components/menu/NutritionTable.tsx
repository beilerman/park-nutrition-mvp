// src/components/menu/NutritionTable.tsx

import type { NutritionalData } from '../../lib/types'

interface NutritionTableProps {
  nutrition: NutritionalData
}

const NUTRIENTS: Array<{ key: string; label: string; unit: string; highlight?: boolean }> = [
  { key: 'calories', label: 'Calories', unit: '', highlight: true },
  { key: 'protein', label: 'Protein', unit: 'g', highlight: true },
  { key: 'carbs', label: 'Carbohydrates', unit: 'g' },
  { key: 'sugar', label: 'Sugar', unit: 'g' },
  { key: 'fat', label: 'Total Fat', unit: 'g' },
  { key: 'saturated_fat', label: 'Saturated Fat', unit: 'g' },
  { key: 'fiber', label: 'Fiber', unit: 'g' },
  { key: 'sodium', label: 'Sodium', unit: 'mg' },
  { key: 'cholesterol', label: 'Cholesterol', unit: 'mg' },
]

export default function NutritionTable({ nutrition }: NutritionTableProps) {
  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-md overflow-hidden border border-park-purple/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-park-purple/10 to-park-soft px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-park-blue flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="text-park-gold text-sm">&#10022;</span>
            Nutrition Facts
          </h3>
          {nutrition.confidence_score < 70 && (
            <span className="text-sm text-park-orange bg-park-orange/10 px-3 py-1 rounded-full font-medium">
              Estimated
            </span>
          )}
        </div>
        <div className="text-sm text-park-slate/60 mt-1 capitalize">
          Source: {nutrition.source.replace('_', ' ')}
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="px-6 py-3 border-b border-park-purple/10">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-park-slate/70">Data Confidence</span>
          <span className="font-medium text-park-purple">{nutrition.confidence_score}%</span>
        </div>
        <div className="h-2 bg-park-soft rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-park-purple to-park-gold rounded-full transition-all"
            style={{ width: `${nutrition.confidence_score}%` }}
          />
        </div>
      </div>

      {/* Table */}
      <table className="w-full">
        <tbody>
          {NUTRIENTS.map(({ key, label, unit, highlight }, idx) => {
            const value = nutrition[key as keyof NutritionalData]
            if (value === null) return null
            return (
              <tr
                key={key}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-park-cream/50'}
              >
                <td className={`px-6 py-3 text-park-slate ${highlight ? 'font-medium' : ''}`}>
                  {label}
                </td>
                <td className={`px-6 py-3 text-right ${highlight ? 'font-bold text-park-purple' : 'font-medium text-park-slate'}`}>
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
