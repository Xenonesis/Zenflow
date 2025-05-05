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
  User, 
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
  Camera
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { fileStorage } from "@/lib/supabase";
import { getProfile, updateProfile } from "@/services/database";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Achievement } from "@/components/health/physical/AchievementBadges";
import { UserProfile as UserProfileType } from "@/types/database";
import { supabase } from "@/lib/supabase";

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
  
  // Profile image upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Profile data loading states
  const { user } = useAuth();
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
        const { success, data, error } = await getProfile(user);
        
        if (!success || error) {
          console.error('Error loading profile:', error);
          setError(`Failed to load profile: ${error.message || 'Unknown error'}`);
          return;
        }
        
        if (data) {
          setProfile(data);
          // Only update state if the field has a value to avoid overwriting existing state with undefined
          if (data.full_name) setName(data.full_name);
          if (user.email) setEmail(user.email);
          if (data.preferences?.bio) setBio(data.preferences.bio);
          if (data.age) setAge(data.age);
          if (data.blood_group) setBloodGroup(data.blood_group);
          if (data.height) setHeight(data.height);
          if (data.weight) setWeight(data.weight);
          if (data.gender) setGender(data.gender);
          
          // Load health statistics if available in preferences
          if (data.preferences) {
            if (data.preferences.health_score) setHealthScore(data.preferences.health_score);
            if (data.preferences.streak) setStreak(data.preferences.streak);
            if (data.preferences.tasks_today) setTasksToday(data.preferences.tasks_today);
            if (data.preferences.tasks_completed) setTasksCompleted(data.preferences.tasks_completed);
            
            // Load personal records if available
            if (data.preferences.personal_records) {
              setPersonalRecords(prev => ({
                ...prev,
                ...data.preferences.personal_records
              }));
            }
            
            // Load achievements if available
            if (data.preferences.achievements) {
              setAchievements(data.preferences.achievements);
            }
            
            // Load AI settings if available
            if (data.preferences.ai_settings) {
              const aiSettings = data.preferences.ai_settings;
              
              if (aiSettings.ai_model) {
                // Find the provider for this model
                const provider = getModelProvider(aiSettings.ai_model);
                setModelProvider(provider);
                setSelectedAiModel(aiSettings.ai_model);
              }
              
              if (aiSettings.ai_api_key) setAiApiKey(aiSettings.ai_api_key);
              if (aiSettings.temperature !== undefined) setTemperature(aiSettings.temperature);
              if (aiSettings.max_tokens !== undefined) setMaxTokens(aiSettings.max_tokens);
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
  
  // Profile image upload handlers
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const acceptedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!acceptedImageTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG or WebP image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (2MB max)
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
      // Validate if the selected model exists in the supported models
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
      
      // Prepare AI settings to save in profile preferences
      const aiSettings = {
        ai_model: selectedAiModel,
        ai_api_key: aiApiKey,
        temperature: temperature,
        max_tokens: maxTokens,
        model_provider: modelProvider,
        last_updated: new Date().toISOString()
      };
      
      // Get current profile data first
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('user_id', user.id)
        .single();
        
      if (fetchError) {
        throw fetchError;
      }
      
      // Merge with existing preferences
      const updatedPreferences = {
        ...currentProfile?.preferences,
        ai_settings: aiSettings
      };
      
      // Update profile in database - remove email as it doesn't exist in the profiles table
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
      // First upload image if there's a selected file
      let avatarUrl = profile?.avatar_url;
      
      if (selectedFile) {
        const newAvatarUrl = await uploadProfileImage();
        if (newAvatarUrl) {
          avatarUrl = newAvatarUrl;
        }
      }
      
      // Prepare profile update data
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
      
      // Update profile in database
      const { success, data, error } = await updateProfile(user, updates);
      
      if (!success || error) {
        console.error('Profile update failed:', error);
        // Extract error message
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
        // Handle case where data is null but no error
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

  // Update when provider changes
  const handleProviderChange = (newProvider: string) => {
    setModelProvider(newProvider);
    // Auto-select the first model from the new provider
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
              <TabsList className="grid grid-cols-4 mb-8 max-w-md">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="ai">AI</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
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
                      <User className="mr-2 h-5 w-5 text-health-primary" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and how it appears on your profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar and Basic Info */}
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

                    {/* Bio */}
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

                    {/* Health Information */}
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

                    {/* Health Statistics */}
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
                    
                    {/* Personal Records */}
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

                    {/* Achievements */}
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
                                    date: checked && !achievement.date ? new Date().toISOString().split('T')[0] : achievement.date
                                  };
                                  setAchievements(newAchievements);
                                }}
                                disabled={loading}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const name = prompt("Achievement name:");
                            if (name && name.trim()) {
                              const description = prompt("Achievement description:");
                              if (description && description.trim()) {
                                setAchievements(prev => [
                                  ...prev,
                                  {
                                    id: `${Date.now()}`,
                                    name: name.trim(),
                                    description: description.trim(),
                                    completed: false
                                  }
                                ]);
                              }
                            }
                          }}
                          disabled={loading}
                        >
                          + Add New Achievement
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={handleSaveAccountSettings}
                      disabled={saveLoading || loading}
                      className="flex items-center gap-2"
                    >
                      {saveLoading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="mr-2 h-5 w-5 text-health-primary" />
                      Password
                    </CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" disabled={loading} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" disabled={loading} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" disabled={loading} />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="ml-auto mr-2" disabled={loading}>Cancel</Button>
                    <Button disabled={loading}>Update Password</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="mr-2 h-5 w-5 text-health-primary" />
                      Notifications
                    </CardTitle>
                    <CardDescription>
                      Configure how you receive notifications from ZenFlow
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates, reminders, and reports via email
                        </p>
                      </div>
                      <Switch 
                        id="email-notifications" 
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                        disabled={loading}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications on your device when using the app
                        </p>
                      </div>
                      <Switch 
                        id="push-notifications" 
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                        disabled={loading}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Toggle between dark and light theme
                        </p>
                      </div>
                      <Switch 
                        id="dark-mode" 
                        checked={darkMode}
                        onCheckedChange={handleToggleDarkMode}
                        disabled={loading}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveGeneralSettings} className="ml-auto flex items-center gap-2" disabled={loading}>
                      <Save className="h-4 w-4" />
                      Save Preferences
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="ai" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="mr-2 h-5 w-5 text-health-primary" />
                      AI Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure AI model settings for personalized health insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ai-provider">AI Provider</Label>
                      <Select value={modelProvider} onValueChange={handleProviderChange} disabled={loading}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select AI provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="anthropic">Anthropic</SelectItem>
                          <SelectItem value="google">Google</SelectItem>
                          <SelectItem value="mistral">Mistral AI</SelectItem>
                          <SelectItem value="other">Other Providers</SelectItem>
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select AI model" />
                        </SelectTrigger>
                        <SelectContent>
                          {supportedModels[modelProvider as keyof typeof supportedModels]?.map(model => (
                            <SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        The selected model will be used for health insights and recommendations.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="api-key">API Key</Label>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="h-4 w-4"
                          disabled={loading}
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Input 
                        id="api-key" 
                        type={showApiKey ? "text" : "password"} 
                        value={aiApiKey}
                        onChange={(e) => setAiApiKey(e.target.value)}
                        disabled={loading}
                      />
                      <p className="text-xs text-muted-foreground">
                        Your API key is stored securely and never shared.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="temperature">Temperature: {temperature}</Label>
                        <span className="text-sm text-muted-foreground">
                          {temperature < 0.4 ? "More focused" : temperature > 0.7 ? "More creative" : "Balanced"}
                        </span>
                      </div>
                      <Input 
                        id="temperature" 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="cursor-pointer"
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-tokens">Max Response Length: {maxTokens} tokens</Label>
                      <Input 
                        id="max-tokens" 
                        type="range" 
                        min="500" 
                        max="4000" 
                        step="100" 
                        value={maxTokens}
                        onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                        className="cursor-pointer"
                        disabled={loading}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="ai-enabled" className="cursor-pointer">Health Insights</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow AI to analyze your health data and provide personalized insights
                        </p>
                      </div>
                      <Switch id="ai-enabled" defaultChecked disabled={loading} />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Using AI responsibly for better health
                    </div>
                    <Button 
                      onClick={handleSaveAiSettings} 
                      className="flex items-center gap-2" 
                      disabled={loading || saveLoading}
                    >
                      {saveLoading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save AI Settings
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-health-primary" />
                      Privacy Settings
                    </CardTitle>
                    <CardDescription>
                      Control how your data is used and shared
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="share-data">Share Data for Research</Label>
                        <p className="text-sm text-muted-foreground">
                          Contribute anonymized data to help improve health analytics
                        </p>
                      </div>
                      <Switch 
                        id="share-data" 
                        checked={shareData}
                        onCheckedChange={setShareData}
                        disabled={loading}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="analytics">Anonymous Usage Analytics</Label>
                        <p className="text-sm text-muted-foreground">
                          Help us improve by sharing anonymous app usage data
                        </p>
                      </div>
                      <Switch 
                        id="analytics" 
                        checked={anonymousAnalytics}
                        onCheckedChange={setAnonymousAnalytics}
                        disabled={loading}
                      />
                    </div>

                    <div className="pt-4">
                      <Label className="mb-2 block">Data Export Options</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Key className="h-3 w-3" />
                          Export All Data
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <MailWarning className="h-3 w-3" />
                          Request Data Deletion
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center text-sm text-amber-500 mr-auto">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      Changes take effect immediately
                    </div>
                    <Button onClick={handleSavePrivacySettings} className="flex items-center gap-2" disabled={loading}>
                      <Save className="h-4 w-4" />
                      Save Privacy Settings
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mail className="mr-2 h-5 w-5 text-health-primary" />
                      Communication Preferences
                    </CardTitle>
                    <CardDescription>
                      Control what types of emails you receive
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <Switch id="marketing-emails" defaultChecked={false} disabled={loading} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="product-updates">Product Updates</Label>
                      <Switch id="product-updates" defaultChecked disabled={loading} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="health-newsletters">Health Newsletters</Label>
                      <Switch id="health-newsletters" defaultChecked disabled={loading} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="ml-auto" disabled={loading}>Save Preferences</Button>
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
