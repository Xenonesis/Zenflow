import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Heart, 
  AlarmClock, 
  Dumbbell,
  Flame, 
  Droplets,
  Moon,
  ArrowUp,
  ArrowDown,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  ActivitySquare,
  Footprints,
  Timer,
  Battery
} from 'lucide-react';
import { databaseService } from '@/services/database.service';
import { format, subDays, subWeeks, subMonths, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Tables } from '@/types/database.types';
import { supabase } from '@/lib/supabase';
import { Badge } from "@/components/ui/badge";
import { ActivityRing } from "@/components/ui/activity-ring";

// Define the structure for our health data
interface HealthData {
  today: {
    steps: number;
    activeMinutes: number;
    caloriesBurned: number;
    heartRate: {
      current: number;
      min: number;
      max: number;
    };
    hydration: number; // ml
    sleep: {
      hours: number;
      quality: number;
    };
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
  };
  weekly: {
    averageSteps: number;
    totalActiveMinutes: number;
    totalCaloriesBurned: number;
    averageHeartRate: number;
    averageHydration: number; // ml per day
    averageSleep: number; // hours
    workouts: number;
    progressToGoal: number;
  };
  monthly: {
    averageSteps: number;
    totalWorkouts: number;
    longestWorkout: number;
    averageSleep: number; // hours
    restDays: number;
    progressToGoal: number;
  };
}

// Create initial empty data structure
const initialHealthData: HealthData = {
  today: {
    steps: 0,
    activeMinutes: 0,
    caloriesBurned: 0,
    heartRate: {
      current: 0,
      min: 0,
      max: 0,
    },
    hydration: 0,
    sleep: {
      hours: 0,
      quality: 0,
    },
    bloodPressure: {
      systolic: 0,
      diastolic: 0,
    },
  },
  weekly: {
    averageSteps: 0,
    totalActiveMinutes: 0,
    totalCaloriesBurned: 0,
    averageHeartRate: 0,
    averageHydration: 0,
    averageSleep: 0,
    workouts: 0,
    progressToGoal: 0,
  },
  monthly: {
    averageSteps: 0,
    totalWorkouts: 0,
    longestWorkout: 0,
    averageSleep: 0,
    restDays: 0,
    progressToGoal: 0,
  },
};

interface HealthStatisticsProps {
  timeRange: "day" | "week" | "month" | "year";
}

