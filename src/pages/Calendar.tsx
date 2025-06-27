import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ActivityList } from "@/components/health/ActivityList";
import { ActivityForm } from "@/components/health/ActivityForm";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { initNotifications } from "@/services/notifications";
import { Plus } from "lucide-react";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [healthMode, setHealthMode] = useState<"physical" | "mental">("physical");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
  
  // Initialize notifications when component mounts
  useEffect(() => {
    initNotifications();
  }, []);
  
  // Reset date to today if it's not set
  useEffect(() => {
    if (!date) {
      setDate(new Date());
    }
  }, [date]);
  
  const handleActivityChange = () => {
    // This would fetch and refresh highlighted dates with activities
    // Placeholder for now - actual implementation would query the API
    console.log("Activity change detected - should refresh highlighted dates");
  };
  
  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header mode={healthMode} onModeChange={setHealthMode} />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-health-dark dark:text-white">Health Calendar</h1>
              
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    New Activity
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogTitle>Schedule New Activity</DialogTitle>
                  <DialogDescription>
                    Add a new health activity to your calendar.
                  </DialogDescription>
                  <ActivityForm 
                    onSave={() => {
                      setIsFormOpen(false);
                      handleActivityChange();
                    }} 
                    onCancel={() => setIsFormOpen(false)} 
                  />
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle>Schedule Your Health Activities</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center pb-6">
                    <CalendarComponent 
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      className="rounded-md border shadow-sm p-3"
                      // Future enhancement: Highlight dates with activities
                      modifiers={{
                        highlighted: highlightedDates,
                      }}
                      modifiersClassNames={{
                        highlighted: "bg-primary/20",
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                {date && (
                  <ActivityList 
                    date={date} 
                    onActivityChange={handleActivityChange} 
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Calendar;
