import { Router } from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  voteMovie,
  getUserVote
} from '../controllers/movieController';
import { isAuth, isAdmin } from '../middleware/auth';
import { validateMovie, validateVote } from '../middleware/validation';
import { uploadSingle } from '../middleware/upload';

const router = Router();

// @route   GET /api/movies
// @desc    Get all movies with pagination and filtering
// @access  Public
router.get('/', getAllMovies);

// @route   GET /api/movies/:id
// @desc    Get movie by ID
// @access  Public
router.get('/:id', getMovieById);

// @route   POST /api/movies
// @desc    Create a new movie
// @access  Private
router.post('/', isAuth, uploadSingle, validateMovie, createMovie);

// @route   PUT /api/movies/:id
// @desc    Update a movie
// @access  Private (Owner or Admin)
router.put('/:id', isAuth, uploadSingle, validateMovie, updateMovie);

// @route   DELETE /api/movies/:id
// @desc    Delete a movie
// @access  Private (Owner or Admin)
router.delete('/:id', isAuth, deleteMovie);

// @route   POST /api/movies/:movieId/vote
// @desc    Vote on a movie
// @access  Private
router.post('/:movieId/vote', isAuth, validateVote, voteMovie);

// @route   GET /api/movies/:movieId/vote
// @desc    Get user's vote on a movie
// @access  Private
router.get('/:movieId/vote', isAuth, getUserVote);

export default router;
