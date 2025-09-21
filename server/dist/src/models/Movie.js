"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const movieSchema = new mongoose_1.Schema({
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
    addedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
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
movieSchema.pre('save', function (next) {
    this.score = this.upvotes - this.downvotes;
    next();
});
// Index for better query performance
movieSchema.index({ score: -1, createdAt: -1 });
movieSchema.index({ genre: 1 });
movieSchema.index({ addedBy: 1 });
exports.default = mongoose_1.default.model('Movie', movieSchema);
//# sourceMappingURL=Movie.js.map