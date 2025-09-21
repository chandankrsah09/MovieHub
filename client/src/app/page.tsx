'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moviesAPI, Vote } from '@/lib/api';
import { Navigation } from '@/components/Navigation';
import { MovieCard } from '@/components/MovieCard';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Search, Filter, Star, Calendar, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const GENRES = [
  { value: '', label: 'All Genres' },
  { value: 'Action', label: 'Action' },
  { value: 'Adventure', label: 'Adventure' },
  { value: 'Animation', label: 'Animation' },
  { value: 'Biography', label: 'Biography' },
  { value: 'Comedy', label: 'Comedy' },
  { value: 'Crime', label: 'Crime' },
  { value: 'Documentary', label: 'Documentary' },
  { value: 'Drama', label: 'Drama' },
  { value: 'Family', label: 'Family' },
  { value: 'Fantasy', label: 'Fantasy' },
  { value: 'Film-Noir', label: 'Film-Noir' },
  { value: 'History', label: 'History' },
  { value: 'Horror', label: 'Horror' },
  { value: 'Music', label: 'Music' },
  { value: 'Musical', label: 'Musical' },
  { value: 'Mystery', label: 'Mystery' },
  { value: 'Romance', label: 'Romance' },
  { value: 'Sci-Fi', label: 'Sci-Fi' },
  { value: 'Sport', label: 'Sport' },
  { value: 'Thriller', label: 'Thriller' },
  { value: 'War', label: 'War' },
  { value: 'Western', label: 'Western' },
];

