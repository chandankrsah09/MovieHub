import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { isAuth } from '../middleware/auth';
import { validateUserRegistration, validateUserLogin } from '../middleware/validation';

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateUserRegistration, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateUserLogin, login);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', isAuth, getProfile);

export default router;
