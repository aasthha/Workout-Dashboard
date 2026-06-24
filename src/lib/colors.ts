import { WorkoutCategory } from "./supabase";

export const CATEGORY_COLORS: Record<WorkoutCategory, { bg: string, text: string, border: string, dot: string, activeBg: string, abbr: string, initial: string }> = {
  "Legs": { bg: "bg-purple-500", text: "text-purple-400", border: "border-purple-500", dot: "bg-purple-500", activeBg: "bg-purple-500/20", abbr: "LEGS", initial: "L" },
  "CST": { bg: "bg-blue-500", text: "text-blue-400", border: "border-blue-500", dot: "bg-blue-500", activeBg: "bg-blue-500/20", abbr: "CST", initial: "C" },
  "BB": { bg: "bg-pink-500", text: "text-pink-400", border: "border-pink-500", dot: "bg-pink-500", activeBg: "bg-pink-500/20", abbr: "BB", initial: "B" },
  "Cardio": { bg: "bg-orange-500", text: "text-orange-400", border: "border-orange-500", dot: "bg-orange-500", activeBg: "bg-orange-500/20", abbr: "CAR", initial: "C" }
};
