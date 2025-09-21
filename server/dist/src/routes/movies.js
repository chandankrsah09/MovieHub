"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movieController_1 = require("../controllers/movieController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
// @route   GET /api/movies
// @desc    Get all movies with pagination and filtering
// @access  Public
router.get('/', movieController_1.getAllMovies);
// @route   GET /api/movies/:id
// @desc    Get movie by ID
// @access  Public
router.get('/:id', movieController_1.getMovieById);
// @route   POST /api/movies
// @desc    Create a new movie
// @access  Private
router.post('/', auth_1.isAuth, validation_1.validateMovie, movieController_1.createMovie);
// @route   PUT /api/movies/:id
// @desc    Update a movie
// @access  Private (Owner or Admin)
router.put('/:id', auth_1.isAuth, validation_1.validateMovie, movieController_1.updateMovie);
// @route   DELETE /api/movies/:id
// @desc    Delete a movie
// @access  Private (Owner or Admin)
router.delete('/:id', auth_1.isAuth, movieController_1.deleteMovie);
// @route   POST /api/movies/:movieId/vote
// @desc    Vote on a movie
// @access  Private
router.post('/:movieId/vote', auth_1.isAuth, validation_1.validateVote, movieController_1.voteMovie);
// @route   GET /api/movies/:movieId/vote
// @desc    Get user's vote on a movie
// @access  Private
router.get('/:movieId/vote', auth_1.isAuth, movieController_1.getUserVote);
exports.default = router;
//# sourceMappingURL=movies.js.map