import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { SelfCareActivityForm } from "../forms/SelfCareActivityForm";
import { Skeleton } from "@/components/ui/skeleton";

interface Activity {
  id: string;
  user_id: string;
  title: string;
  activity_type: "meditation" | "sleep" | "reflection" | "exercise" | "reading" | "custom";
  description?: string;
  duration?: number;
  start_time: string;
  end_time?: string;
  notes?: string;
  created_at: string;
}

function getActivityIcon(type: string) {
  switch (type) {
    case "meditation":
      return "🧘‍♀️";
    case "reflection":
      return "📓";
    case "sleep":
      return "😴";
    case "exercise":
      return "🚶‍♂️";
    case "reading":
      return "📚";
    default:
      return "⭐";
  }
}

function formatDuration(minutes: number | undefined) {
  if (!minutes) return "";
  
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
  }
  
  return `${minutes}m`;
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function SelfCareLog() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const fetchActivities = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("self_care_activities")
        .select("*")
        .eq("user_id", user.id)
        .order("start_time", { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error fetching self-care activities:", error);
        setError("Failed to load activities");
      } else {
        setActivities(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch self-care activities:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchActivities();
  }, [user]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Self-Care Activities</CardTitle>
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
          ) : activities.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No self-care activities recorded yet</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setFormOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Record your first activity
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 rounded-lg border p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-health-mental/10 text-xl">
                    {getActivityIcon(activity.activity_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center">
                        <Badge className="bg-health-mental text-white capitalize">
                          {activity.activity_type}
                        </Badge>
                        {activity.duration && (
                          <span className="ml-2 text-sm text-gray-500">
                            {formatDuration(activity.duration)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(activity.start_time)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{activity.title}</p>
                    {activity.notes && (
                      <p className="mt-1 text-sm text-gray-600">{activity.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <SelfCareActivityForm 
        open={formOpen} 
        onOpenChange={setFormOpen}
        onSuccess={fetchActivities}
      />
    </>
  );
}
