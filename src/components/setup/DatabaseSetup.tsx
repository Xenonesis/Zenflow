import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// This component can be used by administrators to fix database issues
export function DatabaseSetup() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const location = useLocation();
  const [functionAvailable, setFunctionAvailable] = useState<boolean | null>(null);
  
  // Auth system check state
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [authStatus, setAuthStatus] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [emailCheckResult, setEmailCheckResult] = useState<any>(null);

  // Auto-trigger fix if redirected with action=fix_profiles
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const action = searchParams.get('action');
    
    if (action === 'fix_profiles' && !isRunning && !result) {
      // Automatically run the direct fix when redirected from signup form
      runDirectFix();
    }
  }, [location.search]);

  // Check if the fix function is available
  useEffect(() => {
    const checkFunction = async () => {
      try {
        const { data, error } = await supabase.rpc('check_if_function_exists', {
          function_name: 'fix_profile_creation'
        });
        
        if (error) {
          console.warn('Error checking function availability:', error);
          setFunctionAvailable(false);
        } else {
          setFunctionAvailable(!!data);
        }
      } catch (err) {
        console.warn('Failed to check function availability:', err);
        setFunctionAvailable(false);
      }
    };
    
    checkFunction();
  }, []);

  const runProfilesFix = async () => {
    setIsRunning(true);
    setResult(null);
    
    try {
      // Call the database function to fix profile creation
      const { data, error } = await supabase.rpc('fix_profile_creation');
      
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }
      
      // Handle the response
      if (data.success) {
        setStats({
          profiles: data.profiles_count || 0,
          users: data.users_count || 0,
          fixed: data.missing_profiles_fixed || 0
        });
        
        setResult({ 
          success: true, 
          message: 'Database fix applied successfully. Profile creation trigger is now working.'
        });
      } else {
        throw new Error(data.error || 'Unknown error in fix operation');
      }
    } catch (err) {
      console.error('Failed to run profile fix:', err);
      setResult({ 
        success: false, 
        message: err instanceof Error ? err.message : 'Unknown error occurred'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runDirectFix = async () => {
    setIsRunning(true);
    setResult(null);
    
    try {
      // 1. First, drop existing trigger that might be problematic
      await supabase.rpc('execute_sql', {
        sql: "DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users; DROP FUNCTION IF EXISTS public.create_profile_for_new_user() CASCADE;"
      });
      
      // 2. Set extremely permissive RLS policies
      await supabase.rpc('execute_sql', {
        sql: `
          DROP POLICY IF EXISTS "Anyone can insert profiles" ON public.profiles;
          CREATE POLICY "Anyone can insert profiles" 
            ON public.profiles 
            FOR INSERT WITH CHECK (true);
            
          GRANT ALL ON public.profiles TO authenticated;
          GRANT ALL ON public.profiles TO service_role;
          GRANT ALL ON public.profiles TO anon;
        `
      });
      
      // 3. Find any users missing profiles and create them
      const { data: usersData } = await supabase
        .from('auth.users')
        .select('id');
        
      if (usersData) {
        // Create any missing profiles
        const promises = usersData.map(async (user) => {
          await supabase
            .from('profiles')
            .upsert({
              user_id: user.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
        });
        
        await Promise.all(promises);
      }
      
      setResult({ 
        success: true, 
        message: 'Direct fix applied. Signup should work now through client-side handling.'
      });
      
    } catch (err) {
      console.error('Failed to run direct fix:', err);
      setResult({ 
        success: false, 
        message: err instanceof Error ? err.message : 'Unknown error occurred'
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  // Function to check authentication system status
  const checkAuthSystem = async () => {
    setIsCheckingAuth(true);
    setAuthStatus(null);
    
    try {
      // Check if auth is accessible
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      // Verify authentication endpoints
      const signInEndpoint = `${supabase.supabaseUrl}/auth/v1/token?grant_type=password`;
      const response = await fetch(signInEndpoint, {
        method: 'HEAD',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabase.supabaseKey as string
        }
      });
      
      const endpointStatus = response.status >= 400 && response.status < 500 ? 'OK' : 'Error';
      
      setAuthStatus({
        accessible: !sessionError,
        session: sessionData?.session ? 'Active' : 'None',
        sessionError: sessionError ? sessionError.message : null,
        signInEndpoint: endpointStatus,
        lastChecked: new Date().toLocaleTimeString()
      });
    } catch (err) {
      console.error('Auth check error:', err);
      setAuthStatus({
        accessible: false,
        error: err instanceof Error ? err.message : 'Unknown error checking auth',
        lastChecked: new Date().toLocaleTimeString()
      });
    } finally {
      setIsCheckingAuth(false);
    }
  };
  
  // Function to check if an email exists in the auth system
  const checkEmailExists = async () => {
    if (!email || !email.includes('@')) {
      setEmailCheckResult({
        valid: false,
        message: 'Please enter a valid email address'
      });
      return;
    }
    
    setEmailCheckResult({ loading: true });
    
    try {
      // Try a password reset request - will tell us if the email exists without exposing data
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        if (error.message.includes('not found')) {
          setEmailCheckResult({
            exists: false,
            message: 'This email is not registered in the system'
          });
        } else {
          setEmailCheckResult({
            error: true,
            message: error.message
          });
        }
      } else {
        setEmailCheckResult({
          exists: true,
          message: 'This email exists in the system. A password reset email was sent.'
        });
      }
    } catch (err) {
      console.error('Email check error:', err);
      setEmailCheckResult({
        error: true,
        message: err instanceof Error ? err.message : 'Error checking email'
      });
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Database Maintenance</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profiles" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profiles">Profile Fixes</TabsTrigger>
            <TabsTrigger value="auth">Auth Checks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profiles" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This utility fixes issues with user profile creation during signup.
                Run this if new users are experiencing problems signing up with the error:
                "Database error saving new user".
              </p>
              
              {functionAvailable === false && (
                <Alert variant="destructive">
                  <AlertTitle>
                    <AlertTriangle className="h-4 w-4 inline mr-2" />
                    Function Not Available
                  </AlertTitle>
                  <AlertDescription>
                    The fix_profile_creation function is not installed on your Supabase instance.
                    Please run the SQL script in scripts/create-fix-profile-function.sql in the Supabase SQL Editor first.
                  </AlertDescription>
                </Alert>
              )}
              
              {result && (
                <Alert variant={result.success ? "default" : "destructive"}>
                  <AlertTitle>
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 inline mr-2" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 inline mr-2" />
                    )}
                    {result.success ? 'Success' : 'Error'}
                  </AlertTitle>
                  <AlertDescription>{result.message}</AlertDescription>
                </Alert>
              )}
              
              {stats && (
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="bg-muted rounded p-2 text-center">
                    <div className="text-xl font-medium">{stats.users}</div>
                    <div className="text-xs text-muted-foreground">Users</div>
                  </div>
                  <div className="bg-muted rounded p-2 text-center">
                    <div className="text-xl font-medium">{stats.profiles}</div>
                    <div className="text-xs text-muted-foreground">Profiles</div>
                  </div>
                  <div className="bg-muted rounded p-2 text-center">
                    <Badge variant="outline" className="bg-primary/20">+{stats.fixed}</Badge>
                    <div className="text-xs text-muted-foreground">Fixed</div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="auth" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Check authentication system status and verify user emails.
                Use this to troubleshoot login issues.
              </p>
              
              <div className="space-y-2">
                <Button 
                  onClick={checkAuthSystem}
                  disabled={isCheckingAuth}
                  className="w-full"
                >
                  {isCheckingAuth ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking Auth System...
                    </>
                  ) : 'Check Auth System Status'}
                </Button>
                
                {authStatus && (
                  <Alert variant={authStatus.accessible ? "default" : "destructive"}>
                    <AlertTitle>
                      {authStatus.accessible ? (
                        <CheckCircle className="h-4 w-4 inline mr-2" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 inline mr-2" />
                      )}
                      Auth System Status
                    </AlertTitle>
                    <AlertDescription>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div>System Accessible:</div>
                        <div>{authStatus.accessible ? 'Yes' : 'No'}</div>
                        
                        {authStatus.session && (
                          <>
                            <div>Current Session:</div>
                            <div>{authStatus.session}</div>
                          </>
                        )}
                        
                        {authStatus.signInEndpoint && (
                          <>
                            <div>Sign-in Endpoint:</div>
                            <div>{authStatus.signInEndpoint}</div>
                          </>
                        )}
                        
                        {authStatus.error && (
                          <>
                            <div>Error:</div>
                            <div>{authStatus.error}</div>
                          </>
                        )}
                        
                        <div>Last Checked:</div>
                        <div>{authStatus.lastChecked}</div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="email-check">Check if email exists in auth system</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="email-check" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com" 
                  />
                  <Button onClick={checkEmailExists} disabled={emailCheckResult?.loading}>
                    {emailCheckResult?.loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : 'Check'}
                  </Button>
                </div>
                
                {emailCheckResult && !emailCheckResult.loading && (
                  <Alert variant={emailCheckResult.error ? "destructive" : emailCheckResult.exists ? "default" : "warning"}>
                    <AlertDescription>{emailCheckResult.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button 
          onClick={runProfilesFix}
          disabled={isRunning || functionAvailable === false}
          className="w-full"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Fix...
            </>
          ) : 'Fix Profile Creation'}
        </Button>
        
        <Button 
          onClick={runDirectFix}
          variant="outline"
          disabled={isRunning}
          className="w-full"
        >
          Apply Direct Fix (Bypass Triggers)
        </Button>
      </CardFooter>
    </Card>
  );
} 