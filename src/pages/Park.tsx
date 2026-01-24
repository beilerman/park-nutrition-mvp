// src/pages/Park.tsx

import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useRestaurants } from '../lib/queries'
import RestaurantList from '../components/restaurants/RestaurantList'
import type { Park } from '../lib/types'

export default function Park() {
  const { parkId } = useParams<{ parkId: string }>()

  const { data: park } = useQuery({
    queryKey: ['park', parkId],
    queryFn: async (): Promise<Park | null> => {
      if (!parkId) return null
      const { data, error } = await supabase
        .from('parks')
        .select('*')
        .eq('id', parkId)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!parkId,
  })

  const { data: restaurants = [], isLoading, error } = useRestaurants(parkId)

  if (error) {
    return (
      <div className="text-red-600">
        Error loading restaurants: {error.message}
      </div>
    )
  }

  return (
    <div>
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-gray-700">Parks</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{park?.name ?? 'Loading...'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {park?.name ?? 'Loading...'}
      </h1>
      {park?.location && (
        <p className="text-gray-600 mb-6">{park.location}</p>
      )}

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Restaurants</h2>
      <RestaurantList restaurants={restaurants} isLoading={isLoading} />
    </div>
  )
}
