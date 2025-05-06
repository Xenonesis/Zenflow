import { useState } from "react";
import { WelcomeSection } from "./WelcomeSection";
import { WorkoutHistory } from "./physical/WorkoutHistory";
import { PersonalRecords } from "./physical/PersonalRecords";
import { ProgressCharts } from "./physical/ProgressCharts";
import { AchievementBadges } from "./physical/AchievementBadges";
import { UserDataCard } from "./UserDataCard";
import { HealthStatistics } from "./physical/HealthStatistics";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, BarChart3, ListFilter, ChevronDown, Calendar, Dumbbell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PhysicalDashboard() {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year">("week");

  return (
    <div className="space-y-8 animate-fade-in">
      <WelcomeSection />
      
      <section className="space-y-6 mt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="h-1.5 w-6 bg-health-primary rounded-full"></div>
            <h2 className="text-2xl font-bold">Physical Health</h2>
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
            
            <Button size="sm" className="gap-1 h-8 bg-health-primary hover:bg-health-primary/90">
              <Plus className="h-4 w-4" />
              <span>Add Workout</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-6 bg-muted/50">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-health-primary/10 data-[state=active]:text-health-primary">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="workouts" className="data-[state=active]:bg-health-primary/10 data-[state=active]:text-health-primary">
              <Dumbbell className="h-4 w-4 mr-2" />
              Workouts
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-health-primary/10 data-[state=active]:text-health-primary">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6 mt-0">
            {/* Health Statistics */}
            <Card className="bg-white dark:bg-slate-800/80 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md animate-fade-in">
              <HealthStatistics timeRange={timeRange} />
            </Card>

            {/* Top row */}
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-health-primary/10 to-health-secondary/5 rounded-xl p-4 shadow-sm border border-health-primary/10 transition-all hover:shadow-md animate-fade-in">
                <PersonalRecords timeRange={timeRange} />
              </Card>
              <Card className="bg-gradient-to-br from-health-secondary/10 to-health-primary/5 rounded-xl p-4 shadow-sm border border-health-secondary/10 transition-all hover:shadow-md animate-fade-in" style={{ animationDelay: "100ms" }}>
                <AchievementBadges />
              </Card>
            </div>

            {/* User Data Card */}
            <Card className="bg-white dark:bg-slate-800/80 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md animate-fade-in" style={{ animationDelay: "150ms" }}>
              <UserDataCard />
            </Card>

            {/* Middle row - charts */}
            <Card className="bg-white dark:bg-slate-800/80 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md animate-fade-in" style={{ animationDelay: "200ms" }}>
              <ProgressCharts timeRange={timeRange} />
            </Card>

            {/* Bottom row - history */}
            <Card className="bg-white dark:bg-slate-800/80 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md animate-fade-in" style={{ animationDelay: "300ms" }}>
              <WorkoutHistory timeRange={timeRange} />
            </Card>
          </TabsContent>
          
          <TabsContent value="workouts">
            <Card className="bg-white dark:bg-slate-800/80 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center">
              <Dumbbell className="h-16 w-16 mb-4 text-health-primary/20" />
              <h3 className="text-xl font-semibold mb-2">Workout Library</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Access your custom workouts, templates, and exercises all in one place.
              </p>
              <Button className="bg-health-primary hover:bg-health-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Create New Workout
              </Button>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule">
            <Card className="bg-white dark:bg-slate-800/80 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center">
              <Calendar className="h-16 w-16 mb-4 text-health-primary/20" />
              <h3 className="text-xl font-semibold mb-2">Training Schedule</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Plan your workout schedule, set reminders, and track your consistency.
              </p>
              <Button className="bg-health-primary hover:bg-health-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Workout
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
