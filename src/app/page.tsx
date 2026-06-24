"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase, WorkoutCategory, Workout } from "@/lib/supabase";
import { DashboardStats } from "@/components/DashboardStats";
import { Calendar } from "@/components/Calendar";
import { WorkoutLoggingPanel } from "@/components/WorkoutLoggingPanel";
import { AdditionalStats } from "@/components/AdditionalStats";
import { startOfMonth, isSameMonth, differenceInDays, parseISO, format, subDays } from "date-fns";

const CATEGORIES: WorkoutCategory[] = ["Legs", "CST", "BB", "Cardio"];

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
    const today = new Date();
    const currentMonth = startOfMonth(today);
    
    const workoutsThisMonth = workouts.filter(w => isSameMonth(parseISO(w.workout_date), currentMonth)).length;
    
    const uniqueDaysThisMonth = new Set(
      workouts
        .filter(w => isSameMonth(parseISO(w.workout_date), today))
        .map(w => w.workout_date)
    ).size;
    
    const daysPassed = today.getDate();
    const restDaysThisMonth = daysPassed - uniqueDaysThisMonth;

    return {
      totalWorkouts,
      workoutsThisMonth,
      restDaysThisMonth
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
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  return (
    <main className="min-h-[100dvh] p-2 max-w-6xl w-full mx-auto flex flex-col gap-2 overflow-hidden bg-gray-900">
      <section className="w-full min-w-0 mt-2">
        <DashboardStats stats={dashboardStats} />
      </section>

      <section className="grid grid-cols-1 gap-2 w-full min-w-0">
        <div className="w-full">
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

      <section className="w-full min-w-0">
        <AdditionalStats {...additionalStats} />
      </section>
    </main>
  );
}
