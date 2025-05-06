import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { useState, memo } from "react";
import { MoodEntry } from "@/lib/data-sync";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { MoodEntryForm } from "../forms/MoodEntryForm";
import { useMoodHistory } from "@/hooks/useHealthData";
import { 
  SmilePlus,
  Calendar,
  BarChart3,
  Plus,
  ArrowRight,
  Smile,
  Frown,
  Meh,
  MehIcon,
  SmileIcon,
  FrownIcon
} from "lucide-react";

function getMoodEmoji(mood: string) {
  switch (mood) {
    case "excellent":
      return "😁";
    case "good":
      return "🙂";
    case "neutral":
      return "😐";
    case "bad":
      return "😔";
    case "terrible":
      return "😢";
    default:
      return "😐";
  }
}

function getMoodColor(mood: string) {
  switch (mood) {
    case "excellent":
      return "bg-green-100 text-green-800";
    case "good":
      return "bg-blue-100 text-blue-800";
    case "neutral":
      return "bg-gray-100 text-gray-800";
    case "bad":
      return "bg-orange-100 text-orange-800";
    case "terrible":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

interface MoodTrackerProps {
  timeRange: "day" | "week" | "month" | "year";
}

export function MoodTracker({ timeRange }: MoodTrackerProps) {
  const { user } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  
  const { 
    data: moodEntries = [], 
    isLoading: loading, 
    error: queryError,
    refetch: fetchMoodEntries
  } = useMoodHistory(user?.id);
  
  const error = queryError ? String(queryError) : null;
  
  // Find today's mood entry
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = moodEntries.find(entry => 
    entry.recorded_at.split('T')[0] === todayStr
  );
  const todayMood = todayEntry?.mood_label || null;

  const moodData = [
    { day: "Mon", level: 4, note: "Productive day at work" },
    { day: "Tue", level: 3, note: "Neutral day, nothing special" },
    { day: "Wed", level: 5, note: "Great workout and social time" },
    { day: "Thu", level: 2, note: "Stress from deadline" },
    { day: "Fri", level: 4, note: "Looking forward to weekend" },
    { day: "Sat", level: 5, note: "Relaxing day outdoors" },
    { day: "Sun", level: 4, note: "Good family time" }
  ];

  const getMoodIcon = (level: number) => {
    if (level >= 4) return <SmileIcon className="text-green-500" />;
    if (level === 3) return <MehIcon className="text-amber-500" />;
    return <FrownIcon className="text-red-500" />;
  };

  const getMoodLabel = (level: number) => {
    if (level >= 4) return "Good";
    if (level === 3) return "Neutral";
    return "Low";
  };
  
  const getMoodColor = (level: number) => {
    if (level >= 4) return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
    if (level === 3) return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
    return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
  };

  // Calculate average mood
  const averageMood = moodData.reduce((acc, curr) => acc + curr.level, 0) / moodData.length;
  
  // Get the latest mood
  const latestMood = moodData[moodData.length - 1];
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mood Tracker</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-health-mental/10 text-health-mental">
              Today: {todayMood ? getMoodEmoji(todayMood) : '❓'}
            </Badge>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setFormOpen(true)}
            >
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : moodEntries.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No mood entries found for the last 7 days</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setFormOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Log your first mood
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {moodEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center space-x-4 rounded-lg border p-3"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl">
                    {getMoodEmoji(entry.mood_label || 'neutral')}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <Badge className={getMoodColor(entry.mood_label || 'neutral')} variant="outline">
                        {entry.mood_label || `Score: ${entry.mood_score}`}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(entry.recorded_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{entry.notes || 'No notes'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <MoodEntryForm 
        open={formOpen} 
        onOpenChange={setFormOpen}
        onSuccess={() => fetchMoodEntries()}
      />
    </>
  );
}
