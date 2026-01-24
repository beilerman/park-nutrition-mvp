# Discovery MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a nutrition discovery app where users browse parks, restaurants, and menu items with filtering by calories, allergens, and diet tags.

**Architecture:** React SPA with React Router for navigation, React Query for server state, Supabase for database and auth. Filters stored in URL params for shareable links.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, React Query, React Router, Supabase

---

## Task 1: TypeScript Types

**Files:**
- Create: `src/lib/types.ts`

**Step 1: Create type definitions**

```typescript
// src/lib/types.ts

export interface Park {
  id: string
  name: string
  location: string
  timezone: string
  created_at: string
}

export interface Restaurant {
  id: string
  park_id: string
  name: string
  location_in_park: string | null
  cuisine_type: string | null
  hours: Record<string, string> | null
  latitude: number | null
  longitude: number | null
  created_at: string
}

export interface MenuItem {
  id: string
  restaurant_id: string
  name: string
  description: string | null
  price: number | null
  category: 'entree' | 'snack' | 'beverage' | 'dessert' | 'side'
  is_seasonal: boolean
  photo_url: string | null
  last_verified_date: string | null
  created_at: string
}

export interface NutritionalData {
  id: string
  menu_item_id: string
  source: 'official' | 'crowdsourced' | 'api_lookup'
  calories: number | null
  carbs: number | null
  sugar: number | null
  protein: number | null
  fat: number | null
  saturated_fat: number | null
  sodium: number | null
  fiber: number | null
  cholesterol: number | null
  confidence_score: number
  created_at: string
}

export interface Allergen {
  id: string
  menu_item_id: string
  allergen_type: string
  severity: 'contains' | 'may_contain'
  created_at: string
}

export interface MenuItemWithNutrition extends MenuItem {
  nutritional_data: NutritionalData | null
  allergens: Allergen[]
  restaurant?: Restaurant
}

export interface RestaurantWithMenuItems extends Restaurant {
  menu_items: MenuItemWithNutrition[]
  park?: Park
}

export interface Filters {
  maxCalories?: number
  minCalories?: number
  excludeAllergens?: string[]
  dietTags?: string[]
  category?: MenuItem['category']
  maxPrice?: number
}
```

**Step 2: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: add TypeScript type definitions"
```

---

## Task 2: Supabase Client

**Files:**
- Create: `src/lib/supabase.ts`

**Step 1: Create Supabase client**

```typescript
// src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Step 2: Create environment file template**

Create `.env.example`:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Step 3: Add .env to .gitignore if not present**

Verify `.env` is in `.gitignore`. If not, add it.

**Step 4: Commit**

```bash
git add src/lib/supabase.ts .env.example
git commit -m "feat: add Supabase client configuration"
```

---

## Task 3: React Query Setup and Data Fetching Hooks

**Files:**
- Create: `src/lib/queries.ts`
- Modify: `src/main.tsx`

**Step 1: Create query hooks**

