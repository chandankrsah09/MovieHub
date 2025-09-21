'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ThumbsUp, ThumbsDown, MessageCircle, Calendar, User, TrendingUp } from 'lucide-react';
import { Movie } from '@/lib/api';

interface MovieCardProps {
  movie: Movie;
  userVote?: 'up' | 'down' | null;
  onVote?: (movieId: string, voteType: 'up' | 'down') => void;
  onCardClick?: (movieId: string) => void;
  showActions?: boolean;
  isVoting?: boolean;
}

export const MovieCard = memo(function MovieCard({ movie, userVote, onVote, onCardClick, showActions = true, isVoting = false }: MovieCardProps) {
  const handleVote = (voteType: 'up' | 'down') => {
    if (onVote) {
      onVote(movie._id, voteType);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on vote buttons or links
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('a')
    ) {
      return;
    }
    
    if (onCardClick) {
      onCardClick(movie._id);
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 0) return 'text-green-600';
    if (score < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getScoreBg = (score: number) => {
    if (score > 0) return 'bg-green-100';
    if (score < 0) return 'bg-red-100';
    return 'bg-gray-100';
  };

  return (
    <Card 
      className="h-full flex flex-col animate-slide-up group cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 shadow-lg bg-white/95 backdrop-blur-sm"
      onClick={handleCardClick}
    >
      {/* Movie Image */}
      {movie.image ? (
        <div className="relative h-64 overflow-hidden">
          <img
            src={movie.image.startsWith('http') ? movie.image : `http://localhost:5000${movie.image}`}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            <div className={`px-4 py-2 rounded-full shadow-lg ${getScoreBg(movie.score)}`}>
              <div className={`text-sm font-bold ${getScoreColor(movie.score)} flex items-center space-x-1`}>
                <TrendingUp className="h-4 w-4" />
                <span>{movie.score}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-2xl font-bold">{movie.title.charAt(0)}</span>
            </div>
            <div className="absolute top-4 right-4">
              <div className={`px-4 py-2 rounded-full shadow-lg ${getScoreBg(movie.score)}`}>
                <div className={`text-sm font-bold ${getScoreColor(movie.score)} flex items-center space-x-1`}>
                  <TrendingUp className="h-4 w-4" />
                  <span>{movie.score}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <CardContent className="flex-1 p-5">
        <div className="space-y-4">
          {/* Movie Title */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 group-hover:scale-105 transform duration-300">
              {movie.title}
            </h3>
            <p className="text-sm text-gray-600 mt-2 font-medium">
              by {movie.director}
            </p>
          </div>

          {/* Movie Description */}
          <p className="text-gray-700 line-clamp-2 leading-relaxed text-sm">
            {movie.description}
          </p>

          {/* Movie Meta */}
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-full">
              <Calendar className="h-3 w-3 text-blue-600" />
              <span className="text-blue-800 font-medium">{movie.releaseYear}</span>
            </div>
            <div className="flex items-center space-x-1 bg-purple-50 px-2 py-1 rounded-full">
              <User className="h-3 w-3 text-purple-600" />
              <span className="text-purple-800 font-medium truncate max-w-20">{movie.addedBy.name}</span>
            </div>
          </div>

          {/* Genre Badge */}
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
              {movie.genre}
            </span>
          </div>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="p-4 pt-0">
          <div className="flex flex-col space-y-3 w-full">
            {/* Voting Section */}
            <div className="flex items-center justify-center space-x-3">
              <Button
                variant={userVote === 'up' ? 'success' : 'outline'}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleVote('up');
                }}
                icon={<ThumbsUp className="h-4 w-4" />}
                className="flex-1 text-sm font-medium"
                loading={isVoting}
                disabled={isVoting}
              >
                {movie.upvotes}
              </Button>

              <Button
                variant={userVote === 'down' ? 'danger' : 'outline'}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleVote('down');
                }}
                icon={<ThumbsDown className="h-4 w-4" />}
                className="flex-1 text-sm font-medium"
                loading={isVoting}
                disabled={isVoting}
              >
                {movie.downvotes}
              </Button>
            </div>

            {/* View Details Button */}
            <Button
              variant="ghost"
              size="sm"
              icon={<MessageCircle className="h-4 w-4" />}
              className="hover:bg-blue-50 hover:text-blue-600 text-sm font-medium w-full"
              onClick={(e) => {
                e.stopPropagation();
                if (onCardClick) {
                  onCardClick(movie._id);
                }
              }}
            >
              View Details
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
});
