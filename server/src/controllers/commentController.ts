import { Request, Response } from 'express';
import Comment from '../models/Comment';
import Movie from '../models/Movie';
import { sendSuccess, sendError, sendPaginatedResponse } from '../utils/response';

export const getMovieComments = async (req: Request, res: Response) => {
  try {
    const movieId = req.params.movieId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return sendError(res, 'Movie not found', 404);
    }

    const comments = await Comment.find({ movie: movieId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ movie: movieId });

    sendPaginatedResponse(res, 'Comments retrieved successfully', comments, page, limit, total);
  } catch (error) {
    console.error('Get comments error:', error);
    sendError(res, 'Failed to retrieve comments', 500);
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const userId = (req as any).user._id;
    const movieId = req.params.movieId;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return sendError(res, 'Movie not found', 404);
    }

    const comment = await Comment.create({
      content,
      user: userId,
      movie: movieId
    });

    await comment.populate('user', 'name email');

    sendSuccess(res, 'Comment created successfully', comment, 201);
  } catch (error) {
    console.error('Create comment error:', error);
    sendError(res, 'Failed to create comment', 500);
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const userId = (req as any).user._id;
    const userRole = (req as any).user.role;
    const commentId = req.params.commentId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return sendError(res, 'Comment not found', 404);
    }

    // Check if user is admin or the one who created the comment
    if (userRole !== 'admin' && comment.user.toString() !== userId.toString()) {
      return sendError(res, 'Not authorized to update this comment', 403);
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    sendSuccess(res, 'Comment updated successfully', updatedComment);
  } catch (error) {
    console.error('Update comment error:', error);
    sendError(res, 'Failed to update comment', 500);
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const userRole = (req as any).user.role;
    const commentId = req.params.commentId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return sendError(res, 'Comment not found', 404);
    }

    // Check if user is admin or the one who created the comment
    if (userRole !== 'admin' && comment.user.toString() !== userId.toString()) {
      return sendError(res, 'Not authorized to delete this comment', 403);
    }

    await Comment.findByIdAndDelete(commentId);

    sendSuccess(res, 'Comment deleted successfully');
  } catch (error) {
    console.error('Delete comment error:', error);
    sendError(res, 'Failed to delete comment', 500);
  }
};

export const getCommentById = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
      .populate('user', 'name email')
      .populate('movie', 'title');

    if (!comment) {
      return sendError(res, 'Comment not found', 404);
    }

    sendSuccess(res, 'Comment retrieved successfully', comment);
  } catch (error) {
    console.error('Get comment error:', error);
    sendError(res, 'Failed to retrieve comment', 500);
  }
};
