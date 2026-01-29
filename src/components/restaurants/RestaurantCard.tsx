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
      className="group relative block overflow-hidden bg-white/90 backdrop-blur rounded-2xl border border-park-purple/10 shadow-md p-6 hover:shadow-xl hover:shadow-park-purple/10 hover:-translate-y-1.5 transition-all duration-300"
    >
      <span className="absolute top-3 right-3 text-park-gold text-sm opacity-0 group-hover:opacity-100 transition-opacity animate-twinkle">&#10022;</span>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-park-blue group-hover:text-park-purple transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
            {restaurant.name}
          </h2>
          {restaurant.cuisine_type && (
            <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-park-purple/10 to-park-soft text-park-purple text-sm font-medium rounded-full">
              {restaurant.cuisine_type}
            </span>
          )}
          {restaurant.location_in_park && (
            <p className="text-park-slate/60 text-sm mt-2 flex items-center gap-1.5">
              <span>📍</span>
              {restaurant.location_in_park}
            </p>
          )}
        </div>
        <span className="text-park-purple opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-xl">
          &rarr;
        </span>
      </div>
    </Link>
  )
}
