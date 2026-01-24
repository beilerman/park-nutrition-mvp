-- Parks table
CREATE TABLE parks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Restaurants table
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  park_id UUID NOT NULL REFERENCES parks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location_in_park TEXT,
  cuisine_type TEXT,
  hours JSONB,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu items table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  category TEXT NOT NULL CHECK (category IN ('entree', 'snack', 'beverage', 'dessert', 'side')),
  is_seasonal BOOLEAN DEFAULT FALSE,
  photo_url TEXT,
  last_verified_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Nutritional data table
CREATE TABLE nutritional_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  source TEXT NOT NULL CHECK (source IN ('official', 'crowdsourced', 'api_lookup')),
  calories INTEGER,
  carbs INTEGER,
  sugar INTEGER,
  protein INTEGER,
  fat INTEGER,
  saturated_fat INTEGER,
  sodium INTEGER,
  fiber INTEGER,
  cholesterol INTEGER,
  confidence_score INTEGER DEFAULT 50 CHECK (confidence_score >= 0 AND confidence_score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allergens table
CREATE TABLE allergens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  allergen_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('contains', 'may_contain')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_restaurants_park_id ON restaurants(park_id);
CREATE INDEX idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX idx_nutritional_data_menu_item_id ON nutritional_data(menu_item_id);
CREATE INDEX idx_allergens_menu_item_id ON allergens(menu_item_id);

-- Enable Row Level Security (permissive for MVP - anyone can read)
ALTER TABLE parks ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutritional_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergens ENABLE ROW LEVEL SECURITY;

-- Read-only policies for anonymous users
CREATE POLICY "Anyone can read parks" ON parks FOR SELECT USING (true);
CREATE POLICY "Anyone can read restaurants" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Anyone can read menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Anyone can read nutritional_data" ON nutritional_data FOR SELECT USING (true);
CREATE POLICY "Anyone can read allergens" ON allergens FOR SELECT USING (true);
