import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Dumbbell } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { ExerciseLogForm } from "../forms/ExerciseLogForm";
import { Skeleton } from "@/components/ui/skeleton";

interface Exercise {
  id: string;
  user_id: string;
  title: string;
  exercise_type: string;
  duration: number;
  intensity: "low" | "moderate" | "high";
  calories_burned?: number;
  distance?: number;
  notes?: string;
  completed_at: string;
}

function getExerciseIcon(type: string) {
  switch (type) {
    case "walk":
      return "🚶";
    case "run":
      return "🏃";
    case "cycling":
      return "🚴";
    case "swim":
      return "🏊";
    case "yoga":
      return "🧘";
    case "hiit":
      return "⚡";
    case "strength":
      return "💪";
    case "pilates":
      return "🤸";
    case "stretching":
      return "🙆";
    case "dance":
      return "💃";
    default:
      return "🏋️";
  }
}

function getIntensityColor(intensity: string) {
  switch (intensity) {
    case "low":
      return "bg-green-100 text-green-800";
    case "moderate":
      return "bg-yellow-100 text-yellow-800";
    case "high":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function formatDuration(minutes: number) {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
  }
  
  return `${minutes}m`;
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ExerciseLog() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const fetchExercises = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error fetching exercises:", error);
        setError("Failed to load exercises");
      } else {
        setExercises(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch exercises:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchExercises();
  }, [user]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Exercise Log</CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => setFormOpen(true)}
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : exercises.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No exercises logged yet</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setFormOpen(true)}
              >
                <Dumbbell className="h-4 w-4 mr-2" />
                Log your first exercise
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-start space-x-4 rounded-lg border p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-xl">
                    {getExerciseIcon(exercise.exercise_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-pink-600 text-white capitalize">
                          {exercise.exercise_type}
                        </Badge>
                        <Badge variant="outline" className={getIntensityColor(exercise.intensity)}>
                          {exercise.intensity}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatDuration(exercise.duration)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(exercise.completed_at)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{exercise.title}</p>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                      {exercise.calories_burned && (
                        <span>{exercise.calories_burned} calories</span>
                      )}
                      {exercise.distance && (
                        <span>{exercise.distance} km</span>
                      )}
                    </div>
                    {exercise.notes && (
                      <p className="mt-1 text-sm text-gray-600">{exercise.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <ExerciseLogForm 
        open={formOpen} 
        onOpenChange={setFormOpen}
        onSuccess={fetchExercises}
      />
    </>
  );
} 