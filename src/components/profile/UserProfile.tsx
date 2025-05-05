import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/auth-context';
import { userData, UserProfile as UserProfileType, Gender, fileStorage } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Upload } from 'lucide-react';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const profileFormSchema = z.object({
  full_name: z.string().min(2, { message: 'Name must be at least 2 characters' }).optional(),
  avatar_url: z.string().optional(),
  age: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive().int().optional()
  ),
  blood_group: z.string().optional(),
  height: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive().optional()
  ),
  weight: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive().optional()
  ),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
});

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasAttemptedLoading = useRef(false);
  const loadAttempts = useRef(0);
  const MAX_LOAD_ATTEMPTS = 3;

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: '',
      avatar_url: '',
      age: undefined,
      blood_group: '',
      height: undefined,
      weight: undefined,
      gender: undefined,
    },
  });

  const loadProfile = React.useCallback(async (forceRefresh = false) => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    if (hasAttemptedLoading.current && !forceRefresh) {
      return;
    }
    
    hasAttemptedLoading.current = true;
    loadAttempts.current += 1;
    console.log(`Loading profile data for user (attempt ${loadAttempts.current}):`, user.id);
    setLoading(true);
    
    try {
      const startTime = performance.now();
      const { data, error } = await userData.getUserProfile(user.id);
      const endTime = performance.now();
      console.log(`Profile data fetched in ${(endTime - startTime).toFixed(2)}ms`);
      
      if (error) {
        console.error('Error loading profile:', error);
        setError(`Failed to load profile: ${error.message}`);
        
        if (loadAttempts.current < MAX_LOAD_ATTEMPTS) {
          setTimeout(() => {
            console.log(`Retrying profile load (attempt ${loadAttempts.current + 1})`);
            loadProfile(true);
          }, 1000);
        }
        return;
      }
      
      if (data) {
        console.log('Profile data loaded successfully');
        loadAttempts.current = 0;
        setProfile(data);
        setError(null);
        form.reset({
          full_name: data.full_name || '',
          avatar_url: data.avatar_url || '',
          age: data.age || undefined,
          blood_group: data.blood_group || '',
          height: data.height || undefined,
          weight: data.weight || undefined,
          gender: data.gender || undefined,
        });
      } else {
        console.log('No profile data found');
        if (loadAttempts.current < MAX_LOAD_ATTEMPTS) {
          setTimeout(() => {
            console.log(`Retrying profile load (attempt ${loadAttempts.current + 1})`);
            loadProfile(true);
          }, 1000);
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError(`Failed to load profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [user, form]);

  useEffect(() => {
    if (user && !profile) {
      console.log('Initiating immediate profile load');
      loadProfile();
    }
  }, [user, profile, loadProfile]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (user && !profile && !loading && !error) {
        console.log('Initiating delayed profile load');
        loadProfile(true);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [user, profile, loading, error, loadProfile]);

  // Add effect to update avatar_url in form when profile changes
  useEffect(() => {
    if (profile && profile.avatar_url) {
      console.log('Updating form with avatar_url from profile:', profile.avatar_url);
      form.setValue('avatar_url', profile.avatar_url);
    }
  }, [profile, form]);

  const handleRetryLoading = () => {
    hasAttemptedLoading.current = false;
    loadAttempts.current = 0;
    setError(null);
    loadProfile(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Invalid file type. Please upload a JPEG, PNG or WebP image.");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("File size too large. Maximum size is 2MB.");
      return;
    }

    setSelectedFile(file);
    setError(null);
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
        setError(error.message);
        return null;
      }
      
      if (data) {
        form.setValue('avatar_url', data.url);
        return data.url;
      }
      
      return null;
    } catch (err) {
      console.error('Failed to upload image:', err);
      setError('Failed to upload image');
      return null;
    } finally {
      setUploadProgress(null);
      setSelectedFile(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    if (!user) return;
    
    setError(null);
    setSuccess(null);
    setSaving(true);
    
    try {
      console.log('Starting profile update process');
      console.log('Form values:', JSON.stringify(values, null, 2));
      
      // First upload image if there's a selected file
      let avatarUrl = values.avatar_url;
      let uploadError = null;
      
      if (selectedFile) {
        console.log('Uploading profile image');
        avatarUrl = await uploadProfileImage();
        
        // Check if there was an error uploading the image
        if (!avatarUrl) {
          uploadError = 'Failed to upload image';
          console.error('Image upload failed, but continuing with profile update');
          // We'll continue with the profile update, but without the new avatar
        } else {
          console.log('Image uploaded successfully:', avatarUrl);
        }
      } else if (profile?.avatar_url && !avatarUrl) {
        // Preserve existing avatar_url if not changed
        console.log('Preserving existing avatar URL:', profile.avatar_url);
        avatarUrl = profile.avatar_url;
      }
      
      // Prepare update data with explicit avatar_url
      const updateData = {
        ...values,
        avatar_url: avatarUrl || null, // Use null instead of undefined to make it explicit
      };
      
      console.log('Sending profile update with data:', JSON.stringify(updateData, null, 2));
      
      const { data, error: updateError } = await userData.updateUserProfile(user.id, updateData);
      
      if (updateError) {
        console.error('Profile update failed:', updateError);
        setError(`Failed to update profile: ${updateError.message}${uploadError ? '. Also, ' + uploadError : ''}`);
        return;
      }
      
      if (data) {
        console.log('Profile updated successfully:', data);
        setProfile(data);
        
        if (uploadError) {
          // Show a partial success message if the avatar upload failed
          setSuccess('Profile updated successfully, but avatar upload failed.');
        } else {
          setSuccess('Profile updated successfully');
        }
        
        // Refresh the form with the latest data, ensuring we preserve the avatar_url
        form.reset({
          full_name: data.full_name || '',
          avatar_url: data.avatar_url || '',
          age: data.age || undefined,
          blood_group: data.blood_group || '',
          height: data.height || undefined,
          weight: data.weight || undefined,
          gender: data.gender || undefined,
        });
      } else {
        setError('Profile was updated but no data was returned');
      }
    } catch (err) {
      console.error('Unexpected error in profile update:', err);
      setError(`Failed to update profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>You need to be signed in to view your profile</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          {loading ? (
            <Skeleton className="h-12 w-12 rounded-full" />
          ) : (
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || user.email} />
              <AvatarFallback>
                {profile?.full_name
                  ? profile.full_name.charAt(0).toUpperCase()
                  : user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <div>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your profile information</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="flex justify-center items-center py-8">
              <div className="text-center">
                <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                <Skeleton className="h-4 w-48 mx-auto mb-2" />
                <Skeleton className="h-4 w-32 mx-auto" />
                <p className="text-sm text-muted-foreground mt-4">Loading profile data...</p>
              </div>
            </div>
          </div>
        ) : error && !profile ? (
          <div className="py-8 text-center">
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={handleRetryLoading}>Retry Loading</Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
                <div className="space-y-6">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-24 w-24">
                      <AvatarImage 
                        src={selectedFile ? URL.createObjectURL(selectedFile) : profile?.avatar_url || undefined} 
                        alt={profile?.full_name || user.email} 
                      />
                      <AvatarFallback className="text-lg">
                        {profile?.full_name
                          ? profile.full_name.charAt(0).toUpperCase()
                          : user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
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
                        {selectedFile ? selectedFile.name : "Upload Picture"}
                      </Button>
                      
                      {uploadProgress !== null && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                      
                      <FormDescription className="text-center text-sm mt-1">
                        Click to upload a profile picture (JPEG, PNG, WebP, max 2MB)
                      </FormDescription>
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Health Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Your age" 
                            {...field}
                            value={field.value === undefined ? '' : field.value}
                            onChange={e => {
                              const value = e.target.value;
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="blood_group"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Group</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {bloodGroups.map(group => (
                              <SelectItem key={group} value={group}>{group}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="Height in cm" 
                            {...field}
                            value={field.value === undefined ? '' : field.value}
                            onChange={e => {
                              const value = e.target.value;
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="Weight in kg" 
                            {...field}
                            value={field.value === undefined ? '' : field.value}
                            onChange={e => {
                              const value = e.target.value;
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={saving || loading}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <p>Email: {user.email}</p>
      </CardFooter>
    </Card>
  );
} 