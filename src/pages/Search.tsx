// src/pages/Search.tsx

import { useSearchParams, Link } from 'react-router-dom'
import { useSearch } from '../lib/queries'
import MenuItemCard from '../components/menu/MenuItemCard'

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { data: results = [], isLoading, error } = useSearch(query)

  // Group results by restaurant
  const groupedResults = results.reduce((acc, item) => {
    const restaurant = item.restaurant as { id: string; name: string; park?: { name: string } } | undefined
    const key = restaurant?.id || 'unknown'
    if (!acc[key]) {
      acc[key] = {
        restaurant,
        items: [],
      }
    }
    acc[key].items.push(item)
    return acc
  }, {} as Record<string, { restaurant: { id: string; name: string; park?: { name: string } } | undefined; items: typeof results }>)

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-park-blue to-park-blue/80 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Search Results
        </h1>
        {query && (
          <p className="text-white/80">
            {isLoading ? 'Searching...' : `${results.length} results for "${query}"`}
          </p>
        )}
      </div>

      {!query ? (
        <div className="bg-park-soft rounded-xl p-8 text-center">
          <span className="text-4xl mb-3 block">🔍</span>
          <p className="text-park-slate/70">Enter a search term to find menu items.</p>
        </div>
      ) : isLoading ? (
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div key={i}>
              <div className="h-7 bg-park-soft rounded w-48 mb-4" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[1, 2].map((j) => (
                  <div key={j} className="bg-white rounded-xl shadow-md p-5 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-park-soft rounded-lg" />
                      <div className="flex-1">
                        <div className="h-5 bg-park-soft rounded w-3/4 mb-2" />
                        <div className="h-4 bg-park-soft rounded w-full mb-2" />
                        <div className="h-6 bg-park-soft rounded-full w-32" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-park-red/10 border border-park-red/20 rounded-xl p-6 text-park-red">
          Error: {error.message}
        </div>
      ) : results.length === 0 ? (
        <div className="bg-park-soft rounded-xl p-8 text-center">
          <span className="text-4xl mb-3 block">😕</span>
          <p className="text-park-slate/70 mb-2">No items found matching "{query}".</p>
          <Link to="/" className="text-park-blue hover:text-park-gold transition-colors font-medium">
            Browse all parks
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.values(groupedResults).map(({ restaurant, items }) => (
            <div key={restaurant?.id || 'unknown'}>
              <h2 className="text-xl font-bold text-park-blue mb-4 flex items-center gap-2">
                <Link
                  to={restaurant ? `/restaurants/${restaurant.id}` : '#'}
                  className="hover:text-park-gold transition-colors"
                >
                  {restaurant?.name || 'Unknown Restaurant'}
                </Link>
                {restaurant?.park && (
                  <span className="text-park-slate/50 font-normal text-base">
                    at {restaurant.park.name}
                  </span>
                )}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
