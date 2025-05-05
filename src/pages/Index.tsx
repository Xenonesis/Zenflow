
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { PhysicalDashboard } from "@/components/health/PhysicalDashboard";
import { MentalDashboard } from "@/components/health/MentalDashboard";

const Index = () => {
  const [healthMode, setHealthMode] = useState<"physical" | "mental">("physical");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header mode={healthMode} onModeChange={setHealthMode} />
        <main className="flex-1 overflow-auto p-3 sm:p-6">
          <div className="mx-auto max-w-6xl">
            {healthMode === "physical" ? <PhysicalDashboard /> : <MentalDashboard />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
