import { Request } from 'express';
import { Types } from 'mongoose';
export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}
export interface IMovie {
    _id: Types.ObjectId;
    title: string;
    description: string;
    genre: string;
    releaseYear: number;
    director: string;
    addedBy: Types.ObjectId;
    upvotes: number;
    downvotes: number;
    score: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface IVote {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    movie: Types.ObjectId;
    voteType: 'up' | 'down';
    createdAt: Date;
}
export interface IComment {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    movie: Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface AuthRequest extends Request {
    user?: IUser;
}
export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}
//# sourceMappingURL=index.d.ts.map