```typescript
// src/lib/queries.ts

import { useQuery } from '@tanstack/react-query'
import { supabase } from './supabase'
import type { Park, Restaurant, MenuItemWithNutrition, Filters } from './types'

export function useParks() {
  return useQuery({
    queryKey: ['parks'],
    queryFn: async (): Promise<Park[]> => {
      const { data, error } = await supabase
        .from('parks')
        .select('*')
        .order('name')
      if (error) throw error
      return data
    },
  })
}

export function useRestaurants(parkId: string | undefined) {
  return useQuery({
    queryKey: ['restaurants', parkId],
    queryFn: async (): Promise<Restaurant[]> => {
      if (!parkId) return []
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('park_id', parkId)
        .order('name')
      if (error) throw error
      return data
    },
    enabled: !!parkId,
  })
}

export function useMenuItems(restaurantId: string | undefined, filters?: Filters) {
  return useQuery({
    queryKey: ['menuItems', restaurantId, filters],
    queryFn: async (): Promise<MenuItemWithNutrition[]> => {
      if (!restaurantId) return []

      let query = supabase
        .from('menu_items')
        .select(`
          *,
          nutritional_data (*),
          allergens (*)
        `)
        .eq('restaurant_id', restaurantId)

      if (filters?.category) {
        query = query.eq('category', filters.category)
      }

      const { data, error } = await query.order('name')
      if (error) throw error

      // Client-side filtering for nutrition and allergens
      let items = data as MenuItemWithNutrition[]

      if (filters?.maxCalories !== undefined) {
        items = items.filter(item =>
          item.nutritional_data?.calories !== null &&
          item.nutritional_data.calories <= filters.maxCalories!
        )
      }

      if (filters?.excludeAllergens?.length) {
        items = items.filter(item =>
          !item.allergens.some(a =>
            filters.excludeAllergens!.includes(a.allergen_type) &&
            a.severity === 'contains'
          )
        )
      }

      return items
    },
    enabled: !!restaurantId,
  })
}

export function useMenuItem(id: string | undefined) {
  return useQuery({
    queryKey: ['menuItem', id],
    queryFn: async (): Promise<MenuItemWithNutrition | null> => {
      if (!id) return null
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          nutritional_data (*),
          allergens (*),
          restaurant:restaurants (*, park:parks (*))
        `)
        .eq('id', id)
        .single()
      if (error) throw error
      return data as MenuItemWithNutrition
    },
    enabled: !!id,
  })
}

export function useSearch(query: string, filters?: Filters) {
  return useQuery({
    queryKey: ['search', query, filters],
    queryFn: async (): Promise<MenuItemWithNutrition[]> => {
      if (!query.trim()) return []

      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          nutritional_data (*),
          allergens (*),
          restaurant:restaurants (*, park:parks (*))
        `)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('name')
        .limit(50)

      if (error) throw error

      let items = data as MenuItemWithNutrition[]

      if (filters?.maxCalories !== undefined) {
        items = items.filter(item =>
          item.nutritional_data?.calories !== null &&
          item.nutritional_data.calories <= filters.maxCalories!
        )
      }

      if (filters?.excludeAllergens?.length) {
        items = items.filter(item =>
          !item.allergens.some(a =>
            filters.excludeAllergens!.includes(a.allergen_type) &&
            a.severity === 'contains'
          )
        )
      }

      return items
    },
    enabled: query.trim().length > 0,
  })
}
```

**Step 2: Update main.tsx with QueryClientProvider**

```typescript
// src/main.tsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
```

**Step 3: Commit**

```bash
git add src/lib/queries.ts src/main.tsx
git commit -m "feat: add React Query setup and data fetching hooks"
```

---

## Task 4: Router Setup

**Files:**
- Create: `src/pages/Home.tsx`
- Create: `src/pages/Park.tsx`
- Create: `src/pages/Restaurant.tsx`
- Create: `src/pages/MenuItem.tsx`
- Create: `src/pages/Search.tsx`
- Modify: `src/App.tsx`

**Step 1: Create placeholder pages**

```typescript
// src/pages/Home.tsx
export default function Home() {
  return <div>Home Page</div>
}
```

```typescript
// src/pages/Park.tsx
export default function Park() {
  return <div>Park Page</div>
}
```

```typescript
// src/pages/Restaurant.tsx
export default function Restaurant() {
  return <div>Restaurant Page</div>
}
```

```typescript
// src/pages/MenuItem.tsx
export default function MenuItem() {
  return <div>Menu Item Page</div>
}
```

```typescript
// src/pages/Search.tsx
export default function Search() {
  return <div>Search Page</div>
}
```

**Step 2: Update App.tsx with router**

```typescript
// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Park from './pages/Park'
import Restaurant from './pages/Restaurant'
import MenuItem from './pages/MenuItem'
import Search from './pages/Search'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/parks/:parkId" element={<Park />} />
        <Route path="/restaurants/:id" element={<Restaurant />} />
        <Route path="/items/:id" element={<MenuItem />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

**Step 3: Update App.test.tsx**

```typescript
// src/App.test.tsx

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

describe('App', () => {
  it('renders the home page', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    )
    expect(screen.getByText('Home Page')).toBeInTheDocument()
  })
})
```

**Step 4: Run tests**

```bash
npm run test:run
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/pages src/App.tsx src/App.test.tsx
git commit -m "feat: add router with placeholder pages"
```

---

## Task 5: Layout Components

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Layout.tsx`
- Modify: `src/App.tsx`

**Step 1: Create Header component**

```typescript
// src/components/layout/Header.tsx

import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold text-green-600">
          Park Nutrition
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <input
            type="search"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </form>

        <nav className="flex items-center gap-4">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            Parks
          </Link>
        </nav>
      </div>
    </header>
  )
}
```

**Step 2: Create Layout component**

```typescript
// src/components/layout/Layout.tsx

import Header from './Header'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
```

**Step 3: Update App.tsx to use Layout**

```typescript
// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Park from './pages/Park'
import Restaurant from './pages/Restaurant'
import MenuItem from './pages/MenuItem'
import Search from './pages/Search'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/parks/:parkId" element={<Park />} />
          <Route path="/restaurants/:id" element={<Restaurant />} />
          <Route path="/items/:id" element={<MenuItem />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
```

**Step 4: Commit**

```bash
git add src/components/layout src/App.tsx
git commit -m "feat: add Header and Layout components"
```

---

## Task 6: Park Components and Home Page

**Files:**
- Create: `src/components/parks/ParkCard.tsx`
- Create: `src/components/parks/ParkList.tsx`
- Modify: `src/pages/Home.tsx`

**Step 1: Create ParkCard**

```typescript
// src/components/parks/ParkCard.tsx

import { Link } from 'react-router-dom'
import type { Park } from '../../lib/types'

interface ParkCardProps {
  park: Park
}

export default function ParkCard({ park }: ParkCardProps) {
  return (
    <Link
      to={`/parks/${park.id}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <h2 className="text-xl font-semibold text-gray-900">{park.name}</h2>
      <p className="text-gray-600 mt-1">{park.location}</p>
    </Link>
  )
}
```

**Step 2: Create ParkList**

```typescript
// src/components/parks/ParkList.tsx

