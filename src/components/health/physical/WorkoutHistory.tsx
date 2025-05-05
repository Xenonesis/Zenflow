import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { healthData, WorkoutSession } from "@/lib/data-sync";
import { Skeleton } from "@/components/ui/skeleton";

function getWorkoutTypeColor(type: string) {
  switch (type) {
    case "cardio":
      return "bg-blue-100 text-blue-800";
    case "strength":
      return "bg-purple-100 text-purple-800";
    case "flexibility":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function WorkoutHistory() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorkouts() {
      if (!user) return;
      
      try {
        // Get 7 days ago for the date range
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { data, error } = await healthData.getWorkoutsByUser(
          user.id,
          sevenDaysAgo.toISOString().split('T')[0]
        );
        
        if (error) {
          console.error('Error fetching workouts:', error);
          setError('Failed to load workout history');
        } else {
          setWorkouts(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch workouts:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchWorkouts();
  }, [user]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Workout History</CardTitle>
        <Badge>Last 7 days</Badge>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-6 text-red-500">{error}</div>
        ) : workouts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No workout history found for the last 7 days
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workouts.map((workout) => (
                  <TableRow key={workout.id}>
                    <TableCell>
                      {new Date(workout.recorded_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getWorkoutTypeColor(workout.workout_type)}
                        variant="outline"
                      >
                        {workout.workout_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{workout.duration} min</TableCell>
                    <TableCell>{workout.notes || workout.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
