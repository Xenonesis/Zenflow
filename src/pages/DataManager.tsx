import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DatabaseSetup } from "@/components/setup/DatabaseSetup";
import { useAuth } from "@/lib/auth-context";
import { profileService, workoutService, healthMetricService } from "@/lib/database";
import { UserProfile } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, RefreshCw, Database, File, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const DataManager = () => {
  const [healthMode, setHealthMode] = useState<"physical" | "mental">("physical");
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for import/export operations
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [setupComplete, setSetupComplete] = useState(false);
  
  // Function to handle importing data
  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    
    try {
      setImportLoading(true);
      setProgress(10);
      
      const file = e.target.files[0];
      const fileContent = await file.text();
      const data = JSON.parse(fileContent);
      
      setProgress(30);
      
      // Validate imported data
      if (!data.profile) {
        throw new Error('Invalid data format: profile data missing');
      }
      
      // Update profile with imported data
      setProgress(50);
      const { error } = await profileService.updateUserProfile(user.id, {
        ...data.profile,
        user_id: user.id // Ensure correct user ID
      });
      
      if (error) {
        throw new Error(`Failed to import profile: ${error.message}`);
      }
      
      setProgress(90);
      
      // Import workouts if available
      if (data.workouts && Array.isArray(data.workouts)) {
        // TODO: Implement workout import
      }
      
      // Import health metrics if available
      if (data.healthMetrics && Array.isArray(data.healthMetrics)) {
        // TODO: Implement health metrics import
      }
      
      setProgress(100);
      
      toast({
        title: "Import successful",
        description: "Your data has been imported successfully.",
      });
      
      // Reload profile
      const { data: newProfile } = await profileService.getUserProfile(user.id);
      setUserProfile(newProfile);
      
    } catch (err) {
      console.error('Import error:', err);
      toast({
        title: "Import failed",
        description: err instanceof Error ? err.message : "Failed to import data",
        variant: "destructive",
      });
    } finally {
      setImportLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };
  
  // Function to handle exporting data
  const handleExportData = async () => {
    if (!user) return;
    
    try {
      setExportLoading(true);
      setProgress(10);
      
      // Fetch profile data
      const { data: profile, error: profileError } = await profileService.getUserProfile(user.id);
      
      if (profileError) {
        throw new Error(`Failed to fetch profile: ${profileError.message}`);
      }
      
      setProgress(40);
      
      // Fetch workouts
      const { data: workouts, error: workoutsError } = await workoutService.getUserWorkouts(user.id);
      
      if (workoutsError) {
        console.error('Error fetching workouts:', workoutsError);
      }
      
      setProgress(70);
      
      // Fetch health metrics
      const { data: healthMetrics, error: metricsError } = await healthMetricService.getUserMetrics(user.id);
      
      if (metricsError) {
        console.error('Error fetching health metrics:', metricsError);
      }
      
      setProgress(90);
      
      // Combine all data
      const exportData = {
        profile,
        workouts: workouts || [],
        healthMetrics: healthMetrics || [],
        exportDate: new Date().toISOString()
      };
      
      // Create downloadable file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const dataUrl = URL.createObjectURL(dataBlob);
      
      // Create download link and trigger download
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `wellbeing-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      setProgress(100);
      
      toast({
        title: "Export successful",
        description: "Your data has been exported successfully.",
      });
    } catch (err) {
      console.error('Export error:', err);
      toast({
        title: "Export failed",
        description: err instanceof Error ? err.message : "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setExportLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };
  
  // Function to sync data between client and server
  const handleSyncData = async () => {
    if (!user) return;
    
    try {
      setSyncLoading(true);
      setProgress(20);
      
      // Fetch latest profile
      const { data: profile, error: profileError } = await profileService.getUserProfile(user.id);
      
      if (profileError) {
        throw new Error(`Failed to sync profile: ${profileError.message}`);
      }
      
      setProgress(60);
      setUserProfile(profile);
      
      // Sync other data as needed
      // ...
      
      setProgress(100);
      
      toast({
        title: "Sync successful",
        description: "Your data has been synchronized with the server.",
      });
    } catch (err) {
      console.error('Sync error:', err);
      toast({
        title: "Sync failed",
        description: err instanceof Error ? err.message : "Failed to sync data",
        variant: "destructive",
      });
    } finally {
      setSyncLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };
  
  // Load initial profile data
  useState(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await profileService.getUserProfile(user.id);
        
        if (!error && data) {
          setUserProfile(data);
          setSetupComplete(true);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    
    fetchProfile();
  });

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header mode={healthMode} onModeChange={setHealthMode} />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-health-dark dark:text-white mb-2">Data Manager</h1>
            <p className="text-muted-foreground mb-6">Manage your data, import/export and database setup</p>
            
            {progress > 0 && (
              <div className="mb-6">
                <p className="text-sm mb-2">
                  {importLoading && "Importing data..."}
                  {exportLoading && "Exporting data..."}
                  {syncLoading && "Syncing data..."}
                  {" "}{progress}%
                </p>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <Tabs defaultValue="manage">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="manage">Manage Data</TabsTrigger>
                <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
                <TabsTrigger value="setup">Database Setup</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manage" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="mr-2 h-5 w-5 text-health-primary" />
                      Sync & Refresh Data
                    </CardTitle>
                    <CardDescription>
                      Synchronize your data between the client and server
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-md bg-slate-50 dark:bg-slate-800">
                        <h3 className="font-medium mb-2">Data Status</h3>
                        
                        {userProfile ? (
                          <div className="flex items-start mb-4">
                            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 text-green-500" />
                            <div>
                              <p className="text-sm">
                                Profile data is loaded and synchronized.
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Last updated: {new Date(userProfile.updated_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start mb-4">
                            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 text-amber-500" />
                            <div>
                              <p className="text-sm">
                                Profile data is not loaded. Click "Sync Data" to load your profile.
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <Button
                          onClick={handleSyncData}
                          disabled={syncLoading}
                          className="flex items-center gap-2"
                        >
                          {syncLoading ? (
                            <>
                              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                              Syncing...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4" />
                              Sync Data
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {setupComplete && userProfile && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Record Management</CardTitle>
                      <CardDescription>
                        Manage individual health records and metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center text-muted-foreground py-6">
                        Record management features coming soon...
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="backup" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Download className="mr-2 h-5 w-5 text-health-primary" />
                      Export Data
                    </CardTitle>
                    <CardDescription>
                      Download your health data as a backup
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 border rounded-md bg-slate-50 dark:bg-slate-800">
                      <h3 className="font-medium mb-2">Export Options</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Download your profile, health metrics, and workout history as a JSON file.
                      </p>
                      <Button
                        onClick={handleExportData}
                        disabled={exportLoading || !userProfile}
                        className="flex items-center gap-2"
                      >
                        {exportLoading ? (
                          <>
                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            Exporting...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            Export Data
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Upload className="mr-2 h-5 w-5 text-health-primary" />
                      Import Data
                    </CardTitle>
                    <CardDescription>
                      Restore your health data from a backup
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 border rounded-md bg-slate-50 dark:bg-slate-800">
                      <h3 className="font-medium mb-2">Import Options</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload a previously exported JSON file to restore your data.
                      </p>
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={() => document.getElementById('file-upload')?.click()}
                          disabled={importLoading}
                          className="flex items-center gap-2"
                        >
                          {importLoading ? (
                            <>
                              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                              Importing...
                            </>
                          ) : (
                            <>
                              <File className="h-4 w-4" />
                              Select File
                            </>
                          )}
                        </Button>
                        <input
                          type="file"
                          id="file-upload"
                          accept=".json"
                          onChange={handleImportData}
                          className="hidden"
                          aria-label="Upload data file"
                        />
                        <p className="text-xs text-muted-foreground">
                          Only .json files exported from this app are supported
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-amber-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Importing data will overwrite your existing data
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="setup" className="mt-6">
                <DatabaseSetup />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DataManager; 