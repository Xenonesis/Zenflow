import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Dumbbell, 
  Flame, 
  Heart, 
  MoreHorizontal,
  ArrowUpRight 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

interface WorkoutHistoryProps {
  timeRange: "day" | "week" | "month" | "year";
}

export function WorkoutHistory({ timeRange }: WorkoutHistoryProps) {
  const [activeTab, setActiveTab] = useState("recent");
  
  const workouts = [
    {
      id: 1,
      type: "Strength",
      name: "Upper Body Focus",
      date: "Today, 8:30 AM",
      duration: "48 min",
      calories: 320,
      intensity: "Medium",
      heartRate: 142,
    },
    {
      id: 2,
      type: "Cardio",
      name: "Morning Run",
      date: "Yesterday, 6:15 AM",
      duration: "32 min",
      calories: 285,
      intensity: "High",
      heartRate: 156,
    },
    {
      id: 3,
      type: "Flexibility",
      name: "Yoga Flow",
      date: "2 days ago, 7:30 PM",
      duration: "45 min",
      calories: 180,
      intensity: "Low",
      heartRate: 98,
    },
    {
      id: 4,
      type: "Strength",
      name: "Lower Body",
      date: "3 days ago, 5:45 PM",
      duration: "55 min",
      calories: 390,
      intensity: "High",
      heartRate: 148,
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Strength":
        return <Dumbbell className="h-4 w-4" />;
      case "Cardio":
        return <Heart className="h-4 w-4" />;
      case "Flexibility":
        return <ArrowUpRight className="h-4 w-4" />;
      default:
        return <Dumbbell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Strength":
        return "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800";
      case "Cardio":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      case "Flexibility":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BarChart className="mr-2 h-5 w-5 text-health-primary" />
          <h3 className="text-lg font-semibold">Workout History</h3>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="h-8">
            <TabsTrigger value="recent" className="text-xs h-8">Recent</TabsTrigger>
            <TabsTrigger value="calendar" className="text-xs h-8">Calendar</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <TabsContent value="recent" className="mt-0 space-y-4">
        <div className="space-y-3">
          {workouts.map(workout => (
            <div 
              key={workout.id}
              className="bg-white dark:bg-gray-800/60 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className={`px-2 py-1 ${getTypeColor(workout.type)}`}>
                      {getTypeIcon(workout.type)}
                      <span className="ml-1 text-xs">{workout.type}</span>
                    </Badge>
                    <div>
                      <h4 className="font-medium">{workout.name}</h4>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{workout.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Edit workout</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                  <div className="flex items-center text-sm">
                    <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <span>{workout.duration}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Flame className="h-3.5 w-3.5 mr-1 text-orange-500" />
                    <span>{workout.calories} cal</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Heart className="h-3.5 w-3.5 mr-1 text-red-500" />
                    <span>{workout.heartRate} bpm</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <Button variant="ghost" size="sm" className="text-health-primary text-xs">
            View Workout History
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="calendar" className="mt-0">
        <div className="flex items-center justify-center p-8 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-medium mb-2">Workout Calendar</h3>
            <p className="text-muted-foreground max-w-sm mb-4">
              Track your workouts over time and identify patterns in your training schedule.
            </p>
            <Button className="bg-health-primary hover:bg-health-primary/90">View Calendar</Button>
          </div>
        </div>
      </TabsContent>
    </div>
  );
}
