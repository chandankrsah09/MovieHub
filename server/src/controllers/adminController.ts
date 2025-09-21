import { Request, Response } from 'express';
import User from '../models/User';
import Movie from '../models/Movie';
import Comment from '../models/Comment';
import { sendSuccess, sendError, sendPaginatedResponse } from '../utils/response';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({});

    sendPaginatedResponse(res, 'Users retrieved successfully', users, page, limit, total);
  } catch (error) {
    console.error('Get users error:', error);
    sendError(res, 'Failed to retrieve users', 500);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    sendSuccess(res, 'User retrieved successfully', user);
  } catch (error) {
    console.error('Get user error:', error);
    sendError(res, 'Failed to retrieve user', 500);
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!['user', 'admin'].includes(role)) {
      return sendError(res, 'Invalid role. Must be "user" or "admin"', 400);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    sendSuccess(res, 'User role updated successfully', user);
  } catch (error) {
    console.error('Update user role error:', error);
    sendError(res, 'Failed to update user role', 500);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const currentUserId = (req as any).user._id;

    // Prevent admin from deleting themselves
    if (userId === currentUserId.toString()) {
      return sendError(res, 'Cannot delete your own account', 400);
    }

    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Delete user's movies and comments
    await Movie.deleteMany({ addedBy: userId });
    await Comment.deleteMany({ user: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    sendSuccess(res, 'User deleted successfully');
  } catch (error) {
    console.error('Delete user error:', error);
    sendError(res, 'Failed to delete user', 500);
  }
};

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalMovies = await Movie.countDocuments({});
    const totalComments = await Comment.countDocuments({});
    const totalVotes = await Movie.aggregate([
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: '$upvotes' },
          totalDownvotes: { $sum: '$downvotes' }
        }
      }
    ]);

    const recentUsers = await User.find({})
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const topMovies = await Movie.find({})
      .populate('addedBy', 'name')
      .sort({ upvotes: -1 })
      .limit(5);

    const stats = {
      totalUsers,
      totalMovies,
      totalComments,
      totalVotes: totalVotes[0] || { totalUpvotes: 0, totalDownvotes: 0 },
      recentUsers,
      topMovies
    };

    sendSuccess(res, 'Admin stats retrieved successfully', stats);
  } catch (error) {
    console.error('Get admin stats error:', error);
    sendError(res, 'Failed to retrieve admin stats', 500);
  }
};
