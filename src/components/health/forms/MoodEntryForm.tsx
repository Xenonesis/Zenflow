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
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/lib/auth-context";
import { healthData, MoodEntry } from "@/lib/data-sync";
import { useToast } from "@/components/ui/use-toast";
import { CircleSlash, Loader2 } from "lucide-react";

const formSchema = z.object({
  mood_score: z.number().min(1).max(10),
  mood_label: z.enum(["terrible", "bad", "poor", "neutral", "good", "great", "excellent"]),
  notes: z.string().optional(),
});

type MoodEntryFormValues = z.infer<typeof formSchema>;

interface MoodEntryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function MoodEntryForm({ open, onOpenChange, onSuccess }: MoodEntryFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MoodEntryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood_score: 5,
      mood_label: "neutral",
      notes: "",
    },
  });

  const scoreToLabel = (score: number): MoodEntryFormValues["mood_label"] => {
    if (score <= 2) return "terrible";
    if (score <= 3) return "bad";
    if (score <= 4) return "poor";
    if (score <= 6) return "neutral";
    if (score <= 7) return "good";
    if (score <= 9) return "great";
    return "excellent";
  };

  const handleScoreChange = (value: number[]) => {
    const score = value[0];
    form.setValue("mood_score", score);
    form.setValue("mood_label", scoreToLabel(score));
  };

  const onSubmit = async (values: MoodEntryFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to log your mood",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const moodEntry: MoodEntry = {
        user_id: user.id,
        mood_score: values.mood_score,
        mood_label: values.mood_label,
        notes: values.notes || undefined,
        recorded_at: new Date().toISOString(),
      };

      const { data, error } = await healthData.addMoodEntry(moodEntry);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Your mood has been logged successfully",
      });

      form.reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to log mood:", error);
      toast({
        title: "Error",
        description: "Failed to log your mood. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Your Mood</DialogTitle>
          <DialogDescription>
            How are you feeling right now? Record your current mood.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="mood_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mood Score (1-10)</FormLabel>
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>😢 Terrible</span>
                      <span>😐 Neutral</span>
                      <span>😁 Excellent</span>
                    </div>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={handleScoreChange}
                      />
                    </FormControl>
                    <div className="text-center">
                      <span className="text-2xl font-bold">
                        {field.value}
                      </span>
                      <span className="ml-2 text-muted-foreground">
                        ({form.watch("mood_label")})
                      </span>
                    </div>
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
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What's affecting your mood today?"
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
                  "Save Mood"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 