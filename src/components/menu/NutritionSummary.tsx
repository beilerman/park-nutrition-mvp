// src/components/menu/NutritionSummary.tsx

import type { NutritionalData } from '../../lib/types'

interface NutritionSummaryProps {
  nutrition: NutritionalData | null
  showConfidence?: boolean
}

export default function NutritionSummary({ nutrition, showConfidence }: NutritionSummaryProps) {
  if (!nutrition) {
    return <div className="text-gray-400 text-sm">No nutrition data</div>
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      {nutrition.calories !== null && (
        <span className="font-medium">{nutrition.calories} cal</span>
      )}
      {nutrition.carbs !== null && (
        <span className="text-gray-600">{nutrition.carbs}g carbs</span>
      )}
      {nutrition.protein !== null && (
        <span className="text-gray-600">{nutrition.protein}g protein</span>
      )}
      {nutrition.fat !== null && (
        <span className="text-gray-600">{nutrition.fat}g fat</span>
      )}
      {showConfidence && nutrition.confidence_score < 70 && (
        <span className="text-orange-500 text-xs">(estimated)</span>
      )}
    </div>
  )
}
