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
      <div className="bg-park-red/10 border border-park-red/20 rounded-xl p-6 text-park-red">
        Error loading restaurants: {error.message}
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <Link to="/" className="text-park-blue hover:text-park-gold transition-colors">
          ← Back to Parks
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-park-blue to-park-blue/80 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {park?.name ?? 'Loading...'}
        </h1>
        {park?.location && (
          <p className="text-white/80 flex items-center gap-2">
            <span>📍</span>
            {park.location}
          </p>
        )}
      </div>

      {/* Restaurants Section */}
      <h2 className="text-2xl font-bold text-park-blue mb-6">Restaurants</h2>
      <RestaurantList restaurants={restaurants} isLoading={isLoading} />
    </div>
  )
}
