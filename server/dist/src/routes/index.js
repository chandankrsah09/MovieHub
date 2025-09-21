"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const movies_1 = __importDefault(require("./movies"));
const comments_1 = __importDefault(require("./comments"));
const router = (0, express_1.Router)();
// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'MovieHub API is running',
        timestamp: new Date().toISOString()
    });
});
// API routes
router.use('/auth', auth_1.default);
router.use('/movies', movies_1.default);
router.use('/comments', comments_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map