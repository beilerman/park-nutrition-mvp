// src/pages/Restaurant.tsx

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useMenuItems, useRestaurant } from '../lib/queries'
import { useFilters } from '../hooks/useFilters'
import MenuItemCard from '../components/menu/MenuItemCard'
import FilterSidebar from '../components/filters/FilterSidebar'

const CATEGORIES = ['entree', 'snack', 'beverage', 'dessert', 'side'] as const

export default function Restaurant() {
  const { id } = useParams<{ id: string }>()
  const { filters, setFilter, clearFilters } = useFilters()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const { data: restaurant, isLoading: isRestaurantLoading } = useRestaurant(id)
  const { data: menuItems = [], isLoading, error } = useMenuItems(id, filters)

  const activeFilterCount =
    (filters.maxCalories ? 1 : 0) + (filters.excludeAllergens?.length ?? 0)

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
      <nav aria-label="Breadcrumb" className="text-sm mb-6">
        <Link to="/" className="text-park-blue hover:text-park-gold transition-colors">
          Parks
        </Link>
        {restaurant?.park && (
          <>
            <span className="mx-2 text-park-slate/40" aria-hidden="true">/</span>
            <Link to={`/parks/${restaurant.park.id}`} className="text-park-blue hover:text-park-gold transition-colors">
              {restaurant.park.name}
            </Link>
          </>
        )}
        <span className="mx-2 text-park-slate/40" aria-hidden="true">/</span>
        {isRestaurantLoading ? (
          <span className="inline-block h-4 w-24 bg-park-soft rounded animate-pulse" />
        ) : (
          <span className="text-park-slate" aria-current="page">{restaurant?.name}</span>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-park-soft rounded-2xl p-8 mb-8">
        {isRestaurantLoading ? (
          <div className="h-9 w-64 bg-park-blue/10 rounded animate-pulse mb-2" />
        ) : (
          <h1 className="text-3xl font-bold text-park-blue mb-2">
            {restaurant?.name}
          </h1>
        )}
        <div className="flex items-center gap-4 flex-wrap">
          {restaurant?.cuisine_type && (
            <span className="inline-block px-3 py-1 bg-park-blue text-white text-sm font-medium rounded-full">
              {restaurant.cuisine_type}
            </span>
          )}
          {restaurant?.location_in_park && (
            <span className="text-park-slate/70 flex items-center gap-1.5">
              <span aria-hidden="true">📍</span>
              {restaurant.location_in_park}
            </span>
          )}
        </div>
      </div>

      {/* Category Pills + Mobile Filter Toggle */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter('category', undefined)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-park-gold ${
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
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-park-gold ${
              filters.category === cat
                ? 'bg-park-blue text-white shadow-md'
                : 'bg-white text-park-slate hover:bg-park-soft shadow-sm'
            }`}
          >
            {cat}s
          </button>
        ))}

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-park-blue text-sm font-medium shadow-sm hover:bg-park-soft transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-park-gold"
          aria-label={`Open filters${activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ''}`}
        >
          <span aria-hidden="true">⚙️</span>
          Filters
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-park-red text-white text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden lg:block" aria-label="Filters">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilter}
            onClear={clearFilters}
          />
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileFiltersOpen(false)}
              aria-hidden="true"
            />
            <aside
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-park-cream shadow-2xl overflow-y-auto"
              role="dialog"
              aria-label="Filters"
            >
              <div className="flex items-center justify-between p-4 border-b border-park-soft">
                <h2 className="font-bold text-park-blue text-lg">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 text-park-slate hover:text-park-blue transition-colors rounded-lg focus-visible:outline-2 focus-visible:outline-park-gold"
                  aria-label="Close filters"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilter}
                  onClear={clearFilters}
                />
              </div>
            </aside>
          </div>
        )}

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
              <span className="text-4xl mb-3 block" aria-hidden="true">🔍</span>
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
