// src/pages/Restaurant.tsx

import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useMenuItems } from '../lib/queries'
import { useFilters } from '../hooks/useFilters'
import MenuItemCard from '../components/menu/MenuItemCard'
import FilterSidebar from '../components/filters/FilterSidebar'
import type { Restaurant as RestaurantType } from '../lib/types'

const CATEGORIES = ['entree', 'snack', 'beverage', 'dessert', 'side'] as const

export default function Restaurant() {
  const { id } = useParams<{ id: string }>()
  const { filters, setFilter, clearFilters } = useFilters()

  const { data: restaurant } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: async (): Promise<RestaurantType & { park: { id: string; name: string } } | null> => {
      if (!id) return null
      const { data, error } = await supabase
        .from('restaurants')
        .select('*, park:parks (id, name)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })

  const { data: menuItems = [], isLoading, error } = useMenuItems(id, filters)

  if (error) {
    return (
      <div className="bg-park-red/10 border border-park-red/20 rounded-xl p-6 text-park-red">
        Error loading menu: {error.message}
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <Link to="/" className="text-park-blue hover:text-park-gold transition-colors">
          Parks
        </Link>
        {restaurant?.park && (
          <>
            <span className="mx-2 text-park-slate/40">/</span>
            <Link to={`/parks/${restaurant.park.id}`} className="text-park-blue hover:text-park-gold transition-colors">
              {restaurant.park.name}
            </Link>
          </>
        )}
        <span className="mx-2 text-park-slate/40">/</span>
        <span className="text-park-slate">{restaurant?.name ?? 'Loading...'}</span>
      </nav>

      {/* Hero Section */}
      <div className="bg-park-soft rounded-2xl p-8 mb-8">
        <h1 className="text-3xl font-bold text-park-blue mb-2">
          {restaurant?.name ?? 'Loading...'}
        </h1>
        <div className="flex items-center gap-4 flex-wrap">
          {restaurant?.cuisine_type && (
            <span className="inline-block px-3 py-1 bg-park-blue text-white text-sm font-medium rounded-full">
              {restaurant.cuisine_type}
            </span>
          )}
          {restaurant?.location_in_park && (
            <span className="text-park-slate/70 flex items-center gap-1.5">
              <span>📍</span>
              {restaurant.location_in_park}
            </span>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter('category', undefined)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !filters.category
              ? 'bg-park-blue text-white shadow-md'
              : 'bg-white text-park-slate hover:bg-park-soft shadow-sm'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter('category', cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
              filters.category === cat
                ? 'bg-park-blue text-white shadow-md'
                : 'bg-white text-park-slate hover:bg-park-soft shadow-sm'
            }`}
          >
            {cat}s
          </button>
        ))}
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilter}
            onClear={clearFilters}
          />
        </aside>

        {/* Menu Items */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-park-soft rounded-lg" />
                    <div className="flex-1">
                      <div className="h-5 bg-park-soft rounded w-3/4 mb-2" />
                      <div className="h-4 bg-park-soft rounded w-full mb-2" />
                      <div className="h-6 bg-park-soft rounded-full w-32 mb-2" />
                      <div className="h-5 bg-park-soft rounded w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : menuItems.length === 0 ? (
            <div className="bg-park-soft rounded-xl p-8 text-center">
              <span className="text-4xl mb-3 block">🔍</span>
              <p className="text-park-slate/70">No menu items found matching your filters.</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-park-blue hover:text-park-gold transition-colors font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
