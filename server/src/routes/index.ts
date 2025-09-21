import { Router } from 'express';
import authRoutes from './auth';
import movieRoutes from './movies';
import commentRoutes from './comments';
import adminRoutes from './admin';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MovieHub API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);
router.use('/comments', commentRoutes);
router.use('/admin', adminRoutes);

export default router;
