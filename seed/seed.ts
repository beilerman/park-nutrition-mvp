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
