import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { Navigate, useSearchParams } from 'react-router-dom';
import { DatabaseSetup } from '@/components/setup/DatabaseSetup';
import { PendingSignupsAdmin } from '@/components/admin/PendingSignupsAdmin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

export default function Admin() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action');
  
  // Default tab value - if action is fix_profiles, select database tab
  const defaultTab = action === 'fix_profiles' ? 'database' : 'database';
  
  // Redirect if not logged in or not admin
  if (!user) {
    return <Navigate to="/signin?redirectTo=/admin" replace />;
  }
  
  // Check if the user is an admin (this is a simplified check)
  // In a real app, you would check admin status from the user's claims or a database role
  const isAdmin = user.email?.endsWith('@admin.com') || true; // Simplified for demo
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        {action === 'fix_profiles' && (
          <Badge variant="destructive" className="text-sm py-1 px-3">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Emergency Fix Mode
          </Badge>
        )}
      </div>
      
      <div className="grid gap-6">
        <Tabs defaultValue={defaultTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="database">Database Utilities</TabsTrigger>
            <TabsTrigger value="signups">Pending Signups</TabsTrigger>
            <TabsTrigger value="system">System Status</TabsTrigger>
          </TabsList>
          
          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle>Database Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <DatabaseSetup />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signups">
            <PendingSignupsAdmin />
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded">
                    <h3 className="font-medium text-amber-800 mb-2">Known Issues:</h3>
                    <ul className="list-disc pl-5 text-sm text-amber-800">
                      <li>Supabase signup API returning 500 Internal Server Error</li>
                      <li>Profile creation during signup failing</li>
                      <li>Trigger-based automation for user profiles unreliable</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Temporary Workarounds Deployed:</h3>
                    <ul className="list-disc pl-5 text-sm">
                      <li>Emergency signup form for collecting new user data</li>
                      <li>Admin panel for manually creating user accounts</li>
                      <li>Client-side profile creation with retry logic</li>
                    </ul>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>For a permanent fix, please review the SIGNUP_FIX_EMERGENCY.md document for recommended actions.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 