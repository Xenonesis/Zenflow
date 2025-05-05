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
  DialogTrigger,
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
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { timezoneOffset } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

// Define form validation schema
const sleepLogSchema = z.object({
  sleepDate: z.string().nonempty('Date is required'),
  bedTime: z.string().nonempty('Bed time is required'),
  wakeTime: z.string().nonempty('Wake time is required'),
  durationHours: z.coerce.number()
    .min(0, 'Duration must be positive')
    .max(24, 'Duration cannot exceed 24 hours'),
  qualityRating: z.coerce.number()
    .min(1, 'Rating must be at least 1')
    .max(10, 'Rating cannot exceed 10'),
  notes: z.string().optional(),
  factors: z.array(z.string()).optional(),
});

type SleepLogFormValues = z.infer<typeof sleepLogSchema>;

const sleepFactors = [
  { id: 'exercise', label: 'Exercise' },
  { id: 'caffeine', label: 'Caffeine' },
  { id: 'stress', label: 'Stress' },
  { id: 'screen-time', label: 'Screen Time Before Bed' },
  { id: 'alcohol', label: 'Alcohol' },
  { id: 'noise', label: 'Noise' },
  { id: 'temperature', label: 'Room Temperature' },
  { id: 'meditation', label: 'Meditation Before Bed' },
  { id: 'reading', label: 'Reading Before Bed' },
  { id: 'late-meal', label: 'Late Meal' },
];

interface SleepLogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function SleepLogForm({ open, onOpenChange, onSuccess }: SleepLogFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const defaultValues: Partial<SleepLogFormValues> = {
    sleepDate: format(new Date(), 'yyyy-MM-dd'),
    bedTime: '22:00',
    wakeTime: '06:00',
    durationHours: 8,
    qualityRating: 5,
    notes: '',
    factors: [],
  };

  const form = useForm<SleepLogFormValues>({
    resolver: zodResolver(sleepLogSchema),
    defaultValues,
  });

  // Calculate duration when bed time or wake time changes
  const calculateDuration = (bedTime: string, wakeTime: string) => {
    const [bedHours, bedMinutes] = bedTime.split(':').map(Number);
    const [wakeHours, wakeMinutes] = wakeTime.split(':').map(Number);
    
    let duration = (wakeHours - bedHours) * 60 + (wakeMinutes - bedMinutes);
    
    // Handle crossing midnight
    if (duration < 0) {
      duration += 24 * 60;
    }
    
    return parseFloat((duration / 60).toFixed(1));
  };

  // Update duration when bed time or wake time changes
  React.useEffect(() => {
    const bedTime = form.watch('bedTime');
    const wakeTime = form.watch('wakeTime');
    
    if (bedTime && wakeTime) {
      const duration = calculateDuration(bedTime, wakeTime);
      form.setValue('durationHours', duration);
    }
  }, [form.watch('bedTime'), form.watch('wakeTime')]);

  // Handle form submission
  const onSubmit = async (data: SleepLogFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to log your sleep.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the data for insertion
      const sleepData = {
        user_id: user.id,
        sleep_date: data.sleepDate,
        bed_time: data.bedTime,
        wake_time: data.wakeTime,
        duration_hours: data.durationHours,
        quality_rating: data.qualityRating,
        factors: data.factors,
        notes: data.notes,
      };

      // Insert data into the sleep_logs table
      const { error } = await supabase
        .from('sleep_logs')
        .insert(sleepData);

      if (error) throw error;

      // Show success message
      toast({
        title: "Sleep log recorded",
        description: "Your sleep record has been saved successfully.",
      });

      // Reset form and close dialog
      form.reset(defaultValues);
      onOpenChange(false);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error logging sleep:', error);
      toast({
        title: "Failed to record sleep",
        description: "There was an error saving your sleep log. Please try again.",
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
          <DialogTitle>Log Your Sleep</DialogTitle>
          <DialogDescription>
            Track your sleep patterns to improve your sleep quality and overall wellbeing.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sleepDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="bedTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bed Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="wakeTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wake Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="durationHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sleep Duration: {field.value} hours</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" min="0" max="24" {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormDescription>
                    Automatically calculated from bed and wake times, but you can adjust if needed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="qualityRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sleep Quality: {field.value}/10</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    1 = Poor quality, 10 = Excellent quality
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="factors"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Sleep Factors</FormLabel>
                    <FormDescription>
                      What factors affected your sleep?
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {sleepFactors.map((factor) => (
                      <FormField
                        key={factor.id}
                        control={form.control}
                        name="factors"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={factor.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(factor.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), factor.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== factor.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {factor.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
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
                      placeholder="Any additional notes about your sleep..."
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
                  'Save Sleep Log'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 