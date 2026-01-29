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
        <Link to="/" className="text-park-purple hover:text-park-gold transition-colors font-medium">
          &larr; Back to Parks
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-park-blue via-park-purple to-park-blue rounded-2xl p-8 mb-8 text-white">
        <div className="absolute top-4 right-6 text-park-gold/30 text-xl animate-twinkle">&#10022;</div>
        <div className="absolute bottom-3 left-[20%] text-park-gold/20 text-sm animate-twinkle" style={{ animationDelay: '0.7s' }}>&#10022;</div>
        <h1 className="text-3xl font-bold mb-2 relative" style={{ fontFamily: 'var(--font-display)' }}>
          {park?.name ?? 'Loading...'}
        </h1>
        {park?.location && (
          <p className="text-white/80 flex items-center gap-2 relative">
            <span>📍</span>
            {park.location}
          </p>
        )}
      </div>

      {/* Restaurants Section */}
      <h2 className="text-2xl font-bold text-park-blue mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
        <span className="text-park-gold text-sm">&#10022;</span>
        Restaurants
      </h2>
      <RestaurantList restaurants={restaurants} isLoading={isLoading} />
    </div>
  )
}
