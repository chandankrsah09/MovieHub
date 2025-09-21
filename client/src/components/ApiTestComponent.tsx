'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moviesAPI, authAPI, commentsAPI, adminAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function ApiTestComponent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  // Test Auth APIs
  const testAuth = async () => {
    try {
      // Test register
      const registerResult = await authAPI.register({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      });
      setTestResults(prev => ({ ...prev, register: { success: true, data: registerResult.data } }));

      // Test login
      const loginResult = await authAPI.login({
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      });
      setTestResults(prev => ({ ...prev, login: { success: true, data: loginResult.data } }));

      return { success: true };
    } catch (error) {
      setTestResults(prev => ({ ...prev, auth: { success: false, error } }));
      return { success: false, error };
    }
  };

  // Test Movies APIs
  const testMovies = async () => {
    try {
      // Test get all movies
      const moviesResult = await moviesAPI.getAll();
      setTestResults(prev => ({ ...prev, getMovies: { success: true, data: moviesResult.data } }));

      // Test create movie (if user is logged in)
      if (user) {
        const createResult = await moviesAPI.create({
          title: 'Test Movie',
          description: 'This is a test movie description',
          genre: 'Action',
          releaseYear: 2025,
          director: 'Test Director'
        });
        setTestResults(prev => ({ ...prev, createMovie: { success: true, data: createResult.data } }));
      }

      return { success: true };
    } catch (error) {
      setTestResults(prev => ({ ...prev, movies: { success: false, error } }));
      return { success: false, error };
    }
  };

  // Test Comments APIs
  const testComments = async () => {
    try {
      if (user) {
        // Get first movie to test comments
        const moviesResult = await moviesAPI.getAll();
        if (moviesResult.data.data && moviesResult.data.data.length > 0) {
          const movieId = moviesResult.data.data[0]._id;
          
          // Test get comments
          const commentsResult = await commentsAPI.getByMovie(movieId);
          setTestResults(prev => ({ ...prev, getComments: { success: true, data: commentsResult.data } }));

          // Test create comment
          const createCommentResult = await commentsAPI.create(movieId, 'This is a test comment');
          setTestResults(prev => ({ ...prev, createComment: { success: true, data: createCommentResult.data } }));
        }
      }
      return { success: true };
    } catch (error) {
      setTestResults(prev => ({ ...prev, comments: { success: false, error } }));
      return { success: false, error };
    }
  };

  // Test Admin APIs
  const testAdmin = async () => {
    try {
      if (user && user.role === 'admin') {
        // Test get admin stats
        const statsResult = await adminAPI.getStats();
        setTestResults(prev => ({ ...prev, getAdminStats: { success: true, data: statsResult.data } }));

        // Test get all users
        const usersResult = await adminAPI.getAllUsers();
        setTestResults(prev => ({ ...prev, getAdminUsers: { success: true, data: usersResult.data } }));
      }
      return { success: true };
    } catch (error) {
      setTestResults(prev => ({ ...prev, admin: { success: false, error } }));
      return { success: false, error };
    }
  };

  const runAllTests = async () => {
    setTestResults({});
    await testAuth();
    await testMovies();
    await testComments();
  };

  const getStatusIcon = (result: { success: boolean; data?: any; error?: any } | null) => {
    if (!result) return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />;
    if (result.success) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900">API Testing Dashboard</h2>
        <p className="text-gray-600">Test all API endpoints to ensure they're working correctly</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Test Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button onClick={testAuth} variant="outline">
              Test Auth APIs
            </Button>
            <Button onClick={testMovies} variant="outline">
              Test Movies APIs
            </Button>
            <Button onClick={testComments} variant="outline">
              Test Comments APIs
            </Button>
            <Button onClick={runAllTests} className="bg-gradient-to-r from-blue-600 to-purple-600">
              Run All Tests
            </Button>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
            
            {Object.entries(testResults).map(([key, result]) => (
              <div key={key} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {getStatusIcon(result)}
                <span className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                {result && (
                  <span className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {result.success ? 'Success' : 'Failed'}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* User Status */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Current User Status</h4>
            {user ? (
              <div className="text-blue-800">
                <p>✅ Logged in as: {user.name}</p>
                <p>📧 Email: {user.email}</p>
                <p>👤 Role: {user.role}</p>
              </div>
            ) : (
              <p className="text-blue-800">❌ Not logged in - Some APIs require authentication</p>
            )}
          </div>

          {/* API Endpoints Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Available API Endpoints</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-gray-800">Authentication</h5>
                <ul className="text-gray-600 space-y-1">
                  <li>POST /api/auth/register</li>
                  <li>POST /api/auth/login</li>
                  <li>GET /api/auth/profile</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-800">Movies</h5>
                <ul className="text-gray-600 space-y-1">
                  <li>GET /api/movies</li>
                  <li>GET /api/movies/:id</li>
                  <li>POST /api/movies</li>
                  <li>POST /api/movies/:id/vote</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-800">Comments</h5>
                <ul className="text-gray-600 space-y-1">
                  <li>GET /api/movies/:id/comments</li>
                  <li>POST /api/movies/:id/comments</li>
                  <li>PUT /api/comments/:id</li>
                  <li>DELETE /api/comments/:id</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
