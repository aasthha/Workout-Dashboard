"use client";

import { WorkoutCategory } from "@/lib/supabase";
import { formatDistanceToNow, differenceInDays } from "date-fns";

interface CategoryStat {
  category: WorkoutCategory;
  totalLogs: number;
  lastTrainedDate: Date | null;
}

export function DashboardStats({ stats }: { stats: CategoryStat[] }) {
  // Format last trained date cleaner
  const formatLastTrained = (date: Date | null) => {
    if (!date) return "Never";
    const daysSince = differenceInDays(new Date(), date);
    if (daysSince === 0) return "Today";
    if (daysSince === 1) return "Yesterday";
    return `Last: ${daysSince}d ago`;
  };

  return (
    <div className="grid grid-cols-4 gap-2 w-full">
      {stats.map((stat, idx) => {
        return (
          <div 
            key={stat.category} 
            className="p-3 rounded-xl border border-gray-700 bg-gray-800 flex flex-col items-center justify-center text-center transition-all active:scale-95 duration-300"
          >
            <div className="text-2xl font-bold mb-0.5 text-white tracking-tight">
              {stat.totalLogs}
            </div>
            
            <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
              {stat.category}
            </div>
            
            <div className="text-[10px] text-gray-500 font-medium">
              {formatLastTrained(stat.lastTrainedDate)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
