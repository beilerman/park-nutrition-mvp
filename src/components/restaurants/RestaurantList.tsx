// src/components/restaurants/RestaurantList.tsx

import RestaurantCard from './RestaurantCard'
import type { Restaurant } from '../../lib/types'

interface RestaurantListProps {
  restaurants: Restaurant[]
  isLoading: boolean
}

export default function RestaurantList({ restaurants, isLoading }: RestaurantListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md p-6 animate-pulse"
          >
            <div className="h-5 bg-park-soft rounded w-3/4 mb-3" />
            <div className="h-6 bg-park-soft rounded-full w-20 mb-2" />
            <div className="h-4 bg-park-soft rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (restaurants.length === 0) {
    return (
      <div className="bg-park-soft rounded-xl p-8 text-center">
        <span className="text-4xl mb-3 block">🍽️</span>
        <p className="text-park-slate/70">No restaurants found in this park.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  )
}
