# 🎬 MovieHub - Complete Movie Rating & Review Platform

A full-stack movie rating and review platform built with modern technologies, featuring a professional backend API and a beautiful, responsive frontend.

## 🚀 **Live Demo**

- **Frontend**: https://movie-hub-wfby.vercel.app/
- **Backend API**: https://moviehub-uc48.onrender.com/
- **API Health Check**: https://moviehub-uc48.onrender.com/api/health

## ✨ **Features**

### 🔐 **Authentication System**
- User registration and login
- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (User/Admin)
- Protected routes and middleware

### 🎬 **Movie Management**
- Browse movies with pagination
- Add new movies (authenticated users)
- Search and filter by genre, year, director
- Sort by rating, date, title
- Movie detail pages with full information
- Edit/delete movies (owner or admin)

### ⭐ **Voting System**
- Upvote/downvote movies
- Real-time vote count updates
- Smart voting logic (same vote removes, different vote updates)
- Score calculation (upvotes - downvotes)
- User vote tracking

### 💬 **Comment System**
- Add comments to movies
- Edit/delete own comments
- Admin comment management
- Real-time comment updates
- User attribution

### 🎨 **Modern UI/UX**
- Responsive design (mobile-first)
- Clean, modern interface with Tailwind CSS
- Loading states and error handling
- Form validation with Zod
- Real-time updates with React Query

## 🛠️ **Tech Stack**

### **Backend**
- **Framework**: Node.js with Express
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs
- **Validation**: express-validator
- **Architecture**: MVC pattern with proper separation

### **Frontend**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 📁 **Project Structure**

```
MovieHub/
├── server/                 # Backend API
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth, validation, error handling
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── index.ts           # Main server file
│   ├── package.json
│   └── .env
└── client/                # Frontend Application
    ├── src/
    │   ├── app/           # Next.js App Router pages
    │   ├── components/    # Reusable components
    │   ├── contexts/      # React contexts
    │   └── lib/           # Utilities and API client
    ├── package.json
    └── .env.local
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### **Backend Setup**
```bash
cd server
npm install
npm run dev
```

### **Frontend Setup**
```bash
cd client
npm install
npm run dev
```

### **Environment Variables**

**Server (.env)**
```env
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
PORT=5000
```

**Client (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📚 **API Documentation**

### **Authentication Endpoints**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### **Movie Endpoints**
- `GET /api/movies` - Get all movies (with pagination/filtering)
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Create movie (Protected)
- `PUT /api/movies/:id` - Update movie (Protected)
- `DELETE /api/movies/:id` - Delete movie (Protected)

### **Voting Endpoints**
- `POST /api/movies/:movieId/vote` - Vote on movie (Protected)
- `GET /api/movies/:movieId/vote` - Get user's vote (Protected)

### **Comment Endpoints**
- `GET /api/movies/:movieId/comments` - Get movie comments
- `POST /api/movies/:movieId/comments` - Add comment (Protected)
- `PUT /api/comments/:commentId` - Update comment (Protected)
- `DELETE /api/comments/:commentId` - Delete comment (Protected)

## 🎯 **Key Features Implementation**

### **Smart Voting System**
- Users can upvote/downvote movies
- Same vote removes the vote
- Different vote updates the vote
- Real-time score calculation

### **Role-Based Permissions**
- Regular users: Add movies, vote, comment
- Admins: Manage all content
- Owners: Edit/delete their own content

### **Responsive Design**
- Mobile-first approach
- Breakpoints: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- Touch-friendly interface
- Optimized for all screen sizes

### **Performance Optimizations**
- Database indexing for fast queries
- React Query for efficient data fetching
- Image optimization
- Code splitting and lazy loading

## 🔧 **Development**

### **Backend Development**
```bash
cd server
npm run dev    # Start with hot reload
npm run build  # Build TypeScript
npm start      # Start production server
```

### **Frontend Development**
```bash
cd client
npm run dev    # Start development server
npm run build  # Build for production
npm start      # Start production server
```

## 🚀 **Deployment**

### **Backend Deployment**
1. Set production environment variables
2. Build the application: `npm run build`
3. Start with PM2: `pm2 start dist/index.js`
4. Configure reverse proxy (nginx)

### **Frontend Deployment**
1. Set production API URL
2. Build: `npm run build`
3. Deploy to Vercel/Netlify
4. Configure environment variables

## 📊 **Database Schema**

### **Users Collection**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  createdAt: Date,
  updatedAt: Date
}
```

### **Movies Collection**
```javascript
{
  title: String,
  description: String,
  genre: String,
  releaseYear: Number,
  director: String,
  addedBy: ObjectId (ref: User),
  upvotes: Number,
  downvotes: Number,
  score: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### **Votes Collection**
```javascript
{
  user: ObjectId (ref: User),
  movie: ObjectId (ref: Movie),
  voteType: String (up/down),
  createdAt: Date
}
```

### **Comments Collection**
```javascript
{
  user: ObjectId (ref: User),
  movie: ObjectId (ref: Movie),
  content: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 **UI Components**

### **Base Components**
- Button (with loading states)
- Input (with validation)
- Textarea
- Select
- Card (with header, content, footer)

### **Feature Components**
- Navigation (with user menu)
- MovieCard (with voting)
- Authentication forms
- Comment system

## 🔒 **Security Features**

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- CORS configuration
- Rate limiting (can be added)
- SQL injection prevention (MongoDB)
- XSS protection

## 📱 **Mobile Responsiveness**

- Touch-friendly buttons and inputs
- Responsive grid layouts
- Mobile navigation
- Optimized images
- Fast loading on mobile networks

## 🧪 **Testing**

The application is built with testing in mind:
- TypeScript for type safety
- Input validation on both client and server
- Error handling and user feedback
- Responsive design testing

## 🤝 **Contributing**

1. Follow the existing code style
2. Use TypeScript for all new code
3. Add proper error handling
4. Test responsive design
5. Update documentation

## 📄 **License**

This project is open source and available under the MIT License.

## 🎉 **Conclusion**

MovieHub is a complete, production-ready movie rating and review platform that demonstrates modern full-stack development practices. It features a robust backend API with proper authentication, a beautiful responsive frontend, and all the features you'd expect from a modern web application.

The application is ready for deployment and can be easily extended with additional features like user profiles, movie recommendations, social features, and more!
