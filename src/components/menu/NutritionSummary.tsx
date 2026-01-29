// src/components/menu/NutritionSummary.tsx

import type { NutritionalData } from '../../lib/types'

interface NutritionSummaryProps {
  nutrition: NutritionalData | null
  showConfidence?: boolean
}

export default function NutritionSummary({ nutrition, showConfidence }: NutritionSummaryProps) {
  if (!nutrition) {
    return (
      <span className="inline-block px-3 py-1 bg-park-soft/50 text-park-slate/50 text-sm rounded-full">
        No nutrition data
      </span>
    )
  }

  const parts: string[] = []
  if (nutrition.calories !== null) parts.push(`${nutrition.calories} cal`)
  if (nutrition.protein !== null) parts.push(`${nutrition.protein}g protein`)

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="inline-block px-3 py-1 bg-gradient-to-r from-park-purple/10 to-park-soft text-park-purple text-sm font-medium rounded-full">
        {parts.join(' · ')}
      </span>
      {showConfidence && nutrition.confidence_score < 70 && (
        <span className="text-park-orange text-xs font-medium">(estimated)</span>
      )}
    </div>
  )
}
