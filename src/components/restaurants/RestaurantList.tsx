// src/components/restaurants/RestaurantList.tsx

import RestaurantCard from './RestaurantCard'
import type { Restaurant } from '../../lib/types'

interface RestaurantListProps {
  restaurants: Restaurant[]
  isLoading: boolean
}

export default function RestaurantList({ restaurants, isLoading }: RestaurantListProps) {
  if (isLoading) {
    return <div className="text-gray-500">Loading restaurants...</div>
  }

  if (restaurants.length === 0) {
    return <div className="text-gray-500">No restaurants found.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  )
}
