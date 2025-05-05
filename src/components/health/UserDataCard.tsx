import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { userData, UserProfile } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Heart, Ruler, Weight, Activity, Edit, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UserDataCard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  
  const loadProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
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
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const navigateToSettings = () => {
    navigate('/settings');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <User className="h-5 w-5 mr-2 text-health-primary" />
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-10 w-10"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2 text-health-primary" />
            User Profile
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex items-center gap-1"
              onClick={navigateToSettings}
            >
              <Edit className="h-3 w-3" />
              Edit Profile
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Show notification if health statistics are missing */}
        {profile && (!profile.preferences?.health_score && !profile.preferences?.streak) && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 px-4 py-3 rounded-md flex items-start mb-4">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Complete your health statistics</h3>
              <p className="text-sm mb-2">
                Track your progress by adding health score, streaks and tasks in your settings.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs bg-white dark:bg-blue-900/30"
                onClick={navigateToSettings}
              >
                Update Statistics
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex flex-col p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3" /> Name
            </span>
            <span className="font-medium">{profile?.full_name || 'Not set'}</span>
          </div>
          
          <div className="flex flex-col p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Activity className="h-3 w-3" /> Age
            </span>
            <span className="font-medium">{profile?.age || 'Not set'}</span>
          </div>
          
          <div className="flex flex-col p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Heart className="h-3 w-3" /> Blood Group
            </span>
            <span className="font-medium">{profile?.blood_group || 'Not set'}</span>
          </div>
          
          <div className="flex flex-col p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Ruler className="h-3 w-3" /> Height
            </span>
            <span className="font-medium">{profile?.height ? `${profile.height} cm` : 'Not set'}</span>
          </div>
          
          <div className="flex flex-col p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Weight className="h-3 w-3" /> Weight
            </span>
            <span className="font-medium">{profile?.weight ? `${profile.weight} kg` : 'Not set'}</span>
          </div>
          
          <div className="flex flex-col p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
            <span className="text-xs text-muted-foreground">Gender</span>
            <span className="font-medium">{profile?.gender || 'Not set'}</span>
          </div>
        </div>
        
        {profile?.preferences?.bio && (
          <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
            <span className="text-xs text-muted-foreground">Bio</span>
            <p className="text-sm mt-1">{profile.preferences.bio}</p>
          </div>
        )}
        
        {/* Health Statistics Section */}
        {(profile?.preferences?.health_score || profile?.preferences?.streak || 
          profile?.preferences?.tasks_today || profile?.preferences?.tasks_completed) && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Health Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {profile?.preferences?.health_score && (
                <div className="flex flex-col p-2 rounded bg-health-primary/10 dark:bg-health-primary/20">
                  <span className="text-xs text-muted-foreground">Health Score</span>
                  <span className="font-medium">{profile.preferences.health_score}/100</span>
                </div>
              )}
              
              {profile?.preferences?.streak && (
                <div className="flex flex-col p-2 rounded bg-health-secondary/10 dark:bg-health-secondary/20">
                  <span className="text-xs text-muted-foreground">Current Streak</span>
                  <span className="font-medium">{profile.preferences.streak} days</span>
                </div>
              )}
              
              {(profile?.preferences?.tasks_today || profile?.preferences?.tasks_completed) && (
                <div className="flex flex-col p-2 rounded bg-health-tertiary/10 dark:bg-health-tertiary/20">
                  <span className="text-xs text-muted-foreground">Tasks</span>
                  <span className="font-medium">
                    {profile.preferences.tasks_completed || '0'}/{profile.preferences.tasks_today || '0'} completed
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mt-4 text-center">
          Last updated: {profile?.updated_at ? new Date(profile.updated_at).toLocaleString() : 'Unknown'}
        </div>
      </CardContent>
    </Card>
  );
} 