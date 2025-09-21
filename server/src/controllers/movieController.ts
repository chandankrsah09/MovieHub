import { Request, Response } from 'express';
import Movie from '../models/Movie';
import Vote from '../models/Vote';
import { sendSuccess, sendError, sendPaginatedResponse } from '../utils/response';
import { createError } from '../middleware/errorHandler';

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const genre = req.query.genre as string;
    const sortBy = req.query.sortBy as string || 'score';
    const sortOrder = req.query.sortOrder as string || 'desc';

    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    if (genre) {
      filter.genre = genre;
    }

    // Get movies with vote counts
    const movies = await Movie.find(filter)
      .populate('addedBy', 'name email')
      .skip(skip)
      .limit(limit);

    // Calculate score for each movie
    const moviesWithScore = movies.map(movie => {
      const score = movie.upvotes - movie.downvotes;
      return {
        ...movie.toObject(),
        score
      };
    });

    // Sort by score if sortBy is 'score'
    if (sortBy === 'score') {
      moviesWithScore.sort((a, b) => {
        return sortOrder === 'desc' ? b.score - a.score : a.score - b.score;
      });
    } else {
      // Sort by other fields
      moviesWithScore.sort((a, b) => {
        const aValue = (a as any)[sortBy];
        const bValue = (b as any)[sortBy];
        if (sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        } else {
          return aValue > bValue ? 1 : -1;
        }
      });
    }

    const total = await Movie.countDocuments(filter);

    sendPaginatedResponse(res, 'Movies retrieved successfully', moviesWithScore, page, limit, total);
  } catch (error) {
    console.error('Get movies error:', error);
    sendError(res, 'Failed to retrieve movies', 500);
  }
};

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate('addedBy', 'name email');

    if (!movie) {
      return sendError(res, 'Movie not found', 404);
    }

    // Calculate score
    const score = movie.upvotes - movie.downvotes;
    const movieWithScore = {
      ...movie.toObject(),
      score
    };

    sendSuccess(res, 'Movie retrieved successfully', movieWithScore);
  } catch (error) {
    console.error('Get movie error:', error);
    sendError(res, 'Failed to retrieve movie', 500);
  }
};

export const createMovie = async (req: Request, res: Response) => {
  try {
    const { title, description, genre, releaseYear, director } = req.body;
    const userId = (req as any).user._id;
    
    // Get image path if uploaded
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    const movie = await Movie.create({
      title,
      description,
      genre,
      releaseYear,
      director,
      image: imagePath,
      addedBy: userId
    });

    await movie.populate('addedBy', 'name email');

    sendSuccess(res, 'Movie created successfully', movie, 201);
  } catch (error) {
    console.error('Create movie error:', error);
    sendError(res, 'Failed to create movie', 500);
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const { title, description, genre, releaseYear, director } = req.body;
    const userId = (req as any).user._id;
    const userRole = (req as any).user.role;

    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return sendError(res, 'Movie not found', 404);
    }

    // Check if user is admin or the one who added the movie
    if (userRole !== 'admin' && movie.addedBy.toString() !== userId.toString()) {
      return sendError(res, 'Not authorized to update this movie', 403);
    }

    // Get image path if uploaded
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;
    
    const updateData: any = { title, description, genre, releaseYear, director };
    if (imagePath) {
      updateData.image = imagePath;
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('addedBy', 'name email');

    sendSuccess(res, 'Movie updated successfully', updatedMovie);
  } catch (error) {
    console.error('Update movie error:', error);
    sendError(res, 'Failed to update movie', 500);
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const userRole = (req as any).user.role;

    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return sendError(res, 'Movie not found', 404);
    }

    // Check if user is admin or the one who added the movie
    if (userRole !== 'admin' && movie.addedBy.toString() !== userId.toString()) {
      return sendError(res, 'Not authorized to delete this movie', 403);
    }

    await Movie.findByIdAndDelete(req.params.id);

    sendSuccess(res, 'Movie deleted successfully');
  } catch (error) {
    console.error('Delete movie error:', error);
    sendError(res, 'Failed to delete movie', 500);
  }
};

export const voteMovie = async (req: Request, res: Response) => {
  try {
    const { voteType } = req.body;
    const userId = (req as any).user._id;
    const movieId = req.params.movieId;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return sendError(res, 'Movie not found', 404);
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({ user: userId, movie: movieId });

    if (existingVote) {
      // If same vote type, remove the vote
      if (existingVote.voteType === voteType) {
        await Vote.findByIdAndDelete(existingVote._id);
        
        // Update movie vote counts
        if (voteType === 'up') {
          movie.upvotes = Math.max(0, movie.upvotes - 1);
        } else {
          movie.downvotes = Math.max(0, movie.downvotes - 1);
        }
        await movie.save();

        return sendSuccess(res, 'Vote removed successfully', { 
          voteType: null,
          upvotes: movie.upvotes,
          downvotes: movie.downvotes,
          score: movie.upvotes - movie.downvotes
        });
      } else {
        // Update vote type
        existingVote.voteType = voteType;
        await existingVote.save();

        // Update movie vote counts
        if (voteType === 'up') {
          movie.upvotes += 1;
          movie.downvotes = Math.max(0, movie.downvotes - 1);
        } else {
          movie.downvotes += 1;
          movie.upvotes = Math.max(0, movie.upvotes - 1);
        }
        await movie.save();

        return sendSuccess(res, 'Vote updated successfully', { 
          voteType,
          upvotes: movie.upvotes,
          downvotes: movie.downvotes,
          score: movie.upvotes - movie.downvotes
        });
      }
    } else {
      // Create new vote
      await Vote.create({ user: userId, movie: movieId, voteType });

      // Update movie vote counts
      if (voteType === 'up') {
        movie.upvotes += 1;
      } else {
        movie.downvotes += 1;
      }
      await movie.save();

      return sendSuccess(res, 'Vote added successfully', { 
        voteType,
        upvotes: movie.upvotes,
        downvotes: movie.downvotes,
        score: movie.upvotes - movie.downvotes
      });
    }
  } catch (error) {
    console.error('Vote movie error:', error);
    sendError(res, 'Failed to vote on movie', 500);
  }
};

export const getUserVote = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const movieId = req.params.movieId;

    const vote = await Vote.findOne({ user: userId, movie: movieId });
    
    sendSuccess(res, 'User vote retrieved successfully', { 
      voteType: vote ? vote.voteType : null 
    });
  } catch (error) {
    console.error('Get user vote error:', error);
    sendError(res, 'Failed to retrieve user vote', 500);
  }
};
