# UI Redesign: Theme Park Vibrant

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the minimal UI into a polished, vibrant theme park aesthetic

**Style:** Classic Theme Park colors with polished, refined visual flair

---

## Color System

### Primary Colors
- **Deep Blue** `#1e3a5f` - Headers, primary buttons, navigation background
- **Golden Yellow** `#f5a623` - Accents, highlights, CTAs, prices
- **Warm Red** `#d64545` - Allergen warnings, important alerts

### Supporting Colors
- **Cream White** `#faf8f5` - Page backgrounds
- **Soft Blue** `#e8f0f8` - Card backgrounds, subtle sections
- **Dark Slate** `#2d3748` - Body text

### Design Tokens (Tailwind)
```js
// tailwind.config.js colors extension
colors: {
  'park-blue': '#1e3a5f',
  'park-gold': '#f5a623',
  'park-red': '#d64545',
  'park-cream': '#faf8f5',
  'park-soft': '#e8f0f8',
  'park-slate': '#2d3748',
}
```

---

## Typography

- **Headers:** Bold, deep blue (`text-park-blue`)
- **Body:** Dark slate (`text-park-slate`)
- **Prices:** Golden yellow, semi-bold (`text-park-gold font-semibold`)
- **Categories:** Uppercase, small, letter-spaced (`uppercase text-sm tracking-wide`)

---

## Component Designs

### Header
- Deep blue background (`bg-park-blue`)
- White logo text with golden yellow icon
- Pill-shaped search bar with soft blue background
- White nav links with golden yellow hover underline
- Subtle bottom shadow

### Home Page Hero
- Deep blue to soft blue gradient background
- "Discover Park Dining" headline in white
- Warm subheading text
- Positioned above park cards

### Park Cards
- Cream background with warm shadow
- Deep blue park name (larger, bolder)
- Slate location text
- Golden yellow left border accent (4px)
- Golden yellow arrow icon on hover
- Hover: lift with deeper shadow

### Restaurant Cards
- Cream/shadow treatment matching park cards
- Cuisine type as pill badge (soft blue bg, deep blue text)
- Map-pin icon for location
- Golden yellow accent on hover

### Menu Item Cards
- Deep blue bold name
- Slate description
- Golden yellow price (prominent)
- Nutrition summary in soft blue pill: "850 cal · 42g protein"
- Allergen badges: warm red "contains", orange "may contain"
- Placeholder icon when no photo
- Hover: gentle lift

### Restaurant Page
- Hero section with soft blue background
- Restaurant name in deep blue, cuisine badge, location
- 2-column grid for menu items (desktop)
- Category headers with golden yellow underline

### Menu Item Detail Page
- Large deep blue item name
- Prominent golden yellow price
- Nutrition table:
  - Soft blue header row
  - Alternating cream/white rows
  - Key values slightly bolder
  - Golden yellow confidence progress bar
- Allergen section with warm red header accent
- Back navigation with arrow

### Search Results
- Prominent search query display
- Results grouped by restaurant
- Subtle golden yellow highlight on matches

---

## Shadows & Effects

- Cards: `shadow-md` with warm tint, `hover:shadow-lg` with slight translateY
- Rounded corners: `rounded-xl` (12px)
- Transitions: `transition-all duration-200`

---

## Files to Modify

1. `tailwind.config.js` - Add custom colors
2. `src/index.css` - Global styles, body background
3. `src/components/layout/Header.tsx` - Complete redesign
4. `src/components/layout/Layout.tsx` - Background color
5. `src/pages/Home.tsx` - Add hero section
6. `src/components/parks/ParkCard.tsx` - New styling
7. `src/components/parks/ParkList.tsx` - Grid adjustments
8. `src/components/restaurants/RestaurantCard.tsx` - New styling
9. `src/components/restaurants/RestaurantList.tsx` - Grid adjustments
10. `src/pages/Restaurant.tsx` - Hero section, layout
11. `src/components/menu/MenuItemCard.tsx` - New styling
12. `src/components/menu/NutritionSummary.tsx` - Pill style
13. `src/components/menu/AllergenBadges.tsx` - Red/orange badges
14. `src/components/menu/NutritionTable.tsx` - Table styling
15. `src/pages/MenuItem.tsx` - Detail page layout
16. `src/pages/Search.tsx` - Results styling
