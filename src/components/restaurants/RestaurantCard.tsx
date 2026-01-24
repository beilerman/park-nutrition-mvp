// src/components/restaurants/RestaurantCard.tsx

import { Link } from 'react-router-dom'
import type { Restaurant } from '../../lib/types'

interface RestaurantCardProps {
  restaurant: Restaurant
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="group block bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-park-blue group-hover:text-park-gold transition-colors">
            {restaurant.name}
          </h2>
          {restaurant.cuisine_type && (
            <span className="inline-block mt-2 px-3 py-1 bg-park-soft text-park-blue text-sm font-medium rounded-full">
              {restaurant.cuisine_type}
            </span>
          )}
          {restaurant.location_in_park && (
            <p className="text-park-slate/70 text-sm mt-2 flex items-center gap-1.5">
              <span>📍</span>
              {restaurant.location_in_park}
            </p>
          )}
        </div>
        <span className="text-park-gold opacity-0 group-hover:opacity-100 transition-opacity text-xl">
          →
        </span>
      </div>
    </Link>
  )
}
