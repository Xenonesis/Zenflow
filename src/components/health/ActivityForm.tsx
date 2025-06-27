import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format, parseISO, set } from "date-fns";
import { cn } from "@/lib/utils";
import { HealthActivity, CreateHealthActivityParams, ActivityType } from "@/types/health-activities";
import { createHealthActivity, updateHealthActivity } from "@/services/health-activities";
import { toast } from "@/components/ui/use-toast";

// Time picker options
const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = [0, 15, 30, 45];

interface ActivityFormProps {
  activity?: HealthActivity;
  onSave: () => void;
  onCancel: () => void;
}

export function ActivityForm({ activity, onSave, onCancel }: ActivityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(activity?.title || "");
  const [description, setDescription] = useState(activity?.description || "");
  const [activityType, setActivityType] = useState<ActivityType>(activity?.activity_type || "workout");
  const [startDate, setStartDate] = useState<Date | undefined>(
    activity?.start_time ? parseISO(activity.start_time) : new Date()
  );
  const [startTime, setStartTime] = useState({
    hours: activity?.start_time ? parseISO(activity.start_time).getHours() : new Date().getHours(),
    minutes: activity?.start_time ? Math.floor(parseISO(activity.start_time).getMinutes() / 15) * 15 : 0
  });
  const [endDate, setEndDate] = useState<Date | undefined>(
    activity?.end_time ? parseISO(activity.end_time) : undefined
  );
  const [endTime, setEndTime] = useState({
    hours: activity?.end_time ? parseISO(activity.end_time).getHours() : new Date().getHours() + 1,
    minutes: activity?.end_time ? Math.floor(parseISO(activity.end_time).getMinutes() / 15) * 15 : 0
  });
  const [allDay, setAllDay] = useState(activity?.all_day || false);
  const [recurring, setRecurring] = useState(activity?.recurring || false);
  const [reminderDate, setReminderDate] = useState<Date | undefined>(
    activity?.reminder_time ? parseISO(activity.reminder_time) : undefined
  );
  const [reminderTime, setReminderTime] = useState({
    hours: activity?.reminder_time ? parseISO(activity.reminder_time).getHours() : new Date().getHours(),
    minutes: activity?.reminder_time ? Math.floor(parseISO(activity.reminder_time).getMinutes() / 15) * 15 : 0
  });
  const [notes, setNotes] = useState(activity?.notes || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !startDate) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare dates
      const fullStartTime = startDate 
        ? set(startDate, { hours: startTime.hours, minutes: startTime.minutes, seconds: 0, milliseconds: 0 })
        : undefined;
        
      const fullEndTime = endDate 
        ? set(endDate, { hours: endTime.hours, minutes: endTime.minutes, seconds: 0, milliseconds: 0 })
        : undefined;
        
      const fullReminderTime = reminderDate 
        ? set(reminderDate, { hours: reminderTime.hours, minutes: reminderTime.minutes, seconds: 0, milliseconds: 0 })
        : undefined;
      
      const activityData: CreateHealthActivityParams = {
        title,
        description,
        activity_type: activityType,
        start_time: fullStartTime?.toISOString() || new Date().toISOString(),
        end_time: fullEndTime?.toISOString(),
        all_day: allDay,
        recurring,
        reminder_time: fullReminderTime?.toISOString(),
        notes
      };
      
      if (activity?.id) {
        await updateHealthActivity({ id: activity.id, ...activityData });
        toast({
          title: "Activity updated",
          description: "Your health activity has been updated."
        });
      } else {
        await createHealthActivity(activityData);
        toast({
          title: "Activity scheduled",
          description: "Your new health activity has been scheduled."
        });
      }
      
      onSave();
    } catch (error) {
      console.error("Error saving activity:", error);
      toast({
        title: "Error",
        description: "There was an error saving your activity. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Activity title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Activity description"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="activity-type">Activity Type *</Label>
            <Select value={activityType} onValueChange={(value) => setActivityType(value as ActivityType)}>
              <SelectTrigger id="activity-type">
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="workout">Workout</SelectItem>
                <SelectItem value="meditation">Meditation</SelectItem>
                <SelectItem value="medication">Medication</SelectItem>
                <SelectItem value="doctor_appointment">Doctor Appointment</SelectItem>
                <SelectItem value="therapy_session">Therapy Session</SelectItem>
                <SelectItem value="water_intake">Water Intake</SelectItem>
                <SelectItem value="sleep">Sleep</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="all-day" 
              checked={allDay} 
              onCheckedChange={setAllDay} 
            />
            <Label htmlFor="all-day">All Day Activity</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            
            {!allDay && (
              <div className="space-y-2">
                <Label>Start Time</Label>
                <div className="flex space-x-2">
                  <Select 
                    value={startTime.hours.toString()}
                    onValueChange={(value) => setStartTime({ ...startTime, hours: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="HH" />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map((hour) => (
                        <SelectItem key={hour} value={hour.toString()}>
                          {hour.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <span className="flex items-center">:</span>
                  
                  <Select 
                    value={startTime.minutes.toString()}
                    onValueChange={(value) => setStartTime({ ...startTime, minutes: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {minutes.map((minute) => (
                        <SelectItem key={minute} value={minute.toString()}>
                          {minute.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            
            {!allDay && endDate && (
              <div className="space-y-2">
                <Label>End Time</Label>
                <div className="flex space-x-2">
                  <Select 
                    value={endTime.hours.toString()}
                    onValueChange={(value) => setEndTime({ ...endTime, hours: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="HH" />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map((hour) => (
                        <SelectItem key={hour} value={hour.toString()}>
                          {hour.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <span className="flex items-center">:</span>
                  
                  <Select 
                    value={endTime.minutes.toString()}
                    onValueChange={(value) => setEndTime({ ...endTime, minutes: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {minutes.map((minute) => (
                        <SelectItem key={minute} value={minute.toString()}>
                          {minute.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="recurring" 
              checked={recurring} 
              onCheckedChange={setRecurring} 
            />
            <Label htmlFor="recurring">Recurring Activity</Label>
          </div>
          
          <div className="space-y-2">
            <Label>Set Reminder</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !reminderDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {reminderDate ? format(reminderDate, "PPP") : "Reminder date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={reminderDate} onSelect={setReminderDate} initialFocus />
                </PopoverContent>
              </Popover>
              
              {reminderDate && (
                <div className="flex space-x-2">
                  <Select 
                    value={reminderTime.hours.toString()}
                    onValueChange={(value) => setReminderTime({ ...reminderTime, hours: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="HH" />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map((hour) => (
                        <SelectItem key={hour} value={hour.toString()}>
                          {hour.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <span className="flex items-center">:</span>
                  
                  <Select 
                    value={reminderTime.minutes.toString()}
                    onValueChange={(value) => setReminderTime({ ...reminderTime, minutes: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {minutes.map((minute) => (
                        <SelectItem key={minute} value={minute.toString()}>
                          {minute.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Additional notes"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2 pt-0">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : activity ? "Update Activity" : "Schedule Activity"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 