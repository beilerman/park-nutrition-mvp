// src/components/menu/MenuItemCard.tsx

import { Link } from 'react-router-dom'
import type { MenuItemWithNutrition } from '../../lib/types'
import NutritionSummary from './NutritionSummary'
import AllergenBadges from './AllergenBadges'

function formatPrice(price: number | string | null): string | null {
  if (price === null) return null
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(numPrice)) return null
  return numPrice.toFixed(2)
}

interface MenuItemCardProps {
  item: MenuItemWithNutrition
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <Link
      to={`/items/${item.id}`}
      className="group relative block overflow-hidden bg-white/90 backdrop-blur rounded-2xl border border-park-purple/10 shadow-md p-5 hover:shadow-xl hover:shadow-park-purple/10 hover:-translate-y-1 transition-all duration-300"
    >
      <span className="absolute top-3 right-3 text-park-gold text-xs opacity-0 group-hover:opacity-100 transition-opacity animate-twinkle">&#10022;</span>
      <div className="flex gap-4">
        {item.photo_url ? (
          <img
            src={item.photo_url}
            alt={item.name}
            className="w-24 h-24 object-cover rounded-xl"
          />
        ) : (
          <div className="w-24 h-24 bg-gradient-to-br from-park-soft to-park-purple/10 rounded-xl flex items-center justify-center text-3xl">
            🍽️
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-park-blue group-hover:text-park-purple transition-colors text-lg truncate" style={{ fontFamily: 'var(--font-display)' }}>
            {item.name}
          </h3>
          {item.description && (
            <p className="text-park-slate/60 text-sm mt-1 line-clamp-2">{item.description}</p>
          )}
          <div className="mt-3">
            <NutritionSummary nutrition={item.nutritional_data} showConfidence />
          </div>
          <div className="mt-2">
            <AllergenBadges allergens={item.allergens} />
          </div>
          {formatPrice(item.price) && (
            <div className="text-park-gold font-bold text-lg mt-3">
              ${formatPrice(item.price)}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
