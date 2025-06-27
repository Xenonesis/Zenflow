import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addWorkout } from "@/services/database";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WorkoutFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkoutAdded?: () => void;
}

export function WorkoutForm({ open, onOpenChange, onWorkoutAdded }: WorkoutFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workoutData, setWorkoutData] = useState({
    name: "",
    type: "cardio",
    duration: "30",
    recorded_at: new Date().toISOString().split("T")[0],
    description: "",
    calories_burned: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWorkoutData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setWorkoutData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a workout",
        variant: "destructive"
      });
      return;
    }

    if (!workoutData.name || !workoutData.recorded_at) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format the name to include workout type
      const formattedName = workoutData.name;
      const workoutType = workoutData.type || "other";

      // Include only fields that exist in the database
      const result = await addWorkout(user, {
        name: formattedName,
        workout_type: workoutType,
        duration: workoutData.duration ? parseInt(workoutData.duration) : undefined,
        calories_burned: workoutData.calories_burned ? parseInt(workoutData.calories_burned) : undefined,
        recorded_at: workoutData.recorded_at
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Workout added successfully",
        });
        
        // Reset form data
        setWorkoutData({
          name: "",
          type: "cardio",
          duration: "30",
          recorded_at: new Date().toISOString().split("T")[0],
          description: "",
          calories_burned: ""
        });
        
        // Close the dialog
        onOpenChange(false);
        
        // Trigger refresh if callback provided
        if (onWorkoutAdded) {
          onWorkoutAdded();
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to add workout",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error adding workout:", error);
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Workout</DialogTitle>
          <DialogDescription>
            Fill in the details to record your workout session
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name*
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Workout name"
                value={workoutData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select 
                value={workoutData.type} 
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger className="col-span-3">
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
              <Label htmlFor="date" className="text-right">
                Date*
              </Label>
              <Input
                id="date"
                name="recorded_at"
                type="date"
                value={workoutData.recorded_at}
                onChange={handleChange}
                className="col-span-3"
                required
              />
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
                value={workoutData.duration}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="calories_burned" className="text-right">
                Calories
              </Label>
              <Input
                id="calories_burned"
                name="calories_burned"
                type="number"
                min="0"
                placeholder="Calories burned"
                value={workoutData.calories_burned}
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
                placeholder="Describe your workout (optional)"
                value={workoutData.description}
                onChange={handleChange}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Workout"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 