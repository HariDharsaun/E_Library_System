import express from 'express';
import {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  purchaseBook,
  returnBook,
  getUserBooks,
  payFine
} from '../controllers/bookController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllBooks);
router.get('/:id', getBookById);

// User routes
router.post('/purchase', auth, purchaseBook);
router.post('/return', auth, returnBook);
router.get('/user/books', auth, getUserBooks);
router.post('/pay-fine', auth, payFine);

// Admin routes
router.post('/', adminAuth, addBook);
router.put('/:id', adminAuth, updateBook);
router.delete('/:id', adminAuth, deleteBook);

export default router;