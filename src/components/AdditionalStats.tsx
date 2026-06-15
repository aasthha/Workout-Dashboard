"use client";

import { Activity, Flame, Trophy, CalendarDays } from "lucide-react";

interface AdditionalStatsProps {
  totalWorkouts: number;
  workoutsThisMonth: number;
  currentStreak: number;
  longestStreak: number;
}

export function AdditionalStats({ totalWorkouts, workoutsThisMonth, currentStreak, longestStreak }: AdditionalStatsProps) {
  const stats = [
    {
      label: "Total Workouts",
      value: totalWorkouts,
      icon: Activity,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      label: "This Month",
      value: workoutsThisMonth,
      icon: CalendarDays,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20"
    },
    {
      label: "Current Streak",
      value: `${currentStreak} days`,
      icon: Flame,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20"
    },
    {
      label: "Longest Streak",
      value: `${longestStreak} days`,
      icon: Trophy,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className={`p-5 rounded-2xl border ${stat.border} bg-[#1e222a] flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300`}>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <Icon size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-white/50 font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
