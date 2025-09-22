'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { moviesAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function TestAPIPage() {
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  const { data: moviesData, isLoading, error } = useQuery({
    queryKey: ['movies-test'],
    queryFn: () => moviesAPI.getAll({ limit: 5 }),
  });

  const testAPI = async () => {
    try {
      // Test root endpoint
      const rootResponse = await fetch('https://moviehub-uc48.onrender.com/');
      const rootData = await rootResponse.json();
      setTestResults(prev => ({ ...prev, root: { success: true, data: rootData } }));

      // Test health endpoint
      const healthResponse = await fetch('https://moviehub-uc48.onrender.com/health');
      const healthData = await healthResponse.json();
      setTestResults(prev => ({ ...prev, health: { success: true, data: healthData } }));

      // Test movies API
      const moviesResponse = await moviesAPI.getAll({ limit: 3 });
      setTestResults(prev => ({ ...prev, movies: { success: true, data: moviesResponse.data } }));

    } catch (error) {
      setTestResults(prev => ({ ...prev, error: { success: false, error } }));
    }
  };

  const getStatusIcon = (result: any) => {
    if (!result) return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />;
    if (result.success) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 API Integration Test
          </h1>
          <p className="text-lg text-gray-600">
            Testing connection between frontend and live backend API
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Backend Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Backend Status</span>
                <span className="text-green-500">🟢</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>URL:</strong> https://moviehub-uc48.onrender.com/</p>
                <p><strong>Status:</strong> <span className="text-green-600">Live & Running</span></p>
                <p><strong>CORS:</strong> <span className="text-green-600">Configured</span></p>
              </div>
            </CardContent>
          </Card>

          {/* Frontend Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Frontend Status</span>
                <span className="text-blue-500">🔵</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Environment:</strong> {process.env.NODE_ENV || 'development'}</p>
                <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'https://moviehub-uc48.onrender.com/api'}</p>
                <p><strong>Status:</strong> <span className="text-blue-600">Connected</span></p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>API Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={testAPI} className="w-full">
                Run API Tests
              </Button>
              
              {Object.entries(testResults).map(([key, result]) => (
                <div key={key} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getStatusIcon(result)}
                  <span className="font-medium text-gray-900 capitalize">{key}</span>
                  {result && (
                    <span className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                      {result.success ? 'Success' : 'Failed'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Movies Data Test */}
        <Card>
          <CardHeader>
            <CardTitle>Movies API Test (React Query)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2">Loading movies...</span>
              </div>
            )}
            
            {error && (
              <div className="flex items-center justify-center py-8 text-red-500">
                <XCircle className="h-8 w-8" />
                <span className="ml-2">Error loading movies: {error.message}</span>
              </div>
            )}
            
            {moviesData && (
              <div className="space-y-4">
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Successfully loaded {moviesData.data.data?.length || 0} movies</span>
                </div>
                
                {moviesData.data.data?.slice(0, 3).map((movie: any) => (
                  <div key={movie._id} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900">{movie.title}</h3>
                    <p className="text-sm text-gray-600">{movie.genre} • {movie.releaseYear}</p>
                    <p className="text-sm text-gray-500 mt-1">{movie.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}