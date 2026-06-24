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
          <div key={idx} className={`p-2 rounded-xl border ${stat.border} bg-[#1e222a] flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 duration-300`}>
            <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color}`}>
              <Icon size={16} />
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-black text-white leading-none">{stat.value}</div>
              <div className="text-[9px] text-white/50 font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
