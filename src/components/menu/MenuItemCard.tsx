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
      className="block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4">
        {item.photo_url && (
          <img
            src={item.photo_url}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
          {item.description && (
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
          )}
          <div className="mt-2">
            <NutritionSummary nutrition={item.nutritional_data} showConfidence />
          </div>
          <div className="mt-2">
            <AllergenBadges allergens={item.allergens} />
          </div>
          {item.price !== null && (
            <div className="text-green-600 font-medium mt-2">
              ${item.price.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
