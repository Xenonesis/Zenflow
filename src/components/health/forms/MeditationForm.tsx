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

const meditationTypes = [
  { value: "mindfulness", label: "Mindfulness" },
  { value: "focused", label: "Focused" },
  { value: "loving-kindness", label: "Loving-Kindness" },
  { value: "body-scan", label: "Body Scan" },
  { value: "guided", label: "Guided" },
  { value: "transcendental", label: "Transcendental" },
  { value: "custom", label: "Custom" },
];

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  type: z.enum(["mindfulness", "focused", "loving-kindness", "body-scan", "guided", "transcendental", "custom"]),
  duration: z.string().transform((val) => (val ? parseInt(val, 10) : undefined)),
  notes: z.string().optional(),
  feeling_before: z.string().optional(),
  feeling_after: z.string().optional(),
});

type MeditationFormValues = z.infer<typeof formSchema>;

interface MeditationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function MeditationForm({ open, onOpenChange, onSuccess }: MeditationFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MeditationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "mindfulness",
      duration: "10",
      notes: "",
      feeling_before: "",
      feeling_after: "",
    },
  });

  const onSubmit = async (values: MeditationFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add meditation sessions",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format data for the database
      const meditationData = {
        user_id: user.id,
        title: values.title,
        meditation_type: values.type,
        duration: values.duration,
        notes: values.notes || null,
        feeling_before: values.feeling_before || null,
        feeling_after: values.feeling_after || null,
        completed_at: new Date().toISOString(),
      };

      // Insert into meditations table
      const { data, error } = await supabase
        .from("meditations")
        .insert(meditationData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Meditation session has been logged successfully",
      });

      form.reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to log meditation session:", error);
      toast({
        title: "Error",
        description: "Failed to log meditation session. Please try again.",
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
          <DialogTitle>Log Meditation Session</DialogTitle>
          <DialogDescription>
            Track your meditation practice to build mindfulness habits.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Morning mindfulness" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meditation Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select meditation type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {meditationTypes.map((type) => (
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
                      placeholder="10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="feeling_before"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How did you feel before? (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your state of mind before meditation"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="feeling_after"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How did you feel after? (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your state of mind after meditation"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any insights or observations from your session"
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
                  "Log Session"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 