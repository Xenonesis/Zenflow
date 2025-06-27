import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

// Define form validation schema
const exerciseLogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters'),
  exerciseType: z.string().min(1, 'Exercise type is required'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 minute'),
  intensity: z.string().min(1, 'Intensity level is required'),
  caloriesBurned: z.coerce.number().optional(),
  distance: z.coerce.number().optional(),
  notes: z.string().optional(),
  completedAt: z.string().min(1, 'Completion date/time is required'),
});

type ExerciseLogFormValues = z.infer<typeof exerciseLogSchema>;

// Exercise type options
const exerciseTypes = [
  'running',
  'walking',
  'cycling',
  'swimming',
  'weight lifting',
  'yoga',
  'hiit',
  'pilates',
  'boxing',
  'dancing',
  'hiking',
  'basketball',
  'football',
  'tennis',
  'other',
];

// Intensity levels
const intensityLevels = [
  { value: 'low', label: 'Low - Easy, can maintain conversation' },
  { value: 'moderate', label: 'Moderate - Challenging but sustainable' },
  { value: 'high', label: 'High - Very challenging, difficult to maintain' },
];

interface ExerciseLogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ExerciseLogForm({ open, onOpenChange, onSuccess }: ExerciseLogFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current date and time for default values
  const now = new Date();
  const formattedDateTime = format(now, "yyyy-MM-dd'T'HH:mm");

  // Initialize form with default values
  const form = useForm<ExerciseLogFormValues>({
    resolver: zodResolver(exerciseLogSchema),
    defaultValues: {
      title: '',
      exerciseType: '',
      duration: 30,
      intensity: 'moderate',
      caloriesBurned: undefined,
      distance: undefined,
      notes: '',
      completedAt: formattedDateTime,
    },
  });

  // Handle form submission
  const onSubmit = async (data: ExerciseLogFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to log your exercise.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the data for insertion
      const exerciseData = {
        user_id: user.id,
        title: data.title,
        exercise_type: data.exerciseType,
        duration: data.duration,
        intensity: data.intensity,
        calories_burned: data.caloriesBurned || null,
        distance: data.distance || null,
        notes: data.notes || null,
        completed_at: data.completedAt,
      };

      // Insert data into the exercises table
      const { error } = await supabase
        .from('exercises')
        .insert(exerciseData);

      if (error) throw error;

      // Show success message
      toast({
        title: "Exercise logged",
        description: "Your exercise has been recorded successfully.",
      });

      // Reset form and close dialog
      form.reset();
      onOpenChange(false);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error logging exercise:', error);
      toast({
        title: "Failed to log exercise",
        description: "There was an error saving your exercise log. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Exercise</DialogTitle>
          <DialogDescription>
            Track your fitness activities to monitor your progress and stay motivated.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Morning Run, Yoga Session, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="exerciseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exercise Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select exercise type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {exerciseTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="intensity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intensity</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select intensity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {intensityLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="caloriesBurned"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calories Burned</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        placeholder="Optional"
                        {...field} 
                        value={field.value === undefined ? '' : field.value}
                        onChange={(e) => {
                          const value = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance (km/mi)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.1" 
                        placeholder="Optional"
                        {...field} 
                        value={field.value === undefined ? '' : field.value}
                        onChange={(e) => {
                          const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="completedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date & Time Completed</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How did you feel? Any achievements or challenges?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                  'Save Exercise'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 