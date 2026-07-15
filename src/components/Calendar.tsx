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
  isToday,
  addMonths,
  subMonths
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORY_COLORS } from "@/lib/colors";

interface CalendarProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  workouts: Record<string, WorkoutCategory[]>; // Map of YYYY-MM-DD -> categories
  onSelectDay: (date: Date) => void;
  selectedDate: Date | null;
}

export function Calendar({ currentMonth, onMonthChange, workouts, onSelectDay, selectedDate }: CalendarProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  
  // Calculate full month days
  const monthStartDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const monthEndDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({
    start: monthStartDate,
    end: monthEndDate
  });



  return (
    <div className="w-full bg-gray-800 border border-gray-700 rounded-xl p-2 shadow-xl">
      <div className="flex justify-between items-center mb-2 px-1">
        <button 
          onClick={() => onMonthChange(subMonths(currentMonth, 1))}
          className="text-gray-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-lg hover:bg-white/10"
        >
          <ChevronLeft size={16} />
        </button>
        <h2 className="text-base font-bold text-white tracking-tight text-center">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button 
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
          className="text-gray-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-lg hover:bg-white/10"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      

      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
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
                min-h-[36px] p-1 rounded-lg cursor-pointer transition-all duration-200 border flex flex-col active:scale-95
                ${!isSameMonth(day, monthStart) 
                  ? 'opacity-30 bg-gray-800 border-transparent' 
                  : dayWorkouts.length === 1 
                    ? `${CATEGORY_COLORS[dayWorkouts[0]].activeBg} ${CATEGORY_COLORS[dayWorkouts[0]].border} hover:brightness-110` 
                    : dayWorkouts.length > 1
                      ? 'bg-gray-700 border-gray-600 hover:border-gray-500'
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                }
                ${isSelected ? 'ring-1 ring-white border-white scale-105 z-10 shadow-lg' : ''}
                ${isToday(day) && !isSelected ? 'border-emerald-500/50' : ''}
              `}
            >
              <div className="flex justify-center items-start">
                <span className={`text-xs font-medium ${isSelected ? 'text-white' : isToday(day) ? 'text-emerald-400 font-bold' : 'text-gray-300'}`}>
                  {format(day, 'd')}
                </span>
              </div>
              
              <div className="mt-auto pt-1 flex justify-center items-center gap-0.5">
                {dayWorkouts.length === 1 ? (
                  <span className={`text-[9px] font-bold tracking-widest ${CATEGORY_COLORS[dayWorkouts[0]].text}`}>
                    {CATEGORY_COLORS[dayWorkouts[0]].abbr}
                  </span>
                ) : dayWorkouts.length > 1 ? (
                  <div className="flex items-center gap-0.5">
                    {dayWorkouts.map((workout, idx) => (
                      <div key={idx} className="flex items-center gap-0.5">
                        <div className={`w-1 h-1 rounded-full ${CATEGORY_COLORS[workout].dot}`} />
                        <span className={`text-[8px] font-bold text-gray-300`}>
                          {CATEGORY_COLORS[workout].initial}
                        </span>
                        {idx < dayWorkouts.length - 1 && (
                          <span className={`text-[8px] font-bold text-gray-500`}>+</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
