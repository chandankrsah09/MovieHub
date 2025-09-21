"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validation_1.validateUserRegistration, authController_1.register);
// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validation_1.validateUserLogin, authController_1.login);
// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth_1.isAuth, authController_1.getProfile);
exports.default = router;
//# sourceMappingURL=auth.js.map