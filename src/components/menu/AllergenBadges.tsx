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
    <div className="flex flex-wrap gap-2 text-sm">
      {contains.map((a) => (
        <span
          key={a.id}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-park-red/10 text-park-red font-medium rounded-full"
        >
          <span className="text-xs">⚠️</span>
          {a.allergen_type}
        </span>
      ))}
      {mayContain.map((a) => (
        <span
          key={a.id}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-park-orange/10 text-park-orange font-medium rounded-full"
        >
          {a.allergen_type}
        </span>
      ))}
    </div>
  )
}
