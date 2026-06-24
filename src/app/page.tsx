"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase, WorkoutCategory, Workout } from "@/lib/supabase";
import { DashboardStats } from "@/components/DashboardStats";
import { Calendar } from "@/components/Calendar";
import { WorkoutLoggingPanel } from "@/components/WorkoutLoggingPanel";
import { AdditionalStats } from "@/components/AdditionalStats";
import { startOfMonth, isSameMonth, differenceInDays, parseISO, format, subDays } from "date-fns";

const CATEGORIES: WorkoutCategory[] = ["Legs", "CST", "BB", "Arms", "Cardio"];

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(true);

  // Fetch all workouts
  const fetchWorkouts = async () => {
    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .order("workout_date", { ascending: true });
    
    if (error) {
      console.error("Error fetching workouts:", error);
    } else {
      setWorkouts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Compute stats
  const dashboardStats = useMemo(() => {
    return CATEGORIES.map(category => {
      const categoryWorkouts = workouts.filter(w => w.category === category);
      const lastTrainedDate = categoryWorkouts.length > 0 
        ? parseISO(categoryWorkouts[categoryWorkouts.length - 1].workout_date) 
        : null;
      
      return {
        category,
        totalLogs: categoryWorkouts.length,
        lastTrainedDate
      };
    });
  }, [workouts]);

  const calendarWorkouts = useMemo(() => {
    const map: Record<string, WorkoutCategory[]> = {};
    workouts.forEach(w => {
      if (!map[w.workout_date]) map[w.workout_date] = [];
      map[w.workout_date].push(w.category);
    });
    return map;
  }, [workouts]);

  const additionalStats = useMemo(() => {
    const totalWorkouts = workouts.length;
    const currentMonth = startOfMonth(new Date());
    const workoutsThisMonth = workouts.filter(w => isSameMonth(parseISO(w.workout_date), currentMonth)).length;

    // Calculate streaks
    // A streak is consecutive days with AT LEAST ONE logged workout
    const uniqueDates = [...new Set(workouts.map(w => w.workout_date))].sort();
    
    let currentStreak = 0;
    let longestStreak = 0;
    
    if (uniqueDates.length > 0) {
      let currentTempStreak = 1;
      let maxStreak = 1;
      
      for (let i = 1; i < uniqueDates.length; i++) {
        const diff = differenceInDays(parseISO(uniqueDates[i]), parseISO(uniqueDates[i-1]));
        if (diff === 1) {
          currentTempStreak++;
          maxStreak = Math.max(maxStreak, currentTempStreak);
        } else {
          currentTempStreak = 1;
        }
      }
      
      longestStreak = maxStreak;
      
      // Calculate current streak from today or yesterday
      const todayStr = format(new Date(), "yyyy-MM-dd");
      const yesterdayStr = format(subDays(new Date(), 1), "yyyy-MM-dd");
      
      if (uniqueDates.includes(todayStr) || uniqueDates.includes(yesterdayStr)) {
        // Trace back from the latest active date
        let latestDate = uniqueDates.includes(todayStr) ? new Date() : subDays(new Date(), 1);
        let activeStreak = 0;
        
        while (true) {
          const dateStr = format(subDays(latestDate, activeStreak), "yyyy-MM-dd");
          if (uniqueDates.includes(dateStr)) {
            activeStreak++;
          } else {
            break;
          }
        }
        currentStreak = activeStreak;
      }
    }

    return {
      totalWorkouts,
      workoutsThisMonth,
      currentStreak,
      longestStreak
    };
  }, [workouts]);

  // Handlers
  const handleToggleWorkout = async (category: WorkoutCategory) => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const existing = workouts.find(w => w.workout_date === dateStr && w.category === category);
    
    if (existing) {
      // Remove
      setWorkouts(prev => prev.filter(w => w.id !== existing.id)); // Optimistic UI
      const { error } = await supabase.from("workouts").delete().eq("id", existing.id);
      if (error) {
        console.error("Error deleting:", error);
        fetchWorkouts(); // Revert on error
      }
    } else {
      // Add
      const tempWorkout: Workout = {
        id: Math.random().toString(),
        workout_date: dateStr,
        category,
        created_at: new Date().toISOString()
      };
      setWorkouts(prev => [...prev, tempWorkout]); // Optimistic UI
      
      const { error, data } = await supabase.from("workouts").insert({
        workout_date: dateStr,
        category
      }).select().single();
      
      if (error) {
        console.error("Error inserting:", error);
        fetchWorkouts(); // Revert on error
      } else if (data) {
        setWorkouts(prev => prev.map(w => w.id === tempWorkout.id ? data : w));
      }
    }
  };

  const selectedDateWorkouts = selectedDate 
    ? calendarWorkouts[format(selectedDate, "yyyy-MM-dd")] || []
    : [];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0f1115] text-white">Loading...</div>;
  }

  return (
    <main className="min-h-[100dvh] p-2 sm:p-4 md:p-8 max-w-6xl mx-auto flex flex-col gap-3 md:gap-8">
      <header className="flex items-center justify-between mt-1 md:mt-4 px-1">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 tracking-tight mb-1">
            Workout Tracker
          </h1>
          <p className="text-white/40 text-sm md:text-base font-medium">Your personal fitness dashboard</p>
        </div>
      </header>

      <section>
        <DashboardStats stats={dashboardStats} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
        <div className="lg:col-span-2">
          <Calendar 
            currentDate={new Date()} 
            workouts={calendarWorkouts} 
            onSelectDay={setSelectedDate}
            selectedDate={selectedDate}
          />
        </div>
        
        <div>
          {selectedDate ? (
            <WorkoutLoggingPanel 
              selectedDate={selectedDate}
              existingWorkouts={selectedDateWorkouts}
              onToggleWorkout={handleToggleWorkout}
              onClose={() => setSelectedDate(null)}
            />
          ) : (
            <div className="bg-[#1e222a] border border-[#2d333b] rounded-2xl p-6 shadow-xl h-full flex flex-col items-center justify-center text-center text-white/40 min-h-[300px]">
              <p>Select a date on the calendar to log workouts</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <AdditionalStats {...additionalStats} />
      </section>
    </main>
  );
}
