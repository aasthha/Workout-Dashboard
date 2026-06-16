"use client";

import { WorkoutCategory } from "@/lib/supabase";
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  format, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface CalendarProps {
  currentDate: Date;
  workouts: Record<string, WorkoutCategory[]>; // Map of YYYY-MM-DD -> categories
  onSelectDay: (date: Date) => void;
  selectedDate: Date | null;
}

export function Calendar({ currentDate, workouts, onSelectDay, selectedDate }: CalendarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  // Calculate full month days
  const monthStartDate = startOfWeek(monthStart);
  const monthEndDate = endOfWeek(monthEnd);
  
  // Calculate current week days based on selectedDate or currentDate
  const activeDate = selectedDate || currentDate;
  const weekStartDate = startOfWeek(activeDate);
  const weekEndDate = endOfWeek(activeDate);

  const days = eachDayOfInterval({
    start: isExpanded ? monthStartDate : weekStartDate,
    end: isExpanded ? monthEndDate : weekEndDate
  });

  const getCategoryColor = (category: WorkoutCategory) => {
    switch (category) {
      case "Legs": return "bg-purple-500";
      case "CST": return "bg-blue-500";
      case "BB": return "bg-green-500";
      case "Arms": return "bg-orange-500";
      case "Cardio": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="w-full bg-[#1e222a] border border-[#2d333b] rounded-2xl p-3 sm:p-4 md:p-6 shadow-xl">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs font-semibold text-white/50 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full"
        >
          {isExpanded ? (
            <>Collapse <ChevronUp size={14} /></>
          ) : (
            <>Expand <ChevronDown size={14} /></>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-white/40 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {days.map((day, dayIdx) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayWorkouts = workouts[dateStr] || [];
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          
          return (
            <div
              key={day.toString()}
              onClick={() => onSelectDay(day)}
              className={`
                min-h-[64px] md:min-h-[80px] p-1.5 md:p-2 rounded-xl cursor-pointer transition-all duration-200 border flex flex-col active:scale-95
                ${!isSameMonth(day, monthStart) ? 'opacity-30 bg-[#1e222a] border-transparent' : 'bg-[#252a34] border-[#374151] hover:border-white/30'}
                ${isSelected ? 'ring-2 ring-white border-white scale-105 z-10' : ''}
                ${isToday(day) && !isSelected ? 'border-blue-500/50 bg-blue-500/5' : ''}
              `}
            >
              <div className="flex justify-between items-start">
                <span className={`text-sm font-medium ${isToday(day) ? 'text-blue-400 font-bold' : 'text-white/80'}`}>
                  {format(day, 'd')}
                </span>
              </div>
              
              <div className="mt-auto pt-2 flex flex-wrap gap-1">
                {dayWorkouts.map((workout, idx) => (
                  <div 
                    key={idx}
                    title={workout}
                    className={`w-3 h-3 rounded-full ${getCategoryColor(workout)} shadow-[0_0_8px_rgba(255,255,255,0.2)]`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
