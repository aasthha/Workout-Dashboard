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
    <div className="grid grid-cols-4 gap-2 w-full">
      {stats.map((stat, idx) => {
        const recovery = getRecoveryStatus(stat.lastTrainedDate);
        return (
          <div 
            key={stat.category} 
            className={`p-1.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all active:scale-95 duration-300 ${getCategoryColor(stat.category)}`}
          >
            <div className="w-full flex justify-center items-center mb-0.5 relative">
              <span className="font-bold text-xs">{stat.category}</span>
              <div className={`absolute right-0 w-1.5 h-1.5 rounded-full ${recovery.color} animate-pulse`} />
            </div>
            
            <div className="text-xl font-black mb-0 text-white">
              {stat.totalLogs}
            </div>
            <div className="text-[9px] text-white/70 font-medium uppercase tracking-wider mb-1">
              Logs
            </div>
            
            <div className="text-[10px] text-white/60 bg-black/20 w-full rounded py-0.5">
              {stat.lastTrainedDate ? formatDistanceToNow(stat.lastTrainedDate).replace('about ', '') : "Never"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
