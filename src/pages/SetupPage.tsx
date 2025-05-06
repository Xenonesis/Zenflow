import React from 'react';
import { DatabaseSetup } from '@/components/setup/DatabaseSetup';

export default function SetupPage() {
  return (
    <div className="container max-w-md py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Database Maintenance</h1>
      <DatabaseSetup />
    </div>
  );
} 