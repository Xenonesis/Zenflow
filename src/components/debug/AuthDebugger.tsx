import React, { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

export const AuthDebugger = () => {
  const { user, session, loading } = useAuth();

  useEffect(() => {
    // Check Supabase connection on component mount
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (error) {
          console.error('Supabase connection test failed:', error.message);
        } else {
          console.log('Supabase connection test passed');
        }
      } catch (err) {
        console.error('Supabase connection test exception:', err);
      }
    };

    checkConnection();
  }, []);

  // Convert objects to pretty JSON strings for display
  const userStr = user ? JSON.stringify(user, null, 2) : 'null';
  const sessionStr = session ? JSON.stringify(session, null, 2) : 'null';

  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      right: '16px',
      width: '400px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 9999,
      maxHeight: '80vh',
      overflow: 'auto'
    }}>
      <h3 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
        Auth Debugger
      </h3>
      <div style={{ marginBottom: '8px' }}>
        <strong>Status: </strong>
        {loading ? 'Loading...' : user ? 'Authenticated' : 'Not authenticated'}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>User:</strong>
        <pre style={{ 
          whiteSpace: 'pre-wrap', 
          wordBreak: 'break-word',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '8px',
          borderRadius: '4px'
        }}>
          {userStr}
        </pre>
      </div>
      
      <div>
        <strong>Session:</strong>
        <pre style={{ 
          whiteSpace: 'pre-wrap', 
          wordBreak: 'break-word',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '8px',
          borderRadius: '4px'
        }}>
          {sessionStr}
        </pre>
      </div>
    </div>
  );
}; 