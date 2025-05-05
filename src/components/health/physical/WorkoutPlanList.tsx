import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getWorkoutPlans, deleteWorkoutPlan } from "@/services/database";
import { WorkoutPlan } from "@/types/database";
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
import { Dumbbell, Trash2, Play, Edit } from "lucide-react";
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

function getLevelBadgeColor(level: string) {
  switch (level?.toLowerCase()) {
    case "beginner":
      return "bg-green-100 text-green-800";
    case "intermediate":
      return "bg-blue-100 text-blue-800";
    case "advanced":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

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

export function WorkoutPlanList() {
  const { user } = useAuth();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [workoutPlanToDelete, setWorkoutPlanToDelete] = useState<string | null>(null);

  const fetchWorkoutPlans = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { success, data, error } = await getWorkoutPlans(user);
      
      if (success && data) {
        setWorkoutPlans(data);
      } else {
        console.error('Error fetching workout plans:', error);
        setError('Failed to load workout plans');
      }
    } catch (err) {
      console.error('Failed to fetch workout plans:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutPlans();
  }, [user]);

  const handleDeleteClick = (id: string) => {
    setWorkoutPlanToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!user || !workoutPlanToDelete) return;
    
    try {
      const { success, error } = await deleteWorkoutPlan(user, workoutPlanToDelete);
      
      if (success) {
        toast({
          title: "Success",
          description: "Workout plan deleted successfully",
        });
        
        // Refresh the list
        fetchWorkoutPlans();
      } else {
        console.error('Error deleting workout plan:', error);
        toast({
          title: "Error",
          description: "Failed to delete workout plan",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Failed to delete workout plan:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setWorkoutPlanToDelete(null);
    }
  };

  const handleStartWorkout = (plan: WorkoutPlan) => {
    // Future implementation: Start a workout session based on the plan
    console.log("Starting workout with plan:", plan);
    toast({
      title: "Starting Workout",
      description: `Starting ${plan.title}`,
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Workout Plans</CardTitle>
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
          ) : workoutPlans.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No workout plans found. Create your first plan!
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {workoutPlans.map((plan) => (
                <Card key={plan.id} className="overflow-hidden border hover:shadow-md transition-shadow">
                  <CardHeader className="bg-health-soft p-4 dark:bg-slate-800">
                    <div className="flex justify-between items-center">
                      <div className="h-10 w-10 rounded-full bg-health-primary flex items-center justify-center text-white">
                        <Dumbbell className="h-5 w-5" />
                      </div>
                      <Badge 
                        variant="outline"
                        className={getLevelBadgeColor(plan.level)}
                      >
                        {plan.level.charAt(0).toUpperCase() + plan.level.slice(1)}
                      </Badge>
                    </div>
                    <CardTitle className="mt-2">{plan.title}</CardTitle>
                    <div className="mt-1">
                      <Badge
                        className={getWorkoutTypeColor(plan.workout_type)}
                        variant="outline"
                      >
                        {plan.workout_type}
                      </Badge>
                      {plan.is_public && (
                        <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">
                          Public
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {plan.description ? 
                        (plan.description.length > 100 ? 
                          plan.description.substring(0, 100) + '...' : 
                          plan.description) :
                        'No description provided.'
                      }
                    </p>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {plan.duration ? `${plan.duration} min` : 'No duration set'}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteClick(plan.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          // Edit functionality would be added in the future
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleStartWorkout(plan)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected workout plan.
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