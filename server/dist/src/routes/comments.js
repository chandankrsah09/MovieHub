"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentController_1 = require("../controllers/commentController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
// @route   GET /api/movies/:movieId/comments
// @desc    Get all comments for a movie
// @access  Public
router.get('/movies/:movieId/comments', commentController_1.getMovieComments);
// @route   POST /api/movies/:movieId/comments
// @desc    Create a new comment on a movie
// @access  Private
router.post('/movies/:movieId/comments', auth_1.isAuth, validation_1.validateComment, commentController_1.createComment);
// @route   GET /api/comments/:commentId
// @desc    Get comment by ID
// @access  Public
router.get('/:commentId', commentController_1.getCommentById);
// @route   PUT /api/comments/:commentId
// @desc    Update a comment
// @access  Private (Owner or Admin)
router.put('/:commentId', auth_1.isAuth, validation_1.validateComment, commentController_1.updateComment);
// @route   DELETE /api/comments/:commentId
// @desc    Delete a comment
// @access  Private (Owner or Admin)
router.delete('/:commentId', auth_1.isAuth, commentController_1.deleteComment);
exports.default = router;
//# sourceMappingURL=comments.js.map