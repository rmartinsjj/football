/*
  # Add vest washer photo to game days

  1. Changes
    - Add `vest_washer_photo` column to `game_days` table to store the photo URL/path of the person who washed the vest
    - Add `vest_washer_name` column to store the name of the person (optional)
  
  2. Security
    - No RLS changes needed as game_days already has RLS enabled
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'game_days' AND column_name = 'vest_washer_photo'
  ) THEN
    ALTER TABLE game_days ADD COLUMN vest_washer_photo text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'game_days' AND column_name = 'vest_washer_name'
  ) THEN
    ALTER TABLE game_days ADD COLUMN vest_washer_name text;
  END IF;
END $$;