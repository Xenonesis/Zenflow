import { WelcomeSection } from "./WelcomeSection";
import { WorkoutHistory } from "./physical/WorkoutHistory";
import { PersonalRecords } from "./physical/PersonalRecords";
import { ProgressCharts } from "./physical/ProgressCharts";
import { AchievementBadges } from "./physical/AchievementBadges";
import { UserDataCard } from "./UserDataCard";
import { HealthStatistics } from "./physical/HealthStatistics";

export function PhysicalDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <WelcomeSection />
      
      <section className="space-y-6 mt-6">
        <div className="flex items-center space-x-2 mb-2">
          <div className="h-1.5 w-6 bg-health-primary rounded-full"></div>
          <h2 className="text-2xl font-bold">Physical Health</h2>
        </div>
        
        <div className="grid gap-4 md:gap-6">
          {/* Health Statistics */}
          <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md animate-fade-in">
            <HealthStatistics />
          </div>

          {/* Top row */}
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
            <div className="bg-gradient-to-br from-health-primary/10 to-health-secondary/5 rounded-xl p-4 shadow-sm border border-health-primary/10 transition-all hover:shadow-md animate-fade-in">
              <PersonalRecords />
            </div>
            <div className="bg-gradient-to-br from-health-secondary/10 to-health-primary/5 rounded-xl p-4 shadow-sm border border-health-secondary/10 transition-all hover:shadow-md animate-fade-in" style={{ animationDelay: "100ms" }}>
              <AchievementBadges />
            </div>
          </div>

          {/* User Data Card */}
          <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md animate-fade-in" style={{ animationDelay: "150ms" }}>
            <UserDataCard />
          </div>

          {/* Middle row - charts */}
          <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md animate-fade-in" style={{ animationDelay: "200ms" }}>
            <ProgressCharts />
          </div>

          {/* Bottom row - history */}
          <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md animate-fade-in" style={{ animationDelay: "300ms" }}>
            <WorkoutHistory />
          </div>
        </div>
      </section>
    </div>
  );
}
