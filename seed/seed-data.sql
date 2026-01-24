-- Seed data for Park Nutrition MVP
-- Run this in the Supabase SQL Editor

-- Clear existing data (if any)
DELETE FROM allergens;
DELETE FROM nutritional_data;
DELETE FROM menu_items;
DELETE FROM restaurants;
DELETE FROM parks;

-- Insert Parks
INSERT INTO parks (name, location, timezone) VALUES
  ('Magic Kingdom', 'Walt Disney World, Orlando, FL', 'America/New_York'),
  ('Universal Studios Florida', 'Universal Orlando Resort, Orlando, FL', 'America/New_York');

-- Insert Restaurants (using subqueries to get park IDs)
INSERT INTO restaurants (park_id, name, location_in_park, cuisine_type) VALUES
  ((SELECT id FROM parks WHERE name = 'Magic Kingdom'), 'Cosmic Ray''s Starlight Cafe', 'Tomorrowland', 'American'),
  ((SELECT id FROM parks WHERE name = 'Magic Kingdom'), 'Pecos Bill Tall Tale Inn and Cafe', 'Frontierland', 'Tex-Mex'),
  ((SELECT id FROM parks WHERE name = 'Universal Studios Florida'), 'Leaky Cauldron', 'Diagon Alley', 'British');

-- Insert Menu Items
INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
  ((SELECT id FROM restaurants WHERE name = 'Cosmic Ray''s Starlight Cafe'), 'Angus Bacon Cheeseburger', '1/3 lb. Angus burger with bacon, cheese, lettuce, tomato, and pickles', 14.99, 'entree'),
  ((SELECT id FROM restaurants WHERE name = 'Cosmic Ray''s Starlight Cafe'), 'Chicken Nuggets', 'Crispy chicken nuggets with fries', 11.99, 'entree'),
  ((SELECT id FROM restaurants WHERE name = 'Pecos Bill Tall Tale Inn and Cafe'), 'Taco Trio', 'Three soft tacos with seasoned beef, lettuce, cheese, and salsa', 12.99, 'entree'),
  ((SELECT id FROM restaurants WHERE name = 'Leaky Cauldron'), 'Fish and Chips', 'Traditional British battered fish with chips and mushy peas', 16.99, 'entree'),
  ((SELECT id FROM restaurants WHERE name = 'Leaky Cauldron'), 'Butterbeer', 'Famous frozen or cold Butterbeer beverage', 8.99, 'beverage');

-- Insert Nutritional Data
INSERT INTO nutritional_data (menu_item_id, source, calories, carbs, protein, fat, sodium, confidence_score) VALUES
  ((SELECT id FROM menu_items WHERE name = 'Angus Bacon Cheeseburger'), 'official', 850, 52, 42, 48, 1420, 95),
  ((SELECT id FROM menu_items WHERE name = 'Chicken Nuggets'), 'official', 620, 45, 28, 35, 980, 95),
  ((SELECT id FROM menu_items WHERE name = 'Taco Trio'), 'official', 680, 58, 32, 34, 1280, 90),
  ((SELECT id FROM menu_items WHERE name = 'Fish and Chips'), 'api_lookup', 920, 78, 38, 52, 1560, 65),
  ((SELECT id FROM menu_items WHERE name = 'Butterbeer'), 'crowdsourced', 280, 65, 1, 3, NULL, 75);

-- Insert Allergens
INSERT INTO allergens (menu_item_id, allergen_type, severity) VALUES
  ((SELECT id FROM menu_items WHERE name = 'Angus Bacon Cheeseburger'), 'wheat', 'contains'),
  ((SELECT id FROM menu_items WHERE name = 'Angus Bacon Cheeseburger'), 'milk', 'contains'),
  ((SELECT id FROM menu_items WHERE name = 'Chicken Nuggets'), 'wheat', 'contains'),
  ((SELECT id FROM menu_items WHERE name = 'Taco Trio'), 'wheat', 'contains'),
  ((SELECT id FROM menu_items WHERE name = 'Taco Trio'), 'milk', 'contains'),
  ((SELECT id FROM menu_items WHERE name = 'Fish and Chips'), 'fish', 'contains'),
  ((SELECT id FROM menu_items WHERE name = 'Fish and Chips'), 'wheat', 'contains'),
  ((SELECT id FROM menu_items WHERE name = 'Butterbeer'), 'milk', 'contains');

-- Verify the data
SELECT 'Parks:' as table_name, COUNT(*) as count FROM parks
UNION ALL
SELECT 'Restaurants:', COUNT(*) FROM restaurants
UNION ALL
SELECT 'Menu Items:', COUNT(*) FROM menu_items
UNION ALL
SELECT 'Nutritional Data:', COUNT(*) FROM nutritional_data
UNION ALL
SELECT 'Allergens:', COUNT(*) FROM allergens;
