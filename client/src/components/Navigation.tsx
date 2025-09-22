'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Film, User, LogOut, Plus, Home, Star, TestTube } from 'lucide-react';

export function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav className="glass-effect sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Film className="h-8 w-8 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MovieHub
              </span>
              <p className="text-xs text-gray-600 -mt-1">Rate & Review Movies</p>
            </div>
          </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-8">
                <Link
                  href="/"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105"
                >
                  <Home className="h-5 w-5" />
                  <span className="font-medium">Home</span>
                </Link>

                {user && (
                  <Link
                    href="/movies/new"
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="h-5 w-5" />
                    <span className="font-medium">Add Movie</span>
                  </Link>
                )}

                {user && user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105"
                  >
                    <Star className="h-5 w-5" />
                    <span className="font-medium">Admin</span>
                  </Link>
                )}

                <Link
                  href="/test-api"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105"
                >
                  <TestTube className="h-5 w-5" />
                  <span className="font-medium">API Test</span>
                </Link>
              </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                  <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-800">
                      {user.name}
                    </span>
                    {user.role === 'admin' && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs font-medium text-yellow-600">Admin</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  icon={<LogOut className="h-4 w-4" />}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" icon={<User className="h-4 w-4" />}>
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
