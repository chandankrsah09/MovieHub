'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { moviesAPI } from '@/lib/api';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { getErrorMessage } from '@/lib/types';
import { Film } from 'lucide-react';
import { toast } from 'react-hot-toast';

const movieSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description is too long'),
  genre: z.string().min(1, 'Genre is required'),
  releaseYear: z.number().min(1888, 'Release year must be after 1888').max(new Date().getFullYear() + 5, 'Release year cannot be more than 5 years in the future'),
  director: z.string().min(2, 'Director name must be at least 2 characters').max(100, 'Director name is too long'),
});

type MovieForm = z.infer<typeof movieSchema>;

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 
  'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History', 
  'Horror', 'Music', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 
  'Sport', 'Thriller', 'War', 'Western'
];

export default function AddMoviePage() {
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MovieForm>({
    resolver: zodResolver(movieSchema),
  });

  const createMovieMutation = useMutation({
    mutationFn: (data: MovieForm & { image?: File }) => {
      console.log('Creating movie:', data);
      return moviesAPI.create(data);
    },
    onSuccess: (response) => {
      console.log('Movie created successfully:', response);
      toast.success(response.data.message || 'Movie created successfully!');
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      router.push(`/movies/${response.data.data?._id}`);
    },
    onError: (err: unknown) => {
      console.log('Movie creation error:', err);
      const errorMessage = getErrorMessage(err) || 'Failed to create movie. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: MovieForm) => {
    setError('');
    createMovieMutation.mutate({ ...data, image: imageFile || undefined });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <Film className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h2>
              <p className="text-gray-600 mb-4">You need to be logged in to add a movie.</p>
              <Button onClick={() => router.push('/login')}>Go to Login</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Add New Movie
          </h1>
          <p className="text-xl text-gray-600">Share a movie with the MovieHub community</p>
        </div>

        <Card className="animate-slide-up">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center text-gray-900">Movie Information</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-bounce-in">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}

              <Input
                label="Movie Title"
                placeholder="Enter the movie title"
                error={errors.title?.message}
                {...register('title')}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Director"
                  placeholder="Enter director name"
                  error={errors.director?.message}
                  {...register('director')}
                />

                <Input
                  label="Release Year"
                  type="number"
                  placeholder="2025"
                  error={errors.releaseYear?.message}
                  {...register('releaseYear', { valueAsNumber: true })}
                />
              </div>

              <Select
                label="Genre"
                options={[
                  { value: '', label: 'Select a genre' },
                  ...GENRES.map(genre => ({ value: genre, label: genre }))
                ]}
                error={errors.genre?.message}
                {...register('genre')}
              />

              <Textarea
                label="Description"
                placeholder="Write a brief description of the movie..."
                rows={6}
                error={errors.description?.message}
                {...register('description')}
              />

              <ImageUpload
                label="Movie Poster (Optional)"
                value={imageFile}
                onChange={setImageFile}
                error=""
              />

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  loading={createMovieMutation.isPending}
                  disabled={createMovieMutation.isPending}
                  className="flex-1"
                  size="lg"
                  icon={<Film className="h-5 w-5" />}
                >
                  Add Movie
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="flex-1"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
