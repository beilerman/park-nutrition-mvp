import { useSearchParams } from 'react-router-dom'
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
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Search Results
      </h1>
      {query && (
        <p className="text-gray-600 mb-6">
          {results.length} results for "{query}"
        </p>
      )}

      {!query ? (
        <div className="text-gray-500">Enter a search term to find menu items.</div>
      ) : isLoading ? (
        <div className="text-gray-500">Searching...</div>
      ) : error ? (
        <div className="text-red-600">Error: {error.message}</div>
      ) : results.length === 0 ? (
        <div className="text-gray-500">No items found matching "{query}".</div>
      ) : (
        <div className="space-y-8">
          {Object.values(groupedResults).map(({ restaurant, items }) => (
            <div key={restaurant?.id || 'unknown'}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {restaurant?.name || 'Unknown Restaurant'}
                {restaurant?.park && (
                  <span className="text-gray-500 font-normal text-base ml-2">
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
