import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clipboard, Database, AlertTriangle, CheckCircle, DownloadCloud, ArrowRight } from 'lucide-react';
import { initializeDatabase } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

export function DatabaseSetup() {
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  const handleInitializeDatabase = async () => {
    setLoading(true);
    try {
      const { success, error, message, warning } = await initializeDatabase();
      
      if (success) {
        setInitialized(true);
        toast({
          title: warning ? 'Database Already Set Up' : 'Database initialized',
          description: message || 'Database tables have been initialized successfully.',
          variant: warning ? 'default' : 'default',
        });
      } else {
        // Check for common errors
        let errorMessage = error?.message || 'Failed to initialize database.';
        
        toast({
          title: 'Initialization failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Failed to initialize database:', err);
      toast({
        title: 'Initialization failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'SQL script copied to clipboard.',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5 text-primary" />
          Database Setup
        </CardTitle>
        <CardDescription>
          Set up the database structure for the wellbeing dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="automatic">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="automatic">Automatic Setup</TabsTrigger>
            <TabsTrigger value="manual">Manual Setup</TabsTrigger>
          </TabsList>
          <TabsContent value="automatic" className="pt-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-slate-50 dark:bg-slate-800">
                <h3 className="font-medium mb-2">Automatic Database Initialization</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Click the button below to automatically initialize the database tables. This requires proper Supabase credentials to be configured.
                </p>
                <Button 
                  onClick={handleInitializeDatabase} 
                  disabled={loading || initialized}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Initializing...
                    </>
                  ) : initialized ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Initialized
                    </>
                  ) : (
                    <>
                      <DownloadCloud className="h-4 w-4" />
                      Initialize Database
                    </>
                  )}
                </Button>
              </div>
              
              {initialized && (
                <div className="p-4 border border-green-200 rounded-md bg-green-50 dark:bg-green-900/20 dark:border-green-900 text-green-800 dark:text-green-200">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Database Initialized Successfully</h3>
                      <p className="text-sm mt-1">
                        All required tables have been created. You can now start using the application.
                      </p>
                      <div className="mt-3">
                        <Button variant="outline" size="sm" className="text-xs">
                          <ArrowRight className="h-3 w-3 mr-1" />
                          Continue to Dashboard
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="manual" className="pt-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 text-amber-800 dark:text-amber-200">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Manual Setup Instructions</h3>
                    <p className="text-sm mt-1">
                      If automatic setup fails, you can manually run the SQL script in your Supabase SQL editor.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <pre className="p-4 bg-slate-900 text-slate-50 rounded-md text-xs overflow-auto max-h-[400px]">
                  {`-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create or update the profiles table structure
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  age INTEGER,
  blood_group TEXT,
  height DECIMAL,
  weight DECIMAL,
  gender TEXT,
  preferences JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop existing policies before recreating them
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create Row Level Security policies
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);`}
                </pre>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 bg-white bg-opacity-80 hover:bg-opacity-100 dark:bg-slate-800 dark:bg-opacity-80"
                  onClick={() => copyToClipboard(`-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create or update the profiles table structure
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  age INTEGER,
  blood_group TEXT,
  height DECIMAL,
  weight DECIMAL,
  gender TEXT,
  preferences JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop existing policies before recreating them
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create Row Level Security policies
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);`)}
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-sm">
                <h3 className="font-medium mb-2">Steps to Set Up Manually:</h3>
                <ol className="list-decimal ml-5 space-y-2">
                  <li>Log in to your Supabase dashboard</li>
                  <li>Navigate to the SQL Editor</li>
                  <li>Create a new query</li>
                  <li>Paste the SQL script above</li>
                  <li>Click "Run" to execute the script</li>
                  <li>Return to the application and refresh</li>
                </ol>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Need help? Check out the <a href="/SUPABASE_SETUP.md" className="underline">Supabase setup guide</a>.
        </p>
      </CardFooter>
    </Card>
  );
} 