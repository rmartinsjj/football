/*
  # Add active_match field to game_days

  ## Changes
  - Add `active_match_id` column to `game_days` table to track the currently active match
  - This allows the app to restore the correct match state when returning to the games screen

  ## Details
  - `active_match_id` (integer, nullable) - Stores the match_number of the currently active match
  - When a match is started, this value is updated
  - When returning to the app, the system will automatically select this match
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'game_days' AND column_name = 'active_match_id'
  ) THEN
    ALTER TABLE game_days ADD COLUMN active_match_id integer;
  END IF;
END $$;
