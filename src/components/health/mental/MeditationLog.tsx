import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { MeditationForm } from "../forms/MeditationForm";
import { Skeleton } from "@/components/ui/skeleton";

interface MeditationSession {
  id: string;
  user_id: string;
  title: string;
  meditation_type: string;
  duration: number;
  notes?: string;
  feeling_before?: string;
  feeling_after?: string;
  completed_at: string;
}

function getMeditationIcon(type: string) {
  switch (type) {
    case "mindfulness":
      return "🧘‍♀️";
    case "focused":
      return "🔍";
    case "loving-kindness":
      return "❤️";
    case "body-scan":
      return "👁️";
    case "guided":
      return "🎧";
    case "transcendental":
      return "✨";
    default:
      return "🧠";
  }
}

function formatDuration(minutes: number) {
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

export function MeditationLog() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const fetchSessions = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("meditations")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error fetching meditation sessions:", error);
        setError("Failed to load sessions");
      } else {
        setSessions(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch meditation sessions:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSessions();
  }, [user]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Meditation Sessions</CardTitle>
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
          ) : sessions.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No meditation sessions recorded yet</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setFormOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Record your first session
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-start space-x-4 rounded-lg border p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-xl">
                    {getMeditationIcon(session.meditation_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center">
                        <Badge className="bg-blue-600 text-white capitalize">
                          {session.meditation_type.replace(/-/g, ' ')}
                        </Badge>
                        <span className="ml-2 text-sm text-gray-500">
                          {formatDuration(session.duration)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(session.completed_at)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{session.title}</p>
                    {session.notes && (
                      <p className="mt-1 text-sm text-gray-600">{session.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <MeditationForm 
        open={formOpen} 
        onOpenChange={setFormOpen}
        onSuccess={fetchSessions}
      />
    </>
  );
} 