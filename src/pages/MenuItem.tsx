// src/pages/MenuItem.tsx

import { useParams, Link } from 'react-router-dom'
import { useMenuItem } from '../lib/queries'
import NutritionTable from '../components/menu/NutritionTable'
import AllergenBadges from '../components/menu/AllergenBadges'

export default function MenuItem() {
  const { id } = useParams<{ id: string }>()
  const { data: item, isLoading, error } = useMenuItem(id)

  if (isLoading) {
    return <div className="text-gray-500">Loading...</div>
  }

  if (error) {
    return (
      <div className="text-red-600">
        Error loading item: {error.message}
      </div>
    )
  }

  if (!item) {
    return <div className="text-gray-500">Item not found.</div>
  }

  const restaurant = item.restaurant as { id: string; name: string; park?: { id: string; name: string } } | undefined

  return (
    <div>
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-gray-700">Parks</Link>
        {restaurant?.park && (
          <>
            <span className="mx-2">/</span>
            <Link to={`/parks/${restaurant.park.id}`} className="hover:text-gray-700">
              {restaurant.park.name}
            </Link>
          </>
        )}
        {restaurant && (
          <>
            <span className="mx-2">/</span>
            <Link to={`/restaurants/${restaurant.id}`} className="hover:text-gray-700">
              {restaurant.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-gray-900">{item.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {item.photo_url && (
            <img
              src={item.photo_url}
              alt={item.name}
              className="w-full max-w-md rounded-lg shadow-md mb-6"
            />
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full capitalize">
              {item.category}
            </span>
            {item.is_seasonal && (
              <span className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                Seasonal
              </span>
            )}
            {item.price !== null && (
              <span className="text-lg font-semibold text-green-600">
                ${item.price.toFixed(2)}
              </span>
            )}
          </div>

          {item.description && (
            <p className="text-gray-600 mb-6">{item.description}</p>
          )}

          {item.allergens.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-red-800 mb-2">Allergen Information</h3>
              <AllergenBadges allergens={item.allergens} />
            </div>
          )}
        </div>

        <div>
          {item.nutritional_data ? (
            <NutritionTable nutrition={item.nutritional_data} />
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-gray-500">
              No nutrition data available for this item.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
