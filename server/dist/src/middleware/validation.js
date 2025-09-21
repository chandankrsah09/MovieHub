"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateComment = exports.validateVote = exports.validateMovie = exports.validateUserLogin = exports.validateUserRegistration = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
exports.validateUserRegistration = [
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    exports.handleValidationErrors
];
exports.validateUserLogin = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
    exports.handleValidationErrors
];
exports.validateMovie = [
    (0, express_validator_1.body)('title')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    (0, express_validator_1.body)('description')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters'),
    (0, express_validator_1.body)('genre')
        .isIn([
        'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
        'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History',
        'Horror', 'Music', 'Musical', 'Mystery', 'Romance', 'Sci-Fi',
        'Sport', 'Thriller', 'War', 'Western'
    ])
        .withMessage('Please provide a valid genre'),
    (0, express_validator_1.body)('releaseYear')
        .isInt({ min: 1888, max: new Date().getFullYear() + 5 })
        .withMessage('Please provide a valid release year'),
    (0, express_validator_1.body)('director')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Director name must be between 2 and 100 characters'),
    exports.handleValidationErrors
];
exports.validateVote = [
    (0, express_validator_1.body)('voteType')
        .isIn(['up', 'down'])
        .withMessage('Vote type must be either "up" or "down"'),
    exports.handleValidationErrors
];
exports.validateComment = [
    (0, express_validator_1.body)('content')
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Comment must be between 1 and 500 characters'),
    exports.handleValidationErrors
];
//# sourceMappingURL=validation.js.map