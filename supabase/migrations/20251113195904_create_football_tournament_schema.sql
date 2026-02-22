/*
  # Football Tournament Management System Schema

  ## Overview
  This migration creates a complete football tournament management system with support for:
  - Game days with date-based organization
  - Teams and players
  - Matches and scoring
  - Tournament standings and statistics
  - Top scorers tracking
  - Vest (colete) assignments

  ## Tables Created

  ### 1. game_days
  Represents a tournament day with all its associated data
  - `id` (uuid, primary key)
  - `game_date` (date, unique) - The date of the tournament
  - `tournament_type` (text) - Type: 'championship' or 'winner-stays'
  - `active_teams` (text[]) - Array of active team names
  - `current_winner_team` (text, nullable) - For winner-stays mode
  - `is_active` (boolean) - Whether this is the current active game day
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. players
  All players in the system
  - `id` (uuid, primary key)
  - `name` (text) - Player name
  - `team_name` (text) - Team they belong to
  - `game_day_id` (uuid, foreign key) - Reference to game_days
  - `created_at` (timestamptz)

  ### 3. matches
  All matches played
  - `id` (uuid, primary key)
  - `game_day_id` (uuid, foreign key)
  - `match_number` (integer) - Sequential match number
  - `team1` (text) - First team name
  - `team2` (text) - Second team name
  - `score1` (integer) - Team 1 score
  - `score2` (integer) - Team 2 score
  - `penalty_score1` (integer, nullable) - Penalty shootout score
  - `penalty_score2` (integer, nullable)
  - `winner` (text, nullable) - Winner team name
  - `match_type` (text) - Type: 'regular', 'final', 'third_place', 'winner-stays'
  - `played` (boolean) - Whether match is complete
  - `created_at` (timestamptz)

  ### 4. match_events
  Goal events within matches
  - `id` (uuid, primary key)
  - `match_id` (uuid, foreign key)
  - `game_day_id` (uuid, foreign key)
  - `player_id` (uuid, foreign key)
  - `player_name` (text)
  - `team_name` (text)
  - `minute` (integer) - Time of goal
  - `created_at` (timestamptz)

  ### 5. vest_assignments
  Tracks which team gets the vest (colete)
  - `id` (uuid, primary key)
  - `game_day_id` (uuid, foreign key)
  - `team_name` (text) - Team assigned to wear vests
  - `assigned_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Public read access (no auth required for this app)
  - Insert/update/delete allowed for all users (simplified for sports app)

  ## Notes
  - All timestamps use UTC
  - Team names are stored as text for flexibility
  - Foreign keys ensure data integrity
  - Indexes added for common queries
*/

-- Create game_days table
CREATE TABLE IF NOT EXISTS game_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_date date UNIQUE NOT NULL,
  tournament_type text DEFAULT 'championship' CHECK (tournament_type IN ('championship', 'winner-stays')),
  active_teams text[] DEFAULT ARRAY['Flamengo', 'Cruzeiro', 'Corinthians', 'Palmeiras'],
  current_winner_team text,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  team_name text NOT NULL,
  game_day_id uuid NOT NULL REFERENCES game_days(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_day_id uuid NOT NULL REFERENCES game_days(id) ON DELETE CASCADE,
  match_number integer NOT NULL,
  team1 text NOT NULL,
  team2 text NOT NULL,
  score1 integer DEFAULT 0,
  score2 integer DEFAULT 0,
  penalty_score1 integer,
  penalty_score2 integer,
  winner text,
  match_type text DEFAULT 'regular' CHECK (match_type IN ('regular', 'final', 'third_place', 'winner-stays')),
  played boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create match_events table (goals)
CREATE TABLE IF NOT EXISTS match_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  game_day_id uuid NOT NULL REFERENCES game_days(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  player_name text NOT NULL,
  team_name text NOT NULL,
  minute integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create vest_assignments table
CREATE TABLE IF NOT EXISTS vest_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_day_id uuid NOT NULL REFERENCES game_days(id) ON DELETE CASCADE,
  team_name text NOT NULL,
  assigned_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_players_game_day ON players(game_day_id);
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_name);
CREATE INDEX IF NOT EXISTS idx_matches_game_day ON matches(game_day_id);
CREATE INDEX IF NOT EXISTS idx_match_events_match ON match_events(match_id);
CREATE INDEX IF NOT EXISTS idx_match_events_game_day ON match_events(game_day_id);
CREATE INDEX IF NOT EXISTS idx_match_events_player ON match_events(player_id);
CREATE INDEX IF NOT EXISTS idx_vest_game_day ON vest_assignments(game_day_id);
CREATE INDEX IF NOT EXISTS idx_game_days_active ON game_days(is_active);
CREATE INDEX IF NOT EXISTS idx_game_days_date ON game_days(game_date DESC);

-- Enable Row Level Security
ALTER TABLE game_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE vest_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required)
CREATE POLICY "Allow public read access to game_days"
  ON game_days FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to game_days"
  ON game_days FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to game_days"
  ON game_days FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to game_days"
  ON game_days FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to players"
  ON players FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to players"
  ON players FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to players"
  ON players FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to players"
  ON players FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to matches"
  ON matches FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to matches"
  ON matches FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to matches"
  ON matches FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to matches"
  ON matches FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to match_events"
  ON match_events FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to match_events"
  ON match_events FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to match_events"
  ON match_events FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to match_events"
  ON match_events FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to vest_assignments"
  ON vest_assignments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to vest_assignments"
  ON vest_assignments FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to vest_assignments"
  ON vest_assignments FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to vest_assignments"
  ON vest_assignments FOR DELETE
  TO public
  USING (true);