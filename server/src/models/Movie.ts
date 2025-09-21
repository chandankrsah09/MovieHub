import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  director: string;
  image?: string;
  addedBy: mongoose.Types.ObjectId;
  upvotes: number;
  downvotes: number;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

const movieSchema = new Schema<IMovie>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title must be at least 1 character long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true,
    enum: [
      'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 
      'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History', 
      'Horror', 'Music', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 
      'Sport', 'Thriller', 'War', 'Western'
    ]
  },
  releaseYear: {
    type: Number,
    required: [true, 'Release year is required'],
    min: [1888, 'Release year must be after 1888'],
    max: [new Date().getFullYear() + 5, 'Release year cannot be more than 5 years in the future']
  },
  director: {
    type: String,
    required: [true, 'Director is required'],
    trim: true,
    minlength: [2, 'Director name must be at least 2 characters long'],
    maxlength: [100, 'Director name cannot exceed 100 characters']
  },
  image: {
    type: String,
    trim: true
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  upvotes: {
    type: Number,
    default: 0,
    min: 0
  },
  downvotes: {
    type: Number,
    default: 0,
    min: 0
  },
  score: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate score before saving
movieSchema.pre('save', function(next) {
  (this as any).score = (this as any).upvotes - (this as any).downvotes;
  next();
});

// Index for better query performance
movieSchema.index({ score: -1, createdAt: -1 });
movieSchema.index({ genre: 1 });
movieSchema.index({ addedBy: 1 });

export default mongoose.model<IMovie>('Movie', movieSchema);