import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type WorkoutCategory = "Legs" | "CST" | "BB" | "Arms" | "Cardio";

export interface Workout {
  id: string;
  workout_date: string;
  category: WorkoutCategory;
  created_at: string;
}
