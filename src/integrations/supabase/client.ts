// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kojhfjnlhuytaiwunnxy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvamhmam5saHV5dGFpd3Vubnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxOTIxMjksImV4cCI6MjA1NDc2ODEyOX0.Q6rDqNnBZaPd7ASd_oCtWJiE8IjZtrZ0zdEy8Swn28s";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);