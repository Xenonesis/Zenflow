import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { PageTitle } from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import { HealthMetrics as HealthMetricsComponent } from "@/components/health/metrics/HealthMetrics";
import { Card, CardContent } from "@/components/ui/card";

const HealthMetrics = () => {
  const [healthMode, setHealthMode] = useState<"physical" | "mental">("physical");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header mode={healthMode} onModeChange={setHealthMode} />
        <main className="flex-1 overflow-auto p-3 sm:p-6">
          <div className="mx-auto max-w-6xl space-y-6">
            <PageTitle 
              title="Health Metrics" 
              description="Track and analyze your health metrics over time"
              breadcrumbs={[
                { label: "Health Metrics", href: "/health-metrics", active: true }
              ]}
              actions={
                <Button variant="default">Refresh Data</Button>
              }
            />
            
            <div className="grid gap-6">
              <Card className="card-shadow">
                <CardContent className="p-6">
                  <HealthMetricsComponent />
                </CardContent>
              </Card>
              
              {/* Placeholder for future metrics components */}
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <Card className="card-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Heart Rate Trends</h3>
                    <p className="text-muted-foreground">Heart rate tracking and analysis will be displayed here.</p>
                  </CardContent>
                </Card>
                
                <Card className="card-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Sleep Patterns</h3>
                    <p className="text-muted-foreground">Sleep tracking and analysis will be displayed here.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HealthMetrics; 