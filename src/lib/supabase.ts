import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export type DrawingEvent = {
  id: string;
  board_id: string;
  user_id: string;
  event_type: 'draw' | 'erase' | 'clear';
  data: {
    x?: number;
    y?: number;
    prevX?: number;
    prevY?: number;
    color?: string;
    lineWidth?: number;
    tool?: string;
  };
  created_at: string;
};

export type ChatMessage = {
  id: string;
  board_id: string;
  user_id: string;
  username: string;
  message: string;
  created_at: string;
};

export type ActiveUser = {
  id: string;
  board_id: string;
  user_id: string;
  username: string;
  last_seen: string;
  cursor_x: number;
  cursor_y: number;
};

export type Board = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};
