import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  User as UserIcon, 
  Bell, 
  Lock, 
  Key, 
  Shield, 
  Save, 
  MailWarning,
  Mail,
  Eye,
  EyeOff,
  Brain,
  Sparkles,
  Sliders,
  AlertCircle,
  Upload,
  Camera,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { fileStorage } from "@/lib/supabase";
import { getProfile, updateProfile } from "@/services/database";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Achievement } from "@/components/health/physical/AchievementBadges";
import { Profile as UserProfileType } from "@/types/database";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from '@supabase/supabase-js';

const Settings = () => {
  const [healthMode, setHealthMode] = useState<"physical" | "mental">("physical");
  const { toast } = useToast();
  const [showApiKey, setShowApiKey] = useState(false);
  
  // AI Settings States
  const [selectedAiModel, setSelectedAiModel] = useState("gpt-4");
  const [aiApiKey, setAiApiKey] = useState("•••••••••••••••••••••••••••••");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [modelProvider, setModelProvider] = useState<string>("openai");
  
  // General Settings States
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(
    window.document.documentElement.classList.contains("dark")
  );

  // Privacy Settings States
  const [shareData, setShareData] = useState(false);
  const [anonymousAnalytics, setAnonymousAnalytics] = useState(true);
  
  // Account Settings States
  const [name, setName] = useState("Demo User");
  const [email, setEmail] = useState("demo@example.com");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState<number | undefined>();
  const [bloodGroup, setBloodGroup] = useState<string>("");
  const [height, setHeight] = useState<number | undefined>();
  const [weight, setWeight] = useState<number | undefined>();
  const [gender, setGender] = useState<string>("");
  
  // Health Statistics states
  const [healthScore, setHealthScore] = useState<string>("");
  const [streak, setStreak] = useState<string>("");
  const [tasksToday, setTasksToday] = useState<string>("");
  const [tasksCompleted, setTasksCompleted] = useState<string>("");
  
  // Personal Records states
  const [personalRecords, setPersonalRecords] = useState<Record<string, string>>({
    "Bench Press": "",
    "Squat": "",
    "Deadlift": "",
    "Running": "",
    "Plank": ""
  });
  
  // Achievements states
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "1",
      name: "First Workout",
      description: "Complete your first workout",
      completed: false
    },
    {
      id: "2",
      name: "Consistency",
      description: "Work out 3 days in a row",
      completed: false
    },
    {
      id: "3",
      name: "Early Bird",
      description: "Complete a workout before 7 AM",
      completed: false
    },
    {
      id: "4",
      name: "Goal Crusher",
      description: "Achieve a personal fitness goal",
      completed: false
    }
  ]);
  
  // Google Calendar Collaboration States
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false);
  const [syncWorkouts, setSyncWorkouts] = useState(true);
  const [syncHealthEvents, setSyncHealthEvents] = useState(true);
  const [calendarId, setCalendarId] = useState<string>("primary");
  
  // Profile image upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Profile data loading states
  const { user, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Blood group options
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  // Define supported models by provider
  const supportedModels = {
    openai: [
      { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
      { value: "gpt-4", label: "GPT-4" },
      { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
      { value: "gpt-4o", label: "GPT-4o" }
    ],
    anthropic: [
      { value: "claude-3-opus", label: "Claude 3 Opus" },
      { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
      { value: "claude-3-haiku", label: "Claude 3 Haiku" }
    ],
    google: [
      { value: "gemini-pro", label: "Gemini Pro" },
      { value: "gemini-ultra", label: "Gemini Ultra" }
    ],
    mistral: [
      { value: "mistral-medium", label: "Mistral Medium" },
      { value: "mistral-large", label: "Mistral Large" }
    ],
    other: [
      { value: "qwen-max", label: "Qwen Max" },
      { value: "grok-2", label: "Grok-2" },
      { value: "deepseek", label: "DeepSeek" }
    ]
  };
  
  // Helper function to get model provider based on model value
  const getModelProvider = (modelValue: string): string => {
    for (const [provider, models] of Object.entries(supportedModels)) {
      if (models.some(model => model.value === modelValue)) {
        return provider;
      }
    }
    return "openai"; // Default to OpenAI if not found
  };
  
  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const { success, data, error } = await getProfile(user as SupabaseUser);
        
        if (!success || error) {
          console.error('Error loading profile:', error);
          setError(`Failed to load profile: ${error.message || 'Unknown error'}`);
          return;
        }
        
        if (data) {
          setProfile(data);
          if (data.full_name) setName(data.full_name);
          if (user.email) setEmail(user.email);
          if (data.preferences?.bio) setBio(data.preferences.bio);
          if (data.age) setAge(data.age);
          if (data.blood_group) setBloodGroup(data.blood_group);
          if (data.height) setHeight(data.height);
          if (data.weight) setWeight(data.weight);
          if (data.gender) setGender(data.gender);
          
          if (data.preferences) {
            if (data.preferences.health_score) setHealthScore(data.preferences.health_score);
            if (data.preferences.streak) setStreak(data.preferences.streak);
            if (data.preferences.tasks_today) setTasksToday(data.preferences.tasks_today);
            if (data.preferences.tasks_completed) setTasksCompleted(data.preferences.tasks_completed);
            
            if (data.preferences.personal_records) {
              setPersonalRecords(prev => ({
                ...prev,
                ...data.preferences.personal_records
              }));
            }
            
            if (data.preferences.achievements) {
              setAchievements(data.preferences.achievements);
            }
            
            if (data.preferences.ai_settings) {
              const aiSettings = data.preferences.ai_settings;
              if (aiSettings.ai_model) {
                const provider = getModelProvider(aiSettings.ai_model);
                setModelProvider(provider);
                setSelectedAiModel(aiSettings.ai_model);
              }
              if (aiSettings.ai_api_key) setAiApiKey(aiSettings.ai_api_key);
              if (aiSettings.temperature !== undefined) setTemperature(aiSettings.temperature);
              if (aiSettings.max_tokens !== undefined) setMaxTokens(aiSettings.max_tokens);
            }
            
            if (data.preferences.google_calendar) {
              const calendarSettings = data.preferences.google_calendar;
              setGoogleCalendarConnected(!!calendarSettings.connected);
              setSyncWorkouts(calendarSettings.sync_workouts ?? true);
              setSyncHealthEvents(calendarSettings.sync_health_events ?? true);
              setCalendarId(calendarSettings.calendar_id ?? "primary");
            }
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError(`Failed to load profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [user]);
  
  // Google Calendar Integration Handlers
  const handleConnectGoogleCalendar = async () => {
    if (!user) return;
    
    setSaveLoading(true);
    try {
      await signInWithGoogle({
        scopes: 'https://www.googleapis.com/auth/calendar',
        redirectTo: `${window.location.origin}/settings?tab=collaboration`
      });
      toast({
        title: "Google Calendar Connected",
        description: "Your Google Calendar has been successfully connected.",
      });
    } catch (err) {
      console.error('Failed to connect Google Calendar:', err);
      toast({
        title: "Connection Failed",
        description: `Could not connect to Google Calendar: ${err instanceof Error ? err.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDisconnectGoogleCalendar = async () => {
    if (!user) return;
    
    setSaveLoading(true);
    try {
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('user_id', user.id)
        .single();
        
      if (fetchError) throw fetchError;
      
      const updatedPreferences = {
        ...currentProfile?.preferences,
        google_calendar: null
      };
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ preferences: updatedPreferences })
        .eq('user_id', user.id);
      
      if (updateError) throw updateError;
      
      setGoogleCalendarConnected(false);
      setSyncWorkouts(true);
      setSyncHealthEvents(true);
      setCalendarId("primary");
      
      toast({
        title: "Google Calendar Disconnected",
        description: "Your Google Calendar integration has been removed.",
      });
    } catch (err) {
      console.error('Failed to disconnect Google Calendar:', err);
      toast({
        title: "Disconnection Failed",
        description: `Could not disconnect Google Calendar: ${err instanceof Error ? err.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveCalendarSettings = async () => {
    if (!user) return;
    
    setSaveLoading(true);
    try {
      const calendarSettings = {
        connected: googleCalendarConnected,
        sync_workouts: syncWorkouts,
        sync_health_events: syncHealthEvents,
        calendar_id: calendarId,
        last_updated: new Date().toISOString()
      };
      
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('user_id', user.id)
        .single();
        
      if (fetchError) throw fetchError;
      
      const updatedPreferences = {
        ...currentProfile?.preferences,
        google_calendar: calendarSettings
      };
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ preferences: updatedPreferences })
        .eq('user_id', user.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Calendar Settings Saved",
        description: "Your Google Calendar settings have been updated.",
      });
    } catch (err) {
      console.error('Failed to save calendar settings:', err);
      toast({
        title: "Settings Update Failed",
        description: `Could not save calendar settings: ${err instanceof Error ? err.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Profile image upload handlers
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const acceptedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!acceptedImageTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG or WebP image.",
        variant: "destructive",
      });
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 2MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const uploadProfileImage = async () => {
    if (!selectedFile || !user) return null;
    
    try {
      setUploadProgress(0);
      const { data, error } = await fileStorage.uploadProfileImage(user.id, selectedFile);
      setUploadProgress(100);
      
      if (error) {
        toast({
          title: "Upload Failed",
          description: error.message || "Failed to upload image",
          variant: "destructive",
        });
        return null;
      }
      
      return data?.url || null;
    } catch (err) {
      console.error('Failed to upload image:', err);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setTimeout(() => {
        setUploadProgress(null);
        setSelectedFile(null);
      }, 1000);
    }
  };
  
  const handleSaveGeneralSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your general settings have been updated.",
    });
  };

  const handleSaveAiSettings = async () => {
    if (!user) return;
    
    setSaveLoading(true);
    
    try {
      let isValidModel = false;
      for (const models of Object.values(supportedModels)) {
        if (models.some(model => model.value === selectedAiModel)) {
          isValidModel = true;
          break;
        }
      }
      
      if (!isValidModel) {
        throw new Error("Invalid AI model selected");
      }
      
      const aiSettings = {
        ai_model: selectedAiModel,
        ai_api_key: aiApiKey,
        temperature: temperature,
        max_tokens: maxTokens,
        model_provider: modelProvider,
        last_updated: new Date().toISOString()
      };
      
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('user_id', user.id)
        .single();
        
      if (fetchError) {
        throw fetchError;
      }
      
      const updatedPreferences = {
        ...currentProfile?.preferences,
        ai_settings: aiSettings
      };
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          preferences: updatedPreferences
        })
        .eq('user_id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "AI Settings Saved",
        description: `Your AI settings have been updated to use ${selectedAiModel}.`,
      });
    } catch (err) {
      console.error('Failed to save AI settings:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast({
        title: "Settings Update Failed",
        description: `Could not save AI settings: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSavePrivacySettings = () => {
    toast({
      title: "Privacy Settings Saved",
      description: "Your privacy settings have been updated.",
    });
  };
  
  const handleSaveAccountSettings = async () => {
    if (!user) return;
    
    setSaveLoading(true);
    
    try {
      let avatarUrl = profile?.avatar_url;
      
      if (selectedFile) {
        const newAvatarUrl = await uploadProfileImage();
        if (newAvatarUrl) {
          avatarUrl = newAvatarUrl;
        }
      }
      
      const updates = {
        full_name: name || null,
        age: age || null,
        blood_group: bloodGroup || null,
        height: height || null,
        weight: weight || null,
        gender: gender || null,
        avatar_url: avatarUrl || null,
        preferences: {
          ...profile?.preferences,
          bio: bio,
          health_score: healthScore,
          streak: streak,
          tasks_today: tasksToday,
          tasks_completed: tasksCompleted,
          personal_records: personalRecords,
          achievements: achievements
        }
      };
      
      console.log('Saving account settings with data:', JSON.stringify(updates, null, 2));
      
      const { success, data, error } = await updateProfile(user as SupabaseUser, updates);
      
      if (!success || error) {
        console.error('Profile update failed:', error);
        const errorMessage = error.message || 'Unknown error occurred';
        toast({
          title: "Update Failed",
          description: `Failed to update profile: ${errorMessage}`,
          variant: "destructive",
        });
        return;
      }
      
      if (data) {
        setProfile(data);
        toast({
          title: "Account Settings Saved",
          description: "Your account information has been updated.",
        });
      } else {
        toast({
          title: "Warning",
          description: "Profile may not have been updated correctly.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast({
        title: "Update Failed",
        description: `An unexpected error occurred: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      window.document.documentElement.classList.add("dark");
    } else {
      window.document.documentElement.classList.remove("dark");
    }
    
    toast({
      title: `${newDarkMode ? "Dark" : "Light"} Mode Enabled`,
      description: `App theme switched to ${newDarkMode ? "dark" : "light"} mode.`,
    });
  };

  const handleProviderChange = (newProvider: string) => {
    setModelProvider(newProvider);
    const firstModelInProvider = supportedModels[newProvider as keyof typeof supportedModels][0];
    setSelectedAiModel(firstModelInProvider.value);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header mode={healthMode} onModeChange={setHealthMode} />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-4xl animate-fade-in">
            <h1 className="text-3xl font-bold text-health-dark dark:text-white mb-2">Settings</h1>
            <p className="text-muted-foreground mb-6">Manage your account and application preferences</p>

            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid grid-cols-5 mb-8 max-w-lg">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="ai">AI</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="space-y-6">
                {loading && (
                  <div className="flex justify-center items-center py-12">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-muted-foreground">Loading your profile...</p>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start mb-4">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Error loading profile</h3>
                      <p className="text-sm">{error}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2" 
                        onClick={() => window.location.reload()}
                      >
                        Retry
                      </Button>
                    </div>
                  </div>
                )}
                
                {profile && (
                  <>
                    {(!profile.full_name || !profile.age || !profile.blood_group || !profile.height || 
                      !profile.weight || !profile.gender) && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md flex items-start mb-4">
                        <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium">Complete your profile</h3>
                          <p className="text-sm">
                            Your profile information is incomplete. Please fill in all fields to see accurate health insights on your dashboard.
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserIcon className="mr-2 h-5 w-5 text-health-primary" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and how it appears on your profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-4">
                      <div className="flex flex-col items-center">
                        <Avatar className="h-24 w-24 mb-2 relative group cursor-pointer" onClick={handleUploadClick}>
                          <AvatarImage 
                            src={selectedFile ? URL.createObjectURL(selectedFile) : profile?.avatar_url || undefined} 
                            alt={name || "User"}
                            className="object-cover"
                          />
                          <AvatarFallback className="text-lg">
                            {name ? name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="h-6 w-6 text-white" />
                          </div>
                        </Avatar>
                        
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          aria-label="Upload profile picture"
                        />
                        
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={handleUploadClick}
                          className="mt-2"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {selectedFile ? "Change" : "Upload"}
                        </Button>
                        
                        {uploadProgress !== null && (
                          <div className="w-full mt-2">
                            <Progress value={uploadProgress} className="h-2 w-24" />
                          </div>
                        )}
                        
                        <p className="text-xs text-muted-foreground mt-1">
                          JPEG, PNG, WebP (max 2MB)
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter your name"
                            disabled={loading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" value={email} readOnly disabled />
                          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea 
                        id="bio" 
                        className="w-full min-h-[100px] p-2 border rounded-md bg-background resize-y"
                        placeholder="Tell us something about yourself..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        disabled={loading}
                      ></textarea>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Health Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input 
                            id="age" 
                            type="number" 
                            value={age ?? ''} 
                            onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : undefined)} 
                            disabled={loading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select 
                            value={gender} 
                            onValueChange={setGender}
                            disabled={loading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="blood-group">Blood Group</Label>
                          <Select 
                            value={bloodGroup} 
                            onValueChange={setBloodGroup}
                            disabled={loading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                            <SelectContent>
                              {bloodGroups.map(group => (
                                <SelectItem key={group} value={group}>{group}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input 
                            id="height" 
                            type="number" 
                            step="0.01"
                            value={height ?? ''} 
                            onChange={(e) => setHeight(e.target.value ? parseFloat(e.target.value) : undefined)} 
                            disabled={loading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input 
                            id="weight" 
                            type="number" 
                            step="0.01"
                            value={weight ?? ''} 
                            onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : undefined)} 
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-medium mb-4">Health Statistics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label htmlFor="health-score">Health Score (0-100)</Label>
                          <Input 
                            id="health-score" 
                            type="number" 
                            min="0"
                            max="100"
                            value={healthScore} 
                            onChange={(e) => setHealthScore(e.target.value)}
                            placeholder="Enter health score from 0-100" 
                            disabled={loading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="streak">Current Streak (days)</Label>
                          <Input 
                            id="streak" 
                            type="number"
                            min="0" 
                            value={streak} 
                            onChange={(e) => setStreak(e.target.value)}
                            placeholder="Enter current streak" 
                            disabled={loading}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tasks-today">Tasks Today</Label>
                          <Input 
                            id="tasks-today" 
                            type="number"
                            min="0" 
                            value={tasksToday} 
                            onChange={(e) => setTasksToday(e.target.value)}
                            placeholder="Number of tasks today" 
                            disabled={loading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tasks-completed">Tasks Completed</Label>
                          <Input 
                            id="tasks-completed" 
                            type="number"
                            min="0" 
                            value={tasksCompleted} 
                            onChange={(e) => setTasksCompleted(e.target.value)}
                            placeholder="Number of completed tasks" 
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        These statistics will be displayed on your dashboard.
                      </p>
                    </div>
                    
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-medium mb-4">Personal Records</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.keys(personalRecords).map((exercise) => (
                          <div key={exercise} className="space-y-2">
                            <Label htmlFor={`record-${exercise}`}>{exercise}</Label>
                            <Input 
                              id={`record-${exercise}`}
                              value={personalRecords[exercise]} 
                              onChange={(e) => setPersonalRecords(prev => ({
                                ...prev,
                                [exercise]: e.target.value
                              }))}
                              placeholder={`Your ${exercise} record`} 
                              disabled={loading}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const exercise = prompt("Enter new exercise name:");
                            if (exercise && exercise.trim()) {
                              setPersonalRecords(prev => ({
                                ...prev,
                                [exercise.trim()]: ""
                              }));
                            }
                          }}
                          disabled={loading}
                        >
                          + Add New Record
                        </Button>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-medium mb-4">Achievements</h3>
                      <div className="space-y-3">
                        {achievements.map((achievement, index) => (
                          <div key={achievement.id} className="flex items-center justify-between p-3 rounded bg-slate-50 dark:bg-slate-800">
                            <div className="flex items-center">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${achievement.completed ? 'bg-health-primary text-white' : 'bg-gray-200 dark:bg-slate-700'}`}>
                                {achievement.completed ? '✓' : '?'}
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">{achievement.name}</h4>
                                <p className="text-xs text-muted-foreground">{achievement.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {achievement.completed && (
                                <Input 
                                  type="date" 
                                  className="w-auto text-xs"
                                  value={achievement.date || ''}
                                  onChange={(e) => {
                                    const newAchievements = [...achievements];
                                    newAchievements[index] = {
                                      ...achievement,
                                      date: e.target.value
                                    };
                                    setAchievements(newAchievements);
                                  }}
                                  disabled={loading}
                                />
                              )}
                              <Switch 
                                checked={achievement.completed}
                                onCheckedChange={(checked) => {
                                  const newAchievements = [...achievements];
                                  newAchievements[index] = {
                                    ...achievement,
                                    completed: checked,
                                    date: checked ? new Date().toISOString().split('T')[0] : undefined
                                  };
                                  setAchievements(newAchievements);
                                }}
                                disabled={loading}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleSaveAccountSettings} 
                      disabled={saveLoading || loading}
                      className="ml-auto"
                    >
                      {saveLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sliders className="mr-2 h-5 w-5 text-health-primary" />
                      General Settings
                    </CardTitle>
                    <CardDescription>
                      Configure your application preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive email updates about your account and health progress
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                        disabled={loading}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Get push notifications for reminders and updates
                        </p>
                      </div>
                      <Switch
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                        disabled={loading}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Toggle between light and dark theme
                        </p>
                      </div>
                      <Switch
                        checked={darkMode}
                        onCheckedChange={handleToggleDarkMode}
                        disabled={loading}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleSaveGeneralSettings}
                      disabled={saveLoading || loading}
                      className="ml-auto"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="ai">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="mr-2 h-5 w-5 text-health-primary" />
                      AI Settings
                    </CardTitle>
                    <CardDescription>
                      Configure AI model preferences for health recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="model-provider">Model Provider</Label>
                      <Select 
                        value={modelProvider} 
                        onValueChange={handleProviderChange}
                        disabled={loading}
                      >
                        <SelectTrigger id="model-provider">
                          <SelectValue placeholder="Select a provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Providers</SelectLabel>
                            {Object.keys(supportedModels).map(provider => (
                              <SelectItem key={provider} value={provider}>
                                {provider.charAt(0).toUpperCase() + provider.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ai-model">AI Model</Label>
                      <Select 
                        value={selectedAiModel} 
                        onValueChange={setSelectedAiModel}
                        disabled={loading}
                      >
                        <SelectTrigger id="ai-model">
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Models</SelectLabel>
                            {supportedModels[modelProvider as keyof typeof supportedModels].map(model => (
                              <SelectItem key={model.value} value={model.value}>
                                {model.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <div className="relative">
                        <Input
                          id="api-key"
                          type={showApiKey ? "text" : "password"}
                          value={aiApiKey}
                          onChange={(e) => setAiApiKey(e.target.value)}
                          className="pr-10"
                          disabled={loading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowApiKey(!showApiKey)}
                          disabled={loading}
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enter your API key for the selected provider
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature</Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        min="0"
                        max="2"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        disabled={loading}
                      />
                      <p className="text-xs text-muted-foreground">
                        Controls randomness (0.0-2.0). Lower values make responses more focused.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-tokens">Max Tokens</Label>
                      <Input
                        id="max-tokens"
                        type="number"
                        min="100"
                        max="8000"
                        value={maxTokens}
                        onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                        disabled={loading}
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum number of tokens in the response (100-8000)
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleSaveAiSettings}
                      disabled={saveLoading || loading}
                      className="ml-auto"
                    >
                      {saveLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="privacy">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-health-primary" />
                      Privacy Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your data sharing and privacy preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Share Health Data</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow sharing anonymized health data for research
                        </p>
                      </div>
                      <Switch
                        checked={shareData}
                        onCheckedChange={setShareData}
                        disabled={loading}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Anonymous Analytics</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable anonymous usage analytics to improve the app
                        </p>
                      </div>
                      <Switch
                        checked={anonymousAnalytics}
                        onCheckedChange={setAnonymousAnalytics}
                        disabled={loading}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleSavePrivacySettings}
                      disabled={saveLoading || loading}
                      className="ml-auto"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="collaboration">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-health-primary" />
                      Collaboration
                    </CardTitle>
                    <CardDescription>
                      Connect with third-party services like Google Calendar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Google Calendar Integration</Label>
                          <p className="text-sm text-muted-foreground">
                            Sync your workouts and health events with Google Calendar
                          </p>
                        </div>
                        {googleCalendarConnected ? (
                          <Button 
                            variant="destructive" 
                            onClick={handleDisconnectGoogleCalendar}
                            disabled={saveLoading || loading}
                          >
                            Disconnect
                          </Button>
                        ) : (
                          <Button 
                            onClick={handleConnectGoogleCalendar}
                            disabled={saveLoading || loading}
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                      {googleCalendarConnected && (
                        <div className="space-y-4 border-t pt-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label>Sync Workouts</Label>
                              <p className="text-sm text-muted-foreground">
                                Add workout sessions to your calendar
                              </p>
                            </div>
                            <Switch
                              checked={syncWorkouts}
                              onCheckedChange={setSyncWorkouts}
                              disabled={loading}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label>Sync Health Events</Label>
                              <p className="text-sm text-muted-foreground">
                                Add health-related events to your calendar
                              </p>
                            </div>
                            <Switch
                              checked={syncHealthEvents}
                              onCheckedChange={setSyncHealthEvents}
                              disabled={loading}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="calendar-id">Calendar ID</Label>
                            <Input
                              id="calendar-id"
                              value={calendarId}
                              onChange={(e) => setCalendarId(e.target.value)}
                              placeholder="primary"
                              disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground">
                              Enter the ID of the calendar to sync with (default: primary)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleSaveCalendarSettings}
                      disabled={saveLoading || loading || !googleCalendarConnected}
                      className="ml-auto"
                    >
                      {saveLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;