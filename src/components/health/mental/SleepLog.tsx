import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Moon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { SleepLogForm } from "../forms/SleepLogForm";
import { Skeleton } from "@/components/ui/skeleton";

interface SleepEntry {
  id: string;
  user_id: string;
  sleep_date: string;
  duration_hours: number;
  bed_time: string;
  wake_time: string;
  quality_rating: number;
  factors?: string[];
  notes?: string;
  created_at: string;
}

function formatSleepTime(time: string) {
  try {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return time;
  }
}

function getQualityColor(rating: number) {
  if (rating >= 8) return "bg-green-100 text-green-800";
  if (rating >= 6) return "bg-blue-100 text-blue-800";
  if (rating >= 4) return "bg-yellow-100 text-yellow-800";
  if (rating >= 2) return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
}

function getQualityLabel(rating: number) {
  if (rating >= 9) return "Excellent";
  if (rating >= 7) return "Very Good";
  if (rating >= 5) return "Good";
  if (rating >= 3) return "Fair";
  return "Poor";
}

function formatDuration(hours: number) {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (minutes === 0) {
    return `${wholeHours}h`;
  }
  
  return `${wholeHours}h ${minutes}m`;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function SleepLog() {
  const { user } = useAuth();
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const fetchSleepEntries = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("sleep_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("sleep_date", { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error fetching sleep entries:", error);
        setError("Failed to load sleep data");
      } else {
        setSleepEntries(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch sleep entries:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSleepEntries();
  }, [user]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sleep Log</CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => setFormOpen(true)}
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
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
          ) : sleepEntries.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No sleep data logged yet</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setFormOpen(true)}
              >
                <Moon className="h-4 w-4 mr-2" />
                Log your first sleep entry
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sleepEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start space-x-4 rounded-lg border p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-xl">
                    😴
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center">
                        <Badge variant="outline" className={getQualityColor(entry.quality_rating)}>
                          {getQualityLabel(entry.quality_rating)} ({entry.quality_rating}/10)
                        </Badge>
                        <span className="ml-2 text-sm text-gray-500">
                          {formatDuration(entry.duration_hours)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(entry.sleep_date)}
                      </span>
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="font-medium">
                        {formatSleepTime(entry.bed_time)} - {formatSleepTime(entry.wake_time)}
                      </span>
                    </div>
                    {entry.factors && entry.factors.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {entry.factors.map((factor, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {entry.notes && (
                      <p className="mt-1 text-sm text-gray-600">{entry.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <SleepLogForm 
        open={formOpen} 
        onOpenChange={setFormOpen}
        onSuccess={fetchSleepEntries}
      />
    </>
  );
} 