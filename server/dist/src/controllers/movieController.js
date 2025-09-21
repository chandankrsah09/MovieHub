"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserVote = exports.voteMovie = exports.deleteMovie = exports.updateMovie = exports.createMovie = exports.getMovieById = exports.getAllMovies = void 0;
const Movie_1 = __importDefault(require("../models/Movie"));
const Vote_1 = __importDefault(require("../models/Vote"));
const response_1 = require("../utils/response");
const getAllMovies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const genre = req.query.genre;
        const sortBy = req.query.sortBy || 'score';
        const sortOrder = req.query.sortOrder || 'desc';
        const skip = (page - 1) * limit;
        // Build filter object
        const filter = {};
        if (genre) {
            filter.genre = genre;
        }
        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        const movies = await Movie_1.default.find(filter)
            .populate('addedBy', 'name email')
            .sort(sort)
            .skip(skip)
            .limit(limit);
        const total = await Movie_1.default.countDocuments(filter);
        (0, response_1.sendPaginatedResponse)(res, 'Movies retrieved successfully', movies, page, limit, total);
    }
    catch (error) {
        console.error('Get movies error:', error);
        (0, response_1.sendError)(res, 'Failed to retrieve movies', 500);
    }
};
exports.getAllMovies = getAllMovies;
const getMovieById = async (req, res) => {
    try {
        const movie = await Movie_1.default.findById(req.params.id)
            .populate('addedBy', 'name email')
            .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'name'
            }
        });
        if (!movie) {
            return (0, response_1.sendError)(res, 'Movie not found', 404);
        }
        (0, response_1.sendSuccess)(res, 'Movie retrieved successfully', movie);
    }
    catch (error) {
        console.error('Get movie error:', error);
        (0, response_1.sendError)(res, 'Failed to retrieve movie', 500);
    }
};
exports.getMovieById = getMovieById;
const createMovie = async (req, res) => {
    try {
        const { title, description, genre, releaseYear, director } = req.body;
        const userId = req.user._id;
        const movie = await Movie_1.default.create({
            title,
            description,
            genre,
            releaseYear,
            director,
            addedBy: userId
        });
        await movie.populate('addedBy', 'name email');
        (0, response_1.sendSuccess)(res, 'Movie created successfully', movie, 201);
    }
    catch (error) {
        console.error('Create movie error:', error);
        (0, response_1.sendError)(res, 'Failed to create movie', 500);
    }
};
exports.createMovie = createMovie;
const updateMovie = async (req, res) => {
    try {
        const { title, description, genre, releaseYear, director } = req.body;
        const userId = req.user._id;
        const userRole = req.user.role;
        const movie = await Movie_1.default.findById(req.params.id);
        if (!movie) {
            return (0, response_1.sendError)(res, 'Movie not found', 404);
        }
        // Check if user is admin or the one who added the movie
        if (userRole !== 'admin' && movie.addedBy.toString() !== userId.toString()) {
            return (0, response_1.sendError)(res, 'Not authorized to update this movie', 403);
        }
        const updatedMovie = await Movie_1.default.findByIdAndUpdate(req.params.id, { title, description, genre, releaseYear, director }, { new: true, runValidators: true }).populate('addedBy', 'name email');
        (0, response_1.sendSuccess)(res, 'Movie updated successfully', updatedMovie);
    }
    catch (error) {
        console.error('Update movie error:', error);
        (0, response_1.sendError)(res, 'Failed to update movie', 500);
    }
};
exports.updateMovie = updateMovie;
const deleteMovie = async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role;
        const movie = await Movie_1.default.findById(req.params.id);
        if (!movie) {
            return (0, response_1.sendError)(res, 'Movie not found', 404);
        }
        // Check if user is admin or the one who added the movie
        if (userRole !== 'admin' && movie.addedBy.toString() !== userId.toString()) {
            return (0, response_1.sendError)(res, 'Not authorized to delete this movie', 403);
        }
        await Movie_1.default.findByIdAndDelete(req.params.id);
        (0, response_1.sendSuccess)(res, 'Movie deleted successfully');
    }
    catch (error) {
        console.error('Delete movie error:', error);
        (0, response_1.sendError)(res, 'Failed to delete movie', 500);
    }
};
exports.deleteMovie = deleteMovie;
const voteMovie = async (req, res) => {
    try {
        const { voteType } = req.body;
        const userId = req.user._id;
        const movieId = req.params.movieId;
        // Check if movie exists
        const movie = await Movie_1.default.findById(movieId);
        if (!movie) {
            return (0, response_1.sendError)(res, 'Movie not found', 404);
        }
        // Check if user already voted
        const existingVote = await Vote_1.default.findOne({ user: userId, movie: movieId });
        if (existingVote) {
            // If same vote type, remove the vote
            if (existingVote.voteType === voteType) {
                await Vote_1.default.findByIdAndDelete(existingVote._id);
                // Update movie vote counts
                if (voteType === 'up') {
                    movie.upvotes = Math.max(0, movie.upvotes - 1);
                }
                else {
                    movie.downvotes = Math.max(0, movie.downvotes - 1);
                }
                await movie.save();
                return (0, response_1.sendSuccess)(res, 'Vote removed successfully', { voteType: null });
            }
            else {
                // Update vote type
                existingVote.voteType = voteType;
                await existingVote.save();
                // Update movie vote counts
                if (voteType === 'up') {
                    movie.upvotes += 1;
                    movie.downvotes = Math.max(0, movie.downvotes - 1);
                }
                else {
                    movie.downvotes += 1;
                    movie.upvotes = Math.max(0, movie.upvotes - 1);
                }
                await movie.save();
                return (0, response_1.sendSuccess)(res, 'Vote updated successfully', { voteType });
            }
        }
        else {
            // Create new vote
            await Vote_1.default.create({ user: userId, movie: movieId, voteType });
            // Update movie vote counts
            if (voteType === 'up') {
                movie.upvotes += 1;
            }
            else {
                movie.downvotes += 1;
            }
            await movie.save();
            return (0, response_1.sendSuccess)(res, 'Vote added successfully', { voteType });
        }
    }
    catch (error) {
        console.error('Vote movie error:', error);
        (0, response_1.sendError)(res, 'Failed to vote on movie', 500);
    }
};
exports.voteMovie = voteMovie;
const getUserVote = async (req, res) => {
    try {
        const userId = req.user._id;
        const movieId = req.params.movieId;
        const vote = await Vote_1.default.findOne({ user: userId, movie: movieId });
        (0, response_1.sendSuccess)(res, 'User vote retrieved successfully', {
            voteType: vote ? vote.voteType : null
        });
    }
    catch (error) {
        console.error('Get user vote error:', error);
        (0, response_1.sendError)(res, 'Failed to retrieve user vote', 500);
    }
};
exports.getUserVote = getUserVote;
//# sourceMappingURL=movieController.js.map