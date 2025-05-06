import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState, useEffect, Suspense, lazy } from "react";
import { WorkoutHistory } from "@/components/health/physical/WorkoutHistory";
import { MoodTracker } from "@/components/health/mental/MoodTracker";
import { useAuth } from "@/lib/auth-context";
import { prefetchHealthData } from "@/hooks/useHealthData";
import { Skeleton } from "@/components/ui/skeleton";
import queryClient from "@/lib/query-client";

// Lazy load components that aren't immediately visible
const LazyHealthMetrics = lazy(() => import("@/components/health/metrics/HealthMetrics").then(
  module => ({ default: module.HealthMetrics })
));

// Skeleton loaders for lazy-loaded components
const MetricsSkeleton = () => (
  <Card>
    <CardHeader>
      <CardTitle>Health Metrics Over Time</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </CardContent>
  </Card>
);

const History = () => {
  const [healthMode, setHealthMode] = useState<"physical" | "mental">("physical");
  const [activeTab, setActiveTab] = useState("workouts");
  const { user } = useAuth();
  
  // Prefetch data when the component mounts
  useEffect(() => {
    if (user?.id) {
      // Pass the shared queryClient explicitly to avoid hooks issues
      prefetchHealthData(user.id, queryClient);
    }
  }, [user?.id]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header mode={healthMode} onModeChange={setHealthMode} />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl animate-fade-in">
            <h1 className="text-2xl font-bold text-health-dark dark:text-white mb-6">History</h1>
            
            <Tabs 
              defaultValue="workouts" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList>
                <TabsTrigger value="workouts">Workout History</TabsTrigger>
                <TabsTrigger value="moods">Mood History</TabsTrigger>
                <TabsTrigger value="metrics">Health Metrics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="workouts" className="space-y-4">
                <WorkoutHistory />
              </TabsContent>
              
              <TabsContent value="moods" className="space-y-4">
                <MoodTracker />
              </TabsContent>
              
              <TabsContent value="metrics" className="space-y-4">
                <Suspense fallback={<MetricsSkeleton />}>
                  {activeTab === "metrics" && <LazyHealthMetrics />}
                </Suspense>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default History;
