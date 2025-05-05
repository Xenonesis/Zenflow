import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MentalDashboard } from "@/components/health/MentalDashboard";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  SmilePlus, 
  Sparkles, 
  Dumbbell, 
  Coffee, 
  Bed, 
  Brain,
  BookOpen
} from "lucide-react";
import { MoodEntryForm } from "@/components/health/forms/MoodEntryForm";
import { SelfCareActivityForm } from "@/components/health/forms/SelfCareActivityForm";
import { MeditationForm } from "@/components/health/forms/MeditationForm";
import { JournalEntryForm } from "@/components/health/forms/JournalEntryForm";
import { ExerciseLogForm } from "@/components/health/forms/ExerciseLogForm";
import { SleepLogForm } from "@/components/health/forms/SleepLogForm";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

const MentalHealth = () => {
  const [healthMode, setHealthMode] = useState<"physical" | "mental">("mental");
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const { toast } = useToast();

  // Quick actions for mental health
  const quickActions = [
    { id: "mood", icon: SmilePlus, label: "Log Mood", color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
    { id: "selfcare", icon: Coffee, label: "Self-Care", color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
    { id: "meditation", icon: Brain, label: "Meditation", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
    { id: "journal", icon: BookOpen, label: "Journal", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
    { id: "exercise", icon: Dumbbell, label: "Exercise", color: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300" },
    { id: "sleep", icon: Bed, label: "Sleep Log", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300" },
  ];

  const handleCardClick = (id: string) => {
    setActiveForm(id);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header mode={healthMode} onModeChange={setHealthMode} />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl font-bold text-health-dark dark:text-white">Mental Wellness</h1>
              <Button className="mt-2 md:mt-0 bg-health-mental hover:bg-orange-600 transition-colors flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Get Personalized Insights
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              {quickActions.map((action) => (
                <Card 
                  key={action.id} 
                  className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
                  onClick={() => handleCardClick(action.id)}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className={`rounded-full p-3 mb-2 ${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium">{action.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <MentalDashboard />
          </div>
        </main>
      </div>

      {/* Form modals */}
      <MoodEntryForm 
        open={activeForm === "mood"} 
        onOpenChange={(open) => {
          if (!open) setActiveForm(null);
        }}
      />
      
      <SelfCareActivityForm 
        open={activeForm === "selfcare"} 
        onOpenChange={(open) => {
          if (!open) setActiveForm(null);
        }}
      />

      <MeditationForm 
        open={activeForm === "meditation"} 
        onOpenChange={(open) => {
          if (!open) setActiveForm(null);
        }}
      />

      <JournalEntryForm 
        open={activeForm === "journal"} 
        onOpenChange={(open) => {
          if (!open) setActiveForm(null);
        }}
      />

      <ExerciseLogForm 
        open={activeForm === "exercise"} 
        onOpenChange={(open) => {
          if (!open) setActiveForm(null);
        }}
      />

      <SleepLogForm 
        open={activeForm === "sleep"} 
        onOpenChange={(open) => {
          if (!open) setActiveForm(null);
        }}
      />

      <Toaster />
    </div>
  );
};

export default MentalHealth;
