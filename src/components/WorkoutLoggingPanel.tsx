"use client";

import { WorkoutCategory } from "@/lib/supabase";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import { CATEGORY_COLORS } from "@/lib/colors";

interface WorkoutLoggingPanelProps {
  selectedDate: Date;
  existingWorkouts: WorkoutCategory[];
  onToggleWorkout: (category: WorkoutCategory) => void;
  onClose: () => void;
}

const CATEGORIES: WorkoutCategory[] = ["Legs", "CST", "BB", "Cardio"];

export function WorkoutLoggingPanel({ 
  selectedDate, 
  existingWorkouts, 
  onToggleWorkout,
  onClose
}: WorkoutLoggingPanelProps) {
  
  const getCategoryStyles = (category: WorkoutCategory, isActive: boolean) => {
    if (!isActive) return "bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-700 hover:border-gray-600";
    const colors = CATEGORY_COLORS[category];
    return `${colors.activeBg} ${colors.text} ${colors.border}`;
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors bg-white/5 p-1 rounded-full hover:bg-white/10"
      >
        <X size={16} />
      </button>

      <div className="mb-2">
        <h3 className="text-base font-bold text-white mb-0">Log Workout</h3>
        <p className="text-gray-400 text-[10px] font-medium">{format(selectedDate, "EEEE, MMMM do, yyyy")}</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(category => {
          const isActive = existingWorkouts.includes(category);
          return (
            <button
              key={category}
              onClick={() => onToggleWorkout(category)}
              className={`
                flex-1 min-w-[30%] flex items-center justify-between p-2 rounded-lg border-2 transition-all duration-200 group
                ${getCategoryStyles(category, isActive)}
              `}
            >
              <span className="font-bold tracking-wide text-sm">{category}</span>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${isActive ? `${CATEGORY_COLORS[category].border} ${CATEGORY_COLORS[category].activeBg}` : 'border-gray-600 group-hover:border-gray-500'}`}>
                {isActive && <Check size={10} strokeWidth={3} className={CATEGORY_COLORS[category].text} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
