import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { HealthActivity } from "@/types/health-activities";
import { getActivitiesForDay, deleteHealthActivity } from "@/services/health-activities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash, Edit, Clock, CalendarIcon, Bell } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { ActivityForm } from "./ActivityForm";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface ActivityListProps {
  date: Date;
  onActivityChange: () => void;
}

export function ActivityList({ date, onActivityChange }: ActivityListProps) {
  const [activities, setActivities] = useState<HealthActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState<HealthActivity | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, [date]);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const activities = await getActivitiesForDay(date);
      
      // Sort activities by start time
      const sortedActivities = activities.sort((a, b) => {
        const aTime = new Date(a.start_time).getTime();
        const bTime = new Date(b.start_time).getTime();
        return aTime - bTime;
      });
      
      setActivities(sortedActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast({
        title: "Error",
        description: "Failed to load activities for this day.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      try {
        await deleteHealthActivity(id);
        toast({
          title: "Activity deleted",
          description: "The activity has been deleted."
        });
        fetchActivities();
        onActivityChange();
      } catch (error) {
        console.error("Error deleting activity:", error);
        toast({
          title: "Error",
          description: "Failed to delete the activity.",
          variant: "destructive"
        });
      }
    }
  };

  const handleEditActivity = (activity: HealthActivity) => {
    setEditingActivity(activity);
    setIsFormOpen(true);
  };

  const handleAddActivity = () => {
    setEditingActivity(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingActivity(null);
  };

  const handleFormSave = () => {
    setIsFormOpen(false);
    setEditingActivity(null);
    fetchActivities();
    onActivityChange();
  };

  const formatTime = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "h:mm a");
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'workout':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 'meditation':
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case 'medication':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 'doctor_appointment':
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case 'therapy_session':
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
      case 'water_intake':
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300";
      case 'sleep':
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const formatActivityType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{format(date, "MMMM d, yyyy")}</CardTitle>
          <CardDescription>
            {activities.length === 0 && !isLoading 
              ? 'No activities scheduled for this day' 
              : `${activities.length} ${activities.length === 1 ? 'activity' : 'activities'} scheduled`}
          </CardDescription>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddActivity} className="text-xs h-8 px-2">
              + Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogTitle>{editingActivity ? "Edit Activity" : "Add New Activity"}</DialogTitle>
            <DialogDescription>
              {editingActivity 
                ? "Update your scheduled health activity." 
                : "Schedule a new health activity for this day."}
            </DialogDescription>
            <ActivityForm 
              activity={editingActivity || undefined} 
              onSave={handleFormSave} 
              onCancel={handleFormClose} 
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-6 text-center text-muted-foreground">Loading activities...</div>
        ) : activities.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            No events scheduled for this day. Click the "+ Add Activity" button to add an activity.
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {activities.map((activity) => (
                <Card key={activity.id} className="relative overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${getActivityTypeColor(activity.activity_type)}`} />
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{activity.title}</CardTitle>
                      <Badge variant="outline" className={`ml-2 ${getActivityTypeColor(activity.activity_type)}`}>
                        {formatActivityType(activity.activity_type)}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {activity.all_day 
                        ? "All day" 
                        : `${formatTime(activity.start_time)}${activity.end_time ? ` - ${formatTime(activity.end_time)}` : ""}`}
                        
                      {activity.recurring && (
                        <Badge variant="outline" className="ml-2">
                          Recurring
                        </Badge>
                      )}
                      
                      {activity.reminder_time && (
                        <div className="flex items-center ml-2 text-amber-600 dark:text-amber-400">
                          <Bell className="h-3 w-3 mr-1" />
                          <span>Reminder set</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  {activity.description && (
                    <CardContent className="pb-2">
                      <p className="text-sm">{activity.description}</p>
                    </CardContent>
                  )}
                  <CardFooter className="flex justify-end space-x-2 pt-0">
                    <Button variant="ghost" size="sm" onClick={() => handleEditActivity(activity)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteActivity(activity.id)}>
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
} 