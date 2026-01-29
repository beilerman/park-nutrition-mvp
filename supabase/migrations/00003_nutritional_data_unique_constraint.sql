-- Add UNIQUE constraint on nutritional_data.menu_item_id
-- The application treats nutritional_data as a one-to-one relation with menu_items,
-- but the schema previously allowed multiple rows per menu item.
ALTER TABLE nutritional_data ADD CONSTRAINT nutritional_data_menu_item_id_unique UNIQUE (menu_item_id);
