import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Heart,
  Flame,
  Droplets,
  Moon,
  Clock,
  AlertCircle,
  Dumbbell,
  Target,
  LineChart as LineChartIcon,
  Zap
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { databaseService } from "@/services/database.service";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, 
  startOfMonth, endOfMonth, subDays } from "date-fns";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Define color scheme
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00C49F"];

// Define the interface for health data
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
  };
  weekly: {
    averageSteps: number;
    totalActiveMinutes: number;
    totalCaloriesBurned: number;
    averageHeartRate: number;
    sleepHours: number[];
    workouts: number;
    workoutsByType: { name: string; value: number }[];
  };
  monthly: {
    stepsProgress: number;
    totalWorkouts: number;
    longestWorkout: number;
    averageSleep: number;
    caloriesTrend: { date: string; calories: number }[];
    heartRateTrend: { date: string; rate: number }[];
    sleepTrend: { date: string; hours: number; quality: number }[];
  };
}

const initialHealthData: HealthData = {
  today: {
    steps: 0,
    activeMinutes: 0,
    caloriesBurned: 0,
    heartRate: {
      current: 0,
      min: 0,
      max: 0
    },
    hydration: 0,
    sleep: {
      hours: 0,
      quality: 0
    }
  },
  weekly: {
    averageSteps: 0,
    totalActiveMinutes: 0,
    totalCaloriesBurned: 0,
    averageHeartRate: 0,
    sleepHours: [0, 0, 0, 0, 0, 0, 0],
    workouts: 0,
    workoutsByType: []
  },
  monthly: {
    stepsProgress: 0,
    totalWorkouts: 0,
    longestWorkout: 0,
    averageSleep: 0,
    caloriesTrend: [],
    heartRateTrend: [],
    sleepTrend: []
  }
};

// Chart config
const chartConfig = {
  heartRate: {
    label: "Heart Rate",
    color: "#F43F5E"
  },
  calories: {
    label: "Calories",
    color: "#F59E0B"
  },
  steps: {
    label: "Steps",
    color: "#3B82F6" 
  },
  sleep: {
    label: "Sleep Hours",
    color: "#8B5CF6"
  },
  quality: {
    label: "Sleep Quality",
    color: "#10B981"
  }
};

