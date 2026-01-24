// src/pages/MenuItem.tsx

import { useParams, Link } from 'react-router-dom'
import { useMenuItem } from '../lib/queries'
import NutritionTable from '../components/menu/NutritionTable'
import AllergenBadges from '../components/menu/AllergenBadges'

export default function MenuItem() {
  const { id } = useParams<{ id: string }>()
  const { data: item, isLoading, error } = useMenuItem(id)

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-park-soft rounded w-64 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="h-10 bg-park-soft rounded w-3/4 mb-4" />
            <div className="h-6 bg-park-soft rounded w-32 mb-4" />
            <div className="h-20 bg-park-soft rounded mb-4" />
          </div>
          <div className="h-96 bg-park-soft rounded-xl" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-park-red/10 border border-park-red/20 rounded-xl p-6 text-park-red">
        Error loading item: {error.message}
      </div>
    )
  }

  if (!item) {
    return (
      <div className="bg-park-soft rounded-xl p-8 text-center">
        <span className="text-4xl mb-3 block">🍽️</span>
        <p className="text-park-slate/70">Item not found.</p>
      </div>
    )
  }

  const restaurant = item.restaurant as { id: string; name: string; park?: { id: string; name: string } } | undefined

  return (
    <div>
      {/* Back Navigation */}
      <nav className="text-sm mb-6">
        {restaurant ? (
          <Link
            to={`/restaurants/${restaurant.id}`}
            className="text-park-blue hover:text-park-gold transition-colors"
          >
            ← Back to {restaurant.name}
          </Link>
        ) : (
          <Link to="/" className="text-park-blue hover:text-park-gold transition-colors">
            ← Back to Parks
          </Link>
        )}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {item.photo_url ? (
            <img
              src={item.photo_url}
              alt={item.name}
              className="w-full max-w-md rounded-xl shadow-lg mb-6"
            />
          ) : (
            <div className="w-full max-w-md h-48 bg-park-soft rounded-xl flex items-center justify-center text-6xl mb-6">
              🍽️
            </div>
          )}

          <h1 className="text-3xl font-bold text-park-blue mb-4">{item.name}</h1>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="inline-block px-4 py-1.5 bg-park-soft text-park-blue text-sm font-medium rounded-full capitalize">
              {item.category}
            </span>
            {item.is_seasonal && (
              <span className="inline-block px-4 py-1.5 bg-park-orange/10 text-park-orange text-sm font-medium rounded-full">
                Seasonal
              </span>
            )}
            {item.price !== null && (
              <span className="text-2xl font-bold text-park-gold">
                ${item.price.toFixed(2)}
              </span>
            )}
          </div>

          {item.description && (
            <p className="text-park-slate text-lg leading-relaxed mb-6">{item.description}</p>
          )}

          {/* Allergen Section */}
          {item.allergens.length > 0 && (
            <div className="bg-park-red/5 border border-park-red/20 rounded-xl p-6">
              <h3 className="font-bold text-park-red mb-3 flex items-center gap-2">
                <span>⚠️</span>
                Allergen Information
              </h3>
              <AllergenBadges allergens={item.allergens} />
            </div>
          )}
        </div>

        {/* Nutrition Sidebar */}
        <div>
          {item.nutritional_data ? (
            <NutritionTable nutrition={item.nutritional_data} />
          ) : (
            <div className="bg-park-soft rounded-xl p-6 text-center">
              <span className="text-3xl mb-2 block">📊</span>
              <p className="text-park-slate/70">No nutrition data available for this item.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
