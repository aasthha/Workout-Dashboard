"use client";

import { WorkoutCategory } from "@/lib/supabase";
import { format } from "date-fns";
import { Check, X } from "lucide-react";

interface WorkoutLoggingPanelProps {
  selectedDate: Date;
  existingWorkouts: WorkoutCategory[];
  onToggleWorkout: (category: WorkoutCategory) => void;
  onClose: () => void;
}

const CATEGORIES: WorkoutCategory[] = ["Legs", "CST", "BB", "Arms", "Cardio"];

export function WorkoutLoggingPanel({ 
  selectedDate, 
  existingWorkouts, 
  onToggleWorkout,
  onClose
}: WorkoutLoggingPanelProps) {
  
  const getCategoryStyles = (category: WorkoutCategory, isActive: boolean) => {
    if (!isActive) return "bg-[#252a34] border-[#374151] text-white/60 hover:bg-[#2a303c] hover:border-white/20";
    
    switch (category) {
      case "Legs": return "bg-purple-500 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]";
      case "CST": return "bg-blue-500 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)]";
      case "BB": return "bg-green-500 text-white border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]";
      case "Arms": return "bg-orange-500 text-white border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]";
      case "Cardio": return "bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]";
      default: return "bg-gray-500 text-white border-gray-400";
    }
  };

  return (
    <div className="bg-[#1e222a] border border-[#2d333b] rounded-2xl p-6 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10"
      >
        <X size={20} />
      </button>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">Log Workout</h3>
        <p className="text-white/50 text-sm font-medium">{format(selectedDate, "EEEE, MMMM do, yyyy")}</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(category => {
          const isActive = existingWorkouts.includes(category);
          return (
            <button
              key={category}
              onClick={() => onToggleWorkout(category)}
              className={`
                flex-1 min-w-[30%] flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 group
                ${getCategoryStyles(category, isActive)}
              `}
            >
              <span className="font-bold tracking-wide text-base">{category}</span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isActive ? 'border-white bg-white/20' : 'border-white/20 group-hover:border-white/40'}`}>
                {isActive && <Check size={14} strokeWidth={3} className="text-white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
