# MovieHub Backend API

A comprehensive movie rating and review platform built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

- **User Authentication**: Register, login, and JWT-based authentication
- **Movie Management**: CRUD operations for movies with genre categorization
- **Voting System**: Upvote/downvote movies with real-time score calculation
- **Comment System**: Users can comment on movies
- **Role-based Access**: Admin and user roles with appropriate permissions
- **Pagination**: Efficient data loading with pagination support
- **Input Validation**: Comprehensive request validation using express-validator
- **Error Handling**: Centralized error handling with proper HTTP status codes

## 📁 Project Structure

```
server/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication, validation, error handling
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── index.ts             # Main server file
├── package.json
├── tsconfig.json
└── .env
```

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```env
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
PORT=5000
```

3. Start development server:
```bash
npm run dev
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (Protected)

### Movies
- `GET /api/movies` - Get all movies (with pagination, filtering, sorting)
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Create a new movie (Protected)
- `PUT /api/movies/:id` - Update a movie (Protected - Owner/Admin)
- `DELETE /api/movies/:id` - Delete a movie (Protected - Owner/Admin)

### Voting
- `POST /api/movies/:movieId/vote` - Vote on a movie (Protected)
- `GET /api/movies/:movieId/vote` - Get user's vote on a movie (Protected)

### Comments
- `GET /api/movies/:movieId/comments` - Get all comments for a movie
- `POST /api/movies/:movieId/comments` - Create a comment (Protected)
- `GET /api/comments/:commentId` - Get comment by ID
- `PUT /api/comments/:commentId` - Update a comment (Protected - Owner/Admin)
- `DELETE /api/comments/:commentId` - Delete a comment (Protected - Owner/Admin)

## 🔐 Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📊 Database Schema

### User
- name, email, password, role (user/admin)

### Movie
- title, description, genre, releaseYear, director, addedBy, upvotes, downvotes, score

### Vote
- user, movie, voteType (up/down)

### Comment
- user, movie, content

## 🎯 Key Features

1. **Smart Voting System**: Users can upvote/downvote movies. Same vote removes the vote, different vote updates it.
2. **Real-time Score Calculation**: Movie scores are calculated as upvotes - downvotes
3. **Comprehensive Validation**: All inputs are validated with proper error messages
4. **Role-based Permissions**: Admins can manage all content, users can manage their own
5. **Efficient Queries**: Proper indexing and pagination for optimal performance

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT_SECRET
3. Configure proper CORS settings
4. Set up MongoDB Atlas or production database
5. Use PM2 or similar for process management

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
