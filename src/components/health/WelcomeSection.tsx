import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Sparkles, BarChart3, Lightbulb } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { userData } from "@/lib/supabase";
import { UserProfile } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export function WelcomeSection() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState<string>("");
  const [quote, setQuote] = useState<string>("");
  
  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      
      try {
        const { data, error } = await userData.getUserProfile(user.id);
        
        if (error) {
          console.error('Error loading profile:', error);
          return;
        }
        
        if (data) {
          setProfile(data);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  // Get greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    let greeting = "Good ";
    
    if (hour < 12) {
      greeting += "morning";
      setTimeOfDay("morning");
    } else if (hour < 18) {
      greeting += "afternoon";
      setTimeOfDay("afternoon");
    } else {
      greeting += "evening";
      setTimeOfDay("evening");
    }
    
    // Set a random motivational quote
    const quotes = [
      "The mind and body connection is the key to holistic wellness.",
      "Small consistent actions lead to significant wellbeing improvements.",
      "Balance in all things creates harmony within yourself.",
      "Your mental health is just as important as your physical fitness.",
      "Today is a new opportunity to grow stronger in mind and body.",
      "Each breath is an opportunity to reset your focus and intention."
    ];
    
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const today = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = dayNames[today.getDay()];
  const date = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  
  const firstName = user?.name?.split(" ")[0] || "there";
  
  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-0 shadow-sm overflow-hidden">
      <CardContent className="p-6 relative">
        <div className="absolute top-0 right-0 h-64 w-64 bg-health-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                Good {timeOfDay}, {firstName}!
              </h1>
              <p className="text-muted-foreground mt-1">
                {quote}
              </p>
            </div>
            
            <div className="hidden md:block">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <BarChart3 className="h-4 w-4 mr-2 text-health-primary" />
                View Insights
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DailyInsight 
              title="Today's Focus"
              text="Complete your morning meditation session"
              icon={<Lightbulb className="h-5 w-5 text-amber-500" />}
              color="bg-amber-50 dark:bg-amber-950/40"
              textColor="text-amber-600 dark:text-amber-400"
              borderColor="border-amber-100 dark:border-amber-900/50"
            />
            <DailyInsight 
              title="Streak"
              text="10 consecutive days of activity!"
              icon={<Trophy className="h-5 w-5 text-green-500" />}
              color="bg-green-50 dark:bg-green-950/40"
              textColor="text-green-600 dark:text-green-400"
              borderColor="border-green-100 dark:border-green-900/50"
            />
            <DailyInsight 
              title="Your Flow Tip"
              text="Break complex tasks into smaller steps"
              icon={<Sparkles className="h-5 w-5 text-indigo-500" />}
              color="bg-indigo-50 dark:bg-indigo-950/40"
              textColor="text-indigo-600 dark:text-indigo-400"
              borderColor="border-indigo-100 dark:border-indigo-900/50"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DailyInsightProps {
  title: string;
  text: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
  borderColor: string;
}

function DailyInsight({ title, text, icon, color, textColor, borderColor }: DailyInsightProps) {
  return (
    <div className={`${color} ${borderColor} rounded-lg border p-3 flex items-start gap-3`}>
      <div className="rounded-full bg-white dark:bg-gray-800 p-2 border border-gray-100 dark:border-gray-700">
        {icon}
      </div>
      <div>
        <h3 className={`text-sm font-medium ${textColor}`}>{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
      </div>
    </div>
  );
}
