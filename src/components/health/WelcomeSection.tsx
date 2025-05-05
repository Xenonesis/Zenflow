import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { userData } from "@/lib/supabase";
import { UserProfile } from "@/lib/supabase";

export function WelcomeSection() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
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

  const today = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = dayNames[today.getDay()];
  const date = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  
  return (
    <Card className="mb-6 bg-gradient-to-r from-health-soft to-white animate-fade-in dark:from-slate-800 dark:to-slate-900">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-health-dark dark:text-white">
              Good {getTimeOfDay()}, {profile?.full_name || user?.email?.split('@')[0] || 'User'}
            </h2>
            <p className="text-muted-foreground">{dayName}, {date}</p>
            
            {/* Show loading state while fetching data */}
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-40"></div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
              </div>
            ) : (
              <>
                <p className="text-health-dark dark:text-white mt-2">
                  <span className="font-medium">Today's health score:</span> {profile?.preferences?.health_score || 'N/A'}
                </p>
                <Progress value={profile?.preferences?.health_score ? parseInt(profile.preferences.health_score) : 0} className="h-2 mt-1" />
              </>
            )}
          </div>
          
          <div className="flex gap-4 mt-2 md:mt-0">
            <Card className="w-full md:w-36 border-0 bg-health-primary/10 dark:bg-health-primary/20">
              <CardContent className="p-3 text-center">
                <Trophy className="mx-auto text-health-primary mb-1" />
                <p className="text-sm">{profile?.preferences?.streak || '0'}-day streak</p>
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </CardContent>
            </Card>
            <Card className="w-full md:w-36 border-0 bg-health-physical/10 dark:bg-health-physical/20">
              <CardContent className="p-3 text-center">
                <p className="font-bold text-lg">{profile?.preferences?.tasks_today || '0'}</p>
                <p className="text-sm">Tasks today</p>
                <p className="text-xs text-muted-foreground">{profile?.preferences?.tasks_completed || '0'} completed</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}
