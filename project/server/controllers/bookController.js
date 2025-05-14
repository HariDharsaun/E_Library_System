import Book from '../models/Book.js';
import Transaction from '../models/Transaction.js';

// Get all books
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

// Get book by ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book', error: error.message });
  }
};

// Add new book (admin only)
export const addBook = async (req, res) => {
  try {
    const { title, author, description, isbn, quantity, coverImage } = req.body;
    
    const newBook = new Book({
      title,
      author,
      description,
      isbn,
      quantity,
      available: quantity,
      coverImage: coverImage || undefined
    });
    
    await newBook.save();
    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (error) {
    res.status(500).json({ message: 'Error adding book', error: error.message });
  }
};

// Update book (admin only)
export const updateBook = async (req, res) => {
  try {
    const { title, author, description, isbn, quantity, coverImage } = req.body;
    
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Calculate how many more books are available after update
    const availableDelta = quantity - book.quantity;
    
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        description,
        isbn,
        quantity,
        available: book.available + availableDelta > 0 ? book.available + availableDelta : 0,
        coverImage: coverImage || book.coverImage
      },
      { new: true }
    );
    
    res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
};

// Delete book (admin only)
export const deleteBook = async (req, res) => {
  try {
    // Check if book has active transactions
    const activeTransactions = await Transaction.find({
      book: req.params.id,
      status: 'issued'
    });
    
    if (activeTransactions.length > 0) {
      return res.status(400).json({
        message: 'Cannot delete book. There are active checkouts for this book.'
      });
    }
    
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};

// Purchase (issue) book
export const purchaseBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;
    
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if book is available
    if (book.available <= 0) {
      return res.status(400).json({ message: 'Book is not available' });
    }
    
    // Check if user already has this book
    const existingTransaction = await Transaction.findOne({
      user: userId,
      book: bookId,
      status: 'issued'
    });
    
    if (existingTransaction) {
      return res.status(400).json({ message: 'You already have this book' });
    }
    
    // Create transaction
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days from now
    
    const transaction = new Transaction({
      user: userId,
      book: bookId,
      dueDate
    });
    
    // Update book availability
    book.available -= 1;
    await book.save();
    await transaction.save();
    
    res.status(200).json({
      message: 'Book purchased successfully',
      transaction,
      dueDate
    });
  } catch (error) {
    res.status(500).json({ message: 'Error purchasing book', error: error.message });
  }
};

// Return book
export const returnBook = async (req, res) => {
  try {
    const { transactionId } = req.body;
    
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Check if book is already returned
    if (transaction.status === 'returned') {
      return res.status(400).json({ message: 'Book already returned' });
    }
    
    // Mark as returned
    transaction.status = 'returned';
    transaction.returnDate = new Date();
    
    // Calculate fine if returned late
    const fine = transaction.calculateFine();
    
    // Update book availability
    const book = await Book.findById(transaction.book);
    book.available += 1;
    
    await book.save();
    await transaction.save();
    
    res.status(200).json({
      message: 'Book returned successfully',
      transaction,
      fine
    });
  } catch (error) {
    res.status(500).json({ message: 'Error returning book', error: error.message });
  }
};

// Get user's current books
export const getUserBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const transactions = await Transaction.find({
      user: userId,
      status: 'issued'
    }).populate('book');
    
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user books', error: error.message });
  }
};

// Pay fine
export const payFine = async (req, res) => {
  try {
    const { transactionId } = req.body;
    
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    if (transaction.fine <= 0) {
      return res.status(400).json({ message: 'No fine to pay' });
    }
    
    if (transaction.finePaid) {
      return res.status(400).json({ message: 'Fine already paid' });
    }
    
    transaction.finePaid = true;
    await transaction.save();
    
    res.status(200).json({
      message: 'Fine paid successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Error paying fine', error: error.message });
  }
};