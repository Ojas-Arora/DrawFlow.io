/*
  # Collaborative Whiteboard Database Schema

  ## Overview
  This migration creates the database structure for a real-time collaborative whiteboard application.

  ## New Tables
  
  ### `boards`
  Stores whiteboard session information
  - `id` (uuid, primary key) - Unique board identifier
  - `name` (text) - Board name/title
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `drawing_events`
  Stores individual drawing actions for persistence and replay
  - `id` (uuid, primary key) - Unique event identifier
  - `board_id` (uuid, foreign key) - Reference to board
  - `user_id` (text) - Anonymous user identifier
  - `event_type` (text) - Type of drawing event (draw, erase, clear)
  - `data` (jsonb) - Drawing data (coordinates, color, tool, etc.)
  - `created_at` (timestamptz) - Event timestamp
  
  ### `chat_messages`
  Stores chat messages for each board
  - `id` (uuid, primary key) - Unique message identifier
  - `board_id` (uuid, foreign key) - Reference to board
  - `user_id` (text) - Anonymous user identifier
  - `username` (text) - Display name
  - `message` (text) - Message content
  - `created_at` (timestamptz) - Message timestamp
  
  ### `active_users`
  Tracks currently active users on each board
  - `id` (uuid, primary key) - Unique identifier
  - `board_id` (uuid, foreign key) - Reference to board
  - `user_id` (text) - Anonymous user identifier
  - `username` (text) - Display name
  - `last_seen` (timestamptz) - Last activity timestamp
  - `cursor_x` (integer) - Current cursor X position
  - `cursor_y` (integer) - Current cursor Y position

  ## Security
  - Enable RLS on all tables
  - Allow public read/write access for demo purposes (can be restricted later)
  
  ## Notes
  - Uses anonymous user IDs generated client-side
  - All tables have RLS enabled with permissive policies for MVP
  - Real-time subscriptions enabled by default on all tables
*/

-- Create boards table
CREATE TABLE IF NOT EXISTS boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Untitled Board',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create drawing_events table
CREATE TABLE IF NOT EXISTS drawing_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  event_type text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  username text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create active_users table
CREATE TABLE IF NOT EXISTS active_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  username text NOT NULL,
  last_seen timestamptz DEFAULT now(),
  cursor_x integer DEFAULT 0,
  cursor_y integer DEFAULT 0,
  UNIQUE(board_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_drawing_events_board_id ON drawing_events(board_id);
CREATE INDEX IF NOT EXISTS idx_drawing_events_created_at ON drawing_events(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_board_id ON chat_messages(board_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_active_users_board_id ON active_users(board_id);
CREATE INDEX IF NOT EXISTS idx_active_users_last_seen ON active_users(last_seen);

-- Enable Row Level Security
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE drawing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_users ENABLE ROW LEVEL SECURITY;

-- Create policies for boards (public access for MVP)
CREATE POLICY "Anyone can view boards"
  ON boards FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create boards"
  ON boards FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update boards"
  ON boards FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create policies for drawing_events (public access for MVP)
CREATE POLICY "Anyone can view drawing events"
  ON drawing_events FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create drawing events"
  ON drawing_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete drawing events"
  ON drawing_events FOR DELETE
  USING (true);

-- Create policies for chat_messages (public access for MVP)
CREATE POLICY "Anyone can view chat messages"
  ON chat_messages FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create chat messages"
  ON chat_messages FOR INSERT
  WITH CHECK (true);

-- Create policies for active_users (public access for MVP)
CREATE POLICY "Anyone can view active users"
  ON active_users FOR SELECT
  USING (true);

CREATE POLICY "Anyone can manage active users"
  ON active_users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update active users"
  ON active_users FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete active users"
  ON active_users FOR DELETE
  USING (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_boards_updated_at
  BEFORE UPDATE ON boards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();