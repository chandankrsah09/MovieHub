'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moviesAPI, commentsAPI } from '@/lib/api';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { ThumbsUp, ThumbsDown, MessageCircle, Calendar, User, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');

  const movieId = params.id as string;

  const { data: movieData, isLoading: movieLoading, error: movieError } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => moviesAPI.getById(movieId),
    retry: 1,
  });

  const { data: userVoteData } = useQuery({
    queryKey: ['userVote', movieId],
    queryFn: () => moviesAPI.getUserVote(movieId),
    enabled: !!user,
  });

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', movieId],
    queryFn: () => commentsAPI.getByMovie(movieId),
  });

  const voteMutation = useMutation({
    mutationFn: ({ movieId, voteType }: { movieId: string; voteType: 'up' | 'down' }) =>
      moviesAPI.vote(movieId, voteType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movie', movieId] });
      queryClient.invalidateQueries({ queryKey: ['userVote', movieId] });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => {
      console.log('Adding comment:', content);
      return commentsAPI.create(movieId, content);
    },
    onSuccess: (response) => {
      console.log('Comment added successfully:', response);
      toast.success(response.data.message || 'Comment added successfully!');
      queryClient.invalidateQueries({ queryKey: ['comments', movieId] });
      setNewComment('');
    },
    onError: (error: unknown) => {
      console.log('Comment add error:', error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Failed to add comment';
      toast.error(errorMessage || 'Failed to add comment');
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      commentsAPI.update(commentId, content),
    onSuccess: (response) => {
      toast.success(response.data.message || 'Comment updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['comments', movieId] });
      setEditingComment(null);
      setEditCommentText('');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Failed to update comment';
      toast.error(errorMessage || 'Failed to update comment');
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => commentsAPI.delete(commentId),
    onSuccess: (response) => {
      toast.success(response.data.message || 'Comment deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['comments', movieId] });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Failed to delete comment';
      toast.error(errorMessage || 'Failed to delete comment');
    },
  });

  const deleteMovieMutation = useMutation({
    mutationFn: () => {
      console.log('Mutation function called for movie:', movieId);
      return moviesAPI.delete(movieId);
    },
    onSuccess: (response) => {
      console.log('Delete success response:', response);
      console.log('Delete success - showing toast');
      toast.success(response.data.message || 'Movie deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      router.push('/');
    },
    onError: (error: unknown) => {
      console.log('Delete error:', error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Failed to delete movie';
      toast.error(errorMessage || 'Failed to delete movie');
    },
  });

  const movie = movieData?.data.data;
  const userVote = userVoteData?.data.data?.voteType;
  const comments = commentsData?.data.data || [];

  const handleVote = (voteType: 'up' | 'down') => {
    if (user) {
      voteMutation.mutate({ movieId, voteType });
    } else {
      router.push('/login');
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() && user) {
      addCommentMutation.mutate(newComment.trim());
    } else if (!user) {
      router.push('/login');
    }
  };

  const handleEditComment = (commentId: string, currentContent: string) => {
    setEditingComment(commentId);
    setEditCommentText(currentContent);
  };

  const handleUpdateComment = () => {
    if (editingComment && editCommentText.trim()) {
      updateCommentMutation.mutate({
        commentId: editingComment,
        content: editCommentText.trim(),
      });
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const handleDeleteMovie = () => {
    if (confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
      console.log('Deleting movie:', movieId);
      console.log('User:', user);
      console.log('Token:', localStorage.getItem('token'));
      deleteMovieMutation.mutate();
    }
  };


  if (movieLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (movieError || (!movieLoading && !movie)) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Movie not found</h1>
            <p className="text-gray-600 mb-6">
              The movie you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button onClick={() => router.push('/')}>Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button and Admin Controls */}
        <div className="mb-6 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Movies
          </Button>
          
          {/* Admin Controls */}
          {(user?.role === 'admin' || user?.id === movie?.addedBy?._id) && (
            <div className="flex space-x-2">
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteMovie}
                loading={deleteMovieMutation.isPending}
                icon={<Trash2 className="h-4 w-4" />}
              >
                Delete Movie
              </Button>
            </div>
          )}
        </div>

        {/* Movie Header */}
        <div className="card-modern p-8 mb-8 animate-slide-up">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {movie?.title}
              </h1>
              <p className="text-xl text-gray-600 mb-6 font-medium">by {movie?.director}</p>
              
              {/* Movie Image */}
              {movie?.image && (
                <div className="mb-6">
                  <img
                    src={movie.image.startsWith('http') ? movie.image : `http://localhost:5000${movie.image}`}
                    alt={movie?.title || 'Movie'}
                    className="w-full max-w-md h-64 object-cover rounded-xl shadow-lg"
                  />
                </div>
              )}
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800 font-semibold">{movie?.releaseYear}</span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full">
                  <User className="h-5 w-5 text-purple-600" />
                  <span className="text-purple-800 font-semibold">Added by {movie?.addedBy?.name}</span>
                </div>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                  {movie?.genre}
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed text-lg">{movie?.description}</p>
            </div>

            {/* Voting Section */}
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="glass-effect rounded-2xl p-8 text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {movie?.score}
                </div>
                <div className="text-sm text-gray-600 mb-6 font-medium">Overall Score</div>
                
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant={userVote === 'up' ? 'success' : 'outline'}
                    size="md"
                    onClick={() => handleVote('up')}
                    icon={<ThumbsUp className="h-5 w-5" />}
                    className="min-w-[100px]"
                  >
                    {movie?.upvotes}
                  </Button>
                  
                  <Button
                    variant={userVote === 'down' ? 'danger' : 'outline'}
                    size="md"
                    onClick={() => handleVote('down')}
                    icon={<ThumbsDown className="h-5 w-5" />}
                    className="min-w-[100px]"
                  >
                    {movie?.downvotes}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="h-6 w-6 mr-2" />
            Comments ({comments.length})
          </h2>

          {/* Add Comment */}
          {user && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Add a Comment</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Share your thoughts about this movie..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || addCommentMutation.isPending}
                    loading={addCommentMutation.isPending}
                  >
                    Post Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments List */}
          {commentsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment._id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">{comment.user.name}</span>
                          <span className="text-sm text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        
                        {editingComment === comment._id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              rows={3}
                            />
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={handleUpdateComment}
                                disabled={updateCommentMutation.isPending}
                                loading={updateCommentMutation.isPending}
                              >
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingComment(null);
                                  setEditCommentText('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-700">{comment.content}</p>
                        )}
                      </div>
                      
                      {(user?.id === comment.user._id || user?.role === 'admin') && editingComment !== comment._id && (
                        <div className="flex space-x-1 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditComment(comment._id, comment.content)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
