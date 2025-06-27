import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { JournalEntryForm } from "../forms/JournalEntryForm";
import { Skeleton } from "@/components/ui/skeleton";

interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  entry_type: "gratitude" | "reflection" | "goals" | "emotion" | "morning" | "evening" | "custom";
  content: string;
  mood?: string;
  tags?: string[];
  created_at: string;
}

function getEntryIcon(type: string) {
  switch (type) {
    case "gratitude":
      return "🙏";
    case "reflection":
      return "🤔";
    case "goals":
      return "🎯";
    case "emotion":
      return "😌";
    case "morning":
      return "🌅";
    case "evening":
      return "🌙";
    default:
      return "📝";
  }
}

function getEntryColor(type: string) {
  switch (type) {
    case "gratitude":
      return "bg-purple-600";
    case "reflection":
      return "bg-blue-600";
    case "goals":
      return "bg-green-600";
    case "emotion":
      return "bg-pink-600";
    case "morning":
      return "bg-orange-600";
    case "evening":
      return "bg-indigo-600";
    default:
      return "bg-gray-600";
  }
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

function truncateContent(content: string, maxLength = 100) {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + "...";
}

export function JournalLog() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const fetchEntries = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error fetching journal entries:", error);
        setError("Failed to load journal entries");
      } else {
        setEntries(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch journal entries:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEntries();
  }, [user]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Journal Entries</CardTitle>
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
          ) : entries.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No journal entries yet</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setFormOpen(true)}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Write your first entry
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start space-x-4 rounded-lg border p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-xl">
                    {getEntryIcon(entry.entry_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center">
                        <Badge className={`${getEntryColor(entry.entry_type)} text-white capitalize`}>
                          {entry.entry_type}
                        </Badge>
                        {entry.mood && (
                          <span className="ml-2 text-sm text-gray-500">
                            Mood: {entry.mood}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(entry.created_at)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{entry.title}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {truncateContent(entry.content)}
                    </p>
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {entry.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <JournalEntryForm 
        open={formOpen} 
        onOpenChange={setFormOpen}
        onSuccess={fetchEntries}
      />
    </>
  );
} 