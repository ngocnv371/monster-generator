
import { createClient } from '@supabase/supabase-js';
// Fix: Import only necessary types and use utility types for schema definition.
import { type Monster } from '../types';

// Define a type for your database schema
// This helps with type safety when interacting with Supabase
interface Database {
  public: {
    Tables: {
      monsters: {
        Row: Monster; // The type of a row in your table
        // Fix: Use utility types to derive Insert type from Row type.
        Insert: Omit<Monster, 'id' | 'created_at'>;
        // Fix: Use utility types to derive Update type from Row type.
        Update: Partial<Omit<Monster, 'id' | 'created_at' | 'user_id'>>;
      };
    };
  };
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are not set in environment variables. Please set SUPABASE_URL and SUPABASE_ANON_KEY.");
}

// Create a client with the credentials from environment variables.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);