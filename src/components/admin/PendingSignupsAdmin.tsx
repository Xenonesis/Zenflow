import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, UserPlus, Download, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type PendingSignup = {
  email: string;
  fullName: string;
  password: string;
  requestDate: string;
  status: 'pending' | 'created' | 'rejected';
};

export function PendingSignupsAdmin() {
  const [pendingSignups, setPendingSignups] = useState<PendingSignup[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load pending signups from localStorage
  useEffect(() => {
    loadPendingSignups();
  }, []);

  const loadPendingSignups = () => {
    try {
      const stored = localStorage.getItem('pendingSignups');
      if (stored) {
        const parsed = JSON.parse(stored);
        setPendingSignups(parsed);
      }
    } catch (err) {
      console.error('Error loading pending signups:', err);
      setMessage({ type: 'error', text: 'Failed to load pending signup requests' });
    }
  };

  const updateSignups = (updated: PendingSignup[]) => {
    setPendingSignups(updated);
    localStorage.setItem('pendingSignups', JSON.stringify(updated));
  };

  const createUser = async (signup: PendingSignup) => {
    setLoading(true);
    setMessage(null);
    
    try {
      // Using the admin API to create a user
      // Note: In a real implementation, this should go through a secure backend
      // This is just a demonstration and won't actually work client-side
      // due to CORS and security restrictions
      const { data, error } = await supabase.auth.admin.createUser({
        email: signup.email,
        password: signup.password,
        email_confirm: true,
        user_metadata: {
          full_name: signup.fullName
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.user) {
        // Create profile for the user
        await supabase
          .from('profiles')
          .upsert({
            user_id: data.user.id,
            full_name: signup.fullName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        // Update the status in the local storage
        const updated = pendingSignups.map(s => 
          s.email === signup.email 
            ? { ...s, status: 'created' as const } 
            : s
        );
        
        updateSignups(updated);
        setMessage({ type: 'success', text: `User ${signup.email} created successfully` });
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setMessage({ 
        type: 'error', 
        text: `Failed to create user: ${err instanceof Error ? err.message : 'Unknown error'}`
      });
    } finally {
      setLoading(false);
    }
  };

  const rejectSignup = (signup: PendingSignup) => {
    const updated = pendingSignups.map(s => 
      s.email === signup.email 
        ? { ...s, status: 'rejected' as const } 
        : s
    );
    
    updateSignups(updated);
    setMessage({ type: 'success', text: `Request for ${signup.email} marked as rejected` });
  };

  const deleteSignup = (signup: PendingSignup) => {
    const updated = pendingSignups.filter(s => s.email !== signup.email);
    updateSignups(updated);
    setMessage({ type: 'success', text: `Request for ${signup.email} deleted` });
  };

  const exportCSV = () => {
    try {
      const headers = ['Email', 'Full Name', 'Password', 'Request Date', 'Status'];
      const csvRows = [
        headers.join(','),
        ...pendingSignups.map(s => 
          [
            s.email,
            `"${s.fullName.replace(/"/g, '""')}"`, // Handle quotes in names
            s.password,
            s.requestDate,
            s.status
          ].join(',')
        )
      ];
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', `pending-signups-${new Date().toISOString().split('T')[0]}.csv`);
      a.click();
      
      setMessage({ type: 'success', text: 'Exported signup requests to CSV' });
    } catch (err) {
      console.error('Error exporting CSV:', err);
      setMessage({ type: 'error', text: 'Failed to export CSV file' });
    }
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to delete ALL pending signup requests?')) {
      updateSignups([]);
      setMessage({ type: 'success', text: 'All pending signup requests cleared' });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pending Signup Requests</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={loadPendingSignups}>
            Refresh
          </Button>
          <Button size="sm" variant="outline" onClick={exportCSV} disabled={pendingSignups.length === 0}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button size="sm" variant="destructive" onClick={clearAll} disabled={pendingSignups.length === 0}>
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {message && (
          <Alert variant={message.type === 'success' ? 'default' : 'destructive'} className="mb-4">
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}
        
        {pendingSignups.length === 0 ? (
          <div className="text-center p-6 text-muted-foreground">
            No pending signup requests
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingSignups.map((signup, index) => (
                  <TableRow key={index}>
                    <TableCell>{signup.email}</TableCell>
                    <TableCell>{signup.fullName}</TableCell>
                    <TableCell>
                      {new Date(signup.requestDate).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {signup.status === 'created' && (
                        <span className="text-green-600 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" /> Created
                        </span>
                      )}
                      {signup.status === 'rejected' && (
                        <span className="text-red-600 flex items-center">
                          <XCircle className="h-4 w-4 mr-1" /> Rejected
                        </span>
                      )}
                      {signup.status === 'pending' && (
                        <span className="text-amber-600">Pending</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {signup.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => createUser(signup)}
                              disabled={loading}
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Create
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rejectSignup(signup)}
                              disabled={loading}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteSignup(signup)}
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>Note:</strong> This admin panel is a temporary solution for handling user registration
            while the Supabase signup issue is being fixed.
          </p>
          <p>
            The actual user creation might not work directly from this UI due to security restrictions.
            Use the Export button to download the signup data and create users through the Supabase dashboard
            or a secure backend API.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 