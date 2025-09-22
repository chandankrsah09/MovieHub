import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { config } from 'dotenv';
import connectDB from './src/config/database';
import routes from './src/routes';
import { errorHandler, notFound } from './src/middleware/errorHandler';

// Load environment variables
config();

const PORT = process.env.PORT || 5000;

const app = express();

// Connect to database
connectDB();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000', // Local development
    'https://moviehub-frontend.onrender.com', // Production frontend (when deployed)
    'https://*.onrender.com', // Any Render subdomain
    'https://*.vercel.app', // Vercel deployments
    'https://*.netlify.app', // Netlify deployments
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MovieHub API is running 🚀',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      movies: '/api/movies',
      comments: '/api/comments',
      admin: '/api/admin'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api', routes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});



