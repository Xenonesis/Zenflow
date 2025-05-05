import { WelcomeSection } from "./WelcomeSection";
import { MoodTracker } from "./mental/MoodTracker";
import { SelfCareLog } from "./mental/SelfCareLog";
import { MeditationLog } from "./mental/MeditationLog";
import { JournalLog } from "./mental/JournalLog";
import { ExerciseLog } from "./mental/ExerciseLog";
import { SleepLog } from "./mental/SleepLog";
import { WellnessCharts } from "./mental/WellnessCharts";
import { UserDataCard } from "./UserDataCard";

export function MentalDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <WelcomeSection />
      
      <section className="space-y-6 mt-6">
        <div className="flex items-center space-x-2 mb-2">
          <div className="h-1.5 w-6 bg-mental-primary rounded-full"></div>
          <h2 className="text-2xl font-bold">Mental Wellbeing</h2>
        </div>

        <div className="grid gap-4 md:gap-6">
          {/* Top row */}
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
            <div className="bg-gradient-to-br from-mental-primary/10 to-mental-secondary/5 rounded-xl p-4 shadow-sm border border-mental-primary/10 transition-all hover:shadow-md">
              <MoodTracker />
            </div>
            <div className="bg-gradient-to-br from-mental-secondary/10 to-mental-primary/5 rounded-xl p-4 shadow-sm border border-mental-secondary/10 transition-all hover:shadow-md">
              <SelfCareLog />
            </div>
          </div>

          {/* Middle row */}
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
            <div className="bg-gradient-to-br from-blue-100/50 to-blue-50/50 rounded-xl p-4 shadow-sm border border-blue-200/30 transition-all hover:shadow-md">
              <MeditationLog />
            </div>
            <div className="bg-gradient-to-br from-yellow-100/50 to-yellow-50/50 rounded-xl p-4 shadow-sm border border-yellow-200/30 transition-all hover:shadow-md">
              <JournalLog />
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
            <div className="bg-gradient-to-br from-pink-100/50 to-pink-50/50 rounded-xl p-4 shadow-sm border border-pink-200/30 transition-all hover:shadow-md">
              <ExerciseLog />
            </div>
            <div className="bg-gradient-to-br from-indigo-100/50 to-indigo-50/50 rounded-xl p-4 shadow-sm border border-indigo-200/30 transition-all hover:shadow-md">
              <SleepLog />
            </div>
          </div>

          {/* User Data */}
          <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md animate-fade-in" style={{ animationDelay: "150ms" }}>
            <UserDataCard />
          </div>

          {/* Wellness Charts */}
          <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md">
            <WellnessCharts />
          </div>
        </div>
      </section>
    </div>
  );
}
