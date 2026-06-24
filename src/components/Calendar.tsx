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



  return (
    <div className="w-full bg-gray-800 border border-gray-700 rounded-xl p-2 shadow-xl">
      <div className="flex justify-between items-center mb-2 px-1">
        <h2 className="text-base font-bold text-white tracking-tight">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full"
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
          <div key={day} className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
                min-h-[50px] p-1 rounded-lg cursor-pointer transition-all duration-200 border flex flex-col active:scale-95
                ${!isSameMonth(day, monthStart) ? 'opacity-30 bg-gray-800 border-transparent' : 
                  dayWorkouts.length > 0 ? 'bg-gray-700 border-gray-600 hover:border-gray-500' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}
                ${isSelected ? 'bg-emerald-500 text-white border-emerald-500 scale-105 z-10 shadow-lg shadow-emerald-500/20' : ''}
                ${isToday(day) && !isSelected ? 'border-emerald-500/50' : ''}
              `}
            >
              <div className="flex justify-center items-start">
                <span className={`text-xs font-medium ${isSelected ? 'text-white' : isToday(day) ? 'text-emerald-400 font-bold' : 'text-gray-300'}`}>
                  {format(day, 'd')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
