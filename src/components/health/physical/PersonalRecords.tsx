import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight, Plus, CalendarDays, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PersonalRecordsProps {
  timeRange: "day" | "week" | "month" | "year";
}

export function PersonalRecords({ timeRange }: PersonalRecordsProps) {
  const [records, setRecords] = useState([
    {
      id: 1,
      exercise: "Bench Press",
      value: "185",
      unit: "lbs",
      date: "2 days ago",
      isRecent: true
    },
    {
      id: 2,
      exercise: "5K Run",
      value: "23:15",
      unit: "min",
      date: "last week",
      isRecent: false
    },
    {
      id: 3,
      exercise: "Deadlift",
      value: "315",
      unit: "lbs",
      date: "3 days ago",
      isRecent: true
    },
    {
      id: 4,
      exercise: "Swimming",
      value: "1000",
      unit: "m",
      date: "yesterday",
      isRecent: true
    },
    {
      id: 5,
      exercise: "Plank",
      value: "3:05",
      unit: "min",
      date: "today",
      isRecent: true
    }
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-health-primary" />
          <h3 className="text-lg font-semibold">Personal Records</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-xs h-8 px-2 gap-1">
          <Plus className="h-3.5 w-3.5" />
          Add Record
        </Button>
      </div>

      <div className="space-y-3">
        {records.slice(0, 5).map(record => (
          <div 
            key={record.id} 
            className="flex items-center justify-between p-3 bg-white dark:bg-gray-800/60 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-health-primary/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-health-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">{record.exercise}</h4>
                <div className="flex items-center mt-0.5">
                  <span className="text-lg font-bold">{record.value}</span>
                  <span className="text-xs ml-1 text-muted-foreground">{record.unit}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarDays className="h-3 w-3 mr-1" />
                {record.date}
              </div>
              {record.isRecent && (
                <Badge variant="outline" className="mt-1 bg-green-50 border-green-200 text-green-700 text-[10px] py-0 px-1.5">
                  Recent PR
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <Button variant="ghost" size="sm" className="text-health-primary text-xs">
          View All Records
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
