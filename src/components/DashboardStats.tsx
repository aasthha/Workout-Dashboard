"use client";

import { WorkoutCategory } from "@/lib/supabase";
import { formatDistanceToNow, differenceInDays } from "date-fns";

interface CategoryStat {
  category: WorkoutCategory;
  totalLogs: number;
  lastTrainedDate: Date | null;
}

export function DashboardStats({ stats }: { stats: CategoryStat[] }) {
  const getCategoryColor = (category: WorkoutCategory) => {
    switch (category) {
      case "Legs": return "text-purple-400 border-purple-500/30 bg-purple-500/10";
      case "CST": return "text-blue-400 border-blue-500/30 bg-blue-500/10";
      case "BB": return "text-green-400 border-green-500/30 bg-green-500/10";
      case "Cardio": return "text-red-400 border-red-500/30 bg-red-500/10";
      default: return "text-gray-400 border-gray-500/30 bg-gray-500/10";
    }
  };

  const getRecoveryStatus = (lastTrainedDate: Date | null) => {
    if (!lastTrainedDate) return { color: "bg-red-500", text: "Untrained" };
    const daysSince = differenceInDays(new Date(), lastTrainedDate);
    if (daysSince <= 3) return { color: "bg-green-500", text: "Recovered" };
    if (daysSince <= 7) return { color: "bg-yellow-500", text: "Needs Attention" };
    return { color: "bg-red-500", text: "Overdue" };
  };

  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-4 w-full pb-2 md:grid md:grid-cols-4 md:overflow-visible hide-scrollbar">
      {stats.map((stat, idx) => {
        const recovery = getRecoveryStatus(stat.lastTrainedDate);
        // Removed mobile grid span logic
        return (
          <div 
            key={stat.category} 
            className={`min-w-[140px] flex-shrink-0 snap-center p-3 md:p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all active:scale-95 md:hover:scale-105 duration-300 ${getCategoryColor(stat.category)}`}
          >
            <div className="w-full flex justify-between items-center mb-1 md:mb-2">
              <span className="font-bold text-base md:text-lg">{stat.category}</span>
              <div className="flex items-center gap-1 text-xs text-white/50" title={recovery.text}>
                <div className={`w-2 h-2 rounded-full ${recovery.color} animate-pulse`} />
              </div>
            </div>
            
            <div className="text-2xl md:text-3xl font-black mb-0.5 md:mb-1 text-white">
              {stat.totalLogs}
            </div>
            <div className="text-[10px] md:text-xs text-white/70 font-medium uppercase tracking-wider mb-2">
              Workouts
            </div>
            
            <div className="text-xs text-white/50 bg-black/20 px-3 py-1.5 rounded-lg w-full flex flex-col">
              {stat.lastTrainedDate ? (
                <>
                  <span className="font-semibold">{formatDistanceToNow(stat.lastTrainedDate, { addSuffix: true })}</span>
                </>
              ) : (
                <span>Never</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
