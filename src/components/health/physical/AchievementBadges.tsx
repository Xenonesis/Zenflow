import { useEffect, useState } from "react";
import { Medal } from "lucide-react";
import { useAuth } from "@/lib/auth-context"; 
import { userData } from "@/lib/supabase";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  date?: string;
}

export function AchievementBadges() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadAchievements() {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await userData.getUserProfile(user.id);
        
        if (error) {
          console.error('Error loading profile:', error);
          return;
        }
        
        if (data && data.preferences && data.preferences.achievements) {
          setAchievements(data.preferences.achievements);
        } else {
          // Use default achievements if none are set
          setAchievements([
            {
              id: "1",
              name: "First Workout",
              description: "Complete your first workout",
              completed: false
            },
            {
              id: "2",
              name: "Consistency",
              description: "Work out 3 days in a row",
              completed: false
            },
            {
              id: "3",
              name: "Early Bird",
              description: "Complete a workout before 7 AM",
              completed: false
            },
            {
              id: "4",
              name: "Goal Crusher",
              description: "Achieve a personal fitness goal",
              completed: false
            }
          ]);
        }
      } catch (err) {
        console.error('Failed to load achievements:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAchievements();
  }, [user]);

  if (loading) {
    return (
      <div>
        <h3 className="text-lg font-medium flex items-center mb-3">
          <Medal className="mr-1 h-5 w-5 text-amber-500" />
          Achievements
        </h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 mr-2"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-1"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium flex items-center mb-3">
        <Medal className="mr-1 h-5 w-5 text-amber-500" />
        Achievements
      </h3>
      <div className="space-y-3">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={`flex items-center p-2 rounded ${achievement.completed ? 'bg-health-primary/10' : 'bg-gray-100 dark:bg-slate-800'}`}
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${achievement.completed ? 'bg-health-primary text-white' : 'bg-gray-200 dark:bg-slate-700'}`}>
              {achievement.completed ? '✓' : '?'}
            </div>
            <div>
              <h4 className={`text-sm font-medium ${achievement.completed ? 'text-health-primary' : 'text-muted-foreground'}`}>
                {achievement.name}
              </h4>
              <p className="text-xs text-muted-foreground">
                {achievement.description}
                {achievement.completed && achievement.date && ` • ${achievement.date}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
