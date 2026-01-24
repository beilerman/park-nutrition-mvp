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
      className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <h2 className="text-lg font-semibold text-gray-900">{restaurant.name}</h2>
      {restaurant.cuisine_type && (
        <p className="text-sm text-green-600 mt-1">{restaurant.cuisine_type}</p>
      )}
      {restaurant.location_in_park && (
        <p className="text-gray-500 text-sm mt-1">{restaurant.location_in_park}</p>
      )}
    </Link>
  )
}
