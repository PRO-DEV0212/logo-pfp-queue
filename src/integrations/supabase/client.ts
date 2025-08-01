// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hpnldnkxcmdpfrxfyzfk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwbmxkbmt4Y21kcGZyeGZ5emZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MTk5MjYsImV4cCI6MjA2OTE5NTkyNn0.aDhUxaq-naKzetjkE6h8JtXOb86i_C1FAt3KdrgPsTs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});