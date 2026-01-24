// src/components/menu/MenuItemCard.tsx

import { Link } from 'react-router-dom'
import type { MenuItemWithNutrition } from '../../lib/types'
import NutritionSummary from './NutritionSummary'
import AllergenBadges from './AllergenBadges'

interface MenuItemCardProps {
  item: MenuItemWithNutrition
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <Link
      to={`/items/${item.id}`}
      className="group block bg-white rounded-xl shadow-md p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
    >
      <div className="flex gap-4">
        {item.photo_url ? (
          <img
            src={item.photo_url}
            alt={item.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
        ) : (
          <div className="w-24 h-24 bg-park-soft rounded-lg flex items-center justify-center text-3xl">
            🍽️
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-park-blue group-hover:text-park-gold transition-colors text-lg truncate">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-park-slate/70 text-sm mt-1 line-clamp-2">{item.description}</p>
          )}
          <div className="mt-3">
            <NutritionSummary nutrition={item.nutritional_data} showConfidence />
          </div>
          <div className="mt-2">
            <AllergenBadges allergens={item.allergens} />
          </div>
          {item.price !== null && (
            <div className="text-park-gold font-bold text-lg mt-3">
              ${item.price.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
