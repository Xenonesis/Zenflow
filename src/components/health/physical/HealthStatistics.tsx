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
  Target
} from 'lucide-react';
import { databaseService } from '@/services/database.service';
import { format, subDays, subWeeks, subMonths, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Tables } from '@/types/database.types';
import { supabase } from '@/lib/supabase';

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

export function HealthStatistics() {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<HealthData>(initialHealthData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    
    return {
      today: {
        steps: rand(4000, 12000),
        activeMinutes: rand(20, 120),
        caloriesBurned: rand(1200, 3000),
        heartRate: {
          current: rand(60, 85),
          min: rand(55, 65),
          max: rand(120, 160),
        },
        hydration: rand(4, 10) * 100, // ml
        sleep: {
          hours: rand(6, 9),
          quality: rand(65, 95),
        },
        bloodPressure: {
          systolic: rand(110, 140),
          diastolic: rand(70, 90),
        }
      },
      weekly: {
        averageSteps: rand(6000, 10000),
        totalActiveMinutes: rand(150, 400),
        totalCaloriesBurned: rand(10000, 18000),
        averageHeartRate: rand(65, 80),
        averageHydration: rand(5, 9) * 100, // ml per day
        averageSleep: rand(6, 8) + (rand(0, 60) / 60), // hours
        workouts: rand(2, 6),
        progressToGoal: rand(50, 95),
      },
      monthly: {
        averageSteps: rand(7000, 10000),
        totalWorkouts: rand(10, 25),
        longestWorkout: rand(45, 120),
        averageSleep: rand(6, 8) + (rand(0, 60) / 60), // hours
        restDays: rand(4, 10),
        progressToGoal: rand(60, 98),
      }
    };
  }

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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Health Statistics</h3>
      </div>
      
      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-health-primary" />
                  Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.today.steps.toLocaleString()}</div>
                <Progress value={(healthData.today.steps / 10000) * 100} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Goal: 10,000 steps</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Flame className="h-4 w-4 mr-2 text-orange-500" />
                  Calories Burned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.today.caloriesBurned.toLocaleString()}</div>
                <Progress value={(healthData.today.caloriesBurned / 2500) * 100} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Goal: 2,500 calories</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-red-500" />
                  Heart Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.today.heartRate.current} BPM</div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span className="flex items-center">
                    <ArrowDown className="h-3 w-3 mr-1 text-blue-500" />
                    Min: {healthData.today.heartRate.min}
                  </span>
                  <span className="flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1 text-red-500" />
                    Max: {healthData.today.heartRate.max}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <AlarmClock className="h-4 w-4 mr-2 text-health-secondary" />
                  Active Minutes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.today.activeMinutes} min</div>
                <Progress value={(healthData.today.activeMinutes / 60) * 100} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Goal: 60 minutes</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                  Hydration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(healthData.today.hydration / 1000).toFixed(1)}L</div>
                <Progress value={(healthData.today.hydration / 2500) * 100} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Goal: 2.5L</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Moon className="h-4 w-4 mr-2 text-indigo-400" />
                  Sleep
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.today.sleep.hours.toFixed(1)}h</div>
                <Progress value={(healthData.today.sleep.hours / 8) * 100} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Quality: {healthData.today.sleep.quality}%</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="week" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-health-primary" />
                  Average Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.weekly.averageSteps.toLocaleString()}</div>
                <Progress value={(healthData.weekly.averageSteps / 10000) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Dumbbell className="h-4 w-4 mr-2 text-health-secondary" />
                  Workouts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.weekly.workouts}</div>
                <Progress value={(healthData.weekly.workouts / 7) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Flame className="h-4 w-4 mr-2 text-orange-500" />
                  Total Calories Burned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.weekly.totalCaloriesBurned.toLocaleString()}</div>
                <Progress value={(healthData.weekly.totalCaloriesBurned / 17500) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <AlarmClock className="h-4 w-4 mr-2 text-health-secondary" />
                  Active Minutes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.weekly.totalActiveMinutes} min</div>
                <Progress value={(healthData.weekly.totalActiveMinutes / 300) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-red-500" />
                  Avg Heart Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.weekly.averageHeartRate} BPM</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Target className="h-4 w-4 mr-2 text-health-primary" />
                  Weekly Goal Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.weekly.progressToGoal}%</div>
                <Progress value={healthData.weekly.progressToGoal} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="month" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-health-primary" />
                  Average Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.monthly.averageSteps.toLocaleString()}</div>
                <Progress value={(healthData.monthly.averageSteps / 10000) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Dumbbell className="h-4 w-4 mr-2 text-health-secondary" />
                  Total Workouts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.monthly.totalWorkouts}</div>
                <Progress value={(healthData.monthly.totalWorkouts / 30) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <AlarmClock className="h-4 w-4 mr-2 text-health-secondary" />
                  Longest Workout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.monthly.longestWorkout} min</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Moon className="h-4 w-4 mr-2 text-indigo-400" />
                  Average Sleep
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.monthly.averageSleep.toFixed(1)}h</div>
                <Progress value={(healthData.monthly.averageSleep / 8) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-gray-500" />
                  Rest Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.monthly.restDays}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Target className="h-4 w-4 mr-2 text-health-primary" />
                  Monthly Goal Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.monthly.progressToGoal}%</div>
                <Progress value={healthData.monthly.progressToGoal} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 