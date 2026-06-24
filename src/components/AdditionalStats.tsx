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
      color: "text-emerald-400",
      bg: "bg-emerald-500/10"
    },
    {
      label: "This Month",
      value: workoutsThisMonth,
      icon: Calendar,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="p-2 rounded-xl border border-gray-700 bg-gray-800 flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 duration-300">
            <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color}`}>
              <Icon size={16} />
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-bold text-white leading-none">{stat.value}</div>
              <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
