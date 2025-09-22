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

// Serve frontend build files
app.use(express.static(path.join(__dirname, '../client/.next/static')));
app.use(express.static(path.join(__dirname, '../client/public')));

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

// Serve frontend pages (catch-all route for React Router)
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
  
  // For now, serve a simple HTML page that loads the React app
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MovieHub - Rate and Review Movies</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          text-align: center;
          color: white;
          max-width: 600px;
          padding: 2rem;
        }
        .logo {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        .message {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }
        .links {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .link {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          text-decoration: none;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        .link:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
        .api-info {
          margin-top: 2rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          font-size: 0.9rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">🎬 MovieHub</div>
        <div class="message">
          Welcome to MovieHub API! The frontend is currently being served from the backend.
        </div>
        <div class="links">
          <a href="/api/movies" class="link">📽️ Movies API</a>
          <a href="/health" class="link">💚 Health Check</a>
          <a href="/api/auth/login" class="link">🔐 Auth API</a>
        </div>
        <div class="api-info">
          <strong>API Base URL:</strong> ${req.protocol}://${req.get('host')}/api<br>
          <strong>Status:</strong> ✅ Backend Running<br>
          <strong>Frontend:</strong> 🚧 Integrated with Backend
        </div>
      </div>
    </body>
    </html>
  `);
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});



