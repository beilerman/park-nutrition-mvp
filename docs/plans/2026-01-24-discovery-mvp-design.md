# Park Nutrition MVP: Discovery-First Design

## Overview

A nutrition discovery app for theme park food. Users can browse parks, restaurants, and menu items with full nutritional information and allergen data. Filtering by calories, allergens, and diet tags helps users find food that fits their needs.

**Target users:** Health-conscious visitors, allergy sufferers, diet followers

**Primary goal:** Help users explore what's available and make informed choices

**Approach:** Discovery-first MVP — nail browse/search/filter before adding tracking features

## URL Structure

```
/                       → Landing page (park selector)
/parks/:parkId          → Park overview (list of restaurants)
/restaurants/:id        → Restaurant detail (menu items)
/items/:id              → Menu item detail (full nutrition)
/search                 → Global search results
/login, /signup         → Auth pages
/favorites              → Saved items (requires auth)
```

## Primary User Flow

1. User lands on homepage, sees list of supported resorts/parks
2. Selects a park (e.g., "Magic Kingdom")
3. Sees all restaurants in that park with basic info (cuisine, location)
4. Taps a restaurant to see its menu
5. Taps a menu item to see full nutritional breakdown and allergens
6. Can save items to favorites (prompts login if not authenticated)

## Navigation Elements

- **Header:** Logo, search bar, park selector dropdown, login/favorites
- **Filters sidebar:** Always visible on desktop — calories range, allergens to exclude, diet tags
- **Breadcrumbs:** Park → Restaurant → Item (for orientation)

## Menu Item Display

### Card View (in lists)

```
┌─────────────────────────────────────────┐
│ [Photo]  Dole Whip Float                │
│          Pineapple Pineapple Paradise   │
│                                         │
│  350 cal   45g carbs   2g protein       │
│                                         │
│  Dairy · May contain: Tree nuts         │
│  Vegetarian                             │
│                                         │
│  [Save]                                 │
└─────────────────────────────────────────┘
```

### Nutrition Display

- **Primary:** Calories (always visible)
- **Secondary:** Carbs, Protein, Fat (visible on card)
- **Detail view:** Full breakdown (sodium, fiber, sugar, cholesterol, etc.)
- **Confidence indicator:** Badge on items with low confidence scores (< 70%)

## Filter Options

- **Calories:** Range slider (0–2000+)
- **Exclude allergens:** Checkboxes (Dairy, Gluten, Nuts, Shellfish, Soy, Eggs)
- **Diet tags:** Vegetarian, Vegan, Keto-friendly, Low-sodium
- **Category:** Entree, Snack, Beverage, Dessert, Side
- **Price range:** $, $$, $$$

## Search Behavior

- Searches item names and descriptions
- Results grouped by restaurant
- Filters apply to search results

## Component Architecture

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Breadcrumbs.tsx
│   ├── parks/
│   │   ├── ParkCard.tsx
│   │   └── ParkList.tsx
│   ├── restaurants/
│   │   ├── RestaurantCard.tsx
│   │   └── RestaurantList.tsx
│   ├── menu/
│   │   ├── MenuItemCard.tsx
│   │   ├── MenuItemDetail.tsx
│   │   ├── NutritionTable.tsx
│   │   └── AllergenBadges.tsx
│   ├── filters/
│   │   ├── FilterSidebar.tsx
│   │   ├── CalorieSlider.tsx
│   │   └── AllergenCheckboxes.tsx
│   └── search/
│       ├── SearchBar.tsx
│       └── SearchResults.tsx
├── pages/
│   ├── Home.tsx
│   ├── Park.tsx
│   ├── Restaurant.tsx
│   ├── MenuItem.tsx
│   ├── Search.tsx
│   ├── Favorites.tsx
│   ├── Login.tsx
│   └── Signup.tsx
└── lib/
    ├── supabase.ts
    ├── queries.ts
    └── types.ts
```

## State Management

- **Server state:** React Query for all Supabase data
- **URL state:** Filters stored in URL params (shareable filtered views)
- **Auth state:** Supabase auth + React context
- **No Redux/Zustand needed**

## Data Fetching Hooks

- `useParks()` → list all parks
- `useRestaurants(parkId)` → restaurants for a park
- `useMenuItems(restaurantId, filters)` → filtered menu items
- `useMenuItem(id)` → single item with full nutrition

## Authentication

- Email/password signup and login via Supabase Auth
- Optional: Google OAuth
- Session persisted in localStorage
- Protected routes redirect to `/login` with return URL

### User Favorites Table

```sql
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, menu_item_id)
);

CREATE POLICY "Users manage own favorites" ON user_favorites
  FOR ALL USING (auth.uid() = user_id);
```

## Data Seeding Strategy

### MVP Scope

- 1-2 parks with complete data (e.g., Magic Kingdom + Universal Studios)
- ~20-30 restaurants, ~200-300 menu items

### Data Sources (priority order)

1. Official park nutrition/allergy publications
2. Manual research cross-referenced with Nutritionix/MyFitnessPal
3. API lookup for generic items

### Confidence Scores

- Official source: 90-100%
- Manual research (multiple sources): 70-89%
- API lookup (generic match): 40-69%
- Single unverified source: < 40%

### Required Nutrition Fields

- Core: calories, carbs, protein, fat
- Extended (when available): sodium, sugar, fiber

### Allergens

Big 8: milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, soy

## Pages Summary

| Page | Purpose | Key Features |
|------|---------|--------------|
| Home | Park selection | Grid of park cards |
| Park | Restaurant list | Filter by cuisine |
| Restaurant | Menu items | Category tabs, filters |
| MenuItem | Full details | Nutrition table, allergens, save |
| Search | Global search | Results by restaurant |
| Favorites | Saved items | Requires auth |
| Login/Signup | Auth | Simple forms |

## Out of Scope for MVP

- Food diary / consumption tracking
- Portion adjustment
- Meal planning
- Photo uploads by users
- Crowdsourced submissions
- Mobile-optimized layout
- User dietary preferences storage
- Push notifications

## Definition of Done

1. User can browse parks → restaurants → menu items
2. User can filter by calories, allergens, diet tags
3. User can search for items by name
4. User can sign up, log in, save favorites
5. At least 2 parks fully seeded with data
6. Works on desktop browsers (Chrome, Firefox, Safari)
