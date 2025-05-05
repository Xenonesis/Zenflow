
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { WorkoutHistory } from "@/components/health/physical/WorkoutHistory";
import { MoodTracker } from "@/components/health/mental/MoodTracker";

const History = () => {
  const [healthMode, setHealthMode] = useState<"physical" | "mental">("physical");

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header mode={healthMode} onModeChange={setHealthMode} />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl animate-fade-in">
            <h1 className="text-2xl font-bold text-health-dark dark:text-white mb-6">History</h1>
            
            <Tabs defaultValue="workouts" className="space-y-4">
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
                <Card>
                  <CardHeader>
                    <CardTitle>Health Metrics Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Your health metrics history will be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default History;
