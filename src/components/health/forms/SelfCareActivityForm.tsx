import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const activityTypes = [
  { value: "meditation", label: "Meditation" },
  { value: "sleep", label: "Sleep" },
  { value: "reflection", label: "Reflection" },
  { value: "exercise", label: "Exercise" },
  { value: "reading", label: "Reading" },
  { value: "custom", label: "Custom" },
];

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  activity_type: z.enum(["meditation", "sleep", "reflection", "exercise", "reading", "custom"]),
  description: z.string().optional(),
  duration: z.string().transform((val) => (val ? parseInt(val, 10) : undefined)),
  notes: z.string().optional(),
});

type SelfCareFormValues = z.infer<typeof formSchema>;

interface SelfCareActivityFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function SelfCareActivityForm({ open, onOpenChange, onSuccess }: SelfCareActivityFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SelfCareFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      activity_type: "meditation",
      description: "",
      duration: "15",
      notes: "",
    },
  });

  const onSubmit = async (values: SelfCareFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add activities",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format data for the database
      const activityData = {
        user_id: user.id,
        title: values.title,
        activity_type: values.activity_type,
        description: values.description || null,
        duration: values.duration,
        start_time: new Date().toISOString(),
        notes: values.notes || null,
      };

      // Insert into self_care_activities table
      const { data, error } = await supabase
        .from("self_care_activities")
        .insert(activityData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Self-care activity has been added successfully",
      });

      form.reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to add self-care activity:", error);
      toast({
        title: "Error",
        description: "Failed to add self-care activity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Self-Care Activity</DialogTitle>
          <DialogDescription>
            Record your self-care activities to track your wellbeing journey.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Morning meditation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="activity_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activityTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
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
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="15"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the activity"
                      {...field}
                    />
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
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How did it make you feel?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button 
                variant="outline" 
                type="button" 
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Add Activity"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 