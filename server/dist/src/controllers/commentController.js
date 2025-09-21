"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentById = exports.deleteComment = exports.updateComment = exports.createComment = exports.getMovieComments = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
const Movie_1 = __importDefault(require("../models/Movie"));
const response_1 = require("../utils/response");
const getMovieComments = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Check if movie exists
        const movie = await Movie_1.default.findById(movieId);
        if (!movie) {
            return (0, response_1.sendError)(res, 'Movie not found', 404);
        }
        const comments = await Comment_1.default.find({ movie: movieId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await Comment_1.default.countDocuments({ movie: movieId });
        (0, response_1.sendPaginatedResponse)(res, 'Comments retrieved successfully', comments, page, limit, total);
    }
    catch (error) {
        console.error('Get comments error:', error);
        (0, response_1.sendError)(res, 'Failed to retrieve comments', 500);
    }
};
exports.getMovieComments = getMovieComments;
const createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user._id;
        const movieId = req.params.movieId;
        // Check if movie exists
        const movie = await Movie_1.default.findById(movieId);
        if (!movie) {
            return (0, response_1.sendError)(res, 'Movie not found', 404);
        }
        const comment = await Comment_1.default.create({
            content,
            user: userId,
            movie: movieId
        });
        await comment.populate('user', 'name email');
        (0, response_1.sendSuccess)(res, 'Comment created successfully', comment, 201);
    }
    catch (error) {
        console.error('Create comment error:', error);
        (0, response_1.sendError)(res, 'Failed to create comment', 500);
    }
};
exports.createComment = createComment;
const updateComment = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user._id;
        const userRole = req.user.role;
        const commentId = req.params.commentId;
        const comment = await Comment_1.default.findById(commentId);
        if (!comment) {
            return (0, response_1.sendError)(res, 'Comment not found', 404);
        }
        // Check if user is admin or the one who created the comment
        if (userRole !== 'admin' && comment.user.toString() !== userId.toString()) {
            return (0, response_1.sendError)(res, 'Not authorized to update this comment', 403);
        }
        const updatedComment = await Comment_1.default.findByIdAndUpdate(commentId, { content }, { new: true, runValidators: true }).populate('user', 'name email');
        (0, response_1.sendSuccess)(res, 'Comment updated successfully', updatedComment);
    }
    catch (error) {
        console.error('Update comment error:', error);
        (0, response_1.sendError)(res, 'Failed to update comment', 500);
    }
};
exports.updateComment = updateComment;
const deleteComment = async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role;
        const commentId = req.params.commentId;
        const comment = await Comment_1.default.findById(commentId);
        if (!comment) {
            return (0, response_1.sendError)(res, 'Comment not found', 404);
        }
        // Check if user is admin or the one who created the comment
        if (userRole !== 'admin' && comment.user.toString() !== userId.toString()) {
            return (0, response_1.sendError)(res, 'Not authorized to delete this comment', 403);
        }
        await Comment_1.default.findByIdAndDelete(commentId);
        (0, response_1.sendSuccess)(res, 'Comment deleted successfully');
    }
    catch (error) {
        console.error('Delete comment error:', error);
        (0, response_1.sendError)(res, 'Failed to delete comment', 500);
    }
};
exports.deleteComment = deleteComment;
const getCommentById = async (req, res) => {
    try {
        const comment = await Comment_1.default.findById(req.params.commentId)
            .populate('user', 'name email')
            .populate('movie', 'title');
        if (!comment) {
            return (0, response_1.sendError)(res, 'Comment not found', 404);
        }
        (0, response_1.sendSuccess)(res, 'Comment retrieved successfully', comment);
    }
    catch (error) {
        console.error('Get comment error:', error);
        (0, response_1.sendError)(res, 'Failed to retrieve comment', 500);
    }
};
exports.getCommentById = getCommentById;
//# sourceMappingURL=commentController.js.map