import ParkCard from './ParkCard'
import type { Park } from '../../lib/types'

interface ParkListProps {
  parks: Park[]
  isLoading: boolean
}

export default function ParkList({ parks, isLoading }: ParkListProps) {
  if (isLoading) {
    return <div className="text-gray-500">Loading parks...</div>
  }

  if (parks.length === 0) {
    return <div className="text-gray-500">No parks found.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {parks.map((park) => (
        <ParkCard key={park.id} park={park} />
      ))}
    </div>
  )
}
```

**Step 3: Update Home page**

```typescript
// src/pages/Home.tsx

import { useParks } from '../lib/queries'
import ParkList from '../components/parks/ParkList'

export default function Home() {
  const { data: parks = [], isLoading, error } = useParks()

  if (error) {
    return (
      <div className="text-red-600">
        Error loading parks: {error.message}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Select a Park
      </h1>
      <ParkList parks={parks} isLoading={isLoading} />
    </div>
  )
}
```

**Step 4: Commit**

```bash
git add src/components/parks src/pages/Home.tsx
git commit -m "feat: add ParkCard, ParkList, and Home page"
```

---

## Task 7: Restaurant Components and Park Page

**Files:**
- Create: `src/components/restaurants/RestaurantCard.tsx`
- Create: `src/components/restaurants/RestaurantList.tsx`
- Modify: `src/pages/Park.tsx`

**Step 1: Create RestaurantCard**

```typescript
// src/components/restaurants/RestaurantCard.tsx

import { Link } from 'react-router-dom'
import type { Restaurant } from '../../lib/types'

interface RestaurantCardProps {
  restaurant: Restaurant
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <h2 className="text-lg font-semibold text-gray-900">{restaurant.name}</h2>
      {restaurant.cuisine_type && (
        <p className="text-sm text-green-600 mt-1">{restaurant.cuisine_type}</p>
      )}
      {restaurant.location_in_park && (
        <p className="text-gray-500 text-sm mt-1">{restaurant.location_in_park}</p>
      )}
    </Link>
  )
}
```

**Step 2: Create RestaurantList**

```typescript
// src/components/restaurants/RestaurantList.tsx

