import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { healthData, MoodEntry } from "@/lib/data-sync";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { MoodEntryForm } from "../forms/MoodEntryForm";

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

export function MoodTracker() {
  const { user } = useAuth();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const fetchMoodEntries = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Get 7 days ago for the date range
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data, error } = await healthData.getMoodEntriesByUser(
        user.id,
        sevenDaysAgo.toISOString().split('T')[0]
      );
      
      if (error) {
        console.error('Error fetching mood entries:', error);
        setError('Failed to load mood history');
      } else {
        setMoodEntries(data || []);
        
        // Check if there's an entry for today
        const todayStr = today.toISOString().split('T')[0];
        const todayEntry = (data || []).find(entry => 
          entry.recorded_at.split('T')[0] === todayStr
        );
        
        if (todayEntry) {
          setTodayMood(todayEntry.mood_label || 'neutral');
        } else {
          setTodayMood(null);
        }
      }
    } catch (err) {
      console.error('Failed to fetch mood entries:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMoodEntries();
  }, [user]);

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
        onSuccess={fetchMoodEntries}
      />
    </>
  );
}