export function HealthStatistics({ timeRange }: HealthStatisticsProps) {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<HealthData>(initialHealthData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState("overview");

  useEffect(() => {
    async function fetchUserHealthData() {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get today's date
        const today = new Date();
        
        // Format dates properly to avoid timezone issues
        const todayStartStr = format(startOfDay(today), 'yyyy-MM-dd');
        const todayEndStr = format(endOfDay(today), 'yyyy-MM-dd');
        const weekStartStr = format(startOfWeek(today), 'yyyy-MM-dd');
        const weekEndStr = format(endOfWeek(today), 'yyyy-MM-dd');
        const monthStartStr = format(startOfMonth(today), 'yyyy-MM-dd');
        const monthEndStr = format(endOfMonth(today), 'yyyy-MM-dd');
        
        // Get wellness trends - direct use without destructuring
        const wellnessTrendsToday = await databaseService.getWellnessTrends(
          user.id,
          todayStartStr,
          todayEndStr
        );
        
        const wellnessTrendsWeek = await databaseService.getWellnessTrends(
          user.id,
          weekStartStr,
          weekEndStr
        );
        
        const wellnessTrendsMonth = await databaseService.getWellnessTrends(
          user.id,
          monthStartStr,
          monthEndStr
        );
        
        // Get exercise sessions - direct use without destructuring
        const exerciseSessionsToday = await databaseService.getExerciseSessions(user.id, 50);
        
        // Safely filter today's exercises
        const todayStart = startOfDay(today);
        const todayEnd = endOfDay(today);
        const todayExercises = exerciseSessionsToday && exerciseSessionsToday.length > 0
          ? exerciseSessionsToday.filter(
              session => {
                const sessionDate = new Date(session.start_time);
                return sessionDate >= todayStart && sessionDate <= todayEnd;
              }
            )
          : [];
        
        // Get today's heart rate data from health_metrics
        const { data: heartRateMetrics } = await supabase
          .from('health_metrics')
          .select('*')
          .eq('user_id', user.id)
          .eq('metric_type', 'heart_rate')
          .gte('created_at', todayStartStr)
          .lte('created_at', todayEndStr)
          .order('created_at', { ascending: false });
        
        // Calculate heart rate stats
        let currentHeartRate = 0;
        let minHeartRate = 0;
        let maxHeartRate = 0;
        
        if (heartRateMetrics && heartRateMetrics.length > 0) {
          // Current is the most recent reading
          currentHeartRate = heartRateMetrics[0].value;
          
          // Find min and max values
          const heartRateValues = heartRateMetrics.map(metric => metric.value);
          minHeartRate = Math.min(...heartRateValues);
          maxHeartRate = Math.max(...heartRateValues);
        } else {
          // Fallback values if no data is available
          currentHeartRate = 72;
          minHeartRate = 60;
          maxHeartRate = 130;
        }
        
        // Get weekly heart rate data for average calculation
        const { data: weeklyHeartRateMetrics } = await supabase
          .from('health_metrics')
          .select('*')
          .eq('user_id', user.id)
          .eq('metric_type', 'heart_rate')
          .gte('created_at', weekStartStr)
          .lte('created_at', weekEndStr);
        
        // Calculate weekly average heart rate
        const weeklyHeartRateValues = weeklyHeartRateMetrics?.map(metric => metric.value) || [];
        const averageHeartRate = calculateAverage(weeklyHeartRateValues) || 68; // Fallback if no data
        
        // Get week's exercise sessions
        const exerciseSessionsWeek = exerciseSessionsToday && exerciseSessionsToday.length > 0
          ? exerciseSessionsToday.filter(
              session => {
                const sessionDate = new Date(session.start_time);
                return sessionDate >= subDays(today, 7) && sessionDate <= today;
              }
            )
          : [];
        
        // Get month's exercise sessions
        const exerciseSessionsMonth = exerciseSessionsToday && exerciseSessionsToday.length > 0
          ? exerciseSessionsToday.filter(
              session => {
                const sessionDate = new Date(session.start_time);
                return sessionDate >= subDays(today, 30) && sessionDate <= today;
              }
            )
          : [];
        
        // Calculate all the health statistics from the fetched data
        const computedHealthData: HealthData = {
          today: {
            steps: wellnessTrendsToday && wellnessTrendsToday[0]?.exercise_minutes * 100 || 0,
            activeMinutes: todayExercises.reduce((total, session) => total + session.duration, 0),
            caloriesBurned: todayExercises.reduce((total, session) => total + (session.calories_burned || 0), 0),
            heartRate: {
              current: currentHeartRate,
              min: minHeartRate,
              max: maxHeartRate
            },
            hydration: 1500, // This could come from a water intake tracking feature
            sleep: {
              hours: wellnessTrendsToday && wellnessTrendsToday[0]?.sleep_hours || 0,
              quality: 70, // Use a default quality value
            },
            bloodPressure: {
              systolic: 120, // This would come from a blood pressure tracking feature
              diastolic: 80, // This would come from a blood pressure tracking feature
            },
          },
          weekly: {
            averageSteps: wellnessTrendsWeek && wellnessTrendsWeek.length > 0 
              ? calculateAverage(wellnessTrendsWeek.map(trend => trend.exercise_minutes * 100 || 0))
              : 0,
            totalActiveMinutes: exerciseSessionsWeek.reduce((total, session) => total + session.duration, 0),
            totalCaloriesBurned: exerciseSessionsWeek.reduce((total, session) => total + (session.calories_burned || 0), 0),
            averageHeartRate: averageHeartRate,
            averageHydration: 1800, // This would be calculated from water intake data
            averageSleep: wellnessTrendsWeek && wellnessTrendsWeek.length > 0
              ? calculateAverage(wellnessTrendsWeek.map(trend => trend.sleep_hours || 0))
              : 0,
            workouts: exerciseSessionsWeek.length,
            progressToGoal: 75, // This could be calculated based on weekly goals
          },
          monthly: {
            averageSteps: wellnessTrendsMonth && wellnessTrendsMonth.length > 0
              ? calculateAverage(wellnessTrendsMonth.map(trend => trend.exercise_minutes * 100 || 0))
              : 0,
            totalWorkouts: exerciseSessionsMonth.length,
            longestWorkout: exerciseSessionsMonth.length > 0
              ? findMax(exerciseSessionsMonth.map(session => session.duration))
              : 0,
            averageSleep: wellnessTrendsMonth && wellnessTrendsMonth.length > 0
              ? calculateAverage(wellnessTrendsMonth.map(trend => trend.sleep_hours || 0))
              : 0,
            restDays: 30 - exerciseSessionsMonth.length, // Simple calculation for rest days
            progressToGoal: 85, // This could be calculated based on monthly goals
          },
        };
        
        setHealthData(computedHealthData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching health data:', err);
        setError('Failed to load health data');
        setLoading(false);
        
        // If there's an error, fall back to showing some default data
        setHealthData(generateBackupHealthData(user.id));
      }
    }
    
    fetchUserHealthData();
  }, [user?.id]);

  // Helper function to calculate average of an array of numbers
  function calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((total, num) => total + num, 0);
    return sum / numbers.length;
  }
  
  // Helper function to find the maximum value in an array of numbers
  function findMax(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return Math.max(...numbers);
  }
  
  // Generate backup data if we can't get real data
  function generateBackupHealthData(userId: string): HealthData {
    // Generate deterministic but random-looking data based on userId
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rand = (min: number, max: number) => {
      return Math.floor((hash % 100) / 100 * (max - min) + min);
    };
    
    // More realistic patterns - most people have higher activity during weekdays
    // and sleep patterns that follow a weekly cycle
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Activity modifier based on day of week (weekends typically have less structured activity)
    const activityModifier = dayOfWeek >= 1 && dayOfWeek <= 5 ? 1.2 : 0.8;
    
    // Sleep modifier (people tend to sleep more on weekends)
    const sleepModifier = dayOfWeek >= 1 && dayOfWeek <= 4 ? 0.9 : 1.1;
    
    // Heart rate varies by time of day
    const hour = today.getHours();
    const heartRateModifier = hour >= 8 && hour <= 18 ? 1.1 : 0.9; // Higher during day
    
    // Base steps adjusted by activity modifier
    const baseSteps = Math.floor(rand(4000, 12000) * activityModifier);
    
    // Base sleep hours adjusted by sleep modifier
    const baseSleepHours = (rand(6, 9) * sleepModifier).toFixed(1);
    
    // Base heart rate adjusted by time of day
    const baseHeartRate = Math.floor(rand(60, 80) * heartRateModifier);
    
    // Weekly pattern - more workouts mid-week, fewer on weekends
    const weeklyWorkouts = dayOfWeek === 0 || dayOfWeek === 6 ? 
      rand(2, 4) : 
      rand(4, 6);
    
    return {
      today: {
        steps: baseSteps,
        activeMinutes: Math.floor(baseSteps / 100), // Roughly 1 active minute per 100 steps
        caloriesBurned: Math.floor(baseSteps * 0.05 + rand(800, 1200)), // Base metabolism + activity
        heartRate: {
          current: baseHeartRate,
          min: Math.max(55, baseHeartRate - rand(10, 15)),
          max: baseHeartRate + rand(40, 60), // Max from exercise
        },
        hydration: rand(1500, 2500), // ml
        sleep: {
          hours: parseFloat(baseSleepHours),
          quality: rand(65, 95),
        },
        bloodPressure: {
          systolic: 110 + (baseHeartRate - 60), // Correlate with heart rate
          diastolic: 70 + Math.floor((baseHeartRate - 60) / 2),
        }
      },
      weekly: {
        averageSteps: Math.floor(baseSteps * rand(90, 110) / 100), // Slight variation day to day
        totalActiveMinutes: Math.floor(baseSteps / 100) * 7, // Week's worth of active minutes
        totalCaloriesBurned: (Math.floor(baseSteps * 0.05) + rand(800, 1200)) * 7, // Week's worth of calories
        averageHeartRate: baseHeartRate,
        averageHydration: rand(1800, 2200), // ml per day
        averageSleep: parseFloat(baseSleepHours),
        workouts: weeklyWorkouts,
        progressToGoal: rand(50, 95),
      },
      monthly: {
        averageSteps: Math.floor(baseSteps * rand(95, 105) / 100), // Monthly average close to daily
        totalWorkouts: weeklyWorkouts * 4, // Roughly 4 weeks worth
        longestWorkout: rand(45, 120),
        averageSleep: parseFloat(baseSleepHours),
        restDays: 30 - (weeklyWorkouts * 4), // Rest days = non-workout days
        progressToGoal: rand(60, 95),
      }
    };
  }

  // Get the title based on time range
  const getTimeRangeTitle = () => {
    switch (timeRange) {
      case "day":
        return "Today's Health Metrics";
      case "week":
        return "This Week's Health Summary";
      case "month":
        return "Monthly Health Overview";
      case "year":
        return "Yearly Health Trends";
      default:
        return "Health Statistics";
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p>Loading health statistics...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
        <p className="text-sm mt-2">Showing backup data instead</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h3 className="text-xl font-semibold">{getTimeRangeTitle()}</h3>
          <p className="text-sm text-muted-foreground">Track your daily activity and physical health metrics</p>
        </div>
        
        <Tabs value={activeView} onValueChange={setActiveView} className="w-full sm:w-auto">
          <TabsList className="grid w-full sm:w-auto grid-cols-3 h-8">
            <TabsTrigger value="overview" className="text-xs h-8">Overview</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs h-8">Activity</TabsTrigger>
            <TabsTrigger value="vitals" className="text-xs h-8">Vitals</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <TabsContent value="overview" className="space-y-4 mt-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            label="Calories Burned"
            value={healthData.today.caloriesBurned}
            total={null}
            trend="up"
            percentage={(healthData.today.caloriesBurned / 2500) * 100}
            change={""}
            icon={<Flame className="h-4 w-4" />}
            color="from-orange-500 to-red-500"
          />
          <StatCard 
            label="Steps"
            value={healthData.today.steps}
            total={null}
            trend="up"
            percentage={(healthData.today.steps / 10000) * 100}
            change={""}
            icon={<Footprints className="h-4 w-4" />}
            color="from-blue-500 to-indigo-500"
          />
          <StatCard 
            label="Active Minutes"
            value={healthData.today.activeMinutes}
            total={null}
            trend="up"
            percentage={(healthData.today.activeMinutes / 60) * 100}
            change={""}
            icon={<Timer className="h-4 w-4" />}
            color="from-green-500 to-emerald-500"
          />
          <StatCard 
            label="Heart Rate"
            value={healthData.today.heartRate.current}
            total={null}
            trend="down"
            percentage={(healthData.today.heartRate.current / 130) * 100}
            change={""}
            icon={<Heart className="h-4 w-4" />}
            color="from-health-primary to-health-secondary"
            unit="bpm"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="activity" className="space-y-4 mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Daily Activity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[120px] flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Activity chart would go here</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Activity Intensity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[120px] flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Intensity chart would go here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="vitals" className="space-y-4 mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[120px] flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Heart rate chart would go here</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recovery Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{healthData.today.heartRate.current}<span className="text-sm font-normal">%</span></p>
                  <p className="text-xs text-muted-foreground">Recovery Score</p>
                  <div className={`flex items-center mt-1 ${healthData.today.heartRate.current > 65 ? 'text-green-500' : 'text-red-500'}`}>
                    {healthData.today.heartRate.current > 65 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    <span className="text-xs">{healthData.today.heartRate.current > 65 ? "+3" : "-3"}</span>
                  </div>
                </div>
                <div>
                  <ActivityRing 
                    progress={(healthData.today.heartRate.current - 60) / 20 * 100} 
                    size={80} 
                    color="teal" 
                  />
                </div>
              </div>
              <div className="flex mt-4 justify-between">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                  <Battery className="h-3 w-3 mr-1 fill-current" /> Good Recovery
                </Badge>
                <p className="text-xs text-muted-foreground">Ready for activity</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  total: number | null;
  trend: "up" | "down";
  percentage: number;
  change: string;
  icon: React.ReactNode;
  color: string;
  unit?: string;
}

function StatCard({ label, value, total, trend, percentage, change, icon, color, unit = "" }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className={`h-1.5 w-full bg-gradient-to-r ${color}`}></div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className={`flex items-center ${trend === "up" ? 'text-green-500' : 'text-red-500'}`}>
            {trend === "up" ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            <span className="text-xs font-medium">{change}</span>
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold">{value.toLocaleString()}{unit}</p>
            {total && (
              <p className="text-xs text-muted-foreground mt-1">of {total.toLocaleString()} goal</p>
            )}
          </div>
          <ActivityRing progress={percentage} size={40} color={color.includes("health-primary") ? "purple" : "teal"} />
        </div>
      </CardContent>
    </Card>
  );
} 