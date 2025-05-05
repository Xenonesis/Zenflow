import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getWorkouts, deleteWorkout } from "@/services/database";
import { Workout } from "@/types/database";
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function getWorkoutTypeColor(type: string) {
  switch (type?.toLowerCase()) {
    case "cardio":
      return "bg-blue-100 text-blue-800";
    case "strength":
      return "bg-purple-100 text-purple-800";
    case "hiit":
      return "bg-orange-100 text-orange-800";
    case "flexibility":
      return "bg-green-100 text-green-800";
    case "balance":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function WorkoutList() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);

  const fetchWorkouts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { success, data, error } = await getWorkouts(user);
      
      if (success && data) {
        setWorkouts(data);
      } else {
        console.error('Error fetching workouts:', error);
        setError('Failed to load workouts');
      }
    } catch (err) {
      console.error('Failed to fetch workouts:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user]);

  const handleDeleteClick = (id: string) => {
    setWorkoutToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!user || !workoutToDelete) return;
    
    try {
      const { success, error } = await deleteWorkout(user, workoutToDelete);
      
      if (success) {
        toast({
          title: "Success",
          description: "Workout deleted successfully",
        });
        
        // Refresh the workout list
        fetchWorkouts();
      } else {
        console.error('Error deleting workout:', error);
        toast({
          title: "Error",
          description: "Failed to delete workout",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Failed to delete workout:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setWorkoutToDelete(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Workouts</CardTitle>
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
              No workouts found. Create your first workout!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workouts.map((workout) => (
                    <TableRow key={workout.id}>
                      <TableCell>
                        {new Date(workout.recorded_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </TableCell>
                      <TableCell>{workout.name}</TableCell>
                      <TableCell>
                        <Badge
                          className={getWorkoutTypeColor(workout.workout_type)}
                          variant="outline"
                        >
                          {workout.workout_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{workout.duration} min</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(workout.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected workout.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 