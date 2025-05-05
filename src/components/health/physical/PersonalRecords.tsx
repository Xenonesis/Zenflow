import { useEffect, useState } from "react";
import { Award } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { userData } from "@/lib/supabase";

export function PersonalRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadRecords() {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await userData.getUserProfile(user.id);
        
        if (error) {
          console.error('Error loading profile:', error);
          return;
        }
        
        if (data && data.preferences && data.preferences.personal_records) {
          setRecords(data.preferences.personal_records);
        } else {
          // Use default records if none are set
          setRecords({
            "Bench Press": "0 kg",
            "Squat": "0 kg",
            "Deadlift": "0 kg",
            "Running": "0 min/km",
            "Plank": "0 sec"
          });
        }
      } catch (err) {
        console.error('Failed to load records:', err);
      } finally {
        setLoading(false);
      }
    }

    loadRecords();
  }, [user]);

  if (loading) {
    return (
      <div>
        <h3 className="text-lg font-medium flex items-center mb-3">
          <Award className="mr-1 h-5 w-5 text-amber-500" />
          Personal Records
        </h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium flex items-center mb-3">
        <Award className="mr-1 h-5 w-5 text-amber-500" />
        Personal Records
      </h3>
      <div className="space-y-1">
        {Object.entries(records).map(([exercise, record]) => (
          <div key={exercise} className="flex justify-between">
            <span className="text-sm">{exercise}</span>
            <span className="text-sm font-medium">{record}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
