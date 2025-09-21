"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return (0, response_1.sendError)(res, 'User with this email already exists', 400);
        }
        // Create new user
        const user = await User_1.default.create({
            name,
            email,
            password
        });
        // Generate JWT token
        const token = (0, jwt_1.generateToken)({
            userId: user._id.toString(),
            email: user.email,
            role: user.role
        });
        (0, response_1.sendSuccess)(res, 'User registered successfully', {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        }, 201);
    }
    catch (error) {
        console.error('Registration error:', error);
        (0, response_1.sendError)(res, 'Registration failed', 500);
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user) {
            return (0, response_1.sendError)(res, 'Invalid email or password', 401);
        }
        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return (0, response_1.sendError)(res, 'Invalid email or password', 401);
        }
        // Generate JWT token
        const token = (0, jwt_1.generateToken)({
            userId: user._id.toString(),
            email: user.email,
            role: user.role
        });
        (0, response_1.sendSuccess)(res, 'Login successful', {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    }
    catch (error) {
        console.error('Login error:', error);
        (0, response_1.sendError)(res, 'Login failed', 500);
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        const user = req.user;
        (0, response_1.sendSuccess)(res, 'Profile retrieved successfully', {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        (0, response_1.sendError)(res, 'Failed to retrieve profile', 500);
    }
};
exports.getProfile = getProfile;
//# sourceMappingURL=authController.js.map