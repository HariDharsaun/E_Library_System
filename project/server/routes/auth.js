import express from 'express';
import { register, login, adminLogin, getProfile } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Admin login route
router.post('/admin/login', adminLogin);

// Get user profile
router.get('/profile', auth, getProfile);

export default router;