import RestaurantCard from './RestaurantCard'
import type { Restaurant } from '../../lib/types'

interface RestaurantListProps {
  restaurants: Restaurant[]
  isLoading: boolean
}

export default function RestaurantList({ restaurants, isLoading }: RestaurantListProps) {
  if (isLoading) {
    return <div className="text-gray-500">Loading restaurants...</div>
  }

  if (restaurants.length === 0) {
    return <div className="text-gray-500">No restaurants found.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  )
}
```

**Step 3: Update Park page**

```typescript
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
```

**Step 4: Commit**

```bash
git add src/components/restaurants src/pages/Park.tsx
git commit -m "feat: add RestaurantCard, RestaurantList, and Park page"
```

---

## Task 8: Menu Item Components

**Files:**
- Create: `src/components/menu/AllergenBadges.tsx`
- Create: `src/components/menu/NutritionSummary.tsx`
- Create: `src/components/menu/MenuItemCard.tsx`

**Step 1: Create AllergenBadges**

```typescript
// src/components/menu/AllergenBadges.tsx

import type { Allergen } from '../../lib/types'

interface AllergenBadgesProps {
  allergens: Allergen[]
}

export default function AllergenBadges({ allergens }: AllergenBadgesProps) {
  if (allergens.length === 0) return null

  const contains = allergens.filter(a => a.severity === 'contains')
  const mayContain = allergens.filter(a => a.severity === 'may_contain')

  return (
    <div className="text-sm">
      {contains.length > 0 && (
        <div className="text-red-600">
          Contains: {contains.map(a => a.allergen_type).join(', ')}
        </div>
      )}
      {mayContain.length > 0 && (
        <div className="text-orange-500">
          May contain: {mayContain.map(a => a.allergen_type).join(', ')}
        </div>
      )}
    </div>
  )
}
```

**Step 2: Create NutritionSummary**

```typescript
// src/components/menu/NutritionSummary.tsx

import type { NutritionalData } from '../../lib/types'

interface NutritionSummaryProps {
  nutrition: NutritionalData | null
  showConfidence?: boolean
}

export default function NutritionSummary({ nutrition, showConfidence }: NutritionSummaryProps) {
  if (!nutrition) {
    return <div className="text-gray-400 text-sm">No nutrition data</div>
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      {nutrition.calories !== null && (
        <span className="font-medium">{nutrition.calories} cal</span>
      )}
      {nutrition.carbs !== null && (
        <span className="text-gray-600">{nutrition.carbs}g carbs</span>
      )}
      {nutrition.protein !== null && (
        <span className="text-gray-600">{nutrition.protein}g protein</span>
      )}
      {nutrition.fat !== null && (
        <span className="text-gray-600">{nutrition.fat}g fat</span>
      )}
      {showConfidence && nutrition.confidence_score < 70 && (
        <span className="text-orange-500 text-xs">(estimated)</span>
      )}
    </div>
  )
}
```

**Step 3: Create MenuItemCard**

```typescript
// src/components/menu/MenuItemCard.tsx

import { Link } from 'react-router-dom'
import type { MenuItemWithNutrition } from '../../lib/types'
import NutritionSummary from './NutritionSummary'
import AllergenBadges from './AllergenBadges'

