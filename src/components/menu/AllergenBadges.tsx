// src/components/menu/AllergenBadges.tsx

import type { Allergen } from '../../lib/types'

interface AllergenBadgesProps {
  allergens: Allergen[]
}

export default function AllergenBadges({ allergens }: AllergenBadgesProps) {
  if (allergens.length === 0) return null

  const contains = allergens.filter(a => a.severity === 'contains')
  const mayContain = allergens.filter(a => a.severity === 'may_contain')

  return (
    <div className="text-sm">
      {contains.length > 0 && (
        <div className="text-red-600">
          Contains: {contains.map(a => a.allergen_type).join(', ')}
        </div>
      )}
      {mayContain.length > 0 && (
        <div className="text-orange-500">
          May contain: {mayContain.map(a => a.allergen_type).join(', ')}
        </div>
      )}
    </div>
  )
}
