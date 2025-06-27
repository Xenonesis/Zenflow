import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { PhysicalDashboard } from "@/components/health/PhysicalDashboard";
import { MentalDashboard } from "@/components/health/MentalDashboard";
import { AnimatePresence, motion } from "framer-motion";
import { QuickStats } from "@/components/health/QuickStats";
import { ActivityRing } from "@/components/ui/activity-ring";
import { ArrowUpRight, ArrowDownRight, Brain, HeartPulse } from "lucide-react";

const Index = () => {
  const [healthMode, setHealthMode] = useState<"physical" | "mental">("physical");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    // Set first load to false after initial render
    setIsFirstLoad(false);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header mode={healthMode} onModeChange={setHealthMode} />
        
        <main className="flex-1 overflow-auto p-3 sm:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Quick Stats Overview - always visible */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickStatsCard 
                title="Daily Activity" 
                value="78%" 
                change="+12%"
                isPositive={true}
                icon={<ActivityRing progress={78} size={40} />}
                mode={healthMode}
              />
              <QuickStatsCard 
                title="Mindfulness" 
                value="32 min" 
                change="-5 min"
                isPositive={false}
                icon={<Brain className="w-6 h-6 text-mental-primary" />}
                mode={healthMode}
              />
              <QuickStatsCard 
                title="Heart Rate" 
                value="72 bpm" 
                change="-3 bpm"
                isPositive={true}
                icon={<HeartPulse className="w-6 h-6 text-health-primary" />}
                mode={healthMode}
              />
              <QuickStatsCard 
                title="Flow States" 
                value="3" 
                change="+1"
                isPositive={true}
                icon={<ActivityRing progress={60} size={40} color="indigo" />}
                mode={healthMode}
              />
            </div>

            <AnimatePresence mode="wait">
              {healthMode === "physical" ? (
                <motion.div
                  key="physical"
                  initial={isFirstLoad ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <PhysicalDashboard />
                </motion.div>
              ) : (
                <motion.div
                  key="mental"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <MentalDashboard />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

// Quick Stats Card component
const QuickStatsCard = ({ 
  title, 
  value, 
  change, 
  isPositive, 
  icon,
  mode
}: { 
  title: string; 
  value: string; 
  change: string; 
  isPositive: boolean;
  icon: React.ReactNode;
  mode: "physical" | "mental";
}) => {
  return (
    <div className={`${
      mode === "physical" 
        ? "bg-gradient-to-br from-health-primary/10 to-health-primary/5" 
        : "bg-gradient-to-br from-mental-primary/10 to-mental-primary/5"
    } rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-300`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          <div className={`flex items-center mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3 mr-1" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-1" />
            )}
            <span className="text-xs font-medium">{change}</span>
          </div>
        </div>
        <div className="mt-1">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Index;
