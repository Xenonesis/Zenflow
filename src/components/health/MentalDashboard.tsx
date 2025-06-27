import { useState } from "react";
import { WelcomeSection } from "./WelcomeSection";
import { MoodTracker } from "./mental/MoodTracker";
import { SelfCareLog } from "./mental/SelfCareLog";
import { MeditationLog } from "./mental/MeditationLog";
import { JournalLog } from "./mental/JournalLog";
import { ExerciseLog } from "./mental/ExerciseLog";
import { SleepLog } from "./mental/SleepLog";
import { WellnessCharts } from "./mental/WellnessCharts";
import { UserDataCard } from "./UserDataCard";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Plus, 
  BarChart3, 
  ListFilter, 
  ChevronDown, 
  Brain, 
  Smile, 
  BookOpen 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MentalDashboard() {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year">("week");

  return (
    <div className="space-y-8 animate-fade-in">
      <WelcomeSection />
      
      <section className="space-y-6 mt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="h-1.5 w-6 bg-mental-primary rounded-full"></div>
            <h2 className="text-2xl font-bold">Mental Wellbeing</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1 text-muted-foreground">
                  <ListFilter className="h-4 w-4" />
                  <span>{timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setTimeRange("day")}>
                    Day
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeRange("week")}>
                    Week
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeRange("month")}>
                    Month
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeRange("year")}>
                    Year
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button size="sm" className="gap-1 h-8 bg-mental-primary hover:bg-mental-primary/90">
              <Plus className="h-4 w-4" />
              <span>Log Mood</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-6 bg-muted/50">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-mental-primary/10 data-[state=active]:text-mental-primary">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="journal" className="data-[state=active]:bg-mental-primary/10 data-[state=active]:text-mental-primary">
              <BookOpen className="h-4 w-4 mr-2" />
              Journal
            </TabsTrigger>
            <TabsTrigger value="mindfulness" className="data-[state=active]:bg-mental-primary/10 data-[state=active]:text-mental-primary">
              <Brain className="h-4 w-4 mr-2" />
              Mindfulness
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6 mt-0">
            {/* Top row */}
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-mental-primary/10 to-mental-secondary/5 rounded-xl p-4 shadow-sm border border-mental-primary/10 transition-all hover:shadow-md">
                <MoodTracker timeRange={timeRange} />
              </Card>
              <Card className="bg-gradient-to-br from-mental-secondary/10 to-mental-primary/5 rounded-xl p-4 shadow-sm border border-mental-secondary/10 transition-all hover:shadow-md">
                <SelfCareLog timeRange={timeRange} />
              </Card>
            </div>

            {/* Middle row */}
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-blue-100/50 to-blue-50/50 rounded-xl p-4 shadow-sm border border-blue-200/30 transition-all hover:shadow-md">
                <MeditationLog timeRange={timeRange} />
              </Card>
              <Card className="bg-gradient-to-br from-yellow-100/50 to-yellow-50/50 rounded-xl p-4 shadow-sm border border-yellow-200/30 transition-all hover:shadow-md">
                <JournalLog timeRange={timeRange} />
              </Card>
            </div>

            {/* Bottom row */}
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-pink-100/50 to-pink-50/50 rounded-xl p-4 shadow-sm border border-pink-200/30 transition-all hover:shadow-md">
                <ExerciseLog timeRange={timeRange} />
              </Card>
              <Card className="bg-gradient-to-br from-indigo-100/50 to-indigo-50/50 rounded-xl p-4 shadow-sm border border-indigo-200/30 transition-all hover:shadow-md">
                <SleepLog timeRange={timeRange} />
              </Card>
            </div>

            {/* User Data */}
            <Card className="bg-white dark:bg-slate-800/80 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md animate-fade-in" style={{ animationDelay: "150ms" }}>
              <UserDataCard />
            </Card>

            {/* Wellness Charts */}
            <Card className="bg-white dark:bg-slate-800/80 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md">
              <WellnessCharts timeRange={timeRange} />
            </Card>
          </TabsContent>
          
          <TabsContent value="journal">
            <Card className="bg-white dark:bg-slate-800/80 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center">
              <BookOpen className="h-16 w-16 mb-4 text-mental-primary/20" />
              <h3 className="text-xl font-semibold mb-2">Journaling Practice</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Record your thoughts, emotions, and reflections to improve self-awareness and emotional well-being.
              </p>
              <Button className="bg-mental-primary hover:bg-mental-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                New Journal Entry
              </Button>
            </Card>
          </TabsContent>
          
          <TabsContent value="mindfulness">
            <Card className="bg-white dark:bg-slate-800/80 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center">
              <Brain className="h-16 w-16 mb-4 text-mental-primary/20" />
              <h3 className="text-xl font-semibold mb-2">Mindfulness Practices</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Access guided meditations, breathing exercises, and mindfulness sessions to reduce stress and improve focus.
              </p>
              <Button className="bg-mental-primary hover:bg-mental-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Begin Meditation
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
