import { Router } from 'express';
import {
  getMovieComments,
  createComment,
  updateComment,
  deleteComment,
  getCommentById
} from '../controllers/commentController';
import { isAuth, isAdmin } from '../middleware/auth';
import { validateComment } from '../middleware/validation';

const router = Router();

// @route   GET /api/comments/movies/:movieId
// @desc    Get all comments for a movie
// @access  Public
router.get('/movies/:movieId', getMovieComments);

// @route   POST /api/comments/movies/:movieId
// @desc    Create a new comment on a movie
// @access  Private
router.post('/movies/:movieId', isAuth, validateComment, createComment);

// @route   GET /api/comments/:commentId
// @desc    Get comment by ID
// @access  Public
router.get('/:commentId', getCommentById);

// @route   PUT /api/comments/:commentId
// @desc    Update a comment
// @access  Private (Owner or Admin)
router.put('/:commentId', isAuth, validateComment, updateComment);

// @route   DELETE /api/comments/:commentId
// @desc    Delete a comment
// @access  Private (Owner or Admin)
router.delete('/:commentId', isAuth, deleteComment);

export default router;
