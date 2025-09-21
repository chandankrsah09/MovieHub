'use client';

import React from 'react';
import { Navigation } from '@/components/Navigation';
import { ApiTestComponent } from '@/components/ApiTestComponent';

export default function ApiTestPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            API Testing Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Test all API endpoints to ensure they're working correctly
          </p>
        </div>
        <ApiTestComponent />
      </main>
    </div>
  );
}
