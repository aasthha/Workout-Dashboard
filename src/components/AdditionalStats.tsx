"use client";

import { Dumbbell, Calendar } from "lucide-react";

interface AdditionalStatsProps {
  totalWorkouts: number;
  workoutsThisMonth: number;
}

export function AdditionalStats({ 
  totalWorkouts, 
  workoutsThisMonth 
}: AdditionalStatsProps) {
  const stats = [
    {
      label: "Total Workouts",
      value: totalWorkouts,
      icon: Dumbbell,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      label: "This Month",
      value: workoutsThisMonth,
      icon: Calendar,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className={`p-3 md:p-5 rounded-2xl border ${stat.border} bg-[#1e222a] flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 transition-transform hover:-translate-y-1 duration-300`}>
            <div className={`p-2.5 sm:p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <Icon size={22} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-white/50 font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