interface MenuItemCardProps {
  item: MenuItemWithNutrition
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <Link
      to={`/items/${item.id}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4">
        {item.photo_url && (
          <img
            src={item.photo_url}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
          {item.description && (
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
          )}
          <div className="mt-2">
            <NutritionSummary nutrition={item.nutritional_data} showConfidence />
          </div>
          <div className="mt-2">
            <AllergenBadges allergens={item.allergens} />
          </div>
          {item.price !== null && (
            <div className="text-green-600 font-medium mt-2">
              ${item.price.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
```

**Step 4: Commit**

```bash
git add src/components/menu
git commit -m "feat: add MenuItemCard, NutritionSummary, AllergenBadges"
```

---

## Task 9: Restaurant Page with Menu Items

**Files:**
- Modify: `src/pages/Restaurant.tsx`

**Step 1: Update Restaurant page**

```typescript
// src/pages/Restaurant.tsx

import { useParams, Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useMenuItems } from '../lib/queries'
import MenuItemCard from '../components/menu/MenuItemCard'
import type { Restaurant as RestaurantType, Filters } from '../lib/types'

const CATEGORIES = ['entree', 'snack', 'beverage', 'dessert', 'side'] as const

export default function Restaurant() {
  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()

  const category = searchParams.get('category') as Filters['category'] | null

  const filters: Filters = {
    category: category || undefined,
  }

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

  const handleCategoryChange = (newCategory: string | null) => {
    if (newCategory) {
      searchParams.set('category', newCategory)
    } else {
      searchParams.delete('category')
    }
    setSearchParams(searchParams)
  }

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
          onClick={() => handleCategoryChange(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !category
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              category === cat
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}s
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-gray-500">Loading menu...</div>
      ) : menuItems.length === 0 ? (
        <div className="text-gray-500">No menu items found.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/pages/Restaurant.tsx
git commit -m "feat: implement Restaurant page with menu items and category filter"
```

---

## Task 10: Menu Item Detail Page

**Files:**
- Create: `src/components/menu/NutritionTable.tsx`
- Modify: `src/pages/MenuItem.tsx`

**Step 1: Create NutritionTable**

```typescript
// src/components/menu/NutritionTable.tsx

import type { NutritionalData } from '../../lib/types'

interface NutritionTableProps {
  nutrition: NutritionalData
}

const NUTRIENTS = [
  { key: 'calories', label: 'Calories', unit: '' },
  { key: 'carbs', label: 'Carbohydrates', unit: 'g' },
  { key: 'sugar', label: 'Sugar', unit: 'g' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'fat', label: 'Total Fat', unit: 'g' },
  { key: 'saturated_fat', label: 'Saturated Fat', unit: 'g' },
  { key: 'fiber', label: 'Fiber', unit: 'g' },
  { key: 'sodium', label: 'Sodium', unit: 'mg' },
  { key: 'cholesterol', label: 'Cholesterol', unit: 'mg' },
] as const

export default function NutritionTable({ nutrition }: NutritionTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Nutrition Facts</h3>
        {nutrition.confidence_score < 70 && (
          <span className="text-sm text-orange-500 bg-orange-50 px-2 py-1 rounded">
            Estimated
          </span>
        )}
      </div>
      <div className="text-xs text-gray-500 mb-4">
        Source: {nutrition.source.replace('_', ' ')}
      </div>
      <table className="w-full">
        <tbody>
          {NUTRIENTS.map(({ key, label, unit }) => {
            const value = nutrition[key as keyof NutritionalData]
            if (value === null) return null
            return (
              <tr key={key} className="border-b border-gray-100 last:border-0">
                <td className="py-2 text-gray-700">{label}</td>
                <td className="py-2 text-right font-medium text-gray-900">
                  {value}{unit}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
```

**Step 2: Update MenuItem page**

```typescript
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
```

**Step 3: Commit**

```bash
git add src/components/menu/NutritionTable.tsx src/pages/MenuItem.tsx
git commit -m "feat: implement MenuItem detail page with NutritionTable"
```

---

## Task 11: Search Page

**Files:**
- Modify: `src/pages/Search.tsx`

**Step 1: Implement Search page**

```typescript
// src/pages/Search.tsx

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
```

**Step 2: Commit**

```bash
git add src/pages/Search.tsx
git commit -m "feat: implement Search page with grouped results"
```

---

## Task 12: Filter Sidebar

**Files:**
- Create: `src/components/filters/FilterSidebar.tsx`
- Create: `src/hooks/useFilters.ts`
- Modify: `src/pages/Restaurant.tsx`

**Step 1: Create useFilters hook**

```typescript
// src/hooks/useFilters.ts

import { useSearchParams } from 'react-router-dom'
import type { Filters } from '../lib/types'

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: Filters = {
    maxCalories: searchParams.get('maxCalories') ? Number(searchParams.get('maxCalories')) : undefined,
    excludeAllergens: searchParams.getAll('exclude'),
    category: searchParams.get('category') as Filters['category'] | undefined,
  }

  const setFilter = (key: keyof Filters, value: unknown) => {
    const newParams = new URLSearchParams(searchParams)

    if (key === 'excludeAllergens' && Array.isArray(value)) {
      newParams.delete('exclude')
      value.forEach((v) => newParams.append('exclude', v))
    } else if (value === undefined || value === null || value === '') {
      newParams.delete(key === 'maxCalories' ? 'maxCalories' : key)
    } else {
      newParams.set(key === 'maxCalories' ? 'maxCalories' : key, String(value))
    }

    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  return { filters, setFilter, clearFilters }
}
```

**Step 2: Create FilterSidebar**

```typescript
// src/components/filters/FilterSidebar.tsx

import type { Filters } from '../../lib/types'

const ALLERGENS = [
  'milk',
  'eggs',
  'fish',
  'shellfish',
  'tree nuts',
  'peanuts',
  'wheat',
  'soy',
]

const CALORIE_OPTIONS = [
  { label: 'Any', value: undefined },
  { label: 'Under 300', value: 300 },
  { label: 'Under 500', value: 500 },
  { label: 'Under 700', value: 700 },
  { label: 'Under 1000', value: 1000 },
]

interface FilterSidebarProps {
  filters: Filters
  onFilterChange: (key: keyof Filters, value: unknown) => void
  onClear: () => void
}

export default function FilterSidebar({ filters, onFilterChange, onClear }: FilterSidebarProps) {
  const toggleAllergen = (allergen: string) => {
    const current = filters.excludeAllergens || []
    const updated = current.includes(allergen)
      ? current.filter((a) => a !== allergen)
      : [...current, allergen]
    onFilterChange('excludeAllergens', updated)
  }

  const hasActiveFilters = filters.maxCalories || (filters.excludeAllergens?.length ?? 0) > 0

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-sm text-green-600 hover:text-green-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Max Calories</h4>
        <select
          value={filters.maxCalories ?? ''}
          onChange={(e) => onFilterChange('maxCalories', e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {CALORIE_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.value ?? ''}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Exclude Allergens</h4>
        <div className="space-y-2">
          {ALLERGENS.map((allergen) => (
            <label key={allergen} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.excludeAllergens?.includes(allergen) ?? false}
                onChange={() => toggleAllergen(allergen)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700 capitalize">{allergen}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
```

**Step 3: Update Restaurant page to use FilterSidebar**

```typescript
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
```

**Step 4: Commit**

```bash
git add src/hooks/useFilters.ts src/components/filters src/pages/Restaurant.tsx
git commit -m "feat: add FilterSidebar with calorie and allergen filters"
```

---

## Task 13: Seed Data Script

**Files:**
- Create: `seed/parks.json`
- Create: `seed/seed.ts`
- Modify: `package.json`

**Step 1: Create sample seed data**

```json
// seed/parks.json
{
  "parks": [
    {
      "name": "Magic Kingdom",
      "location": "Walt Disney World, Orlando, FL",
      "timezone": "America/New_York"
    },
    {
      "name": "Universal Studios Florida",
      "location": "Universal Orlando Resort, Orlando, FL",
      "timezone": "America/New_York"
    }
  ],
  "restaurants": [
    {
      "park": "Magic Kingdom",
      "name": "Cosmic Ray's Starlight Cafe",
      "location_in_park": "Tomorrowland",
      "cuisine_type": "American"
    },
    {
      "park": "Magic Kingdom",
      "name": "Pecos Bill Tall Tale Inn and Cafe",
      "location_in_park": "Frontierland",
      "cuisine_type": "Tex-Mex"
    },
    {
      "park": "Universal Studios Florida",
      "name": "Leaky Cauldron",
      "location_in_park": "Diagon Alley",
      "cuisine_type": "British"
    }
  ],
  "menuItems": [
    {
      "restaurant": "Cosmic Ray's Starlight Cafe",
      "name": "Angus Bacon Cheeseburger",
      "description": "1/3 lb. Angus burger with bacon, cheese, lettuce, tomato, and pickles",
      "price": 14.99,
      "category": "entree",
      "nutrition": {
        "source": "official",
        "calories": 850,
        "carbs": 52,
        "protein": 42,
        "fat": 48,
        "sodium": 1420,
        "confidence_score": 95
      },
      "allergens": [
        { "allergen_type": "wheat", "severity": "contains" },
        { "allergen_type": "milk", "severity": "contains" }
      ]
    },
    {
      "restaurant": "Cosmic Ray's Starlight Cafe",
      "name": "Chicken Nuggets",
      "description": "Crispy chicken nuggets with fries",
      "price": 11.99,
      "category": "entree",
      "nutrition": {
        "source": "official",
        "calories": 620,
        "carbs": 45,
        "protein": 28,
        "fat": 35,
        "sodium": 980,
        "confidence_score": 95
      },
      "allergens": [
        { "allergen_type": "wheat", "severity": "contains" }
      ]
    },
    {
      "restaurant": "Pecos Bill Tall Tale Inn and Cafe",
      "name": "Taco Trio",
      "description": "Three soft tacos with seasoned beef, lettuce, cheese, and salsa",
      "price": 12.99,
      "category": "entree",
      "nutrition": {
        "source": "official",
        "calories": 680,
        "carbs": 58,
        "protein": 32,
        "fat": 34,
        "sodium": 1280,
        "confidence_score": 90
      },
      "allergens": [
        { "allergen_type": "wheat", "severity": "contains" },
        { "allergen_type": "milk", "severity": "contains" }
      ]
    },
    {
      "restaurant": "Leaky Cauldron",
      "name": "Fish and Chips",
      "description": "Traditional British battered fish with chips and mushy peas",
      "price": 16.99,
      "category": "entree",
      "nutrition": {
        "source": "api_lookup",
        "calories": 920,
        "carbs": 78,
        "protein": 38,
        "fat": 52,
        "sodium": 1560,
        "confidence_score": 65
      },
      "allergens": [
        { "allergen_type": "fish", "severity": "contains" },
        { "allergen_type": "wheat", "severity": "contains" }
      ]
    },
    {
      "restaurant": "Leaky Cauldron",
      "name": "Butterbeer",
      "description": "Famous frozen or cold Butterbeer beverage",
      "price": 8.99,
      "category": "beverage",
      "nutrition": {
        "source": "crowdsourced",
        "calories": 280,
        "carbs": 65,
        "sugar": 58,
        "protein": 1,
        "fat": 3,
        "confidence_score": 75
      },
      "allergens": [
        { "allergen_type": "milk", "severity": "contains" }
      ]
    }
  ]
}
```

**Step 2: Create seed script**

```typescript
// seed/seed.ts

import { createClient } from '@supabase/supabase-js'
import data from './parks.json'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  console.log('Seeding database...')

  // Insert parks
  const parkMap = new Map<string, string>()
  for (const park of data.parks) {
    const { data: inserted, error } = await supabase
      .from('parks')
      .insert(park)
      .select('id, name')
      .single()

    if (error) {
      console.error('Error inserting park:', error)
      continue
    }
    parkMap.set(inserted.name, inserted.id)
    console.log(`Inserted park: ${inserted.name}`)
  }

  // Insert restaurants
  const restaurantMap = new Map<string, string>()
  for (const restaurant of data.restaurants) {
    const parkId = parkMap.get(restaurant.park)
    if (!parkId) {
      console.error(`Park not found: ${restaurant.park}`)
      continue
    }

    const { data: inserted, error } = await supabase
      .from('restaurants')
      .insert({
        park_id: parkId,
        name: restaurant.name,
        location_in_park: restaurant.location_in_park,
        cuisine_type: restaurant.cuisine_type,
      })
      .select('id, name')
      .single()

    if (error) {
      console.error('Error inserting restaurant:', error)
      continue
    }
    restaurantMap.set(inserted.name, inserted.id)
    console.log(`Inserted restaurant: ${inserted.name}`)
  }

  // Insert menu items with nutrition and allergens
  for (const item of data.menuItems) {
    const restaurantId = restaurantMap.get(item.restaurant)
    if (!restaurantId) {
      console.error(`Restaurant not found: ${item.restaurant}`)
      continue
    }

    const { data: menuItem, error: menuError } = await supabase
      .from('menu_items')
      .insert({
        restaurant_id: restaurantId,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
      })
      .select('id')
      .single()

    if (menuError) {
      console.error('Error inserting menu item:', menuError)
      continue
    }

    // Insert nutrition data
    if (item.nutrition) {
      const { error: nutritionError } = await supabase
        .from('nutritional_data')
        .insert({
          menu_item_id: menuItem.id,
          ...item.nutrition,
        })

      if (nutritionError) {
        console.error('Error inserting nutrition:', nutritionError)
      }
    }

    // Insert allergens
    for (const allergen of item.allergens || []) {
      const { error: allergenError } = await supabase
        .from('allergens')
        .insert({
          menu_item_id: menuItem.id,
          ...allergen,
        })

      if (allergenError) {
        console.error('Error inserting allergen:', allergenError)
      }
    }

    console.log(`Inserted menu item: ${item.name}`)
  }

  console.log('Seeding complete!')
}

seed().catch(console.error)
```

**Step 3: Add seed script to package.json**

Add to scripts section:
```json
"seed": "npx tsx seed/seed.ts"
```

**Step 4: Commit**

```bash
git add seed package.json
git commit -m "feat: add seed data and script for parks, restaurants, menu items"
```

---

## Task 14: Add User Favorites Migration

**Files:**
- Create: `supabase/migrations/00002_user_favorites.sql`

**Step 1: Create migration**

```sql
-- supabase/migrations/00002_user_favorites.sql

-- User favorites table
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, menu_item_id)
);

-- Index for fast lookups
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);

-- Enable RLS
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own favorites
CREATE POLICY "Users can view own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);
```

**Step 2: Commit**

```bash
git add supabase/migrations/00002_user_favorites.sql
git commit -m "feat: add user_favorites table migration"
```

---

## Task 15: Run All Tests and Final Verification

**Step 1: Run tests**

```bash
npm run test:run
```

Expected: All tests pass

**Step 2: Run lint**

```bash
npm run lint
```

Expected: No errors

**Step 3: Run build**

```bash
npm run build
```

Expected: Build succeeds

**Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: resolve any test/lint/build issues"
```

---

## Summary

This plan creates a functional discovery MVP with:

1. **TypeScript types** matching the database schema
2. **Supabase client** for database access
3. **React Query hooks** for data fetching
4. **Router** with all required pages
5. **Layout** with Header and search
6. **Park browsing** (Home → Park list)
7. **Restaurant browsing** (Park → Restaurant list)
8. **Menu item display** with nutrition and allergens
9. **Menu item detail page** with full nutrition table
10. **Search** with grouped results
11. **Filter sidebar** for calories and allergens
12. **Seed data** for testing
13. **Favorites migration** for future auth implementation

Auth (Login/Signup/Favorites) is scaffolded but not implemented in this plan to keep scope focused.