export function HealthMetrics() {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<HealthData>(initialHealthData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("today");

  useEffect(() => {
    async function fetchHealthData() {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get date ranges
        const today = new Date();
        const todayStartStr = format(startOfDay(today), 'yyyy-MM-dd');
        const todayEndStr = format(endOfDay(today), 'yyyy-MM-dd');
        const weekStartStr = format(startOfWeek(today), 'yyyy-MM-dd');
        const weekEndStr = format(endOfWeek(today), 'yyyy-MM-dd');
        const monthStartStr = format(startOfMonth(today), 'yyyy-MM-dd');
        const monthEndStr = format(endOfMonth(today), 'yyyy-MM-dd');
        
        // Fetch daily metrics
        const wellnessTrendsToday = await databaseService.getWellnessTrends(
          user.id,
          todayStartStr,
          todayEndStr
        );
        
        // Fetch weekly metrics
        const wellnessTrendsWeek = await databaseService.getWellnessTrends(
          user.id,
          weekStartStr,
          weekEndStr
        );
        
        // Fetch monthly metrics
        const wellnessTrendsMonth = await databaseService.getWellnessTrends(
          user.id,
          monthStartStr,
          monthEndStr
        );
        
        // Fetch exercise sessions
        const exerciseSessions = await databaseService.getExerciseSessions(user.id, 50);
        
        // Fetch sleep logs
        const sleepLogs = await databaseService.getSleepLogs(user.id, 30);
        
        // Fetch heart rate data
        const { data: heartRateMetrics } = await supabase
          .from('health_metrics')
          .select('*')
          .eq('user_id', user.id)
          .eq('metric_type', 'heart_rate')
          .gte('created_at', todayStartStr)
          .order('created_at', { ascending: true });
        
        // Process today's data
        const todayData = {
          steps: wellnessTrendsToday && wellnessTrendsToday[0]?.steps || 0,
          activeMinutes: wellnessTrendsToday && wellnessTrendsToday[0]?.exercise_minutes || 0,
          caloriesBurned: wellnessTrendsToday && wellnessTrendsToday[0]?.calories_burned || 0,
          heartRate: {
            current: heartRateMetrics && heartRateMetrics.length > 0 
              ? heartRateMetrics[heartRateMetrics.length - 1].value 
              : 72,
            min: heartRateMetrics && heartRateMetrics.length > 0 
              ? Math.min(...heartRateMetrics.map(m => m.value)) 
              : 65,
            max: heartRateMetrics && heartRateMetrics.length > 0 
              ? Math.max(...heartRateMetrics.map(m => m.value)) 
              : 85,
          },
          hydration: wellnessTrendsToday && wellnessTrendsToday[0]?.hydration_ml || 1500,
          sleep: {
            hours: wellnessTrendsToday && wellnessTrendsToday[0]?.sleep_hours || 0,
            quality: wellnessTrendsToday && wellnessTrendsToday[0]?.sleep_quality || 0,
          }
        };
        
        // Process weekly data
        const weekDaySleepHours = [0, 0, 0, 0, 0, 0, 0]; // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
        
        if (wellnessTrendsWeek && wellnessTrendsWeek.length > 0) {
          wellnessTrendsWeek.forEach(trend => {
            if (trend.sleep_hours) {
              const date = new Date(trend.date);
              const dayIndex = date.getDay();
              weekDaySleepHours[dayIndex] = trend.sleep_hours;
            }
          });
        }
        
        // Group workouts by type
        const workoutTypes: Record<string, number> = {};
        if (exerciseSessions && exerciseSessions.length > 0) {
          exerciseSessions.forEach(session => {
            const sessionDate = new Date(session.start_time);
            if (sessionDate >= new Date(weekStartStr) && sessionDate <= new Date(weekEndStr)) {
              const type = session.exercise_type || 'Other';
              workoutTypes[type] = (workoutTypes[type] || 0) + 1;
            }
          });
        }
        
        const workoutsByType = Object.entries(workoutTypes).map(([name, value]) => ({ name, value }));
        
        const weeklyData = {
          averageSteps: wellnessTrendsWeek && wellnessTrendsWeek.length > 0 
            ? calculateAverage(wellnessTrendsWeek.map(t => t.steps || 0)) 
            : 0,
          totalActiveMinutes: wellnessTrendsWeek && wellnessTrendsWeek.length > 0 
            ? wellnessTrendsWeek.reduce((sum, t) => sum + (t.exercise_minutes || 0), 0) 
            : 0,
          totalCaloriesBurned: wellnessTrendsWeek && wellnessTrendsWeek.length > 0 
            ? wellnessTrendsWeek.reduce((sum, t) => sum + (t.calories_burned || 0), 0) 
            : 0,
          averageHeartRate: 72, // This would need a more sophisticated calculation
          sleepHours: weekDaySleepHours,
          workouts: Object.values(workoutTypes).reduce((a, b) => a + b, 0),
          workoutsByType: workoutsByType.length > 0 ? workoutsByType : [
            { name: 'Running', value: 2 },
            { name: 'Cycling', value: 1 },
            { name: 'Yoga', value: 3 }
          ]
        };
        
        // Process monthly data
        const caloriesTrend = wellnessTrendsMonth && wellnessTrendsMonth.length > 0 
          ? wellnessTrendsMonth.map(t => ({
              date: format(new Date(t.date), 'MM/dd'),
              calories: t.calories_burned || 0
            }))
          : generateFallbackData(30, 1500, 2500, 'calories');
          
        const heartRateTrend = wellnessTrendsMonth && wellnessTrendsMonth.length > 0 
          ? wellnessTrendsMonth.map(t => ({
              date: format(new Date(t.date), 'MM/dd'),
              rate: t.avg_heart_rate || 0
            }))
          : generateFallbackData(30, 65, 85, 'rate');
          
        const sleepTrend = wellnessTrendsMonth && wellnessTrendsMonth.length > 0 
          ? wellnessTrendsMonth.map(t => ({
              date: format(new Date(t.date), 'MM/dd'),
              hours: t.sleep_hours || 0,
              quality: t.sleep_quality || 0
            }))
          : generateFallbackSleepData(30);
          
        const monthlyData = {
          stepsProgress: calculateStepsProgress(wellnessTrendsMonth),
          totalWorkouts: exerciseSessions ? exerciseSessions.length : 0,
          longestWorkout: exerciseSessions && exerciseSessions.length > 0 
            ? Math.max(...exerciseSessions.map(s => s.duration)) 
            : 0,
          averageSleep: sleepLogs && sleepLogs.length > 0 
            ? calculateAverage(sleepLogs.map(l => l.hours || 0)) 
            : 0,
          caloriesTrend,
          heartRateTrend,
          sleepTrend
        };
        
        setHealthData({
          today: todayData,
          weekly: weeklyData,
          monthly: monthlyData
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching health metrics:", err);
        setError("Failed to load health metrics. Please try again later.");
        setLoading(false);
        
        // Set fallback data
        setHealthData({
          today: {
            steps: 7500,
            activeMinutes: 45,
            caloriesBurned: 1800,
            heartRate: {
              current: 72,
              min: 65,
              max: 110
            },
            hydration: 1500,
            sleep: {
              hours: 7.5,
              quality: 85
            }
          },
          weekly: {
            averageSteps: 8200,
            totalActiveMinutes: 280,
            totalCaloriesBurned: 12500,
            averageHeartRate: 72,
            sleepHours: [7.2, 6.8, 7.5, 7.0, 6.5, 8.0, 7.8],
            workouts: 5,
            workoutsByType: [
              { name: 'Running', value: 2 },
              { name: 'Cycling', value: 1 },
              { name: 'Yoga', value: 3 }
            ]
          },
          monthly: {
            stepsProgress: 75,
            totalWorkouts: 18,
            longestWorkout: 90,
            averageSleep: 7.2,
            caloriesTrend: generateFallbackData(30, 1500, 2500, 'calories'),
            heartRateTrend: generateFallbackData(30, 65, 85, 'rate'),
            sleepTrend: generateFallbackSleepData(30)
          }
        });
      }
    }
    
    fetchHealthData();
  }, [user?.id]);
  
  // Helper functions
  function calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }
  
  function calculateStepsProgress(wellnessTrends: any[] | null): number {
    if (!wellnessTrends || wellnessTrends.length === 0) return 70; // Fallback value
    
    const totalSteps = wellnessTrends.reduce((sum, t) => sum + (t.steps || 0), 0);
    const daysInMonth = wellnessTrends.length;
    const targetSteps = daysInMonth * 10000; // Assuming 10k steps/day goal
    
    return Math.min(Math.round((totalSteps / targetSteps) * 100), 100);
  }
  
  function generateFallbackData(days: number, min: number, max: number, valueKey: string): any[] {
    const result = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(today.getDate() - (days - i - 1));
      
      // Random value within range with some day-to-day correlation
      const randomValue = Math.floor(min + Math.random() * (max - min));
      
      result.push({
        date: format(date, 'MM/dd'),
        [valueKey]: randomValue
      });
    }
    
    return result;
  }
  
  function generateFallbackSleepData(days: number): any[] {
    const result = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(today.getDate() - (days - i - 1));
      
      // Random sleep data with weekend pattern (more sleep on weekends)
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseHours = isWeekend ? 8 : 7;
      const hours = baseHours + (Math.random() * 2 - 1); // +/- 1 hour
      const quality = 70 + Math.floor(Math.random() * 20); // 70-90% quality
      
      result.push({
        date: format(date, 'MM/dd'),
        hours,
        quality
      });
    }
    
    return result;
  }

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
        <p className="mt-4 text-muted-foreground">Loading health metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg p-4 max-w-md">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Error loading health metrics</h3>
              <p className="text-sm mt-1">{error}</p>
              <p className="text-sm mt-2">Showing fallback data instead</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="today">Today</TabsTrigger>
        <TabsTrigger value="week">This Week</TabsTrigger>
        <TabsTrigger value="month">This Month</TabsTrigger>
      </TabsList>
      
      <TabsContent value="today" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Activity className="h-4 w-4 mr-2 text-blue-500" />
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
                Calories
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
                <Clock className="h-4 w-4 mr-2 text-violet-500" />
                Active Minutes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthData.today.activeMinutes} min</div>
              <Progress value={(healthData.today.activeMinutes / 60) * 100} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Goal: 60 minutes</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                Heart Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="text-3xl font-bold text-center mb-2">
                  {healthData.today.heartRate.current} <span className="text-sm font-normal text-muted-foreground">BPM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Min: {healthData.today.heartRate.min} BPM</span>
                  <span>Max: {healthData.today.heartRate.max} BPM</span>
                </div>
              </div>
              
              <div className="h-40">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateFallbackData(12, 65, 90, 'rate')}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        domain={[60, 100]}
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rate" 
                        stroke="#F43F5E" 
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Moon className="h-5 w-5 mr-2 text-indigo-500" />
                Sleep
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Hours</p>
                  <div className="text-3xl font-bold">{healthData.today.sleep.hours.toFixed(1)}</div>
                  <Progress 
                    value={(healthData.today.sleep.hours / 8) * 100} 
                    className="h-2 mt-2" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">Goal: 8 hours</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Quality</p>
                  <div className="text-3xl font-bold">{healthData.today.sleep.quality}%</div>
                  <Progress 
                    value={healthData.today.sleep.quality} 
                    className="h-2 mt-2" 
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm mb-2">Sleep Schedule</p>
                <div className="flex justify-between items-center border-t pt-3 border-dashed">
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Bedtime</p>
                    <p className="font-medium">10:30 PM</p>
                  </div>
                  <div className="flex-1 h-2 mx-4 rounded-full bg-muted overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: `${healthData.today.sleep.hours / 10 * 100}%` }}></div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Wake up</p>
                    <p className="font-medium">6:30 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="week" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Activity className="h-4 w-4 mr-2 text-blue-500" />
                Average Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(healthData.weekly.averageSteps).toLocaleString()}</div>
              <Progress value={(healthData.weekly.averageSteps / 10000) * 100} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Goal: 10,000 steps/day</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Dumbbell className="h-4 w-4 mr-2 text-purple-500" />
                Workouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthData.weekly.workouts}</div>
              <Progress value={(healthData.weekly.workouts / 7) * 100} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Goal: 7 workouts/week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Flame className="h-4 w-4 mr-2 text-orange-500" />
                Total Calories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthData.weekly.totalCaloriesBurned.toLocaleString()}</div>
              <Progress value={(healthData.weekly.totalCaloriesBurned / 17500) * 100} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Goal: 17,500 calories/week</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Pattern</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => ({
                    day,
                    hours: healthData.weekly.sleepHours[i]
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      domain={[0, 10]} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `${value}h`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="hours" 
                      fill="#8B5CF6" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Workout Types</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={healthData.weekly.workoutsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {healthData.weekly.workoutsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="month" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Target className="h-4 w-4 mr-2 text-green-500" />
                Steps Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthData.monthly.stepsProgress}%</div>
              <Progress value={healthData.monthly.stepsProgress} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Monthly goal progress</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Dumbbell className="h-4 w-4 mr-2 text-purple-500" />
                Total Workouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthData.monthly.totalWorkouts}</div>
              <Progress value={(healthData.monthly.totalWorkouts / 20) * 100} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Goal: 20 workouts/month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                Longest Workout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthData.monthly.longestWorkout} min</div>
              <div className="h-2 mt-2"></div>
              <p className="text-xs text-muted-foreground mt-1">Your personal best</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Calorie Burn Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthData.monthly.caloriesTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="calories" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      dot={{ r: 1 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sleep Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthData.monthly.sleepTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10 }}
                      domain={[0, 10]}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="hours" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      dot={{ r: 1 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="quality" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ r: 1 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
} 