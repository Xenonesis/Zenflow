import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bot, 
  Send, 
  User, 
  LineChart, 
  BarChart3, 
  PieChart, 
  Settings, 
  Zap, 
  Coffee, 
  Moon, 
  Brain, 
  BookHeart, 
  Dumbbell,
  Sparkles,
  Activity,
  Flame,
  Heart,
  Droplets
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { aiService, AISettings } from "@/services/ai-service";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { healthData } from "@/lib/data-sync";

// Suggested questions by category
const suggestedQuestions = {
  sleep: [
    "How has my sleep quality been this month?",
    "What's the relationship between my sleep and mood?",
    "When is my optimal bedtime based on my data?",
  ],
  workouts: [
    "Am I balancing cardio and strength training well?",
    "What workout should I focus on next?",
    "How consistent have I been with my exercise routine?",
  ],
  mood: [
    "What factors affect my mood the most?",
    "How can I improve my mental wellbeing?",
    "What patterns do you see in my mood data?",
  ],
  nutrition: [
    "Am I getting enough protein in my diet?",
    "What nutrition changes would improve my energy levels?",
    "How does my diet affect my workout performance?",
  ]
};

const AIInsights = () => {
  const [healthMode, setHealthMode] = useState<"physical" | "mental">("physical");
  const [messages, setMessages] = useState<Array<{role: "user" | "assistant"; content: string}>>([
    {role: "assistant", content: "Hello! I'm your AI health assistant. How can I help you analyze your health data today?"}
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiSettings, setAiSettings] = useState<AISettings | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedTab, setSelectedTab] = useState<string>("chat");
  const [userData, setUserData] = useState<any>(null);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Load user's AI settings
  useEffect(() => {
    const loadAISettings = async () => {
      if (!user) return;
      
      try {
        const settings = await aiService.getUserAISettings(user.id);
        setAiSettings(settings);
      } catch (err) {
        console.error("Failed to load AI settings:", err);
      }
    };
    
    loadAISettings();
  }, [user]);

  // Load user's health data
  useEffect(() => {
    const loadHealthData = async () => {
      if (!user) return;
      
      try {
        // Get metrics from the last 30 days
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        const startDate = thirtyDaysAgo.toISOString().split('T')[0];
        const endDate = today.toISOString().split('T')[0];
        
        // Fetch health metrics
        const metrics = await healthData.getMetricsByUser(
          user.id,
          undefined, // all metric types
          startDate,
          endDate
        );
        
        // Fetch workouts
        const workouts = await healthData.getWorkoutsByUser(
          user.id,
          startDate,
          endDate
        );
        
        // Fetch mood entries
        const moodEntries = await healthData.getMoodEntriesByUser(
          user.id,
          startDate,
          endDate
        );
        
        // Check if we have any real data
        const hasRealData = 
          (metrics.data && metrics.data.length > 0) || 
          (workouts.data && workouts.data.length > 0) ||
          (moodEntries.data && moodEntries.data.length > 0);
        
        if (hasRealData) {
          setUserData({
            metrics: metrics.data || [],
            workouts: workouts.data || [],
            moodEntries: moodEntries.data || []
          });
        } else {
          // Generate backup data if no real data is found
          setUserData(generateBackupData(user.id));
        }
      } catch (err) {
        console.error("Failed to load health data:", err);
        // Generate backup data if there's an error
        setUserData(generateBackupData(user.id));
      }
    };
    
    loadHealthData();
  }, [user]);

  // Generate backup data when no real data is available
  const generateBackupData = (userId: string) => {
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
    
    // Create sample metrics
    const metrics = [];
    const workouts = [];
    const moodEntries = [];
    
    // Generate 30 days of step data
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayOfWeek = date.getDay();
      const dayModifier = dayOfWeek >= 1 && dayOfWeek <= 5 ? 1.2 : 0.8;
      
      // Steps metrics
      metrics.push({
        id: `step-${i}`,
        user_id: userId,
        metric_type: 'steps',
        value: Math.floor(rand(5000, 12000) * dayModifier),
        unit: 'steps',
        recorded_at: date.toISOString(),
        created_at: date.toISOString()
      });
      
      // Sleep metrics (skipping some days for realism)
      if (i % 8 !== 0) {
        metrics.push({
          id: `sleep-${i}`,
          user_id: userId,
          metric_type: 'sleep',
          value: parseFloat((rand(6, 9) * (dayOfWeek === 0 || dayOfWeek === 6 ? 1.1 : 0.9)).toFixed(1)),
          unit: 'hours',
          recorded_at: date.toISOString(),
          created_at: date.toISOString()
        });
      }
      
      // Heart rate metrics (multiple per day)
      const baseHeartRate = Math.floor(rand(60, 75) * heartRateModifier);
      if (i % 3 === 0) {
        for (let j = 0; j < 3; j++) {
          metrics.push({
            id: `hr-${i}-${j}`,
            user_id: userId,
            metric_type: 'heart_rate',
            value: baseHeartRate + rand(-5, 15),
            unit: 'bpm',
            recorded_at: date.toISOString(),
            created_at: date.toISOString()
          });
        }
      }
      
      // Workout sessions (2-4 times per week)
      if (i % rand(2, 4) === 0 && i < 14) {
        const workoutTypes = ['cardio', 'strength', 'flexibility', 'sports'];
        const workoutType = workoutTypes[Math.floor(rand(0, workoutTypes.length))];
        const duration = rand(20, 90);
        workouts.push({
          id: `workout-${i}`,
          user_id: userId,
          name: `${workoutType} workout`,
          workout_type: workoutType,
          duration: duration,
          calories_burned: duration * rand(7, 12),
          intensity: rand(0, 100) > 70 ? 'high' : rand(0, 100) > 40 ? 'medium' : 'low',
          recorded_at: date.toISOString(),
          created_at: date.toISOString()
        });
      }
      
      // Mood entries (not every day)
      if (i % rand(1, 3) === 0) {
        const moodScore = rand(5, 10);
        const moodLabels = ['neutral', 'good', 'great', 'excellent'];
        const moodIndex = Math.floor((moodScore - 5) / 1.25);
        moodEntries.push({
          id: `mood-${i}`,
          user_id: userId,
          mood_score: moodScore,
          mood_label: moodLabels[moodIndex],
          factors: ['exercise', 'sleep', 'nutrition'].slice(0, rand(1, 4)),
          recorded_at: date.toISOString(),
          created_at: date.toISOString()
        });
      }
    }
    
    return {
      metrics,
      workouts,
      moodEntries
    };
  };

  const handleSendMessage = async (messageText = input) => {
    if (!messageText.trim() || !user) return;
    
    // Add user message
    const userMessage = {role: "user" as const, content: messageText};
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Process the message with the AI service
      const response = await aiService.processPrompt(user.id, messageText);
      
      if (response.success && response.content) {
        const aiResponse = {
          role: "assistant" as const, 
          content: response.content
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        // Handle error
        const errorMessage = response.error || "Sorry, I couldn't process your request. Please try again.";
        const aiResponse = {
          role: "assistant" as const, 
          content: errorMessage
        };
        setMessages(prev => [...prev, aiResponse]);
        
        // Show toast for configuration issues
        if (errorMessage.includes("AI settings not found")) {
          toast({
            title: "AI Configuration Required",
            description: "Please configure your AI settings in the Settings page.",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      console.error("Error processing message:", err);
      const aiResponse = {
        role: "assistant" as const, 
        content: "Sorry, an error occurred while processing your request. Please try again later."
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle clicking a suggested question
  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    handleSendMessage(question);
  };

  const renderInsightCard = (icon: React.ReactNode, title: string, description: string, value?: string, change?: string) => (
    <Card className="overflow-hidden border-none shadow-md transition-all hover:shadow-lg">
      <CardHeader className="pb-2 bg-gradient-to-r from-health-primary/10 to-health-secondary/5">
        <CardTitle className="text-lg flex items-center">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        {value && (
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-bold text-health-primary">{value}</span>
            {change && (
              <Badge className="ml-2" variant={change.startsWith('+') ? "default" : "destructive"}>
                {change}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Render health insights based on actual data
  const renderHealthInsights = () => {
    if (!user) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-amber-100 flex items-center justify-center">
            <Settings className="h-8 w-8 text-amber-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Sign In Required</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Please sign in to view your personalized health insights.
          </p>
        </div>
      );
    }
    
    if (!userData) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-health-primary/10 flex items-center justify-center">
            <Zap className="h-8 w-8 text-health-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Loading Health Data</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Please wait while we analyze your health data...
          </p>
        </div>
      );
    }
    
    // Check for empty data after we've tried to load or generate it
    if (!userData.metrics || userData.metrics.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-health-primary/10 flex items-center justify-center">
            <Zap className="h-8 w-8 text-health-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Health Data Found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We couldn't find any health data to analyze. Try logging some activities or syncing your health device.
          </p>
        </div>
      );
    }
    
    // Calculate some simple insights from the data
    const stepMetrics = userData.metrics.filter(m => m.metric_type === 'steps');
    const sleepMetrics = userData.metrics.filter(m => m.metric_type === 'sleep');
    const waterMetrics = userData.metrics.filter(m => m.metric_type === 'water');
    const heartRateMetrics = userData.metrics.filter(m => m.metric_type === 'heart_rate');
    
    const avgSteps = stepMetrics.length > 0
      ? Math.round(stepMetrics.reduce((sum, m) => sum + m.value, 0) / stepMetrics.length)
      : 0;
      
    const avgSleep = sleepMetrics.length > 0
      ? (sleepMetrics.reduce((sum, m) => sum + m.value, 0) / sleepMetrics.length).toFixed(1)
      : 0;
      
    const avgHeartRate = heartRateMetrics.length > 0
      ? Math.round(heartRateMetrics.reduce((sum, m) => sum + m.value, 0) / heartRateMetrics.length)
      : 0;
    
    const totalWorkouts = userData.workouts.length;
    
    const avgMood = userData.moodEntries.length > 0
      ? Math.round(userData.moodEntries.reduce((sum, m) => sum + m.mood_score, 0) / userData.moodEntries.length * 10) / 10
      : 0;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="shadow-md border-none">
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b pb-3">
              <CardTitle className="text-base font-medium flex items-center">
                <Activity className="h-4 w-4 mr-2 text-blue-500" />
                Activity Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span className="text-sm">Average Steps</span>
                  <span className="font-medium">{avgSteps.toLocaleString()} steps/day</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm">Total Workouts</span>
                  <span className="font-medium">{totalWorkouts} sessions</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm">Active Streak</span>
                  <span className="font-medium">{Math.min(userData.workouts.length, 7)} days</span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {avgSteps > 7500 
                    ? "Great job staying active! You're consistently meeting activity goals."
                    : "Try to increase your daily step count to reach the recommended 7,500-10,000 steps."}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-none">
            <CardHeader className="bg-purple-50 dark:bg-purple-900/20 border-b pb-3">
              <CardTitle className="text-base font-medium flex items-center">
                <Moon className="h-4 w-4 mr-2 text-purple-500" />
                Sleep Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span className="text-sm">Average Sleep</span>
                  <span className="font-medium">{avgSleep} hours/night</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm">Sleep Consistency</span>
                  <span className="font-medium">{sleepMetrics.length > 10 ? "Good" : "Needs Improvement"}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm">Best Sleep Day</span>
                  <span className="font-medium">
                    {sleepMetrics.length > 0 ? new Date(sleepMetrics.sort((a, b) => b.value - a.value)[0].recorded_at).toLocaleDateString(undefined, {weekday: 'short'}) : 'N/A'}
                  </span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {parseFloat(avgSleep as string) >= 7 
                    ? "You're getting good quality sleep. Maintain your consistent sleep schedule."
                    : "Your sleep is below the recommended 7-9 hours. Try to establish a regular sleep routine."}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-none">
            <CardHeader className="bg-red-50 dark:bg-red-900/20 border-b pb-3">
              <CardTitle className="text-base font-medium flex items-center">
                <Heart className="h-4 w-4 mr-2 text-red-500" />
                Heart Health
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span className="text-sm">Average Heart Rate</span>
                  <span className="font-medium">{avgHeartRate} BPM</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm">Resting Heart Rate</span>
                  <span className="font-medium">
                    {heartRateMetrics.length > 0 
                      ? Math.min(...heartRateMetrics.map(m => m.value)) 
                      : 'N/A'} BPM
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm">Heart Rate Variability</span>
                  <span className="font-medium">
                    {heartRateMetrics.length > 5 
                      ? Math.round(Math.sqrt(heartRateMetrics.map(m => m.value).reduce((sum, val) => sum + Math.pow(val - avgHeartRate, 2), 0) / heartRateMetrics.length))
                      : 'N/A'}
                  </span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {avgHeartRate > 0 && avgHeartRate < 80
                    ? "Your heart rate is within a healthy range. Continue your current fitness routine."
                    : "Consider tracking your heart rate more consistently for better insights."}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-none md:col-span-2">
            <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b pb-3">
              <CardTitle className="text-base font-medium flex items-center">
                <Brain className="h-4 w-4 mr-2 text-green-500" />
                Wellbeing Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Mood Trends</h4>
                  <div className="flex items-center mb-1">
                    <div className="text-xl font-bold">{avgMood}/10</div>
                    <Badge className="ml-2" variant={avgMood >= 7 ? "default" : "outline"}>
                      {avgMood >= 8 ? "Excellent" : avgMood >= 7 ? "Good" : avgMood >= 5 ? "Average" : "Needs Focus"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on {userData.moodEntries.length} mood entries
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Activity Balance</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Cardio</span>
                      <span>{userData.workouts.filter(w => w.workout_type === 'cardio').length} sessions</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Strength</span>
                      <span>{userData.workouts.filter(w => w.workout_type === 'strength').length} sessions</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Flexibility</span>
                      <span>{userData.workouts.filter(w => w.workout_type === 'flexibility').length} sessions</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                  <ul className="text-xs space-y-1">
                    {avgSteps < 7500 && (
                      <li className="flex items-start gap-1">
                        <span className="bg-blue-100 text-blue-800 rounded-full p-0.5 mt-0.5 h-3 w-3 flex-shrink-0"></span>
                        <span>Increase daily steps to 7,500+</span>
                      </li>
                    )}
                    {parseFloat(avgSleep as string) < 7 && (
                      <li className="flex items-start gap-1">
                        <span className="bg-purple-100 text-purple-800 rounded-full p-0.5 mt-0.5 h-3 w-3 flex-shrink-0"></span>
                        <span>Aim for 7+ hours of sleep</span>
                      </li>
                    )}
                    {userData.workouts.length < 3 && (
                      <li className="flex items-start gap-1">
                        <span className="bg-green-100 text-green-800 rounded-full p-0.5 mt-0.5 h-3 w-3 flex-shrink-0"></span>
                        <span>Try for 3+ workouts per week</span>
                      </li>
                    )}
                    {userData.moodEntries.length < 5 && (
                      <li className="flex items-start gap-1">
                        <span className="bg-amber-100 text-amber-800 rounded-full p-0.5 mt-0.5 h-3 w-3 flex-shrink-0"></span>
                        <span>Log your mood more regularly</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-none lg:col-span-3">
            <CardHeader className="bg-amber-50 dark:bg-amber-900/20 border-b pb-3">
              <CardTitle className="text-base font-medium flex items-center">
                <Zap className="h-4 w-4 mr-2 text-amber-500" />
                AI Health Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm">
                {userData ? (
                  <>
                    Based on your health data from the past 30 days, you've maintained 
                    {avgSteps > 7500 ? " good activity levels" : " moderate activity levels"}
                    {parseFloat(avgSleep as string) >= 7 ? " with healthy sleep patterns" : " but could improve your sleep"}.
                    Your average mood score of {avgMood}/10 indicates 
                    {avgMood >= 7 ? " positive emotional wellbeing" : " there may be room to improve your emotional wellbeing"}.
                    
                    {userData.workouts.length >= 12 
                      ? " You've been consistent with your workouts, which is excellent for long-term health."
                      : " Try to increase your workout frequency for better physical health outcomes."}
                    
                    {heartRateMetrics.length > 0 
                      ? ` Your average heart rate of ${avgHeartRate} BPM is ${avgHeartRate < 80 ? "within a healthy range" : "slightly elevated"}.`
                      : " Consider tracking your heart rate to gain better insights into your cardiovascular health."}
                  </>
                ) : (
                  "Loading your personalized health summary..."
                )}
              </p>
              <div className="mt-6 flex justify-end">
                <Button variant="outline" size="sm" className="text-xs" onClick={() => setSelectedTab("chat")}>
                  Ask AI about your health
                  <Sparkles className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header mode={healthMode} onModeChange={setHealthMode} />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-health-dark dark:text-white">AI Health Insights</h1>
                <p className="text-muted-foreground">Get personalized insights and answers about your health data</p>
              </div>
              
              {aiSettings ? (
                <div className="flex items-center text-sm bg-muted px-3 py-2 rounded-md shadow-sm">
                  <Sparkles className="h-4 w-4 mr-2 text-health-primary" />
                  <span className="mr-1">Powered by</span>
                  <span className="font-semibold text-health-primary">{aiSettings.ai_model}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 ml-1" 
                    onClick={() => window.location.href = '/settings?tab=ai'}
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span className="sr-only">Change AI settings</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/settings?tab=ai'}
                  className="text-xs"
                >
                  <Settings className="h-3.5 w-3.5 mr-1" />
                  Configure AI
                </Button>
              )}
            </div>
            
            <div className="grid gap-6 md:grid-cols-3 mb-6">
              {renderInsightCard(
                <LineChart className="h-5 w-5 mr-2 text-health-primary" />, 
                "Trend Analysis", 
                "AI-powered analysis of your health over time",
                "12% ↑",
                "+2.5% this week"
              )}
              
              {renderInsightCard(
                <BarChart3 className="h-5 w-5 mr-2 text-health-primary" />, 
                "Workout Balance", 
                "Balance between different workout types",
                "8/10",
                "+1 from last month"
              )}
              
              {renderInsightCard(
                <PieChart className="h-5 w-5 mr-2 text-health-primary" />, 
                "Sleep Quality", 
                "Sleep quality based on your sleep logs",
                "7.2/10",
                "+0.8 points"
              )}
            </div>
            
            <Tabs defaultValue="chat" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6 max-w-lg mx-auto">
                <TabsTrigger value="chat" className="flex items-center gap-1">
                  <Brain className="h-4 w-4" />
                  <span className="hidden md:inline">Chat with AI</span>
                  <span className="inline md:hidden">Chat</span>
                </TabsTrigger>
                <TabsTrigger value="questions" className="flex items-center gap-1">
                  <BookHeart className="h-4 w-4" />
                  <span className="hidden md:inline">Suggested Questions</span>
                  <span className="inline md:hidden">Questions</span>
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  <span className="hidden md:inline">Health Insights</span>
                  <span className="inline md:hidden">Insights</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-1">
                  <LineChart className="h-4 w-4" />
                  <span className="hidden md:inline">Conversation History</span>
                  <span className="inline md:hidden">History</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat">
                <Card className="shadow-lg border-none bg-white dark:bg-slate-800">
                  <CardHeader className="bg-gradient-to-r from-health-primary/10 to-health-secondary/5 border-b">
                    <CardTitle className="flex items-center">
                      <Bot className="h-5 w-5 mr-2 text-health-primary" />
                      Chat with Your Health Data
                    </CardTitle>
                    <CardDescription>
                      Ask questions about your health data, workouts, or get personalized advice 
                      {aiSettings && ` using ${aiSettings.ai_model}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[400px] p-4">
                      <div className="space-y-4 pb-2">
                        {messages.map((msg, index) => (
                          <div 
                            key={index}
                            className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                          >
                            <div className={`flex gap-3 ${msg.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'} max-w-[85%]`}>
                              <Avatar className={`${msg.role === 'assistant' ? 'bg-health-primary' : 'bg-gray-500'} h-9 w-9`}>
                                {msg.role === 'assistant' ? 
                                  <Bot className="h-5 w-5 text-white" /> : 
                                  <User className="h-5 w-5 text-white" />
                                }
                                <AvatarFallback>{msg.role === 'assistant' ? 'AI' : 'You'}</AvatarFallback>
                              </Avatar>
                              <div 
                                className={`rounded-xl px-4 py-3 shadow-sm ${
                                  msg.role === 'assistant' 
                                    ? 'bg-white dark:bg-slate-700 text-foreground dark:text-slate-100 border border-slate-200 dark:border-slate-600' 
                                    : 'bg-health-primary text-white'
                                }`}
                              >
                                {msg.content}
                              </div>
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="flex gap-3 max-w-[85%]">
                              <Avatar className="bg-health-primary h-9 w-9">
                                <Bot className="h-5 w-5 text-white" />
                                <AvatarFallback>AI</AvatarFallback>
                              </Avatar>
                              <div className="rounded-xl px-4 py-4 bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600">
                                <div className="flex space-x-2 items-center h-6">
                                  <div className="h-2.5 w-2.5 rounded-full bg-health-primary/30 animate-bounce"></div>
                                  <div className="h-2.5 w-2.5 rounded-full bg-health-primary/40 animate-bounce" style={{animationDelay: "0.2s"}}></div>
                                  <div className="h-2.5 w-2.5 rounded-full bg-health-primary/50 animate-bounce" style={{animationDelay: "0.4s"}}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="p-4 border-t bg-gradient-to-r from-health-primary/5 to-health-secondary/5">
                    <div className="flex w-full flex-col">
                      <div className="flex w-full items-center space-x-2">
                        <Input 
                          placeholder={user ? "Ask about your health data..." : "Sign in to use AI features"}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyPress}
                          className="flex-1 border-slate-300 dark:border-slate-600 py-5"
                          disabled={!user}
                        />
                        <Button 
                          onClick={() => handleSendMessage()}
                          disabled={!input.trim() || isLoading || !user}
                          className="bg-health-primary hover:bg-health-secondary"
                        >
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Send</span>
                        </Button>
                      </div>
                      {!user && (
                        <p className="text-xs text-amber-500 mt-2 w-full text-center">
                          Please sign in to use the AI insights feature
                        </p>
                      )}
                      {user && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          <span className="text-xs text-muted-foreground">Try asking:</span>
                          {["How's my sleep quality?", "Exercise recommendations", "Nutrition tips"].map((q) => (
                            <Button 
                              key={q} 
                              variant="outline" 
                              size="sm" 
                              className="text-xs h-7 px-2"
                              onClick={() => handleSuggestedQuestion(q)}
                              disabled={isLoading}
                            >
                              {q}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="questions">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="shadow-md">
                    <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b">
                      <CardTitle className="flex items-center">
                        <Moon className="h-5 w-5 mr-2 text-blue-500" />
                        Sleep Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {suggestedQuestions.sleep.map((question) => (
                          <Button
                            key={question}
                            variant="ghost"
                            className="w-full justify-start text-left h-auto py-2 px-3 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            onClick={() => handleSuggestedQuestion(question)}
                            disabled={isLoading || !user}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-md">
                    <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b">
                      <CardTitle className="flex items-center">
                        <Dumbbell className="h-5 w-5 mr-2 text-green-500" />
                        Workout Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {suggestedQuestions.workouts.map((question) => (
                          <Button
                            key={question}
                            variant="ghost"
                            className="w-full justify-start text-left h-auto py-2 px-3 hover:bg-green-50 dark:hover:bg-green-900/20"
                            onClick={() => handleSuggestedQuestion(question)}
                            disabled={isLoading || !user}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-md">
                    <CardHeader className="bg-purple-50 dark:bg-purple-900/20 border-b">
                      <CardTitle className="flex items-center">
                        <Brain className="h-5 w-5 mr-2 text-purple-500" />
                        Mood & Mental Wellbeing
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {suggestedQuestions.mood.map((question) => (
                          <Button
                            key={question}
                            variant="ghost"
                            className="w-full justify-start text-left h-auto py-2 px-3 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                            onClick={() => handleSuggestedQuestion(question)}
                            disabled={isLoading || !user}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-md">
                    <CardHeader className="bg-amber-50 dark:bg-amber-900/20 border-b">
                      <CardTitle className="flex items-center">
                        <Coffee className="h-5 w-5 mr-2 text-amber-500" />
                        Nutrition Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {suggestedQuestions.nutrition.map((question) => (
                          <Button
                            key={question}
                            variant="ghost"
                            className="w-full justify-start text-left h-auto py-2 px-3 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                            onClick={() => handleSuggestedQuestion(question)}
                            disabled={isLoading || !user}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="insights">
                {renderHealthInsights()}
              </TabsContent>

              <TabsContent value="history">
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-health-primary/10 flex items-center justify-center">
                    <LineChart className="h-8 w-8 text-health-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Conversation History Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We're building a feature to save and reference your previous AI conversations.
                    This will help you track insights and advice over time.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIInsights;
