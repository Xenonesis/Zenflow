import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addWorkoutPlan } from "@/services/database";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WorkoutPlanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkoutPlanAdded?: () => void;
}

interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  rest: string;
}

export function WorkoutPlanForm({ open, onOpenChange, onWorkoutPlanAdded }: WorkoutPlanFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  
  const [workoutPlanData, setWorkoutPlanData] = useState({
    title: "",
    workout_type: "cardio",
    level: "beginner",
    duration: "30",
    description: "",
    is_public: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWorkoutPlanData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setWorkoutPlanData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setWorkoutPlanData(prev => ({ ...prev, is_public: checked }));
  };

  const addExercise = () => {
    setExercises(prev => [
      ...prev, 
      { 
        id: crypto.randomUUID(), 
        name: "", 
        sets: "3", 
        reps: "10", 
        rest: "60" 
      }
    ]);
  };

  const removeExercise = (id: string) => {
    setExercises(prev => prev.filter(exercise => exercise.id !== id));
  };

  const updateExercise = (id: string, field: keyof Exercise, value: string) => {
    setExercises(prev => prev.map(exercise => {
      if (exercise.id === id) {
        return { ...exercise, [field]: value };
      }
      return exercise;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a workout plan",
        variant: "destructive"
      });
      return;
    }

    if (!workoutPlanData.title) {
      toast({
        title: "Validation Error",
        description: "Please provide a title for your workout plan",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert exercises to JSON string
      const exercisesJson = exercises.length > 0 ? JSON.stringify(exercises) : undefined;

      const result = await addWorkoutPlan(user, {
        title: workoutPlanData.title,
        description: workoutPlanData.description || undefined,
        workout_type: workoutPlanData.workout_type,
        level: workoutPlanData.level,
        duration: workoutPlanData.duration ? parseInt(workoutPlanData.duration) : undefined,
        exercises: exercisesJson,
        is_public: workoutPlanData.is_public
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Workout plan created successfully",
        });
        
        // Reset form data
        setWorkoutPlanData({
          title: "",
          workout_type: "cardio",
          level: "beginner",
          duration: "30",
          description: "",
          is_public: false
        });
        setExercises([]);
        
        // Close the dialog
        onOpenChange(false);
        
        // Trigger refresh if callback provided
        if (onWorkoutPlanAdded) {
          onWorkoutPlanAdded();
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to create workout plan",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating workout plan:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Workout Plan</DialogTitle>
          <DialogDescription>
            Design your custom workout plan with exercises and details
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title*
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Workout plan title"
                value={workoutPlanData.title}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workout_type" className="text-right">
                Type
              </Label>
              <Select 
                value={workoutPlanData.workout_type} 
                onValueChange={(value) => handleSelectChange("workout_type", value)}
              >
                <SelectTrigger id="workout_type" className="col-span-3">
                  <SelectValue placeholder="Select workout type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="hiit">HIIT</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                  <SelectItem value="balance">Balance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level" className="text-right">
                Difficulty
              </Label>
              <Select 
                value={workoutPlanData.level} 
                onValueChange={(value) => handleSelectChange("level", value)}
              >
                <SelectTrigger id="level" className="col-span-3">
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration (min)
              </Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="1"
                placeholder="Duration in minutes"
                value={workoutPlanData.duration}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your workout plan (optional)"
                value={workoutPlanData.description}
                onChange={handleChange}
                className="col-span-3"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_public" className="text-right">
                Make Public
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="is_public"
                  checked={workoutPlanData.is_public}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="is_public" className="text-sm text-muted-foreground">
                  Share this workout plan with other users
                </Label>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Exercises</h3>
              <Button type="button" variant="outline" size="sm" onClick={addExercise}>
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </div>
            
            {exercises.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No exercises added yet. Click "Add Exercise" to begin building your workout.
              </div>
            )}
            
            {exercises.map((exercise, index) => (
              <div key={exercise.id} className="border p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Exercise {index + 1}</h4>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeExercise(exercise.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={`exercise-name-${exercise.id}`} className="text-right">
                      Name
                    </Label>
                    <Input
                      id={`exercise-name-${exercise.id}`}
                      value={exercise.name}
                      onChange={(e) => updateExercise(exercise.id, "name", e.target.value)}
                      placeholder="e.g., Push-ups, Squats"
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-12 gap-2">
                    <Label htmlFor={`exercise-sets-${exercise.id}`} className="text-right col-span-2">
                      Sets
                    </Label>
                    <Input
                      id={`exercise-sets-${exercise.id}`}
                      type="number"
                      min="1"
                      value={exercise.sets}
                      onChange={(e) => updateExercise(exercise.id, "sets", e.target.value)}
                      className="col-span-2"
                    />
                    
                    <Label htmlFor={`exercise-reps-${exercise.id}`} className="text-right col-span-2">
                      Reps
                    </Label>
                    <Input
                      id={`exercise-reps-${exercise.id}`}
                      value={exercise.reps}
                      onChange={(e) => updateExercise(exercise.id, "reps", e.target.value)}
                      className="col-span-2"
                    />
                    
                    <Label htmlFor={`exercise-rest-${exercise.id}`} className="text-right col-span-2">
                      Rest (sec)
                    </Label>
                    <Input
                      id={`exercise-rest-${exercise.id}`}
                      type="number"
                      min="0"
                      value={exercise.rest}
                      onChange={(e) => updateExercise(exercise.id, "rest", e.target.value)}
                      className="col-span-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Plan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 