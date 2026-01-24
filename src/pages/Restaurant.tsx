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
      <div className="text-red-600">
        Error loading menu: {error.message}
      </div>
    )
  }

  return (
    <div>
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-gray-700">Parks</Link>
        <span className="mx-2">/</span>
        {restaurant?.park && (
          <>
            <Link to={`/parks/${restaurant.park.id}`} className="hover:text-gray-700">
              {restaurant.park.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-gray-900">{restaurant?.name ?? 'Loading...'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {restaurant?.name ?? 'Loading...'}
      </h1>
      {restaurant?.cuisine_type && (
        <p className="text-green-600 mb-1">{restaurant.cuisine_type}</p>
      )}
      {restaurant?.location_in_park && (
        <p className="text-gray-600 mb-6">{restaurant.location_in_park}</p>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter('category', undefined)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !filters.category
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter('category', cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filters.category === cat
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}s
          </button>
        ))}
      </div>

      <div className="flex gap-8">
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilter}
            onClear={clearFilters}
          />
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <div className="text-gray-500">Loading menu...</div>
          ) : menuItems.length === 0 ? (
            <div className="text-gray-500">No menu items found matching your filters.</div>
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
