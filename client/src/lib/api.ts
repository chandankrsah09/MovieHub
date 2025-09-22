import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://moviehub-uc48.onrender.com/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error:', error);
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Movie {
  _id: string;
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  director: string;
  image?: string;
  addedBy: {
    _id: string;
    name: string;
    email: string;
  };
  upvotes: number;
  downvotes: number;
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  movie: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vote {
  voteType: 'up' | 'down' | null;
  upvotes?: number;
  downvotes?: number;
  score?: number;
}

export interface AdminStats {
  totalUsers: number;
  totalMovies: number;
  totalVotes: number;
  totalComments: number;
  recentMovies: Movie[];
  topMovies: Movie[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data),
  
  getProfile: () =>
    api.get<ApiResponse<User>>('/auth/profile'),
};

// Movies API
export const moviesAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    genre?: string;
    sortBy?: string;
    sortOrder?: string;
  }) =>
    api.get<ApiResponse<Movie[]>>('/movies', { params }),
  
  getById: (id: string) =>
    api.get<ApiResponse<Movie>>(`/movies/${id}`),
  
  create: (data: {
    title: string;
    description: string;
    genre: string;
    releaseYear: number;
    director: string;
    image?: File;
  }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('genre', data.genre);
    formData.append('releaseYear', data.releaseYear.toString());
    formData.append('director', data.director);
    if (data.image) {
      formData.append('image', data.image);
    }
    
    return api.post<ApiResponse<Movie>>('/movies', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  update: (id: string, data: {
    title: string;
    description: string;
    genre: string;
    releaseYear: number;
    director: string;
    image?: File;
  }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('genre', data.genre);
    formData.append('releaseYear', data.releaseYear.toString());
    formData.append('director', data.director);
    if (data.image) {
      formData.append('image', data.image);
    }
    
    return api.put<ApiResponse<Movie>>(`/movies/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/movies/${id}`),
  
  vote: (movieId: string, voteType: 'up' | 'down') =>
    api.post<ApiResponse<{ voteType: 'up' | 'down' | null }>>(`/movies/${movieId}/vote`, { voteType }),
  
  getUserVote: (movieId: string) =>
    api.get<ApiResponse<{ voteType: 'up' | 'down' | null }>>(`/movies/${movieId}/vote`),
};

// Comments API
export const commentsAPI = {
  getByMovie: (movieId: string, params?: { page?: number; limit?: number }) =>
    api.get<ApiResponse<Comment[]>>(`/comments/movies/${movieId}`, { params }),
  
  create: (movieId: string, content: string) =>
    api.post<ApiResponse<Comment>>(`/comments/movies/${movieId}`, { content }),
  
  update: (commentId: string, content: string) =>
    api.put<ApiResponse<Comment>>(`/comments/${commentId}`, { content }),
  
  delete: (commentId: string) =>
    api.delete<ApiResponse<null>>(`/comments/${commentId}`),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get<ApiResponse<AdminStats>>('/admin/stats'),
  
  getAllUsers: (page = 1, limit = 10) => 
    api.get<ApiResponse<User[]>>(`/admin/users?page=${page}&limit=${limit}`),
  
  getUserById: (userId: string) => 
    api.get<ApiResponse<User>>(`/admin/users/${userId}`),
  
  updateUserRole: (userId: string, role: 'user' | 'admin') => 
    api.put<ApiResponse<User>>(`/admin/users/${userId}/role`, { role }),
  
  deleteUser: (userId: string) => 
    api.delete<ApiResponse<null>>(`/admin/users/${userId}`),
};
