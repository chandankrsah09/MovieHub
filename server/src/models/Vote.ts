import mongoose, { Document, Schema } from 'mongoose';

export interface IVote {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  movie: mongoose.Types.ObjectId;
  voteType: 'up' | 'down';
  createdAt: Date;
}

const voteSchema = new Schema<IVote>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movie: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  voteType: {
    type: String,
    required: true,
    enum: ['up', 'down']
  }
}, {
  timestamps: true
});

// Ensure one vote per user per movie
voteSchema.index({ user: 1, movie: 1 }, { unique: true });

// Index for better query performance
voteSchema.index({ movie: 1, voteType: 1 });

export default mongoose.model<IVote>('Vote', voteSchema);