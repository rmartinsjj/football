/*
  # Fix players.team_name to allow NULL values

  ## Changes
  - Alter `players.team_name` column to allow NULL values
  - Players don't have a team when first added, only after the team draw

  ## Reason
  Players are added to the system before teams are drawn/assigned.
  The team_name should only be populated after the team sorting happens.
*/

ALTER TABLE players 
ALTER COLUMN team_name DROP NOT NULL;
