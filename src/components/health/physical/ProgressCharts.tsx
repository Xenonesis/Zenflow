import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "recharts";
import { supabase } from "@/lib/supabase";
import { format, startOfWeek, endOfWeek, addDays, startOfDay, endOfDay } from "date-fns";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const chartConfig = {
  calories: {
    label: "Calories",
    color: "#33C3F0"
  },
  rate: {
    label: "Heart Rate",
    color: "#8B5CF6"
  },
  restingRate: {
    label: "Resting HR",
    color: "#9CA3AF"
  }
};

export function ProgressCharts() {
  const { user } = useAuth();
  const [caloriesData, setCaloriesData] = useState([]);
  const [heartRateData, setHeartRateData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChartData() {
      if (!user?.id) return;

      try {
        // Get the current week's date range
        const today = new Date();
        const weekStart = startOfWeek(today);
        const weekEnd = endOfWeek(today);

        // Format dates with clear ISO format
        const weekStartStr = format(weekStart, 'yyyy-MM-dd');
        const weekEndStr = format(weekEnd, 'yyyy-MM-dd');
        const todayStartStr = format(startOfDay(today), 'yyyy-MM-dd');
        const todayEndStr = format(endOfDay(today), 'yyyy-MM-dd');

        // Fetch exercise sessions for the week
        const { data: exerciseSessions } = await supabase
          .from('exercise_sessions')
          .select('*')
          .eq('user_id', user.id)
          .gte('start_time', weekStartStr)
          .lte('start_time', weekEndStr)
          .order('start_time', { ascending: true });

        // Create a map of day -> calories
        const weeklyCalories = {};
        days.forEach((day) => {
          weeklyCalories[day] = 0;
        });

        // Sum up calories for each day
        if (exerciseSessions && exerciseSessions.length > 0) {
          exerciseSessions.forEach(session => {
            const date = new Date(session.start_time);
            const dayIndex = date.getDay();
            const day = days[dayIndex];
            weeklyCalories[day] += (session.calories_burned || 0);
          });
        }

        // Convert to chart data format
        const caloriesChartData = days.map(day => ({
          day,
          calories: weeklyCalories[day]
        }));

        // Fetch heart rate data for today
        const { data: heartRateMetrics } = await supabase
          .from('health_metrics')
          .select('*')
          .eq('user_id', user.id)
          .eq('metric_type', 'heart_rate')
          .gte('created_at', todayStartStr)
          .lte('created_at', todayEndStr)
          .order('created_at', { ascending: true });

        // Create time-based heart rate data
        let heartRateChartData = [];
        if (heartRateMetrics && heartRateMetrics.length > 0) {
          // Calculate the average resting heart rate
          const restingRate = heartRateMetrics.reduce((acc, metric) => acc + metric.value, 0) / heartRateMetrics.length * 0.8;

          // Convert to chart data format with time slots
          heartRateChartData = heartRateMetrics.map(metric => {
            const date = new Date(metric.created_at);
            return {
              time: format(date, 'ha'),
              rate: metric.value,
              restingRate: Math.round(restingRate)
            };
          });
        } else {
          // Fallback data if no heart rate readings are available
          heartRateChartData = [
            { time: "8am", rate: 72, restingRate: 65 },
            { time: "10am", rate: 85, restingRate: 65 },
            { time: "12pm", rate: 90, restingRate: 65 },
            { time: "2pm", rate: 78, restingRate: 65 },
            { time: "4pm", rate: 82, restingRate: 65 },
            { time: "6pm", rate: 110, restingRate: 65 },
            { time: "8pm", rate: 70, restingRate: 65 },
          ];
        }

        setCaloriesData(caloriesChartData);
        setHeartRateData(heartRateChartData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        // Fallback to default data if there's an error
        setCaloriesData([
          { day: "Mon", calories: 320 },
          { day: "Tue", calories: 450 },
          { day: "Wed", calories: 280 },
          { day: "Thu", calories: 410 },
          { day: "Fri", calories: 530 },
          { day: "Sat", calories: 350 },
          { day: "Sun", calories: 200 },
        ]);
        setHeartRateData([
          { time: "8am", rate: 72, restingRate: 65 },
          { time: "10am", rate: 85, restingRate: 65 },
          { time: "12pm", rate: 90, restingRate: 65 },
          { time: "2pm", rate: 78, restingRate: 65 },
          { time: "4pm", rate: 82, restingRate: 65 },
          { time: "6pm", rate: 110, restingRate: 65 },
          { time: "8pm", rate: 70, restingRate: 65 },
        ]);
        setLoading(false);
      }
    }

    fetchChartData();
  }, [user?.id]);

  if (loading) {
    return <div className="grid gap-4 md:grid-cols-2 h-80 items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Calories Burned</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p>Loading data...</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Heart Rate Today</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p>Loading data...</p>
        </CardContent>
      </Card>
    </div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Calories Burned</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={caloriesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <XAxis 
                  dataKey="day" 
                  className="text-xs font-medium" 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  className="text-xs font-medium"
                  tickLine={false}
                  axisLine={false} 
                  tickFormatter={(value) => `${value} cal`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="calories" 
                  fill="var(--color-calories, #33C3F0)" 
                  radius={[4, 4, 0, 0]} 
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Heart Rate Today</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={heartRateData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <XAxis 
                  dataKey="time" 
                  className="text-xs font-medium"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={['dataMin - 10', 'dataMax + 10']} 
                  className="text-xs font-medium"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value} bpm`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="var(--color-rate, #8B5CF6)" 
                  strokeWidth={3} 
                  dot={{ r: 3 }} 
                  activeDot={{ r: 5 }}
                  className="stroke-primary"
                />
                <Line 
                  type="monotone" 
                  dataKey="restingRate" 
                  stroke="var(--color-restingRate, #9CA3AF)" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false}
                  className="stroke-muted"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
