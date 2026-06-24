import { WorkoutCategory } from "./supabase";

export const CATEGORY_COLORS: Record<WorkoutCategory, { bg: string, text: string, border: string, dot: string, activeBg: string }> = {
  "Legs": { bg: "bg-purple-500", text: "text-purple-400", border: "border-purple-500", dot: "bg-purple-500", activeBg: "bg-purple-500/20" },
  "CST": { bg: "bg-blue-500", text: "text-blue-400", border: "border-blue-500", dot: "bg-blue-500", activeBg: "bg-blue-500/20" },
  "BB": { bg: "bg-green-500", text: "text-green-400", border: "border-green-500", dot: "bg-green-500", activeBg: "bg-green-500/20" },
  "Cardio": { bg: "bg-orange-500", text: "text-orange-400", border: "border-orange-500", dot: "bg-orange-500", activeBg: "bg-orange-500/20" }
};
