import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { WorkoutForm } from "@/components/health/physical/WorkoutForm";
import { WorkoutList } from "@/components/health/physical/WorkoutList";
import { WorkoutPlanForm } from "@/components/health/physical/WorkoutPlanForm";
import { WorkoutPlanList } from "@/components/health/physical/WorkoutPlanList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Workouts = () => {
  const [healthMode, setHealthMode] = useState<"physical" | "mental">("physical");
  const [isCreateWorkoutOpen, setIsCreateWorkoutOpen] = useState(false);
  const [isCreateWorkoutPlanOpen, setIsCreateWorkoutPlanOpen] = useState(false);
  const [refreshWorkoutList, setRefreshWorkoutList] = useState(0);
  const [refreshWorkoutPlanList, setRefreshWorkoutPlanList] = useState(0);

  const handleWorkoutAdded = () => {
    // Trigger a refresh of the workout list
    setRefreshWorkoutList(prev => prev + 1);
  };

  const handleWorkoutPlanAdded = () => {
    // Trigger a refresh of the workout plan list
    setRefreshWorkoutPlanList(prev => prev + 1);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header mode={healthMode} onModeChange={setHealthMode} />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-health-dark dark:text-white">Workouts</h1>
              <div className="flex gap-2">
                <Button onClick={() => setIsCreateWorkoutPlanOpen(true)} variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Workout Plan
                </Button>
                <Button onClick={() => setIsCreateWorkoutOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Log Workout
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="my-workouts" className="space-y-6">
              <TabsList className="mb-4">
                <TabsTrigger value="my-workouts">My Workouts</TabsTrigger>
                <TabsTrigger value="my-plans">My Plans</TabsTrigger>
              </TabsList>
              
              <TabsContent value="my-workouts" className="space-y-6">
                <WorkoutList key={refreshWorkoutList} />
              </TabsContent>
              
              <TabsContent value="my-plans" className="space-y-6">
                <WorkoutPlanList key={refreshWorkoutPlanList} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      <WorkoutForm 
        open={isCreateWorkoutOpen} 
        onOpenChange={setIsCreateWorkoutOpen} 
        onWorkoutAdded={handleWorkoutAdded}
      />
      
      <WorkoutPlanForm
        open={isCreateWorkoutPlanOpen}
        onOpenChange={setIsCreateWorkoutPlanOpen}
        onWorkoutPlanAdded={handleWorkoutPlanAdded}
      />
    </div>
  );
};

export default Workouts;