const SORT_OPTIONS = [
  { value: 'score', label: 'Highest Rated' },
  { value: 'createdAt', label: 'Newest' },
  { value: 'title', label: 'Title A-Z' },
  { value: 'releaseYear', label: 'Release Year' },
];

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [genre, setGenre] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['movies', page, genre, sortBy, sortOrder, searchTerm],
    queryFn: () => moviesAPI.getAll({
      page,
      limit: 12,
      genre: genre || undefined,
      sortBy,
      sortOrder,
    }),
  });

  const movies = data?.data.data || [];
  const pagination = data?.data.pagination;

  // Get stats data
  const { data: statsData } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const [moviesRes, commentsRes] = await Promise.all([
        moviesAPI.getAll({ limit: 1000 }), // Get all movies for count
        fetch('/api/comments').then(res => res.json()).catch(() => ({ data: { data: [] } }))
      ]);
      
      const totalMovies = moviesRes.data.data?.length || 0;
      const totalComments = commentsRes.data?.data?.length || 0;
      const topMovies = moviesRes.data.data?.slice(0, 5) || [];
      const recentMovies = moviesRes.data.data?.slice(-5).reverse() || [];
      
      return {
        totalMovies,
        totalComments,
        topMovies,
        recentMovies
      };
    },
  });

  // Get user votes for all movies (only if user is logged in)
  const { data: userVotesData } = useQuery({
    queryKey: ['userVotes', movies.map(m => m._id)],
    queryFn: async () => {
      if (!user || movies.length === 0) return {};
      
      const votes = await Promise.all(
        movies.map(async (movie) => {
          try {
            const voteData = await moviesAPI.getUserVote(movie._id);
            return { movieId: movie._id, voteType: voteData.data.data?.voteType || null };
          } catch {
            return { movieId: movie._id, voteType: null };
          }
        })
      );
      
      return votes.reduce((acc, vote) => {
        acc[vote.movieId] = vote.voteType;
        return acc;
      }, {} as Record<string, 'up' | 'down' | null>);
    },
    enabled: !!user && movies.length > 0,
  });

  const userVotes = userVotesData || {};

  const voteMutation = useMutation({
    mutationFn: ({ movieId, voteType }: { movieId: string; voteType: 'up' | 'down' }) =>
      moviesAPI.vote(movieId, voteType),
    onSuccess: (voteResponse, variables) => {
      const voteData = voteResponse.data.data as Vote;
      const voteType = variables.voteType;
      const currentVote = userVotes[variables.movieId];
      
      // Show appropriate toast message
      if (currentVote === voteType) {
        toast.success('Vote removed successfully!');
      } else if (currentVote === null) {
        toast.success(`${voteType === 'up' ? 'Upvoted' : 'Downvoted'} successfully!`);
      } else {
        toast.success(`Vote changed to ${voteType === 'up' ? 'upvote' : 'downvote'}!`);
      }
      
      // Update the specific movie in the current query cache
      queryClient.setQueryData(['movies', page, genre, sortBy, sortOrder, searchTerm], (old: typeof data) => {
        if (!old?.data?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map((movie) => {
              if (movie._id === variables.movieId) {
                // Get the updated vote counts from the vote response
                return {
                  ...movie,
                  upvotes: voteData?.upvotes ?? movie.upvotes,
                  downvotes: voteData?.downvotes ?? movie.downvotes,
                  score: voteData?.score ?? (movie.upvotes - movie.downvotes)
                };
              }
              return movie;
            })
          }
        };
      });
      
      // Update user votes for this specific movie
      queryClient.setQueryData(['userVotes', movies.map(m => m._id)], (old: Record<string, 'up' | 'down' | null> | undefined) => {
        if (!old) return old;
        return {
          ...old,
          [variables.movieId]: voteData?.voteType ?? null
        };
      });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Failed to vote. Please try again.';
      toast.error(errorMessage || 'Failed to vote. Please try again.');
    },
  });

  const handleVote = async (movieId: string, voteType: 'up' | 'down') => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    try {
      // Use mutate instead of mutateAsync to prevent waiting
      voteMutation.mutate({ movieId, voteType });
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

  const handleCardClick = (movieId: string) => {
    router.push(`/movies/${movieId}`);
  };


  const handleStatsClick = (type: 'top' | 'recent' | 'trending') => {
    if (type === 'top') {
      setSortBy('score');
      setSortOrder('desc');
    } else if (type === 'recent') {
      setSortBy('createdAt');
      setSortOrder('desc');
    } else if (type === 'trending') {
      setSortBy('score');
      setSortOrder('desc');
    }
    setPage(1);
    window.scrollTo({ top: 600, behavior: 'smooth' });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Discover Amazing Movies
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Rate, review, and discover your next favorite movie. Join thousands of movie lovers sharing their opinions.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div 
            className="glass-effect rounded-2xl p-6 text-center animate-slide-up cursor-pointer hover:scale-105 transition-all duration-300"
            onClick={() => handleStatsClick('top')}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-4">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Top Rated</h3>
            <p className="text-gray-600 mb-2">Movies ranked by community votes</p>
            <div className="text-3xl font-bold text-blue-600">
              {statsData?.topMovies?.length || 0}
            </div>
            <p className="text-sm text-gray-500">top movies</p>
          </div>
          
          <div 
            className="glass-effect rounded-2xl p-6 text-center animate-slide-up delay-100 cursor-pointer hover:scale-105 transition-all duration-300"
            onClick={() => handleStatsClick('trending')}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Discussions</h3>
            <p className="text-gray-600 mb-2">Total comments & reviews</p>
            <div className="text-3xl font-bold text-green-600">
              {statsData?.totalComments || 0}
            </div>
            <p className="text-sm text-gray-500">comments</p>
          </div>
          
          <div 
            className="glass-effect rounded-2xl p-6 text-center animate-slide-up delay-200 cursor-pointer hover:scale-105 transition-all duration-300"
            onClick={() => handleStatsClick('recent')}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-4">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Latest</h3>
            <p className="text-gray-600 mb-2">Recently added movies</p>
            <div className="text-3xl font-bold text-purple-600">
              {statsData?.recentMovies?.length || 0}
            </div>
            <p className="text-sm text-gray-500">new movies</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card-modern p-8 mb-8 animate-slide-up">
          <div className="flex items-center space-x-2 mb-6">
            <Filter className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Filter & Search</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <Input
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            
            <Select
              options={GENRES}
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
            
            <Select
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            />
            
            <Select
              options={[
                { value: 'desc', label: 'Descending' },
                { value: 'asc', label: 'Ascending' },
              ]}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load movies. Please try again.</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No movies found. Be the first to add one!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
              {movies.map((movie) => (
                <MovieCard
                  key={`movie-${movie._id}`}
                  movie={movie}
                  userVote={userVotes[movie._id] || null}
                  onVote={handleVote}
                  onCardClick={handleCardClick}
                  isVoting={voteMutation.isPending}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}