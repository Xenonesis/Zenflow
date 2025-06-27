import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { AuthDebugger } from '@/components/debug/AuthDebugger';

export default function TestPage() {
  const { user } = useAuth();
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '16px'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        padding: '24px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Test Page</h1>
        <p style={{ marginBottom: '16px' }}>If you can see this page, routing is working correctly!</p>
        
        <div style={{ 
          backgroundColor: '#f3f4f6', 
          padding: '16px', 
          borderRadius: '8px' 
        }}>
          <h2 style={{ fontWeight: '600', marginBottom: '8px' }}>User Info:</h2>
          {user ? (
            <div>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>ID:</strong> {user.id}</p>
            </div>
          ) : (
            <p>Not logged in</p>
          )}
        </div>
        
        <div style={{ marginTop: '24px' }}>
          <a 
            href="/dashboard" 
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: '500'
            }}
          >
            Go to Dashboard
          </a>
        </div>
      </div>
      
      <AuthDebugger />
    </div>
  );
} 