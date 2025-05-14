import express from 'express';
import {
  getAllUsers,
  getUserTransactions,
  getPendingReturns,
  createAdmin
} from '../controllers/userController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.get('/transactions', auth, getUserTransactions);
router.get('/pending-returns', auth, getPendingReturns);

// Admin routes
router.get('/', adminAuth, getAllUsers);
router.get('/:id/transactions', adminAuth, getUserTransactions);
router.get('/:id/pending-returns', adminAuth, getPendingReturns);
router.post('/create-admin', createAdmin);

export default router;